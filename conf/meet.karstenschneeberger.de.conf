server_names_hash_bucket_size 64;

upstream prosody {
    zone upstreams 64K;
    server 127.0.0.1:5280;
    keepalive 2;
}

upstream jvb1 {
    zone upstreams 64K;
    server 127.0.0.1:9090;
    keepalive 2;
}

map $arg_vnode $prosody_node {
    default prosody;
    v1 v1;
    v2 v2;
    v3 v3;
    v4 v4;
    v5 v5;
    v6 v6;
    v7 v7;
    v8 v8;
}

# HTTP → HTTPS Umleitung
server {
    listen 80;
    listen [::]:80;
    server_name meet.karstenschneeberger.de;

    location ^~ /.well-known/acme-challenge/ {
        default_type "text/plain";
        root         /usr/share/jitsi-meet;
    }

    location = /.well-known/acme-challenge/ {
        return 404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS + HTTP/2 + Jitsi
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name meet.karstenschneeberger.de;

    ssl_certificate /etc/jitsi/meet/meet.karstenschneeberger.de.crt;
    ssl_certificate_key /etc/jitsi/meet/meet.karstenschneeberger.de.key;

    ssl_protocols TLSv1.2 TLSv1.3;

    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

    ssl_prefer_server_ciphers off;

    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    root /usr/share/jitsi-meet;
    index index.html index.htm;

    set $prefix "";
    set $custom_index "";
    set $config_js_location /etc/jitsi/meet/meet.karstenschneeberger.de-config.js;

    ssi on;
    ssi_types application/x-javascript application/javascript;

    error_page 404 /static/404.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/x-icon application/octet-stream application/wasm;
    gzip_vary on;
    gzip_proxied no-cache no-store private expired auth;
    gzip_min_length 512;

    # Weiterleitung bei Aufruf von /
    location = / {
        return 301 https://www.karstenschneeberger.de/;
    }

    include /etc/jitsi/meet/jaas/*.conf;

    location = /config.js {
        alias $config_js_location;
    }

    location = /external_api.js {
        alias /usr/share/jitsi-meet/libs/external_api.min.js;
    }

    location = /_api/room-info {
        proxy_pass http://prosody/room-info?prefix=$prefix&$args;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $http_host;
    }

    location ~ ^/_api/public/(.*)$ {
        autoindex off;
        alias /etc/jitsi/meet/public/$1;
    }

    location ~ ^/(libs|css|static|images|fonts|lang|sounds|.well-known)/(.*)$ {
        add_header 'Access-Control-Allow-Origin' '*';
        alias /usr/share/jitsi-meet/$1/$2;

        if ($arg_v) {
            expires 1y;
        }
    }

    location = /http-bind {
        proxy_pass http://$prosody_node/http-bind?prefix=$prefix&$args;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $http_host;
        proxy_set_header Connection "";
    }

    location = /xmpp-websocket {
        proxy_pass http://$prosody_node/xmpp-websocket?prefix=$prefix&$args;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        tcp_nodelay on;
    }

    location ~ ^/colibri-ws/default-id/(.*) {
        proxy_pass http://jvb1/colibri-ws/default-id/$1$is_args$args;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        tcp_nodelay on;
    }

    location = /_unlock {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header Strict-Transport-Security 'max-age=63072000; includeSubDomains';
        add_header "Cache-Control" "no-cache, no-store";
    }

    location ~ ^/conference-request/v1(\/.*)?$ {
        proxy_pass http://127.0.0.1:8888/conference-request/v1$1;
        add_header "Cache-Control" "no-cache, no-store";
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Content-Type';
    }

    location ~ ^/([^/?&:'"]+)/conference-request/v1(\/.*)?$ {
        rewrite ^/([^/?&:'"]+)/conference-request/v1(\/.*)?$ /conference-request/v1$2;
    }

    location ~ ^/([^/?&:'"]+)$ {
        set $roomname "$1";
        try_files $uri @root_path;
    }

    location @root_path {
        rewrite ^/(.*)$ /$custom_index break;
    }

    location ~ ^/([^/?&:'"]+)/config.js$ {
        set $subdomain "$1.";
        set $subdir "$1/";
        alias $config_js_location;
    }

    location ~ ^/([^/?&:'"]+)/(pwa-worker.js|manifest.json)$ {
        set $subdomain "$1.";
        set $subdir "$1/";
        rewrite ^/([^/?&:'"]+)/(pwa-worker.js|manifest.json)$ /$2;
    }

    location ~ ^/([^/?&:'"]+)/http-bind {
        set $subdomain "$1.";
        set $subdir "$1/";
        set $prefix "$1";
        rewrite ^/(.*)$ /http-bind;
    }

    location ~ ^/([^/?&:'"]+)/xmpp-websocket {
        set $subdomain "$1.";
        set $subdir "$1/";
        set $prefix "$1";
        rewrite ^/(.*)$ /xmpp-websocket;
    }

    location ~ ^/([^/?&:'"]+)/_api/room-info {
        set $subdomain "$1.";
        set $subdir "$1/";
        set $prefix "$1";
        rewrite ^/(.*)$ /_api/room-info;
    }

    location ~ ^/([^/?&:'"]+)/(.*)$ {
        set $subdomain "$1.";
        set $subdir "$1/";
        rewrite ^/([^/?&:'"]+)/(.*)$ /$2;
    }
}