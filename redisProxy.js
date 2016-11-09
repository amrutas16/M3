var needle = require("needle");
var os   = require("os");
var fs = require("fs");
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

// console.log('Digital Ocean')

// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.
var name = "production";
var region = "nyc3"; // Fill one in from #1
var image = "ubuntu-14-04-x64"; // Fill one in from #2
// fs.appendFile("inventory", "[redis_proxy]" + "\n")

// client.createDroplet("redisProxy", region, image, function(err, resp, body)
// {
// 	// StatusCode 202 - Means server accepted request.
// 	if(!err && resp.statusCode == 202)
// 	{
// 		// console.log( JSON.stringify( body, null, 3 ) );
// 		console.log("Creating redis and proxy droplet")
// 		dropletId = body.droplet.id;
// 		console.log("Droplet id is", dropletId)
// 		setTimeout(function(){
// 		client.getDropletIp(function(error, response)
// 		{
// 			var data = response.body;
// 			if( data.droplet )
// 			{
// 				var ipAddress = data.droplet.networks.v4[0]["ip_address"];
// 				// process.env.redisProxyIp = ipAddress;
// 				fs.appendFile("inventory", "[redisProxy]" + "\n")
// 				fs.appendFile("inventory", "redisProxy ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
// 				fs.appendFile("~/Fall2016/Devops/App/redisServer.txt", ipAddress)		
// 			}
// 		});
// 		}, 20000);		
// 	}
// });

// client.createDroplet("production", region, image, function(err, resp, body)
// 	{
// 		// StatusCode 202 - Means server accepted request.
// 		if(!err && resp.statusCode == 202)
// 		{
// 			// console.log( JSON.stringify( body, null, 3 ) );
// 			console.log("Creating production droplet")
// 			dropletId = body.droplet.id;
// 			console.log("\nDroplet id is ", dropletId);
// 			setTimeout(function(){
// 			client.getDropletIp(function(error, response)
// 			{
// 				var data = response.body;
// 				if( data.droplet )
// 				{
// 					var ipAddress = data.droplet.networks.v4[0]["ip_address"];
// 					// process.env.redisProxyIp = ipAddress;
// 					fs.appendFile("inventory", "[servers]" + "\n")
// 					fs.appendFile("inventory", "production ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
// 					// fs.appendFile("~/Fall2016/Devops/M3/redisServer.txt", ipAddress)		
// 				}
// 			});
// 			}, 20000);		
// 		}
// });

fs.appendFile("inventory", "[redisProxy]" + "\n")
create("redisProxy")
// fs.appendFile("servers", "[servers]" + "\n")
// console.log(create("production"))
// console.log(create("canary"))

function create(name)
{
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		// StatusCode 202 - Means server accepted request.
		if(!err && resp.statusCode == 202)
		{
			console.log("Creating droplet")
			dropletId = body.droplet.id;
			// console.log("\nDroplet id is ", dropletId);
			setTimeout(function(){
			client.getDropletIp(function(error, response)
			{
				var data = response.body;
				if( data.droplet )
				{
					var ipAddress = data.droplet.networks.v4[0]["ip_address"];
					
					fs.appendFile("~/Fall2016/Devops/M3/App/redisServer.txt", ipAddress)		
					fs.appendFile("inventory", "redisProxy ansible_ssh_host=" + ipAddress + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")
					// 
				}
			});
			}, 10000);		
		}
	});	
}
