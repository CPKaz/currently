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
		client: {start:"_app/immutable/entry/start.Bp3d-qiG.js",app:"_app/immutable/entry/app.BKYU9AaF.js",imports:["_app/immutable/entry/start.Bp3d-qiG.js","_app/immutable/chunks/BTF71sU7.js","_app/immutable/chunks/DNqLcb95.js","_app/immutable/entry/app.BKYU9AaF.js","_app/immutable/chunks/DNqLcb95.js","_app/immutable/chunks/BUbJbmR4.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
