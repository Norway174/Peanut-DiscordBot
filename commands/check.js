const settings = require("../config.js");
const Discord = require("discord.js");
const mcPinger = require("minecraft-pinger");


exports.run = function(client, message, args){
	
	const guild = message.guild;
	let guildSettings = client.getSettings(guild.id);
	
	
	//var hostname = "minecraft.frag.land";
	var hostname = guildSettings.minecraft;
	var port;
	
	if(args != 0){
		hostname = args.join(" ");
	}
	
	var hostname_org = hostname;
	
	if(hostname.includes(":")){
		var pieces = hostname.split(":");
		port = pieces[pieces.length-1];
		
		hostname = hostname.replace(":" + port, "").trim();
	}
	
	//Make the first emblem, for checking status
	const embed = new Discord.MessageEmbed()
		.setTitle(hostname_org)
		.setColor(0xFFD200)
		.setDescription( "Checking...")
		.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
		.setThumbnail("http://i.imgur.com/YRmvlBI.png")
		.setTimestamp();
	
	//Not really needed, just added as a cool-factor.
	//Makes the bot appear as if it's typing while checking the status.
	//message.channel.startTyping();
	
	//Send the checking... message.
	message.channel.send({embed})
		.then(message2 => {
	
	
		//Then we do the check.
			mcPinger.pingPromise(hostname, port)
				.then(result => {
					client.logger.log("Server is online running version " + result.version.name + " with " + result.players.online + " out of " + result.players.max + " players.");
					client.logger.log("Message of the day: " + JSON.stringify(result.description));

					//client.logger.log(JSON.stringify(result));
				
					//Make the body of the message
					var stringBuilder = "";
					//Then add the motd
					if(result.description.text){
						stringBuilder += "Message of the day:```\n" + result.description.text + "```\n";
					} else {
						stringBuilder += "Message of the day:```\n" + JSON.stringify(result.description) + "```\n";
					}

					

					//Then check if there is any players online
					if(result.players.online != 0){
					//If there is, then make a list.
						stringBuilder += result.players.online + " / " + result.players.max + " Players online:```\n" + result.players.sample.map(c => `${c.name}`).join("\n") + "```";
					} else {
					//If there is none, then display a simple string.
						stringBuilder += result.players.online + " / " + result.players.max + " Players online.";
					}
					
					var favicon = null;
					if(result.favicon){
						favicon = "https://api.minetools.eu/favicon/" + hostname_org.replace(":", "/");
					}
					
					const regex = /[§]./g;
					const str = stringBuilder;
					let m;

					while ((m = regex.exec(str)) !== null) {
						// This is necessary to avoid infinite loops with zero-width matches
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						
						// The result can be accessed through the `m`-variable.
						m.forEach((match, groupIndex) => {
							stringBuilder = stringBuilder.replace(m, "");
						});
					}

					//Here, we build the emblem for the online server.
					const embed = new Discord.MessageEmbed()
						.setTitle(hostname_org)
						.setColor(0x009600)
						.setDescription( stringBuilder )
						.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
						.setThumbnail(favicon)
						.setTimestamp();
				
					//And then edit the first message we sent. We don't want duplicate messages in our chat.
					message2.edit({embed});
				//Stop the typing effect.
				//message.channel.stopTyping();
				})
				.catch(error => {
					client.logger.log(hostname_org + " is offline!");
					client.logger.log(error);
				
					//Here we build the offline message
					const embed = new Discord.MessageEmbed()
						.setTitle(hostname_org)
						.setColor(0xE40000)
						.setDescription("Offline")
						.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
						.setThumbnail("http://i.imgur.com/AhMUw4E.png")
						.setTimestamp();
				
					//And the same as before, we edit the first message with the offline message.
					message2.edit({embed});
				//Stop the typing effect.
				//message.channel.stopTyping();
				});
			
		});
		
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["c", "status", "mc"],
	permLevel: 0
};

exports.help = {
	name: "check",
	description: "Check the status of a minecraft server. Default: [localhost:25565]",
	usage: "check <optional IP/Hostname>"
};