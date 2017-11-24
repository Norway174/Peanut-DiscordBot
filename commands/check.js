const settings = require("../settings.json");
const Discord = require("discord.js");
const mcPinger = require('minecraft-pinger');

exports.run = function(client, message, args){
	
	//var hostname = "minecraft.frag.land";
	var hostname = 'localhost';
	var port = 25565;
	
	if(args != 0){
		hostname = args.join(" ");
	}
	
	if(hostname.indexOf(":") + 1){
		var pieces = hostname.split(":");
		port = pieces[pieces.length-1];
		
		hostname = hostname.replace(":" + port, "");
	}
	
	//Make the first emblem, for checking status
	const embed = new Discord.RichEmbed()
			.setTitle(hostname + ":" + port)
			.setColor(0xFFD200)
			.setDescription( "Checking...")
			.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
			.setThumbnail("http://i.imgur.com/YRmvlBI.png")
			.setTimestamp()
	
	//Not really needed, just added as a cool-factor.
	//Makes the bot appear as if it's typing while checking the status.
	//message.channel.startTyping();
	
	//Send the checking... message.
	message.channel.send({embed})
	.then(message2 => {
	 
	 
		//Then we do the check.
		mcPinger.pingPromise(hostname, port)
			.then(result => {
				client.log("Server is online running version " + result.version.name + " with " + result.players.online + " out of " + result.players.max + " players.");
				client.log("Message of the day: " + JSON.stringify(result.description));
				
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
					stringBuilder += result.players.online + " / " + result.players.max + " Players online:\n```" + result.players.sample.map(c => `${c.name}`).join('\n') + "```";
				} else {
					//If there is none, then display a simple string.
					stringBuilder += result.players.online + " / " + result.players.max + " Players online.";
				}
				
				//Here, we build the emblem for the online server.
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0x009600)
					.setDescription( stringBuilder )
					.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/2JUhMfW.png")
					.setTimestamp()
				
				//And then edit the first message we sent. We don't want duplicate messages in our chat.
				message2.edit({embed});
				//Stop the typing effect.
				//message.channel.stopTyping();
			})
			.catch(error => {
				client.log(hostname + ":" + port + " is offline!");
				client.log(error);
				
				//Here we build the offline message
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0xE40000)
					.setDescription("Offline")
					.setFooter("Minecraft status checker", "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/AhMUw4E.png")
					.setTimestamp()
				
				//And the same as before, we edit the first message with the offline message.
				message2.edit({embed});
				//Stop the typing effect.
				//message.channel.stopTyping();
			})
			
	});
		
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["c", "status", "mc"],
  permLevel: 0
};

exports.help = {
  name: 'check',
  description: 'Check the status of a minecraft server. Default: [localhost:25565]',
  usage: 'check <optional IP/Hostname>'
};