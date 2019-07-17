const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

var _format = "MMM Do - YYYY, HH:mm";

exports.run = function(client, message, args){
	this.client = client;
	
	let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.find(mems => mems.displayName === args.join(' '));
	if (!dUser) return message.channel.send("Can't find user!")

	var joinedAt = moment(dUser.joinedTimestamp);
	var joined = joinedAt.format(_format)
	var createdAt = moment(dUser.user.createdAt);
	var created = createdAt.format(_format)

	var lastMsg = dUser.lastMessage ? dUser.lastMessage : null;
	function lastMesg(){
		var timestamp = moment(dUser.lastMessage.createdTimestamp)
		return `${timestamp.format(_format)} [${timestamp.fromNow()}]\n${lastMsg.channel}\n\`\`\`${lastMsg.cleanContent}\`\`\``;
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(dUser.user.tag, dUser.user.displayAvatarURL)
		.setDescription(dUser)
		.setColor(dUser.displayColor)
		.setFooter(message.guild.name)
		.setThumbnail(dUser.user.avatarURL)
		.addField("Display Name", dUser.displayName, true)
		.addField("User ID", dUser.id, true)
		.addField("Status", dUser.user.presence.status, true)
		.addField("Joined server on", `${joined} [${joinedAt.fromNow()}]`)
		.addField("Accounted Created", `${created} [${createdAt.fromNow()}]`);

		lastMsg ? embed.addField("Last Message", lastMesg()) : null

		embed
		.addField(`Roles [${dUser.roles.size - 1}]`, dUser.roles.map(role => role.name === "@everyone" ? null : role).join(" "))
		.addField("Avatar URL", dUser.user.displayAvatarURL, true)
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
