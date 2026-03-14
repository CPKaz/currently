

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BjBqZwfD.js","_app/immutable/chunks/DNqLcb95.js","_app/immutable/chunks/BUbJbmR4.js"];
export const stylesheets = [];
export const fonts = [];
