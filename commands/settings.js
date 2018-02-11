

exports.run = function(client, message, args){
	
	let action = args[0];
	let value = args[1];

	args.splice(0, 2);
	let arg = args.join(" ");

	if(action == "show"){
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
	} 
	else if(action == "prefix"){
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
		let settings = client.settings.get(message.guild.id);

		let oldPrefix = settings.prefix;
		let newPrefix = value;
		settings.prefix = newPrefix;

		client.settings.set(message.guild.id, settings);
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
	}
	else if (action == "welcome"){
		var isTrueSet = (value == "true");
		var isFalseSet = (value == "false");
		if(isTrueSet == false & isFalseSet == false) {
			message.channel.send("Must be either \"true\" or \"false\". " + value);
			return;
		}
		else if (isTrueSet) value = isTrueSet;
		else if (isFalseSet) value = isFalseSet;

		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
		let settings = client.settings.get(message.guild.id);

		let oldWelcomeMessageEnabled = settings.welcomeMessageEnabled;
		let newWelcomeMessageEnabled = value;
		settings.welcomeMessageEnabled = newWelcomeMessageEnabled;

		client.settings.set(message.guild.id, settings);
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
	
	}
	else if(action == "reset"){
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});

		client.settings.set(message.guild.id, client.defaultSettings);
		message.channel.send(JSON.stringify(client.settings.get(message.guild.id)), {code: "json"});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["setting"],
	permLevel: 3
};

exports.help = {
	name: "settings",
	description: "Per-guild settings",
	usage: "settings <show|prefix|welcome|reset> [value]"
};