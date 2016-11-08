var redis = require('redis');
var express = require('express');
var app = express();
var fs = require('fs');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
// var redisIp = '159.203.141.25';
var client = redis.createClient(6379, redisIp, {})

app.get('/on', function(req, res){
	res.send('Feature on')
	client.set("feature", "on")
});

app.get('/off', function(req, res){
	res.send('Feature off')
	client.set("feature", "off")
});

app.get('/', function(req, res){
	// client.set("feature")
  	res.send('Hello world!');
});

app.get('/set', function(req, res){
	client.get("feature", function(err, value){
		if(value == "on"){
			res.send('Key set!');			
		}
		else{
			res.send('Not allowed to set key');
		}
	});
  
});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
