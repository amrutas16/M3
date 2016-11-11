var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var redis = require("redis");
var sleep = require("sleep");
var redisClient;

var config = {};
config.token = process.env.DO_token;

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

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

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};

var name = "production";
var region = "nyc3"; // Fill one in from #1
var image = "ubuntu-14-04-x64"; // Fill one in from #2

create("canary")

function create(name)
{
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		// StatusCode 202 - Means server accepted request.
		if(!err && resp.statusCode == 202)
		{
			dropletId = body.droplet.id;
			sleep.sleep(20);
			client.getDropletIp(function(error, response)
			{
				var data = response.body;
				if( data.droplet )
				{
					var ipAddress = data.droplet.networks.v4[0]["ip_address"];
					fs.writeFile("../proxy/canaryIp.txt", ipAddress);
					// redisClient.lpush("servers", "canary:" + ipAddress);
					fs.writeFile("inventory", "canary ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
				}
			});
			console.log("Droplet created");	
		}
	});	
}
