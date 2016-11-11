var redis = require('redis');
var express = require('express');
var app = express();
var fs = require('fs');
var sleep = require("sleep");
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {});
var doClient = require('./droplet.js');
// var store = require('./store.js');
// var client = store.client;
// var bodyParser = require('body-parser');

// app.use(bodyParser.json());       // to support JSON-encoded bodies

app.get('/', function(req, res){
  res.send('Autoscale');
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
						dropletId = body.droplet.id;
						sleep.sleep(20);
						// setTimeout(function(){
							client.getDropletIp(function(error, response)
							{
								var data = response.body;
								if( data.droplet )
								{
									var ipAddress = data.droplet.networks.v4[0]["ip_address"];	
									client.lpush("servers", "new:" + ipAddress);
								}
							});
						// }, 10000);
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
