# Maskfile for egemengol project

This file defines various tasks for managing and deploying the egemengol project.

## logs-report

Removes any existing local `homepage.log`, fetches the latest `homepage.access.log` from `kindlepathy`, and then generates an HTML traffic report (`report.html`) using `goaccess`.

```sh
rm ./homepage.log
scp kindlepathy:/var/log/nginx/homepage.access.log ./homepage.log
goaccess homepage.log --log-format=COMBINED -o report.html
```

## serve

Serves the Zola site locally. The `-i 0.0.0.0` flag makes it accessible from other devices on your network.

```sh
zola serve -i 0.0.0.0
```

## build-serve

Builds the Zola site and then serves the static files from the `public` directory using `miniserve`.
This is useful for previewing the production build.

```sh
zola build && miniserve --index index.html --compress-response public
```

## deploy

Connects to `kindlepathy` via SSH, navigates to `~/site`, pulls the latest changes with rebase, and then executes `deploy.sh` on the remote server.

```sh
ssh kindlepathy 'cd ~/site && git pull --rebase && sh deploy.sh'
```
