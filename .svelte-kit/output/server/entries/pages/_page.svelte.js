import { c as create_ssr_component, d as createEventDispatcher, e as escape, f as each, h as add_attribute, v as validate_component } from "../../chunks/ssr.js";
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { canEdit = false } = $$props;
  let { weekLabel = "" } = $$props;
  let { tickets = { todo: [], inProgress: [], done: [] } } = $$props;
  let { showEditButton = false } = $$props;
  let { onEditClick = () => {
  } } = $$props;
  createEventDispatcher();
  const COLUMNS = [
    { id: "todo", label: "TODO" },
    { id: "inProgress", label: "IN PROGRESS" },
    { id: "done", label: "DONE" }
  ];
  let dragTicket = null;
  let dropTarget = null;
  if ($$props.canEdit === void 0 && $$bindings.canEdit && canEdit !== void 0) $$bindings.canEdit(canEdit);
  if ($$props.weekLabel === void 0 && $$bindings.weekLabel && weekLabel !== void 0) $$bindings.weekLabel(weekLabel);
  if ($$props.tickets === void 0 && $$bindings.tickets && tickets !== void 0) $$bindings.tickets(tickets);
  if ($$props.showEditButton === void 0 && $$bindings.showEditButton && showEditButton !== void 0) $$bindings.showEditButton(showEditButton);
  if ($$props.onEditClick === void 0 && $$bindings.onEditClick && onEditClick !== void 0) $$bindings.onEditClick(onEditClick);
  return `<div class="board-section"><div class="board-header"><h2 class="board-title" data-svelte-h="svelte-50cr47">TODO for the current week</h2> <p class="board-week-label">${escape(weekLabel)}</p> ${canEdit ? `<button type="button" class="board-clear-btn" data-svelte-h="svelte-1d0qebj">Clear board</button>` : `${showEditButton ? `<button type="button" class="board-edit-btn" data-svelte-h="svelte-134oe6d">Edit</button>` : ``}`}</div> <div class="board-columns">${each(COLUMNS, ({ id, label }) => {
    return `<div class="${["board-column", dropTarget === id ? "board-column-drop" : ""].join(" ").trim()}" role="region" aria-label="${escape(label, true) + " column"}"><div class="board-column-header">${escape(label)}</div> <div class="board-column-cards" role="list">${``} ${each(tickets[id] || [], (ticket) => {
      return `<div class="${["board-ticket", dragTicket === ticket.id ? "board-ticket-dragging" : ""].join(" ").trim()}" role="listitem"${add_attribute("draggable", canEdit, 0)}><div class="board-ticket-title">${escape(ticket.title)}</div> ${ticket.description ? `<div class="board-ticket-desc">${escape(ticket.description)}</div>` : ``} ${canEdit ? `<button type="button" class="board-ticket-remove" title="Remove" data-svelte-h="svelte-m5g4m3">×</button>` : ``} </div>`;
    })}</div> ${id === "todo" && canEdit && true ? `<button type="button" class="board-add-ticket-btn" data-svelte-h="svelte-1dil8w0">+ Add ticket</button>` : ``} </div>`;
  })}</div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lastUpdated = "loading...";
  let canEdit = false;
  let authChecked = false;
  let passwordInput = "";
  let authError = "";
  let weekLabel = "";
  let boardTickets = { todo: [], inProgress: [], done: [] };
  let showPasswordModal = false;
  function openEditModal() {
    authError = "";
    passwordInput = "";
    showPasswordModal = true;
  }
  return ` <div class="hero-strip"></div> <div class="page"><header><div class="wordmark" data-svelte-h="svelte-ti7w3v">// status update</div> <h1 class="tagline" data-svelte-h="svelte-1oeplqo"><span class="solid">what</span> <span class="outline">I&#39;m doing</span> <span class="accent">right now</span></h1> <div class="timestamp">${escape(lastUpdated)}</div></header>  <div class="section"><div class="section-label" data-svelte-h="svelte-1stux1x"><span class="section-num">01</span> <span class="section-label-text book">Reading</span></div> <div class="card book"><div class="card-eyebrow" data-svelte-h="svelte-13e5wi7">currently reading</div> ${`<div class="card-title skeleton" style="height:24px;width:62%;margin-bottom:8px;"></div> <div class="card-sub skeleton" style="height:14px;width:38%;margin-bottom:18px;"></div> <div class="progress-wrap" data-svelte-h="svelte-6gft55"><div class="progress-meta"><span></span><span></span></div> <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div></div>`}</div></div>  <div class="section"><div class="section-label" data-svelte-h="svelte-1ck3011"><span class="section-num">02</span> <span class="section-label-text run">Running</span></div> <div class="card run" style="margin-bottom:10px;"><div class="card-eyebrow" data-svelte-h="svelte-1hls4gm">last 4 weeks</div> <div class="stat-row">${`<div class="stat" data-svelte-h="svelte-q7xleo"><div class="stat-value skeleton" style="width:64px;height:26px;"></div><div class="stat-label">km</div></div> <div class="stat" data-svelte-h="svelte-19902wg"><div class="stat-value skeleton" style="width:40px;height:26px;"></div><div class="stat-label">runs</div></div> <div class="stat" data-svelte-h="svelte-11og8j7"><div class="stat-value skeleton" style="width:88px;height:26px;"></div><div class="stat-label">avg pace</div></div>`}</div></div> <div class="runs-list">${``}</div></div>  <div class="section"><div class="section-label" data-svelte-h="svelte-1bg2c09"><span class="section-num">03</span> <span class="section-label-text game">Gaming</span></div> <div class="games-grid">${`<div class="game-card" data-svelte-h="svelte-odvqwe"><div class="game-name skeleton" style="height:15px;width:80%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:50%;"></div></div> <div class="game-card" data-svelte-h="svelte-z6fjr7"><div class="game-name skeleton" style="height:15px;width:68%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:42%;"></div></div> <div class="game-card" data-svelte-h="svelte-17rstwh"><div class="game-name skeleton" style="height:15px;width:88%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:55%;"></div></div>`}</div></div>  <section class="section board-section-wrap">${validate_component(Board, "Board").$$render(
    $$result,
    {
      canEdit,
      weekLabel,
      tickets: boardTickets,
      showEditButton: authChecked,
      onEditClick: openEditModal
    },
    {},
    {}
  )}</section></div>  ${showPasswordModal ? `<div class="board-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="board-modal-title"><div class="board-modal" role="document"><h2 id="board-modal-title" class="board-modal-title" data-svelte-h="svelte-86iw1z">Edit board</h2> <p class="board-modal-desc" data-svelte-h="svelte-ugogh6">Enter the password (stored in Vercel env) to add, move, or clear tickets.</p> <div class="board-modal-input-wrap">${`<input type="password" class="board-modal-input" placeholder="Password"${add_attribute("value", passwordInput, 0)}>`} <button type="button" class="board-modal-eye"${add_attribute("title", "Show password", 0)}${add_attribute("aria-label", "Show password", 0)}>${`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`}</button></div> ${authError ? `<p class="board-auth-error">${escape(authError)}</p>` : ``} <div class="board-modal-actions"><button type="button" class="board-btn board-btn-primary" data-svelte-h="svelte-5yxx58">Unlock</button> <button type="button" class="board-btn" data-svelte-h="svelte-pp0qko">Cancel</button></div></div></div>` : ``}`;
});
export {
  Page as default
};
