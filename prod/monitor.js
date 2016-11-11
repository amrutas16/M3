var express = require('express');
var app = express();
var fs = require('fs');
var redis = require('redis');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {})

app.get('/', function(req, res){
  res.send('Hello world!');
});

app.post('/monitor', function(req,res){
	res.send('Posted');
	if(req.url)
	{
		console.log("Autoscale alert!");
		client.set("autoscaleAlert", true);
	}
})

var server = app.listen(3001, function(){
	var host = server.address().address;
	var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});