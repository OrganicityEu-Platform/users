# Install

The first version of this application is based on:

* https://github.com/scotch-io/easy-node-authentication

## Ubuntu 14.04

### Prepare

```
sudo apt-get install curl libcurl4-openssl-dev
sudo apt-get install build-essential
sudo apt-get install imagemagick
sudo apt-get install graphicsmagick
```

### Install nodejs (last stable)

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
node --version                 ## v0.10.40
```

### Install MongoDB 2.6

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
```

## CentOS 6.7

### Prepare

```
yum install -y git
yum install -y curl
yum install -y mongodb-org
yum install -y ImageMagick-devel
yum install -y openssl-devel
yum install -y gcc-c++ make
```

###  Install nodejs (last stable)

```
curl --silent --location https://rpm.nodesource.com/setup | bash -
yum -y install nodejs
node --version #v0.10.41
```

### Install gulp and update npm

```
sudo npm install npm -g
sudo npm install gulp -g
npm --version #3.5.3
```

### MongoDB 3.0

Add `mongodb-org-3.0.repo`

```
sudo yum install -y mongodb-org
/var/log/mongodb/mongod.log
```

### Install GraphicsMagick

See: https://gist.github.com/boldt/c1dde964399ce4b45e1f

## MongoDB configuration

```
sudo mkdir /opt/mongodb
chmod 755 /opt/mongodb/
chown mongodb:mongodb /opt/mongodb
```

Add `smallFiles: true` as below, or replace `/etc/mongodb.conf`:

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
mongod --version # v2.6.10 (Ubuntu)
mongod --version # v3.0.7 (CentOS)
```

## Get, install and run project

```
git clone git@git.itm.uni-luebeck.de:organicity/node-scenario-tool.git
cd node-scenario-tool
npm install
```

## Config

Create/Copy config files:

```
cd config/
cp config.localhost.js config.js
cp database.localhost.js database.js
cp auth.localhost.js auth.js
```

### config.js - OAuth

The general server configuration like the IP and the port

### database.js - Database

The MongoDB database configuration

### auth.js - OAuth

Create API keys and edit `config/auth.js`

#### Facebook

https://developers.facebook.com/apps

Callback: {SERVER}/auth/facebook/callback

#### Twitter

https://apps.twitter.com/app

Callback: {SERVER}/auth/twitter/callback

#### Google+

https://console.developers.google.com/project

Callback: {SERVER}/auth/google/callback

#### Github

https://github.com/settings/applications/new

Callback: {SERVER}/auth/github/callback


## Create admin user

An admin user can be created like this:

```
cd scripts/
node mkAdminUser {USERNAME}
```

## Start application project

### Development mode

```
gulp
```

### Production mode

```
npm install forever -g
gulp build
forever start app.js
forever restart app.js
forever stop app.js
```

## Code Style

```
gulp lint
```

or

```
gulp jscs
gulp eslint
```


## Drop Database (During development)

```
mongo scenarios --eval "db.dropDatabase();"
```
