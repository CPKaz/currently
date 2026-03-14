

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.-q9P1t9d.js","_app/immutable/chunks/CUMSf_Ar.js","_app/immutable/chunks/DAZWHqwF.js"];
export const stylesheets = [];
export const fonts = [];
