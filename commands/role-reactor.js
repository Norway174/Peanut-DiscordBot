
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
	  await callback(array[index], index, array);
	}
  }

exports.run = async (client, message, args) => {

	const overwrite_msg_regex = /^\s*(-[0-9]{18})/;
	
	var overwrite_msg_id = args[0].match(overwrite_msg_regex);

	//console.log(overwrite_msg_id);
	if (overwrite_msg_id !== null ){
		overwrite_msg_id = overwrite_msg_id[0].replace("-", "");
		var ovr_msg = await message.channel.messages.fetch(overwrite_msg_id)
		.catch(err => {
			message.channel.send("Unable to find message.");
			//client.logger.error(err);
			return null;
		});
		if ( ovr_msg == null ) return;

		message = ovr_msg;

		client.reactionsRole.delete(overwrite_msg_id);
	}

	var msg = message.content;
	var lines = msg.split("\n");

	// REGEX to find Unicode Emoji OR Discord Custom Emoji
	const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])|<:[a-zA-Z0-9]*:[0-9]*>/gm;

	const roleRegex = /<@&[0-9]*>/;

	const EmojiRegex = /<:[a-zA-z0-9]*:([0-9]*)>/;

	//console.log(lines);

	var ReactionsRole = [];

	

	await lines.forEach(async (line) => {
		var emoji = line.match(regex);
		//match = match ? true : false;

		var role = line.match(roleRegex);
		
		

		if(emoji && role){
			role = role.join("").replace("<@&", "").replace(">", "");
			role = message.guild.roles.cache.get(role);
			emoji = emoji.join("").replace(EmojiRegex, `$1`);

			//console.log("Line: " + line + " | Emoji: " + emoji + " | Role: " + role);

			

			ReactionsRole.push({emoji: emoji, role: role.id})

		}


	});

	//console.log(ReactionsRole);


	if(ReactionsRole){
		//var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

		client.reactionsRole.set(message.id, {msg_id: message.id, channel_id: message.channel.id, ReactionsRole});

		/*ReactionsRole.forEach( async (ReactRole) => {
			
			await message.react(ReactRole.emoji)
				.then((async () => { await wait(20000); console.warn('done') })())
				.catch(err => {
					console.log("Error adding role: " + err);
				});
			
		});*/

		asyncForEach(ReactionsRole, async (ReactRole) => {
			
			await message.react(ReactRole.emoji)
				.then()
				.catch(err => {
					console.log("Error adding role: " + err);
				});
			
		});


	}

};

exports.reactions = async (client, packet, reactionRole) => {

	if (['MESSAGE_REACTION_REMOVE_ALL'].includes(packet.t)) {

		var channel = client.channels.cache.get(packet.d.channel_id);
		
		channel.messages.fetch(packet.d.message_id)
			.then(msg => {
				client.logger.log(`Reactions removed for: ${msg.id}`);

				asyncForEach(reactionRole.ReactionsRole, async (ReactRole) => {

					await msg.react(ReactRole.emoji)
						.then()
						.catch(err => {
							console.log("Error adding role: " + err);
						});
			
				});
			})
			.catch(err => {
				//client.reactionsRole.delete(key);
				client.logger.log("Unable to find ReactionsRole message: " + msg.id + " | Error: " + err);
			});

		
		
		return;
	}

	var guild = client.guilds.cache.get(packet.d.guild_id);

	if(!guild.me.hasPermission("MANAGE_ROLES")){
		client.logger.warn("RoleReactions Error: Missing permissions!")
		return;
	}

	//console.log(ReactionRole);

	var reactEmoji = reactionRole.ReactionsRole.find(re => re.emoji == packet.d.emoji.id || re.emoji == packet.d.emoji.name);
	if(!reactEmoji) return;
	var reactRole = guild.roles.cache.get(reactEmoji.role);

	//console.log(reactRole.name);

	var member = guild.members.cache.get(packet.d.user_id);

	//client.logger.log(`${member.displayName} reacted on ${reactRole.name}`);

	if (packet.t === 'MESSAGE_REACTION_ADD' || packet.t === 'MESSAGE_REACTION_REMOVE') {
		if(member.roles.cache.get(reactRole.id) == null) {
			member.roles.add(reactRole)
			.then(member => client.logger.log(`${member.displayName} added ${reactRole.name} from the roles.`))
			.catch(e => client.logger.warn(`Failed to add ${reactRole.name} to ${member.displayName}. Error: ${e}`));
		} else{
			member.roles.remove(reactRole)
			.then(member => client.logger.log(`${member.displayName} removed ${reactRole.name} from the roles.`))
			.catch(e => client.logger.warn(`Failed to remove ${reactRole.name} from ${member.displayName}. Error: ${e}`));
			verb = "removed";
		}
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "role-reactor",
	description: "Monitors the message for reactions which corresponds to a role. Each role and emoji are defined on seperate lines.",
	usage: "role-reactor [*] <message body>"
};