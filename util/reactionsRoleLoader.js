//REACTIONS HANDLER

/*
client.on('messageReactionAdd', (reaction, user) => {
	client.logger.log('a reaction has been added');
});
 
client.on('messageReactionRemove', (reaction, user) => {
	client.logger.log('a reaction has been removed');
});
*/
module.exports = client => {
	client.on('raw', packet => {
		// We don't want this to run on unrelated packets. We also need this here, because the other events won't fire unless the message is cached. Which it may not always be.
		if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

		messageReact(client, packet);

		// No point in continueing at the moment.

		/*
		// Grab the channel to check the message from
		const channel = client.channels.get(packet.d.channel_id);
		// There's no need to emit if the message is cached, because the event will fire anyway for that
		if (channel.messages.has(packet.d.message_id)) return;
		// Since we have confirmed the message is not cached, let's fetch it
		channel.fetchMessage(packet.d.message_id).then(message => {
			// Emojis can have identifiers of name:id format, so we have to account for that case as well
			const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
			// This gives us the reaction we need to emit the event properly, in top of the message object
			var reaction = message.reactions.get(emoji);
			// Adds the currently reacting user to the reaction's users collection.
			if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
			// Check which type of event it is before emitting
			if (packet.t === 'MESSAGE_REACTION_ADD') {
				client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
			}
			if (packet.t === 'MESSAGE_REACTION_REMOVE') {
				if(!reaction) reaction = packet.d.emoji;
				client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
			}
		});
		*/
	});

};

function messageReact(client, packet){

	let reactionsRole = client.reactionsRole;

	reactionsRole.forEach(reactionsRole => {
		/*if(widget.type == "giverole" && widget.messageID == packet.d.message_id){

			var cmdName = "giverole"
			client.reload(cmdName)
				.then(() => {
					cmd = client.commands.get(cmdName);
					cmd.run(client, widget, widget.data, packet);
				});
		}*/
	});

};