
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
	  await callback(array[index], index, array);
	}
  }

exports.run = async (client, message, args) => {
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
			role = message.guild.roles.get(role);
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

		var channel = client.channels.get(packet.d.channel_id);
		
		channel.fetchMessage(packet.d.message_id)
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

	var guild = client.guilds.get(packet.d.guild_id);

	if(!guild.me.hasPermission("MANAGE_ROLES")){
		client.logger.warn("RoleReactions Error: Missing permissions!")
		return;
	}

	//console.log(ReactionRole);

	var reactEmoji = reactionRole.ReactionsRole.find(re => re.emoji == packet.d.emoji.id || re.emoji == packet.d.emoji.name);
	if(!reactEmoji) return;
	var reactRole = guild.roles.get(reactEmoji.role);

	//console.log(reactRole.name);

	var member = guild.members.get(packet.d.user_id)

	//client.logger.log(`${member.displayName} reacted on ${reactRole.name}`);

	if (packet.t === 'MESSAGE_REACTION_ADD') {
		//client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));

		member.addRole(reactRole).catch(client.logger.error);
		client.logger.log(`${member.displayName} added ${reactRole.name} to their roles.`);

	} else
	if (packet.t === 'MESSAGE_REACTION_REMOVE') {
		//if(!reaction) reaction = packet.d.emoji;
		//client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));

		member.removeRole(reactRole).catch(client.logger.error);
		client.logger.log(`${member.displayName} deleted ${reactRole.name} from the roles.`);
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