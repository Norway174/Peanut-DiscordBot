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

			

			ReactionsRole.push({emoji: emoji, role: role.id, id: message.id})

		}


	});

	//console.log(ReactionsRole);

	if(ReactionsRole){

		client.reactionsRole.set(message.id, ReactionsRole);

		ReactionsRole.forEach(async (ReactRole) => {
			
			message.react(ReactRole.emoji)
				.catch(err => {
					console.log("Error adding role: " + err);
				});

		});


	}

};

exports.reactions = async (client, packet, reactionRole) => {

	var guild = client.guilds.get(packet.d.guild_id);

	if(!guild.me.hasPermission("MANAGE_ROLES")){
		client.logger.warn("RoleReactions Error: Missing permissions!")
		return;
	}

	//console.log(ReactionRole);

	var reactEmoji = reactionRole.find(re => re.emoji == packet.d.emoji.id || re.emoji == packet.d.emoji.name);
	if(!reactEmoji) return;
	var reactRole = guild.roles.get(reactEmoji.role);

	console.log(reactRole);

	var member = guild.members.get(packet.d.user_id)

	console.log(member);

	if (packet.t === 'MESSAGE_REACTION_ADD') {
		//client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));

		member.addRole(reactRole).catch(console.error);

	} else
	if (packet.t === 'MESSAGE_REACTION_REMOVE') {
		//if(!reaction) reaction = packet.d.emoji;
		//client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));

		member.removeRole(reactRole).catch(console.error);
	}


};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "role-reactor",
	description: "Monitors the message for reactions which corresponds to a role. Each role and emoji are defined on seperate lines.",
	usage: "role-reactor [*] <message body>"
};