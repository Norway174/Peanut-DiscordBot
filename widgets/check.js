const settings = require("../settings.json");
const Discord = require("discord.js");
const mcPinger = require("minecraft-pinger");
const moment = require("moment");

exports.run = function(client, widget){
	
	//client.log("Checking server...");
	
	client.guilds.get(widget.serverID).channels.get(widget.channelID).fetchMessage(widget.messageID).then(message => {
		
		var hostname = widget.data;
		var port = 25565;
		
		//client.log(widget.name + " HOSTNAME " + hostname);
		if(hostname.indexOf(":") + 1){
			var pieces = hostname.split(":");
			port = pieces[pieces.length-1];
			
			hostname = hostname.replace(":" + port, "").trim();
		}

		//Then we do the check.
		mcPinger.pingPromise(hostname, port)
			.then(result => {
				//client.log("Server is online at '" + hostname + "', running version " + result.version.name + " with " + result.players.online + " out of " + result.players.max + " players.");
				//client.log("Message of the day: " + JSON.stringify(result.description));
				
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
					stringBuilder += result.players.online + " / " + result.players.max + " Players online:\n```" + result.players.sample.map(c => `${c.name}`).join("\n") + "```";
				} else {
					//If there is none, then display a simple string.
					stringBuilder += result.players.online + " / " + result.players.max + " Players online.";
				}

				// Get the favicon url
				var favicon = null;
				if(result.favicon){
					favicon = "https://api.minetools.eu/favicon/" + hostname + "/" + port;
				}
				
				// Remove Minecraft formatting from the results.
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
				const embed1 = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0x009600)
					.setDescription( stringBuilder )
					.setFooter("Widget ID: " + widget.name + " | Updates every " + widget.interval + " minutes", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail(favicon)
					.setTimestamp();
				
				//client.log("Editing message...Online");
				//And then edit the first message we sent. We don't want duplicate messages in our chat.
				message.edit(embed1);
				//.then(msg => console.log(`New message content: ${msg}`))
				//.catch(console.error);

				//Stop the typing effect.
				//message.channel.stopTyping();
			})
			.catch(error => {
				//client.log(hostname + ":" + port + " is offline!");
				//client.log(error);
				
				//Here we build the offline message
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0xE40000)
					.setDescription("Offline")
					.setFooter("Widget ID: " + widget.name + " | Updates every " + widget.interval + " minutes", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/AhMUw4E.png")
					.setTimestamp();
				
				//client.log("Editing message... Offline/Error");
				//And the same as before, we edit the first message with the offline message.
				message.edit(embed);
				//Stop the typing effect.
				//message.channel.stopTyping();

			});
	});
	
};

exports.help = {
	name: "check",
	description: "(Semi)Real-Time Minecraft server checker.",
	usage: "IP/hostname to check (As a string)."
};