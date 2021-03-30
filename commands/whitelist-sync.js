const Rcon = require("rcon");
const Discord = require("discord.js");

exports.run = (client, message, args, perms) => {
	var hostname = client.config.rcon.hostname;
	var port = client.config.rcon.port;
	var password = client.config.rcon.password;


	// Get the member role.
	var role = message.guild.roles.find(r => r.name == "Server Whitelisted");

	if(role == null) return;

	let membersWithRole = message.guild.roles.cache.get(role.id).members.map(mem => mem.displayName);

	var embed = new Discord.MessageEmbed()
			//.setTitle("Status updated")
			.setColor('#0099ff');
			
	//embed.addField("Discord:", membersWithRole.map(mem => mem + "\n"), true);
	//console.log(membersWithRole.map(mem => mem.displayName + "\n"));
	
	// Opens the connection to the RCON.
	var conn = new Rcon(hostname, port, password);


	conn.on("auth", () => {
		client.logger.log("Authed!");

		conn.send(`whitelist list`);

	})
	.on("response", str => {
		//client.logger.log("Got response: " + str);

		const regex = /There are \d* .out of \d* seen. whitelisted players:(.*) and (.*)/g;

		str = str.replace(regex, "$1, $2");

		var serverMem = str.split(", ")

		//console.log(membersWithRole);
		//console.log(serverMem);

		var diff = diffArray2(membersWithRole, serverMem);

		//console.log(diff);

		var noSync = ""
		if(diff.length == 0) noSync = "No action required. You're all caught up!";

		embed.setDescription("`[Server]` = The username is whitelisted on the server. But is not found in Discord.\n`[Discord]` = The user has the Whitelisted role in Discord. But is not found on the server.\n```Total Server: " + serverMem.length + " | Total Discord: " + membersWithRole.length + " | Out of sync: " + diff.length + "\n\n" + diff.join("\n") + noSync + "```");

		conn.disconnect();

	})
	.on("end", () => {
		client.logger.log("Socket closed!");
		
		message.channel.send({embed});

	})
	.on("error", err => {
		client.logger.log("Socket: " + err);
		
	});
	conn.connect();

	// FUNCTIONS
	function diffArray2(arr1, arr2) {
		seen = {}
		names = {}
		var newArr = []
		arr1.forEach(function(val) {
			seen[val.toLowerCase()] = 1 // we saw it on first array
			names[val.toLowerCase()] = val
		})
		arr2.forEach(function(val) {
			
		  if (seen[val.toLowerCase()] == 1) { // we already saw it on the first one, unmark
			seen[val.toLowerCase()] = false
		  } else if (seen.hasOwnProperty(seen[val.toLowerCase()]) == false) { // if we hadnt seen it earlier
			seen[val.toLowerCase()] = 2 // mark with a 2
			names[val.toLowerCase()] = val
		  }
		})
	  
		for (var val in seen) {
		  if (seen[val]) { // if its a 1 or a 2, it was unique
			if(seen[val] == 1) val = "[Discord] " + names[val.toLowerCase()]
			if(seen[val] == 2) val = "[Server] " + names[val.toLowerCase()]
			newArr.push(val)
		  }
		}
		return newArr
	  }
	
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "whitelist-sync",
	description: "Displays Whitelisted users on the server. And compares them to the Discord role. Only for Peanut Craft.",
	usage: "whitelist-sync"
};