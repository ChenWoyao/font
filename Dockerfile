FROM nginx
COPY ./dist /usr/share/nginx/html
COPY ./font.conf  /etc/nginx/conf.d
EXPOSE 80
