export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DjeKekgL.js",app:"_app/immutable/entry/app.Dd1b-MjJ.js",imports:["_app/immutable/entry/start.DjeKekgL.js","_app/immutable/chunks/DqXKl5Wr.js","_app/immutable/chunks/Dw6mK3uj.js","_app/immutable/entry/app.Dd1b-MjJ.js","_app/immutable/chunks/Dw6mK3uj.js","_app/immutable/chunks/BXGZzFm9.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
