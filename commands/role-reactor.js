exports.run = (client, message, args) => {
	var msg = message.content;
	var lines = msg.split("\n");
	
	// REGEX to find Unicode Emoji OR Discord Custom Emoji
	const regex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{2934}-\u{1f18e}]|<.[a-zA-Z0-9]*.[0-9]*>/gu;

	console.log(lines);

	lines.forEach(line => {
		var match = line.match(regex);
		match = match ? true : false;
		 
	});

};

exports.reactions = (client, packet) => {



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