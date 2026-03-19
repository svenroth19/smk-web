# Stage 1: Build-Stage (hier nur Kopieren, kein echter Build nötig)
FROM nginx:1.25-alpine

# Entferne die nginx-Default-Seite
RUN rm -rf /usr/share/nginx/html/*

# Kopiere alle statischen Dateien in den nginx Web-Root
COPY ./app /usr/share/nginx/html

# Eigene nginx-Konfiguration für korrekte HTML-Routing
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 exponieren (Standard HTTP)
EXPOSE 80

# nginx im Vordergrund starten (wichtig für Container)
CMD ["nginx", "-g", "daemon off;"]
