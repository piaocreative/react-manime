FROM nginx:alpine

LABEL maintainer="robertoh89@gmail.com"

RUN rm /etc/nginx/conf.d/default.conf


COPY conf/dev0.conf /etc/nginx/conf.d/dev0.conf
COPY conf/dev1.conf /etc/nginx/conf.d/dev1.conf
COPY conf/dev2.conf /etc/nginx/conf.d/dev2.conf
COPY conf/dev3.conf /etc/nginx/conf.d/dev3.conf
COPY conf/dev4.conf /etc/nginx/conf.d/dev4.conf
COPY conf/dev5.conf /etc/nginx/conf.d/dev5.conf
COPY conf/dev6.conf /etc/nginx/conf.d/dev6.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx"]