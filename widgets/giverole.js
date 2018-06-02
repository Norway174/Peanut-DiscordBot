const moment = require("moment");

exports.run = function(client, widget, data){
	client.log(`WIDGET PROCESSED: ${widget.name}, TYPE: ${this.help.name}`);
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
	}
	
	//console.log(widgetSettings)
	client.widgets.set(widget.name, widgetSettings);
	*/
	
	message.then(m => {
		m.edit("List of reactions:\n" + m.reactions.map(reaction => reaction.emoji.name + " - " + reaction.users.map(user => user).join(", ")).join("\n"), {split:true});

		m.reactions.forEach(reaction => {
			client.log("Reaction: " + reaction.emoji);
			reaction.users.forEach(user => {
				client.log("- User: " + user.username);

				//reaction.remove(user);

			});
			m.clearReactions();
		});
	});
	
};

exports.help = {
	name: "giverole",
	description: "Gives or removes a role to a user based on the reaction.",
	usage: "Emoji-@role name"
};