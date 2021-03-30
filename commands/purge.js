exports.run = function(client, message, args){
	let messagecount = parseInt(args.join(" "));
	message.channel.messages.fetch({
		limit: messagecount
	}).then(messages => message.channel.bulkDelete(messages));
	message.delete(1);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["delete", "del", "remove", "pu"],
	permLevel: 3
};

exports.help = {
	name: "purge",
	description: "Purges X amount of messages from a given channel. Max 100 messages at once.",
	usage: "purge <number>"
};
