# Medbot Server Admin

A barebones Node.js app using express, socket.io, redis and d3 to perform data
analysis of users' interaction with patientbot.

## Setting up redis

*Under construction*

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```
$ git clone or clone your own fork
$ cd medbot-server-admin
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
