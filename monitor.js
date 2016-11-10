var express = require('express');
var app = express();
var fs = require('fs');
var redis = require('redis');
var redisIp = fs.readFileSync('redisServer.txt', 'utf-8');
// var redisIp = '159.203.141.25';
var client = redis.createClient(6379, redisIp, {})

var bodyParser = require('body-parser');
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 

app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies
var body;

app.get('/', function(req, res){
  res.send('Hello world!');
});

// app.get('/metrics', function(req, res){
// 	res.send('Metrics\n' + body);
// 	//res.send(cpuUsage);
// 	//res.send(memUsage);
// });

app.post('/monitor', function(req,res){
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