FROM alpine:3.19

ENV RCLONE_CONFIG=/config/rclone/rclone.conf

RUN apk add --no-cache rclone restic bash wget bzip2 docker-cli busybox-openrc
RUN wget -qO - https://raw.githubusercontent.com/cupcakearmy/autorestic/master/install.sh | bash

COPY ./.autorestic.yml /root/.autorestic.yml
COPY ./exec-swarm /usr/local/bin/exec-swarm
COPY ./entrypoint.sh /entrypoint.sh
COPY ./env.sh /env.sh

RUN chmod +x /usr/local/bin/exec-swarm
RUN chmod +x /entrypoint.sh
RUN chmod +x /env.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash", "-c" "source /env.sh; $@"]
