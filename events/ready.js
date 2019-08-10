
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
	  await callback(array[index], index, array);
	}
  }

//const moment = require("moment");

module.exports = async (client) => {

	// Clean up old, no longer exsiting RoleReactions messages.
	client.logger.log(`Checking ${client.reactionsRole.size} RoleReactions.`)

	await asyncForEach( client.reactionsRole.array(), async (reactRole) => {
		if(!reactRole) return;

		var channel = client.channels.get(reactRole.channel_id);
			
		await channel.fetchMessage(reactRole.msg_id)
			.then(msg => {
				client.logger.log(`ReactionsRole check complete: ${reactRole.msg_id}`);
			})
			.catch(err => {
				client.reactionsRole.delete(reactRole.msg_id);
				client.logger.log("ReactionsRole has been deleted: " + reactRole.msg_id + " | Error: " + err);
			});
		
		
	});


	client.logger.log(`${client.user.tag} ready!`, "ready");
};