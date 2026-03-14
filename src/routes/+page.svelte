<script>
  import { onMount } from 'svelte';
  import Board from '$lib/Board.svelte';
  import { getWeekId, getWeekLabel, loadBoard, saveBoard } from '$lib/board-utils.js';

  const fmt = {
    date: (d) => new Date(d * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    pace: (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.round(secs % 60);
      return `${m}:${s.toString().padStart(2, '0')}/km`;
    },
    dist: (m) => (m / 1000).toFixed(1),
    hours: (s) => {
      const h = Math.round(s / 3600);
      return h >= 1 ? `${h}h` : `${Math.round(s / 60)}m`;
    }
  };

  let bookData = null;
  let stravaData = null;
  let steamData = null;
  let lastUpdated = 'loading...';

  // Board auth & state
  let canEdit = false;
  let boardConfigured = false;
  let authChecked = false;
  let passwordInput = '';
  let authError = '';
  let weekId = '';
  let weekLabel = '';
  let boardTickets = { todo: [], inProgress: [], done: [] };

  function persistBoard() {
    if (typeof weekId !== 'undefined') saveBoard(weekId, boardTickets);
  }

  onMount(async () => {
    weekId = getWeekId();
    weekLabel = getWeekLabel();
    boardTickets = loadBoard(weekId);

    const [authRes, bookRes, stravaRes, steamRes] = await Promise.allSettled([
      fetch('/api/board-auth', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/books').then((r) => r.json()),
      fetch('/api/strava').then((r) => r.json()),
      fetch('/api/steam').then((r) => r.json())
    ]);

    if (authRes.status === 'fulfilled') {
      canEdit = authRes.value.authenticated === true;
      boardConfigured = authRes.value.configured === true;
    }
    authChecked = true;

    bookData = bookRes.status === 'fulfilled' ? bookRes.value : null;
    stravaData = stravaRes.status === 'fulfilled' ? stravaRes.value : null;
    steamData = steamRes.status === 'fulfilled' ? steamRes.value : null;
    lastUpdated = 'updated ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  });

  async function submitPassword() {
    authError = '';
    const res = await fetch('/api/board-auth', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput })
    });
    const data = await res.json().catch(() => ({}));
    if (data.authenticated) {
      canEdit = true;
      passwordInput = '';
    } else {
      authError = data.error || 'Wrong password';
    }
  }
</script>

<div class="hero-strip"></div>

<div class="page">
  <!-- TODO board (current week) -->
  <section class="section board-section-wrap">
    {#if authChecked && boardConfigured && !canEdit}
      <div class="board-auth-gate">
        <p>Enter password to add, move, or clear tickets:</p>
        <input
          type="password"
          placeholder="Password"
          bind:value={passwordInput}
          on:keydown={(e) => e.key === 'Enter' && submitPassword()}
        />
        <button type="button" on:click={submitPassword}>Unlock</button>
        {#if authError}
          <p class="board-auth-error">{authError}</p>
        {/if}
      </div>
    {/if}
    <Board
      canEdit={canEdit}
      weekLabel={weekLabel}
      tickets={boardTickets}
      on:update={(e) => {
        boardTickets = e.detail;
        persistBoard();
      }}
    />
  </section>

  <header>
    <div class="wordmark">// status update</div>
    <h1 class="tagline">
      <span class="solid">what</span>
      <span class="outline">I'm doing</span>
      <span class="accent">right now</span>
    </h1>
    <div class="timestamp">{lastUpdated}</div>
  </header>

  <!-- READING -->
  <div class="section">
    <div class="section-label">
      <span class="section-num">01</span>
      <span class="section-label-text book">Reading</span>
    </div>
    <div class="card book">
      <div class="card-eyebrow">currently reading</div>
      {#if bookData === null}
        <div class="card-title skeleton" style="height:24px;width:62%;margin-bottom:8px;"></div>
        <div class="card-sub skeleton" style="height:14px;width:38%;margin-bottom:18px;"></div>
        <div class="progress-wrap">
          <div class="progress-meta"><span></span><span></span></div>
          <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
        </div>
      {:else if bookData.error}
        <div class="error-note">// couldn't load reading data — check Goodreads profile is public</div>
      {:else}
        {@const pct = bookData.percent ?? (bookData.page && bookData.pages ? Math.round(bookData.page / bookData.pages * 100) : 0)}
        <div class="card-title">{bookData.title}</div>
        <div class="card-sub">{bookData.author}</div>
        {#if pct || bookData.page}
          <div class="progress-wrap">
            <div class="progress-meta">
              <span>{bookData.page && bookData.pages ? `pg ${bookData.page} / ${bookData.pages}` : `${pct}% complete`}</span>
              <span>{pct}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:{pct}%"></div></div>
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <!-- RUNNING -->
  <div class="section">
    <div class="section-label">
      <span class="section-num">02</span>
      <span class="section-label-text run">Running</span>
    </div>
    <div class="card run" style="margin-bottom:10px;">
      <div class="card-eyebrow">last 4 weeks</div>
      <div class="stat-row">
        {#if stravaData === null}
          <div class="stat"><div class="stat-value skeleton" style="width:64px;height:26px;"></div><div class="stat-label">km</div></div>
          <div class="stat"><div class="stat-value skeleton" style="width:40px;height:26px;"></div><div class="stat-label">runs</div></div>
          <div class="stat"><div class="stat-value skeleton" style="width:88px;height:26px;"></div><div class="stat-label">avg pace</div></div>
        {:else if stravaData.error}
          <div class="error-note">// couldn't load Strava data</div>
        {:else}
          {@const { totals } = stravaData}
          <div class="stat"><div class="stat-value">{fmt.dist(totals.distance)}</div><div class="stat-label">km</div></div>
          <div class="stat"><div class="stat-value">{totals.count}</div><div class="stat-label">runs</div></div>
          <div class="stat"><div class="stat-value">{fmt.pace(totals.avg_pace)}</div><div class="stat-label">avg pace</div></div>
          <div class="stat"><div class="stat-value">{fmt.hours(totals.moving_time)}</div><div class="stat-label">time</div></div>
        {/if}
      </div>
    </div>
    <div class="runs-list">
      {#if stravaData && !stravaData.error && stravaData.recent}
        {#each (stravaData.recent || []).slice(0, 4) as r}
          <div class="run-row">
            <div class="run-row-left">
              <div class="run-name">{r.name}</div>
              <div class="run-date">{fmt.date(r.start_date_local_ts)}</div>
            </div>
            <div class="run-stats">
              <div class="run-stat"><strong>{fmt.dist(r.distance)}km</strong></div>
              <div class="run-stat"><strong>{fmt.pace(r.average_speed_pace)}</strong></div>
              <div class="run-stat"><strong>{fmt.hours(r.moving_time)}</strong></div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- GAMING -->
  <div class="section">
    <div class="section-label">
      <span class="section-num">03</span>
      <span class="section-label-text game">Gaming</span>
    </div>
    <div class="games-grid">
      {#if steamData === null}
        <div class="game-card"><div class="game-name skeleton" style="height:15px;width:80%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:50%;"></div></div>
        <div class="game-card"><div class="game-name skeleton" style="height:15px;width:68%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:42%;"></div></div>
        <div class="game-card"><div class="game-name skeleton" style="height:15px;width:88%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:55%;"></div></div>
      {:else if steamData.error}
        <div class="error-note">// couldn't load Steam data</div>
      {:else if steamData.empty || !steamData.games || steamData.games.length === 0}
        <div class="error-note">// no games played in the last 2 weeks</div>
      {:else}
        {#each steamData.games as g}
          <div class="game-card">
            <div class="game-name">{g.name}</div>
            <div class="game-hours">{fmt.hours(g.playtime_2weeks * 60)} in the last 2 weeks</div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
