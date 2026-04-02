#!/bin/sh
set -e
cat > /usr/share/nginx/html/env.js <<'EOF'
(function () {
	var h = location.hostname;
	var https = location.protocol === 'https:';
	var proto = https ? 'https:' : 'http:';
	var wsProto = https ? 'wss:' : 'ws:';
	window.__EYENEST_ENV__ = {
		VITE_SERVER_URL: proto + '//' + h + '/api',
		VITE_LIVEKIT_URL: wsProto + '//' + h + ':7443',
	};
})();
EOF
exec nginx -g 'daemon off;'
