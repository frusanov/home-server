#!/bin/bash

# parse _FILE env variables
for e in $(env | grep _FILE=); do
  # remove _FILE suffix
  var=$(echo $e | sed -r "s/(.*)_FILE=.*/\1/g");
  # get value of env variable
  val=$(echo $e | sed -r "s/.*=(.*)/\1/g");
  # export variable
  export "$var=$(cat $val)";
done
