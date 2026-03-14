import { c as create_ssr_component, d as createEventDispatcher, e as escape, f as each, h as add_attribute, v as validate_component } from "../../chunks/ssr.js";
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { canEdit = false } = $$props;
  let { weekLabel = "" } = $$props;
  let { tickets = { todo: [], inProgress: [], done: [] } } = $$props;
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
  return `<div class="board-section"><div class="board-header"><h2 class="board-title" data-svelte-h="svelte-50cr47">TODO for the current week</h2> <p class="board-week-label">${escape(weekLabel)}</p> ${canEdit ? `<button type="button" class="board-clear-btn" data-svelte-h="svelte-1d0qebj">Clear board</button>` : ``}</div> <div class="board-columns">${each(COLUMNS, ({ id, label }) => {
    return `<div class="${["board-column", dropTarget === id ? "board-column-drop" : ""].join(" ").trim()}"><div class="board-column-header">${escape(label)}</div> <div class="board-column-cards">${``} ${each(tickets[id] || [], (ticket) => {
      return `<div class="${["board-ticket", dragTicket === ticket.id ? "board-ticket-dragging" : ""].join(" ").trim()}"${add_attribute("draggable", canEdit, 0)}><div class="board-ticket-title">${escape(ticket.title)}</div> ${ticket.description ? `<div class="board-ticket-desc">${escape(ticket.description)}</div>` : ``} ${canEdit ? `<button type="button" class="board-ticket-remove" title="Remove" data-svelte-h="svelte-m5g4m3">×</button>` : ``} </div>`;
    })}</div> ${id === "todo" && canEdit && true ? `<button type="button" class="board-add-ticket-btn" data-svelte-h="svelte-1dil8w0">+ Add ticket</button>` : ``} </div>`;
  })}</div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lastUpdated = "loading...";
  let canEdit = false;
  let weekLabel = "";
  let boardTickets = { todo: [], inProgress: [], done: [] };
  return `<div class="hero-strip"></div> <div class="page"> <section class="section board-section-wrap">${``} ${validate_component(Board, "Board").$$render(
    $$result,
    {
      canEdit,
      weekLabel,
      tickets: boardTickets
    },
    {},
    {}
  )}</section> <header><div class="wordmark" data-svelte-h="svelte-ti7w3v">// status update</div> <h1 class="tagline" data-svelte-h="svelte-1oeplqo"><span class="solid">what</span> <span class="outline">I&#39;m doing</span> <span class="accent">right now</span></h1> <div class="timestamp">${escape(lastUpdated)}</div></header>  <div class="section"><div class="section-label" data-svelte-h="svelte-1stux1x"><span class="section-num">01</span> <span class="section-label-text book">Reading</span></div> <div class="card book"><div class="card-eyebrow" data-svelte-h="svelte-13e5wi7">currently reading</div> ${`<div class="card-title skeleton" style="height:24px;width:62%;margin-bottom:8px;"></div> <div class="card-sub skeleton" style="height:14px;width:38%;margin-bottom:18px;"></div> <div class="progress-wrap" data-svelte-h="svelte-6gft55"><div class="progress-meta"><span></span><span></span></div> <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div></div>`}</div></div>  <div class="section"><div class="section-label" data-svelte-h="svelte-1ck3011"><span class="section-num">02</span> <span class="section-label-text run">Running</span></div> <div class="card run" style="margin-bottom:10px;"><div class="card-eyebrow" data-svelte-h="svelte-1hls4gm">last 4 weeks</div> <div class="stat-row">${`<div class="stat" data-svelte-h="svelte-q7xleo"><div class="stat-value skeleton" style="width:64px;height:26px;"></div><div class="stat-label">km</div></div> <div class="stat" data-svelte-h="svelte-19902wg"><div class="stat-value skeleton" style="width:40px;height:26px;"></div><div class="stat-label">runs</div></div> <div class="stat" data-svelte-h="svelte-11og8j7"><div class="stat-value skeleton" style="width:88px;height:26px;"></div><div class="stat-label">avg pace</div></div>`}</div></div> <div class="runs-list">${``}</div></div>  <div class="section"><div class="section-label" data-svelte-h="svelte-1bg2c09"><span class="section-num">03</span> <span class="section-label-text game">Gaming</span></div> <div class="games-grid">${`<div class="game-card" data-svelte-h="svelte-odvqwe"><div class="game-name skeleton" style="height:15px;width:80%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:50%;"></div></div> <div class="game-card" data-svelte-h="svelte-z6fjr7"><div class="game-name skeleton" style="height:15px;width:68%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:42%;"></div></div> <div class="game-card" data-svelte-h="svelte-17rstwh"><div class="game-name skeleton" style="height:15px;width:88%;margin-bottom:6px;"></div><div class="game-hours skeleton" style="height:11px;width:55%;"></div></div>`}</div></div></div>`;
});
export {
  Page as default
};
