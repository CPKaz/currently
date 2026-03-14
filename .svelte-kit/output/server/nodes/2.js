

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D5MTZCCf.js","_app/immutable/chunks/Dw6mK3uj.js","_app/immutable/chunks/BXGZzFm9.js"];
export const stylesheets = [];
export const fonts = [];
