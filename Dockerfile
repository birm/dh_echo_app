FROM node
ARG hub_url
ARG hub_pw
ARG hostname

ADD . / ./
RUN apt-get update
RUN apt-get install curl sudo --yes --force-yes
RUN apt-get --yes --force-yes install npm

RUN npm install


ENTRYPOINT bash index.js $hub_url $hub_pw $hostname
