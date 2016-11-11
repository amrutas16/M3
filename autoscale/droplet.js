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
			"name": "new",
			"region":"nyc3",
			"size":"512mb",
			"image":"ubuntu-14-04-x64",
			"ssh_keys":[process.env.DO_sshId],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		// var name = "new";
		// var region = "nyc3"; // Fill one in from #1
		// var image = "ubuntu-14-04-x64"; // Fill one in from #2

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};

// console.log('Digital Ocean')

// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.

//fs.appendFile("inventory", "[servers]" + "\n")
//create("production")
//name = "new";
	
//}

module.exports = client;