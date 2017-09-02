const settings = require("../settings.json");
const Discord = require("discord.js");
const mcPinger = require('minecraft-pinger');
const moment = require('moment');
const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

exports.run = function(client, widget, data){
	//log(`WIDGET PROCESSED: ${widget.name}`);
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
	
	//console.log(widgetSettings)
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
		
			//console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
			
			//And if it's online then we do this...
			if(!error) {
			  
			  
				//console.log("Server is online running version " + result.version.name + " with " + result.players.max + " out of " + result.players.online + " players.");
				//console.log("Message of the day: " + result.description.text);
				
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
				//console.log("Server is offline!");
				
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
		
		
		
		
		
		
		
		
		
	});
	
};

exports.help = {
  name: 'check',
  description: 'Used to display the server status.',
  usage: 'NA'
};