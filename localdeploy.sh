#!/bin/bash

# Script to deploy the site by running commands on the remote server

ssh kindlepathy 'cd ~/site && git pull --rebase && sh deploy.sh'

echo "Deployment commands sent to kindlepathy."
