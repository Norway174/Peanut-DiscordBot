
exports.run = function(client, message){

			message.channel.send("Smrots");
	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "badjoke",
	description: "It's not funny!",
	usage: "badjoke"
};