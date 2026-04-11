# Fragmento incluído no server e em location = /index.html (Nginx não herda
# add_header do server quando o location define os seus).

add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;

# default-src: assets do próprio host. connect-src: mesmo origin + APIs HTTPS/WSS
# (ex.: subdomínio da API). Para API só em HTTP fora de localhost, evite URL absoluta
# http ou use reverse proxy com /api no mesmo host.
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: blob:; font-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: wss: http://127.0.0.1:* http://localhost:*" always;
