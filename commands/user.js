const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

var _format = "MMM Do - YYYY, HH:mm";

exports.run = async function(client, message, args){
	this.client = client;

	// If a guild has more than 250 members, not every member will be cached.
	// This should get all the members, so we can search for the correct one. Might take a while?
	if(message.guild.memberCount >= 250) await message.guild.members.fetch();
	
	let dUser = null;
	if(args[0] === true){
		dUser = args[1];
	} else {
		dUser = message.guild.member(message.mentions.users.first()) // First we try to get the first mention. Simple & Quick!
		|| message.guild.members.cache.get(args[0]) // Then we check if the supplied arg is a an ID.
		|| message.guild.members.cache.find(mems => { // If that fails, we move on to the heavy stuff.
			if (mems.displayName.toLowerCase() === args.join(' ').toLowerCase()){ // Check if a user has the display name. Inclduing a custon nickname.
				return mems;
			} else
			if (mems.user.username.toLowerCase() === args.join(' ').toLowerCase()){ // Then check their real username.
				return mems;
			} else
			if (mems.user.tag.toLowerCase() === args.join(' ').toLowerCase()){ // Then we check their real username + tag.
				return mems;
			}
		});
		if (!dUser) {
			// If all of them fails. Then we report back. :(
			return message.channel.send("Can't find user!")
		}
	}
	var joinedAt = moment(dUser.joinedTimestamp);
	var joined = joinedAt.format(_format)
	var createdAt = moment(dUser.user.createdAt);
	var created = createdAt.format(_format)

	var lastMsg = dUser.lastMessage ? dUser.lastMessage : null;
	function lastMesg(){
		var timestamp = moment(dUser.lastMessage.createdTimestamp)
		return `${timestamp.format(_format)} [${timestamp.fromNow()}]\n${lastMsg.channel}\n\`\`\`${lastMsg.cleanContent}\`\`\``;
	}

	var roles = dUser.roles.cache.filter(role => { if(role.name !== "@everyone") return role } )

	const embed = new Discord.MessageEmbed()
		.setAuthor(dUser.user.tag, dUser.user.displayAvatarURL)
		.setDescription(dUser)
		.setColor(dUser.displayColor)
		.setFooter("User lookup")
		.setThumbnail(dUser.user.avatarURL())
		.addField("Display Name", dUser.displayName, true)
		.addField("User ID", dUser.id, true)
		.addField("Status", dUser.user.presence.status, true)
		.addField("Joined server on", `${joined} [${joinedAt.fromNow()}]`)
		.addField("Account Created", `${created} [${createdAt.fromNow()}]`);

		lastMsg ? embed.addField("Last Message", lastMesg()) : null

		embed
		.addField(`Roles [${roles.size}]`, roles.size != 0 ? roles.array().join(" ") : 'No roles.')
		.addField("Avatar URL", dUser.user.displayAvatarURL(), true)
		.setTimestamp();

		message.channel.send(embed)

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["account"],
	permLevel: 2
};

exports.help = {
	name: "user",
	description: "Get information about any user in the current guild.",
	usage: "user <username>"
};
