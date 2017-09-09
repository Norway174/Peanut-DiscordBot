const settings = require("../settings.json");
const Discord = require("discord.js");
const mcPinger = require('minecraft-pinger');
const moment = require('moment');

exports.run = function(client, widget, data){
	//message.channel.send("Current time: '" + Date.now() + "'");
	
	/*
	const widgetSettings = {
		serverID: widget.serverID,
		channelID: widget.channelID,
		messageID: widget.messageID,
		name: widget.name,
		type: widget.type,
		interval: widget.interval,
		intervalCount: 0,
		data: widget.data
	}
	
	client.widgets.set(widget.name, widgetSettings);
	*/
	
	client.guilds.get(widget.serverID).channels.get(widget.channelID).fetchMessage(widget.messageID).then(m => {

		//var hostname = "minecraft.frag.land";
	let hostname = widget.data;
	let port = 25565;
	
	//Make the first emblem, for checking status
	const embed = new Discord.RichEmbed()
			.setTitle(hostname + ":" + port)
			.setColor(0xFFD200)
			.setDescription( "Checking...")
			.setFooter("ID: " + widget.name, "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
			.setThumbnail("http://i.imgur.com/YRmvlBI.png")
			.setTimestamp()
	
	
	//Send the checking... message.
	m.edit({embed})
	.then(message2 => {
	 
		//Then we do the check.
		mcPinger.ping(hostname, port, (error, result) => {
		
			
			//And if it's online then we do this...
			if(!error) {
			  
			  
				//console.log("Server is online running version " + result.version.name + " with " + result.players.max + " out of " + result.players.online + " players.");
				
				//Here, we build the emblem for the online server.
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0x009600)
					.setDescription( "Message of the day:```\n" + JSON.stringify(result.description) + "```\n" + result.players.online + " / " + result.players.max + " Players online:\n```" + result.players.sample.map(c => `${c.name}`).join('\n') + "```")
					.setFooter("Widget ID: " + widget.name, "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/2JUhMfW.png")
					.setTimestamp()
				
				//And then edit the first message we sent. We don't want duplicate messages in our chat.
				message2.edit({embed});
			
			
			} else {  
				
				//Here we build the offline message
				const embed = new Discord.RichEmbed()
					.setTitle(hostname + ":" + port)
					.setColor(0xE40000)
					.setDescription("Offline")
					.setFooter("Widget ID: " + widget.name, "http://www.rw-designer.com/icon-image/5547-256x256x32.png")
					.setThumbnail("http://i.imgur.com/AhMUw4E.png")
					.setTimestamp()
				
				//And the same as before, we edit the first message with the offline message.
				message2.edit({embed});			
			}

		});
	});
		
		
		
		
		
		
		
		
		
					// client.log("Server is offline!");
	});
	
};

exports.help = {
  name: 'check',
  description: 'Used to display the server status.',
  usage: 'NA'
};