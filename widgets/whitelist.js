const moment = require("moment");
const Discord = require("discord.js");
const argsplit = require("argsplit");

exports.run = function(client, widget, data){
	//client.logger.log(`WIDGET PROCESSED: ${widget.name}`);
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
		//Here, we build the emblem for the online server.
		const embed = new Discord.RichEmbed()
		.setTitle(`Welcome to ${client.guilds.get(widget.serverID).name}`)
		.setColor(0x009600)
		.setDescription( "This server uses an automatic whitelist system.\nAll you have to do to get whitelisted is type `#signup <Your Minecraft username>`.\n\nMake sure your username is correct. As this is what will be whitelisted. If you have another account you'd like to whitelist. Then please return to this channel, and do the same again. But with the new username. Please note, you may only whitelist one Minecraft account per Discord account.\n\nIf you leave this server, or change your whitelisted account, all your claimed chunks will become unclaimed.\n\nEnjoy your stay! :)" )
		.setFooter("Widget ID: " + widget.name + " | Updates every " + widget.interval + " minutes")
		//.setThumbnail(favicon)
		.setTimestamp();

		m.edit(embed);
	});

	client.guilds.get(widget.serverID).channels.get(widget.channelID).fetchMessages()
	.then(messages => {
		//client.logger.debug("Size: " + messages.size)
		if(messages.size == 1) return;
		messages
		.filter(msg => msg.id != widget.messageID)
		.tap(msg => {
			//client.logger.debug("Messages: " + msg.cleanContent)
			if(msg.cleanContent.startsWith("#signup")){

				let command = msg.cleanContent.split(" ")[0];
				let msg2 = msg.cleanContent.replace(command, "");
				let params = argsplit(msg2);
				//client.commands.get("whitelist").run(client, msg, params)
			}
			msg.delete();
		});
	})

	
};

exports.help = {
	name: "whitelist",
	description: "A whitelist for Chaos Grid.",
	usage: "No additional data required."
};