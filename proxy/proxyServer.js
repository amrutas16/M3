var redis = require('redis')
var express = require('express')
var app = express();
var fs = require('fs')
var httpProxy = require('http-proxy')
var http = require('http')
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {});

var canaryIp = fs.readFileSync('canaryIp.txt', 'utf-8');
var prodIp = fs.readFileSync('prodIp.txt', 'utf-8');
var proxy = httpProxy.createProxyServer({});

var count = 0;
var url = 'http://'+prodIp+':3000';

// redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
// client = redis.createClient(6379, redisIp, {})
var proxy = httpProxy.createProxyServer({});

client.set("alert", false);

http.createServer(function(req, res) {
	count = count + 1;
	client.get("alert", function(err, value){
		console.log("alert value", value);
		if(value == "true")
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
		console.log("Url is ", url);
	})	
}).listen(80);
