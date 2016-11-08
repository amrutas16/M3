var redis = require('redis')
var express = require('express')
var app = express()
var httpProxy = require('http-proxy')
var http = require('http')
var redisIp; 
var client;
var canaryIp = fs.readFileSync('canaryIp.txt', 'utf-8');
var prodIp = fs.readFileSync('prodIp.txt', 'utf-8');
var proxy = httpProxy.createProxyServer({});

var count = 0;

// redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
client = redis.createClient(6379, redisIp, {})

http.createServer(function(req, res) {
	// client.rpoplpush('proxyQueue', 'proxyQueue', function(err, reply){
	// 	// console.log('Choosing ',reply)
	// 	var url = 'http://localhost:' + reply
	// 	console.log('url is ', url)
	// 	proxy.web(req, res, {target: url});	
	// })
	count = count + 1;
	var url;
	client.get("imgLength", function(err, value){
		if(value > 40000)
		{
			url = 'http://'+prodIp+':3000'
			count = 0;
		}
		else
		{
			if(count % 5 == 0)
			{
				url = 'http://'+canaryIp+':3000'
			}
			else
			{
				url = 'http://'+prodIp+':3000'
			}
		}
		proxy.web(req, res, {target: url});
	})	
}).listen(80);

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
