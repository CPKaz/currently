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
		client: {start:"_app/immutable/entry/start.yzDuDydB.js",app:"_app/immutable/entry/app.CiQ2t4WV.js",imports:["_app/immutable/entry/start.yzDuDydB.js","_app/immutable/chunks/ClomOy67.js","_app/immutable/chunks/CUMSf_Ar.js","_app/immutable/entry/app.CiQ2t4WV.js","_app/immutable/chunks/CUMSf_Ar.js","_app/immutable/chunks/DAZWHqwF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
