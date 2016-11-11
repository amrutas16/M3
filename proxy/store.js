var redis = require('redis');
// var express = require('express');
// var app = express();
var fs = require('fs');
// var multer  = require('multer');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
// var redisIp = '159.203.141.25';
// var redisIp = '127.0.0.1';
var client = redis.createClient(6379, redisIp, {})
// var count = 0;
// client.set("feature", "off");
var a = 5;

module.exports = {
	storeServerIp: function(ip)
	{
		client.lpush("servers", ip);
	},
	
	getAutoscaleAlert: function(callback)
	{
		client.get("autoscaleAlert", function(err, value){
			return callback(value);
		});
	},
	setAutoscaleAlert: function(value)
	{
		client.set("autoscaleAlert", value);
	},
	delAutoscaleAlert: function(value)
	{
		client.del("autoscaleAlert");
	},
	setAlert: function ()
	{
		client.set("alert", true);
	},
	getAlert: function (callback)
	{
		client.get("alert", function(err, value){
			return callback(value);
		});
	},
	delAlert: function ()
	{
		client.del("alert");
	},
	setFeature: function (value)
	{
		client.set("feature", value);
		// console.log("Set ", value);
	},
	getFeature: function (callback)
	{
		console.log("Get feature");
		client.get("feature", function(err, value){
			// val = value;
			// console.log("Value is ", val);
			return callback(value);
		});
		
	},
	delFeature: function ()
	{
		client.del("feature");
	}
};

exports.client = this.client;
exports.a = this.a;