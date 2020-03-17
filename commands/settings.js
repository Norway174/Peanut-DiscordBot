const Discord = require("discord.js");

exports.run = function(client, message, args){
	
	/*
		STEP 1: Initiliazation...

		First, we sort out the commands from the 'args' varible.
		We're also adding some variables that we can use later.

	*/
	const guild = message.guild;

	let guildSettings = client.getSettings(guild.id);


	let action = args[0];
	if(!action) action = "show";
	action = action.toLowerCase();

	let key = args[1]

	args.splice(0, 2);
	let value = args.join(" ");

	

	/*
		STEP 2: Decisions...

		Here we decide what to do.

	*/
	if(action == "show" || action == "get"){
		// SHOW or GET -> Simply outputs all the variables in a neatly formated embed.
		//message.channel.send(JSON.stringify(guildSettings, null, 4), {code: "json"});

		const embed = new Discord.RichEmbed()
		.setTitle("**ALL CONFIGS FOR: **" + message.guild.name)
		.setColor(30975)
		.setFooter(message.guild.name)
		.setTimestamp();
		//var desc = "";
		Object.keys(guildSettings).forEach((key) => {
			embed.addField("```"+ key + "```", "```" + guildSettings[key] + "``` ```[" + client.defaultSettings[key] + "]```", true);
			//desc += "```" + key + " -> " + guildSettings[key] + " [" + client.defaultSettings[key] + "]```"
		});
		//embed.setDescription(desc);
		message.channel.send(embed);
	} 
	else if(action == "set"){
		// SET -> Allows us to set a new properly. Which will be applied to a guild-spesified settings table.

		if(!key) return message.reply("Missing key to edit. Please run `" + guildSettings.prefix + "help settings`.\n```js\n" + JSON.stringify(guildSettings, null, 4) + "```");
		// Missing the key value. Return: sends a message to inform the user and stop execution.

		key = key.toLowerCase(); // Convert the key to lowercase, incase someone uses capital letters, or got their caps lock stuck.

		if(!guildSettings.hasOwnProperty(key)) return message.reply("This key (`" + key + "`) does not exists in the settings. Please run `" + guildSettings.prefix + "help settings`.\n```js\n" + JSON.stringify(guildSettings, null, 4) + "```");
		// The key is NOT missing, but it's either typed wrong. Or it doesn't exists as a setting. In whixh case we have to inform the user and stop execution here.

		if(!value) return message.reply("Missing value to add to the key. Please run `" + guildSettings.prefix + "help settings`.");
		// We have the key, and it exists. But we don't have the value we want to update the key with. So we'll inform the user and stop here.

		if(value === guildSettings[key]) return message.reply("This setting already has that value!");
		// And lastly, we have the key ANd the value. But the value is the same as the one already stored in the setting. There is no need to update it.
		// We don't have to stop here and inform the user. But there is no need to keep going. So we might as well just stop to save time and resources.


		if(!client.settings.has(guild.id)) client.settings.set(guild.id, {});
		// Check if the guild already has an entry in the settings Enmap. If not, create it. So we can poplaute it.

		const embed = new Discord.RichEmbed()
		.setTitle("**CONFIG CHANGES**")
		.setColor(5177088)
		.setFooter(message.guild.name)
		.setTimestamp()
		.addField("KEY", "```" + key + "```", true)
		.addField("NEW VALUE", "```" + value + "```", true)
		.addField("OLD VALUE", "```" + guildSettings[key] + "```", true);

		client.settings.set(guild.id, value, key);

		message.channel.send(embed);

	}
	
	else if(action == "del" || action == "delete"){
		if(!key) return message.reply("Missing key to delete. Please run `" + guildSettings.prefix + "help settings`.");
		key = key.toLowerCase();

		let oldValue = guildSettings[key]

		client.settings.delete(message.guild.id, key);

		const embed = new Discord.RichEmbed()
		.setTitle("**CONFIG DELETED**")
		.setColor(15146526)
		.setFooter(message.guild.name)
		.setTimestamp()
		.addField("DELETED KEY", "```" + key + "```", true)
		.addField("OLD VALUE", "```" + oldValue + "```", true)
		.addField("DEFAULT VALUE", "```" + client.defaultSettings[key] + "```", true);

		message.channel.send(embed);

		//message.reply(`Deleted \`${key}\` from \`${message.guild.name}\`. It's default value is \`${client.defaultSettings[key]}\`.`);

	}

	else if(action == "reset"){

		client.settings.delete(message.guild.id);
		
		const embed = new Discord.RichEmbed()
		.setTitle("**!!!ALL CONFIGS DELETED FOR THIS SERVER!!!** (This can't be undone.)")
		.setColor(15146526)
		.setFooter(message.guild.name)
		.setTimestamp()
		.setDescription("Deleted all custom configs for " + message.guild.name + " and reverted them back to the default configuration.");

		message.channel.send(embed);

	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["setting", "options", "option", "conf", "confs", "config", "configs"],
	permLevel: 3
};

exports.help = {
	name: "settings",
	description: "Per-guild settings",
	usage: "settings <get|set|delete|reset> [property] [value]"
};