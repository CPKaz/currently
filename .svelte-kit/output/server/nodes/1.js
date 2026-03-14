

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Byn29-Mx.js","_app/immutable/chunks/Dw6mK3uj.js","_app/immutable/chunks/BXGZzFm9.js","_app/immutable/chunks/DqXKl5Wr.js"];
export const stylesheets = [];
export const fonts = [];
