var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var sleep = require("sleep");
var config = {};
config.token = process.env.DO_token;

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var dropletId;

var client =
{
	getDropletIp: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":[process.env.DO_sshId],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		//console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};

// var name = "production";
var region = "nyc3"; // Fill one in from #1
var image = "ubuntu-14-04-x64"; // Fill one in from #2

// fs.writeFile("inventory", "[redisProxy]" + "\n")
create("redisProxy")

function create(name)
{
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		// StatusCode 202 - Means server accepted request.
		if(!err && resp.statusCode == 202)
		{
			// console.log("Creating droplet")
			dropletId = body.droplet.id;
			sleep.sleep(20);
			// setTimeout(function(){
			client.getDropletIp(function(error, response)
			{
				var data = response.body;
				if( data.droplet )
				{
					var ipAddress = data.droplet.networks.v4[0]["ip_address"];
					
					fs.writeFile("../App/redisServer.txt", ipAddress);
					fs.writeFile("redisServer.txt", ipAddress);		
					// redisClient.storeIp("proxy:" + ipAddress);
					// redisClient.storeIp("redis:" + ipAddress);
					fs.writeFile("./redis/inventory", "redis ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
					fs.writeFile("./proxy/inventory", "proxy ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
					// 
				}
			});
			// }, 10000);	
			console.log("Droplet created");

		}
	});	
}
