#!/bin/bash

source /env.sh;

syslogd;
logger "Starting backup container";
tail -f /var/log/messages
