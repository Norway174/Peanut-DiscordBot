const moment = require("moment");

exports.run = function(client, widget, data, packet = null){

	return; // STOP HERE. This widget is being handled by an event.

	client.logger.log(`WIDGET PROCESSED: ${widget.name}, TYPE: ${this.help.name}, PACKET: ${packet}`);
	//message.channel.send("Current time: '" + Date.now() + "'");

	let guild = client.guilds.get(widget.serverID);
	let channel = guild.channels.get(widget.channelID);
	let message = channel.fetchMessage(widget.messageID);
	
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
	}*/
	

	
	
};

exports.help = {
	name: "giverole",
	description: "Gives or removes a role to a user based on the reaction.",
	usage: "Emoji-@role name"
};