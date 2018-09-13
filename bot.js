const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const moment = require("moment");
const Enmap = require("enmap");
//const EnmapLevel = require("enmap-level"); //Depricated.

/*const provider = new EnmapLevel({name: "widgets"});
client.widgets = new Enmap({provider: provider});


const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});
client.settings = settings;*/

const widgetsEnmap = new Enmap({name: "widgets"});
const settingsEnmap = new Enmap({name: "settings"});

client.widgets = widgetsEnmap;
client.settings = settingsEnmap;

client.config = require("./config.js");

// Just setting up a default configuration object here, to have somethign to insert.
client.defaultSettings = client.config.defaultSettings;

require("./util/eventLoader")(client);
require("./util/widgetLoader")(client);

client.log = message => {
	console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
	if (err) console.error(err);
	client.log(`Loading a total of ${files.length} commands.`);
	files.forEach(f => {
		let props = require(`./commands/${f}`);
		client.log(`Loading Command: ${props.help.name}`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});

client.reload = command => {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			let cmd = require(`./commands/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((cmd, alias) => {
				if (cmd === command) client.aliases.delete(alias);
			});
			client.commands.set(command, cmd);
			cmd.conf.aliases.forEach(alias => {
				client.aliases.set(alias, cmd.help.name);
			});
			resolve();
		} catch (e){
			reject(e);
		}
	});
};

client.elevation = message => {
	/* This function should resolve to an ELEVATION level which
	 is then sent to the command handler for verification*/
	let permlvl = 0;

	//console.log(`MessageID: ${message.author.id} | OwnerID: ${settings.ownerid}`)

	//It will crash if we continue past this point and it's in a private chat.
	//So we default to perm level 0 here. To make sure no one can run any harmful
	// commands in private.

	if (message.channel.type == "dm") {
		if (message.author.id === client.botSettings.ownerid) permlvl = 4;
		return permlvl;
	}

	//It will crash if a bot continues past this point.
	//So let's make all bots have perm 0, same as in DM channels.
	if (message.author.bot) return permlvl;

	if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;

	if (message.author.id === client.botSettings.ownerid) permlvl = 4;
	return permlvl;
};


client.widgetsType = new Discord.Collection();
fs.readdir("./widgets/", (err, files) => {
	if (err) console.error(err);
	client.log(`Loading a total of ${files.length} widgets.`);
	files.forEach(f => {
		let props = require(`./widgets/${f}`);
		client.log(`Loading Widget: ${props.help.name}`);
		client.widgetsType.set(props.help.name, props);
	});
});

client.reloadWidget = widget => {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./widgets/${widget}`)];
			let cmd = require(`./widgets/${widget}`);
			client.widgets.delete(widget);
			client.widgetsType.set(widget, cmd);
			resolve();
		} catch (e){
			reject(e);
		}
	});
};

client.defaultChannel = guild => {
	// get "original" default channel
	if(guild.channels.has(guild.id))
		return guild.channels.get(guild.id);

	// Check for a "general" channel, which is often default chat
	if(guild.channels.exists("name", "general"))
		return guild.channels.find("name", "general");

	// Now we get into the heavy stuff: first channel in order where the bot can speak
	// hold on to your hats!
	return guild.channels
		.filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
		.sort((a, b) => a.position - b.position || 
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
		.first();
};


client.login(client.botSettings.token);


