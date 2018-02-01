FROM ubuntu:14.04
ARG hub_url
ARG hub_pw
RUN sudo bash build.sh $hub_url $hub_pw
