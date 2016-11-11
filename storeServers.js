var fs = require('fs');
var redis = require('redis')
var redisIp = fs.readFileSync('./prod/redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {});


var canaryIp = fs.readFileSync('./proxy/canaryIp.txt', 'utf-8');
var prodIp = fs.readFileSync('./proxy/prodIp.txt', 'utf-8');

client.lpush("servers", "canary:" + canaryIp);
client.lpush("servers", "prod:" + prodIp);