
## config 폴더 내에 있어야 하는 파일들

- `dhparams.pem` : `openssl dhparam -out dhparam.pem 4096`로 생성한 것.
- `cinesopa-ssl.conf`
- `cinesopa-wildcard-ssl.conf`
- `sopaseom-ssl.conf`
- `sopaseom-wildcard-ssl.conf`

## ssl 관련 conf 파일 에제.

```conf
ssl_protocols               TLSv1 TLSv1.1 TLSv1.2;
ssl_ecdh_curve              secp384r1;
ssl_ciphers                 "ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384 OLD_TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 OLD_TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256";
ssl_prefer_server_ciphers   on;
ssl_dhparam                 /etc/nginx/config/dhparams.pem;
ssl_certificate             /etc/ssl/private/server/config/server.crt;
ssl_certificate_key         /etc/ssl/private/server/config/server.key;
ssl_session_timeout         10m;
ssl_session_cache           shared:SSL:10m;
ssl_session_tickets         off;
ssl_stapling                on;
ssl_stapling_verify         on;
```