# OrganiCity Node.js Scenario Tool

This application is baded on https://github.com/scotch-io/easy-node-authentication

## Prepare Ubuntu 14.04

```
sudo apt-get install curl
sudo apt-get install build-essential

## Install nodejs (last stable)

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
node --version                 ## v0.10.40
```

## Install MongoDB 2.6

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org

mongod --version		## v2.6.10

sudo mkdir /opt/mongodb
chmod 755 /opt/mongodb/
chown mongodb:mongodb /opt/mongodb
```

Replace `/etc/mongodb.conf` with

```
systemLog:
   destination: file
   path: "/var/log/mongodb/mongodb.log"
   logAppend: true

storage:
   dbPath: /opt/mongodb
   smallFiles: true

net:
   bindIp: 127.0.0.1
```

Restart:

```
sudo service mongod stop
sudo service mongod start
sudo service mongod status
```

## Get, install and run project

```
git clone git@git.itm.uni-luebeck.de:organicity/node-scenario-tool.git
cd node-scenario-tool
npm install
```

## Config


Edit `config/config.js`

## Start application project

```
node server.js
```

## Config Auths

Create API keys and edit `config/auth.js`

### Facebook

https://developers.facebook.com/apps

### Twitter

https://apps.twitter.com/app

Callback: {SERVER}/auth/twitter/callbacl

### Google+

https://console.developers.google.com/project

Callback: {SERVER}/auth/google/callback 

### Github

https://github.com/settings/applications/new

Callback: {SERVER}/auth/github/callback

