const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = function(client, message, args){
	this.client = client;
	
	let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.find(mems => mems.displayName === args.join(' '));
	if (!dUser) return message.channel.send("Can't find user!")

	var joinedAt = moment(dUser.joinedTimestamp);
	var createdAt = moment(dUser.user.createdAt);

	const embed = new Discord.RichEmbed()
		.setTitle("User: " + dUser.displayName)
		.setColor(dUser.displayColor)
		.setFooter(message.guild.name)
		.setImage(dUser.user.avatarURL)
		.addField("Tag", dUser.user.tag, true)
		.addField("ID", dUser.id, true)
		.addField("Joined at", joinedAt.format("dddd, MMMM Do YYYY, h:mm:ss a"), true)
		.addField("Joined ago", joinedAt.fromNow(), true)
		.addField("Created at", createdAt.format("dddd, MMMM Do YYYY, h:mm:ss a"), true)
		.addField("Created ago", createdAt.fromNow(), true)
		.addField("Status", dUser.user.presence.status, true)
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
