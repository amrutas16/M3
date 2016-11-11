var redis = require('redis');
var express = require('express');
var app = express();
var fs = require('fs');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {});

client.set("feature", "off");

// app.get('/test', function(req, res){
// 	client.set("feature", "off");
// 	client.getFeature(function(resp){
// 		console.log("returned value is ", resp);
// 	});
// });


app.get('/on', function(req, res){
	res.send('Feature on')
	client.set("feature", "on")
	// client.setFeature("on");
	// console.log(client.getFeature());
	// client.get("feature", function(err, value){

	// })
});

app.get('/off', function(req, res){
	res.send('Feature off')
	client.set("feature", "off")
	// client.setFeature("off");
});

app.get('/', function(req, res){
	// client.set("feature")
  	res.send('Hello world!');
});

app.get('/listservers', function(req, res){
	client.lrange("servers", 0, -1, function(err,value){ 
		res.send(value);
		console.log("Server list is ", value)});
})

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
