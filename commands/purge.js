exports.run = function(client, message, args){
	let messagecount = parseInt(args.join(' '));

	if(messagecount == NaN){
		client.logger.warn("Purge recived a NaN:" + messagecount);
		return;
	}

	if(messagecount => 99)
		messagecount = 99;

	message.channel.bulkDelete(messagecount + 1);

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
