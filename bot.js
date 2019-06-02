const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const moment = require("moment");
const Enmap = require("enmap");
const path = require('path');
const appRoot = path.resolve(__dirname);

const widgetsEnmap = new Enmap({name: "widgets", dataDir: appRoot + "/data"});
const settingsEnmap = new Enmap({name: "settings", dataDir: appRoot + "/data"});
const reactionsRoleEnmap = new Enmap({name: "reactionsRole", dataDir: appRoot + "/data"});

client.widgets = widgetsEnmap;
client.settings = settingsEnmap;
client.reactionsRole = reactionsRoleEnmap;

client.appRoot = appRoot;

client.config = require( appRoot + "/config.js");

// Just setting up a default configuration object here, to have something to insert.
client.defaultSettings = client.config.defaultSettings;

require( appRoot + "/util/eventLoader")(client);
require( appRoot + "/util/widgetLoader")(client);
require( appRoot + "/util/reactionsRoleLoader")(client);

client.logger = require( appRoot + "/util/logger");
/* DEPRICATED
client.log = message => {
	console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
*/

const init = async () => {


	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	fs.readdir( appRoot + "/commands/", (err, files) => {
		if (err) console.error(err);
		client.logger.log(`Loading a total of ${files.length} commands.`);
		files.forEach(f => {
			let props = require( appRoot + `/commands/${f}`);
			client.logger.log(`Loading Command: ${props.help.name}`);
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
		});
	});

	client.reload = command => {
		return new Promise((resolve, reject) => {
			try {
				delete require.cache[require.resolve( appRoot + `/commands/${command}`)];
				let cmd = require( appRoot + `/commands/${command}`);
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

	/*
	HANDLES MESSAGE PERMS

	By default, everyone get perm 0.

	DM channels get perm 0. For everyone but the bot owner.

	Channel Moderators get perm 2. Requires perm: MANAGE_MESSAGES

	Server Admins get perm 3. Requires server perm: ADMINISTRATOR

	Bot Onwer get perm 4. Requires ownerID in config.

	TODO: Add perm 2 for moderators.
	Moderators are defined per channel inside of a server,
	and are anyone who has the following permission: MANAGE_MESSAGES
	*/
	client.elevation = message => {
		/* This function should resolve to an ELEVATION level which
		is then sent to the command handler for verification*/
		let permlvl = 0;

		//console.log(`MessageID: ${message.author.id} | OwnerID: ${settings.ownerid}`)

		//It will crash if we continue past this point and it's in a private chat.
		//So we default to perm level 0 here. To make sure no one can run any harmful
		// commands in private.

		if (message.channel.type == "dm") {
			// But we also want the owner to have full permission in private too.
			if (message.author.id === client.config.ownerid) permlvl = 4;
			return permlvl;
		}

		//It will crash if a bot continues past this point.
		//So let's make all bots have perm 0, same as in DM channels.
		if (message.author.bot) return permlvl;

		if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 2;

		if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;

		if (message.author.id === client.config.ownerid) permlvl = 4;
		return permlvl;
	};


	client.widgetsType = new Discord.Collection();
	fs.readdir( appRoot + "/widgets/", (err, files) => {
		if (err) console.error(err);
		client.logger.log(`Loading a total of ${files.length} widgets.`);
		files.forEach(f => {
			let props = require( appRoot + `/widgets/${f}`);
			client.logger.log(`Loading Widget: ${props.help.name}`);
			client.widgetsType.set(props.help.name, props);
		});
	});

	client.reloadWidget = widget => {
		return new Promise((resolve, reject) => {
			try {
				delete require.cache[require.resolve( appRoot + `/widgets/${widget}`)];
				let cmd = require( appRoot + `/widgets/${widget}`);
				client.widgets.delete(widget);
				client.widgetsType.set(widget, cmd);
				resolve();
			} catch (e){
				reject(e);
			}
		});
	};

	/*
		DEFAULT CHANNELS FUNCTION
		Fetches the "default" channel for Discord.

		TODO: Make this into a guild spesific setting.
	*/
	client.defaultChannel = guild => {
		// get "original" default channel
		if(guild.channels.has(guild.id))
			return guild.channels.get(guild.id);

		// Check for a "general" channel, which is often default chat
		if(guild.channels.some(chan => chan.name === "general"))
			return guild.channels.find(chan => chan.name === "general");

		// Now we get into the heavy stuff: first channel in order where the bot can speak
		// hold on to your hats!
		return guild.channels
			.filter(c => c.type === "text" &&
		c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
			.sort((a, b) => a.position - b.position || 
		Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
			.first();
	};

	/*
		Borrowed from https://github.com/AnIdiotsGuide/guidebot/blob/fcd5bbda490474f42b5b488059beca1b800d40f8/modules/functions.js#L36

		GUILD SETTINGS FUNCTION
		This function merges the default settings (from config.defaultSettings) with any
		guild override you might have for particular guild. If no overrides are present,
		the default settings are used.
	*/
	client.getSettings = (guild) => {
		// Comment these two lines to make default guild-settings NOT be auto-updated. May save some system resources?
		delete require.cache[require.resolve(appRoot + "/config.js")];
		client.config = require( appRoot + "/config.js");

		const defaults = client.config.defaultSettings || {};
		if (!guild) return defaults;

		const guildData = client.settings.get(guild) || {};
		const returnObject = {};

		Object.keys(defaults).forEach((key) => {
			returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
		});
		return returnObject;
	};


	client.login(client.config.token);

};

init();
