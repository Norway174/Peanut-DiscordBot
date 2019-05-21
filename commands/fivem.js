const Discord = require("discord.js");
const fetch = require("node-fetch");


exports.run = function(client, message, args){
	
	const guild = message.guild;
	let guildSettings = client.getSettings(guild.id);
	
	var hostname = guildSettings.fivem_host;
	var port = guildSettings.fivem_port;


	
	if(args != 0){
		hostname = args.join(" ");
	}
	
	if(hostname.indexOf(":") + 1){
		var pieces = hostname.split(":");
		port = pieces[pieces.length-1];
		
		hostname = hostname.replace(":" + port, "").trim();
	}

	const ip = `${hostname}:${port}`
	const serverURL = `http://${ip}/`;
	const infoURL = serverURL + "info.json";
	const playersURL = serverURL + "players.json";

	const masterURL = "http://servers-live.fivem.net/api/servers/";

	//Make the first emblem, for checking status
	const embed = new Discord.RichEmbed()
		.setTitle(ip)
		.setColor(0xFFD200)
		.setDescription( "Checking...")
		.setFooter("FiveM server checker", "https://i.imgur.com/evcQowp.png")
		.setThumbnail("http://i.imgur.com/YRmvlBI.png")
		.setTimestamp();
	
	//Send the checking... message.
	message.channel.send({embed})
		.then(message2 => {
		//Then we do the check.

			var server = {};

			//console.log(`Running Get info on ${serverURL}...`);
			//getInfo();
			getName();
			//console.log("Ran Get info.");

			function getInfo(){
				//console.log("Getting info...");
				fetch(infoURL)
					.then(res => {
						console.log(res);
						return res.text();
					})
					.then(json => {
						// Success!
						//console.log(json)

						server.infos = json;

						getPlayers();

					})
					.catch(err => {
						// Error! / Offline?
						client.logger.error(err)

						failed();
					});
			};

			function getPlayers(){
				//console.log("Getting players...");
				fetch(playersURL)
					.then(res => res.json())
					.then(json => {
						// Success!
						//console.log(json)

						server.players = json;

						getName();

					})
					.catch(err => {
						// Error! / Offline?
						client.logger.error(err)

						failed();
					});
			};

			function getName(){
				//console.log("Getting name...");
				fetch(masterURL)
					.then(res => res.json())
					.then(json => {
						// Success!
						//console.log(json)

						//server.players = json;

						for (let serv of json) {
							if (serv.EndPoint == ip) {
							  //server.infos.vars.sv_hostname = serv.Data.hostname
							  server = serv.Data;
							}
						  }

						success();

					})
					.catch(err => {
						// Error! / Offline?
						client.logger.error(err)

						failed();
					});
			};

			function success(){
				//Make the body of the message
				var stringBuilder = "";

				stringBuilder += "**IP:** " + ip + "\n\n";

				//Then check if there is any players online
				if(server.players.length > 0){

					//If there is, then make a list.
					const names = server.players.map(n => n.name);
					const longest = names.reduce((long, str) => Math.max(long, str.length), 0);

					stringBuilder += server.players.length + " / " + server.sv_maxclients + " Players online:\n```" + server.players.map(c => `${c.id} - ${c.name}${" ".repeat(longest - c.name.length + 4)} | PING: ${c.ping}`).join("\n") + "```";

				} else {
				//If there is none, then display a simple string.
					stringBuilder += server.players.length + " / " + server.sv_maxclients + " Players online.";
				}

				//Here, we build the emblem for the online server.
				const embed = new Discord.RichEmbed()
					.setTitle(server.hostname)
					.setColor(0x009600)
					.setDescription( stringBuilder )
					.setFooter("FiveM server checker", "https://i.imgur.com/evcQowp.png")
					//.setThumbnail(null)
					.setTimestamp();
		
				//And then edit the first message we sent. We don't want duplicate messages in our chat.
				message2.edit({embed});
			};

			function failed(){
				//Here we build the offline message
				const embed = new Discord.RichEmbed()
					.setTitle(ip)
					.setColor(0xE40000)
					.setDescription("Offline")
					.setFooter("FiveM server checker", "https://i.imgur.com/evcQowp.png")
					.setThumbnail("http://i.imgur.com/AhMUw4E.png")
					.setTimestamp();
			
				//And the same as before, we edit the first message with the offline message.
				message2.edit({embed});
			};
		});	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "fivem",
	description: "Check the status of a FiveM server. Default: [localhost:25565]",
	usage: "check <optional IP/Hostname>"
};