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
		
		if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'MESSAGE_REACTION_REMOVE_ALL'].includes(packet.t)) {
			messageReact(client, packet);
		}

	});

};

function messageReact(client, packet){

	let reactionsRole = client.reactionsRole.get(packet.d.message_id);

	//console.log("Reaction registered!");


	//var reactionRole = reactionsRole.find(packet.d.message_id)

	if(!reactionsRole) return;
	if(client.user.id == packet.d.user_id) return;

	var cmdName = "role-reactor"
	client.reload(cmdName)
		.then(() => {
			cmd = client.commands.get(cmdName);
			cmd.reactions(client, packet, reactionsRole);
		});
		

};