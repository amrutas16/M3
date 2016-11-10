var redis = require('redis');
var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
// var redisIp = '159.203.141.25';
var client = redis.createClient(6379, redisIp, {})
var doClient = require('./droplet.js');

// var bodyParser = require('body-parser');

// app.use(bodyParser.json());       // to support JSON-encoded bodies

app.get('/', function(req, res){
  res.send('Hello world!');
});

setInterval(function(){
client.get("autoscaleAlert", function(err, value){
		if(value == "true")
		{
			console.log("Autoscale Alert!");
			client.set("autoscaleAlert", false);
			// create new server
			doClient.createDroplet(function(err, res, body){
				if(!err)
				{
					console.log("New droplet created!");
				}
			});
		}
		else
		{
			console.log("No alert");
		}
	})
}, 2000);


var server = app.listen(3001, function(){
	var host = server.address().address;
	var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
