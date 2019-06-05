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
		
		if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
			messageReact(client, packet);
		} else
		if (['MESSAGE_DELETE'].includes(packet.t)){
			client.reactionsRole.forEach( (reactRole, key ) => {
				if(!reactRole) return;
				client.channels.get(packet.d.channel_id).fetchMessage(key).catch(err => {
					client.reactionsRole.delete(key);
					client.logger.log("ReactionsRole enabled message has been deleted: " + key);
				});
			});
			
		}

	});
};

function messageReact(client, packet){

	let reactionsRole = client.reactionsRole.get(packet.d.message_id);

	//console.log("Reaction registered!");


	//var reactionRole = reactionsRole.find(packet.d.message_id)

	if(!reactionsRole) return;

	var cmdName = "role-reactor"
	client.reload(cmdName)
		.then(() => {
			cmd = client.commands.get(cmdName);
			cmd.reactions(client, packet, reactionsRole);
		});
		

};