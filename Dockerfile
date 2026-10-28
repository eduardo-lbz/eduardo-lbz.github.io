# ─── Stage: servidor web estático com nginx ───────────────────────────────────
FROM nginx:alpine

# Remove a página padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos do site para o diretório público do nginx
COPY . /usr/share/nginx/html/

# Configuração personalizada do nginx (cache, gzip, SPA fallback)
RUN printf 'server {\n\
    listen 8080;\n\
    listen [::]:8080;\n\
\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Gzip para melhor performance\n\
    gzip on;\n\
    gzip_types text/html text/css application/javascript image/svg+xml;\n\
    gzip_min_length 1000;\n\
\n\
    # Cache para assets estáticos\n\
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
\n\
    # Fallback para index.html\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Fly.io usa a porta 8080 por padrão
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
