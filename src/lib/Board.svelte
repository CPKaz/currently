<script>
  import { createEventDispatcher } from 'svelte';
  import { createTicket } from './board-utils.js';

  export let canEdit = false;
  export let weekLabel = '';
  export let tickets = { todo: [], inProgress: [], done: [] };

  const dispatch = createEventDispatcher();
  const COLUMNS = [
    { id: 'todo', label: 'TODO' },
    { id: 'inProgress', label: 'IN PROGRESS' },
    { id: 'done', label: 'DONE' }
  ];

  let dragTicket = null;
  let dragColumn = null;
  let dropTarget = null;
  let addTitle = '';
  let addDesc = '';
  let showAddForm = false;

  function emit() {
    dispatch('update', { ...tickets });
  }

  function addTicket() {
    if (!canEdit) return;
    const t = createTicket(addTitle, addDesc);
    tickets = {
      ...tickets,
      todo: [...tickets.todo, t]
    };
    addTitle = '';
    addDesc = '';
    showAddForm = false;
    emit();
  }

  function removeTicket(columnId, ticketId) {
    if (!canEdit) return;
    const col = tickets[columnId];
    tickets = {
      ...tickets,
      [columnId]: col.filter((t) => t.id !== ticketId)
    };
    emit();
  }

  function moveTicket(ticketId, fromColumn, toColumn) {
    if (fromColumn === toColumn) return;
    const fromList = tickets[fromColumn];
    const toList = tickets[toColumn];
    const ticket = fromList.find((t) => t.id === ticketId);
    if (!ticket) return;
    tickets = {
      ...tickets,
      [fromColumn]: fromList.filter((t) => t.id !== ticketId),
      [toColumn]: [...toList, ticket]
    };
    emit();
  }

  function handleDragStart(e, ticketId, columnId) {
    if (!canEdit) return;
    dragTicket = ticketId;
    dragColumn = columnId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ ticketId, columnId }));
    e.dataTransfer.setData('application/x-board', JSON.stringify({ ticketId, columnId }));
    e.target.classList.add('board-ticket-dragging');
  }

  function handleDragEnd(e) {
    e.target.classList.remove('board-ticket-dragging');
    dragTicket = null;
    dragColumn = null;
    dropTarget = null;
  }

  function handleDragOver(e, columnId) {
    if (!canEdit || !dragTicket) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dropTarget = columnId;
  }

  function handleDragLeave() {
    dropTarget = null;
  }

  function handleDrop(e, toColumnId) {
    e.preventDefault();
    dropTarget = null;
    if (!canEdit || !dragTicket || !dragColumn) return;
    moveTicket(dragTicket, dragColumn, toColumnId);
    dragTicket = null;
    dragColumn = null;
  }

  function clearBoard() {
    if (!canEdit) return;
    if (!confirm('Clear all tickets for this week?')) return;
    tickets = { todo: [], inProgress: [], done: [] };
    emit();
  }
</script>

<div class="board-section">
  <div class="board-header">
    <h2 class="board-title">TODO for the current week</h2>
    <p class="board-week-label">{weekLabel}</p>
    {#if canEdit}
      <button type="button" class="board-clear-btn" on:click={clearBoard}>Clear board</button>
    {/if}
  </div>

  <div class="board-columns">
    {#each COLUMNS as { id, label }}
      <div
        class="board-column"
        class:board-column-drop={dropTarget === id}
        role="region"
        aria-label="{label} column"
        on:dragover={(e) => handleDragOver(e, id)}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, id)}
      >
        <div class="board-column-header">{label}</div>
        <div class="board-column-cards" role="list">
          {#if id === 'todo' && canEdit && showAddForm}
            <div class="board-add-form">
              <input
                type="text"
                class="board-input"
                placeholder="Title"
                bind:value={addTitle}
                on:keydown={(e) => e.key === 'Enter' && addTicket()}
              />
              <textarea
                class="board-textarea"
                placeholder="Description (optional)"
                bind:value={addDesc}
                rows="2"
              />
              <div class="board-add-actions">
                <button type="button" class="board-btn board-btn-primary" on:click={addTicket}>Add</button>
                <button type="button" class="board-btn" on:click={() => (showAddForm = false)}>Cancel</button>
              </div>
            </div>
          {/if}
          {#each tickets[id] || [] as ticket (ticket.id)}
            <div
              class="board-ticket"
              class:board-ticket-dragging={dragTicket === ticket.id}
              role="listitem"
              draggable={canEdit}
              on:dragstart={(e) => handleDragStart(e, ticket.id, id)}
              on:dragend={handleDragEnd}
            >
              <div class="board-ticket-title">{ticket.title}</div>
              {#if ticket.description}
                <div class="board-ticket-desc">{ticket.description}</div>
              {/if}
              {#if canEdit}
                <button
                  type="button"
                  class="board-ticket-remove"
                  title="Remove"
                  on:click|stopPropagation={() => removeTicket(id, ticket.id)}
                >×</button>
              {/if}
            </div>
          {/each}
        </div>
        {#if id === 'todo' && canEdit && !showAddForm}
          <button type="button" class="board-add-ticket-btn" on:click={() => (showAddForm = true)}>+ Add ticket</button>
        {/if}
      </div>
    {/each}
  </div>
</div>
