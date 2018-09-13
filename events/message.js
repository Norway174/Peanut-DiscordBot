//const = require("../json");
const moment = require("moment");
const argsplit = require("argsplit");

module.exports = message => {
	// Ignore other bots!
	//Allow bots in this channel.
	if (message.channel.id != "485006424422744065"){ // Realm of Chaos -> In-Game
		if (message.author.bot) return;
	}
	

	// Definitions
	let client = message.client;
	let guild;
	let settings;
	if (message.channel.type == "dm"){
		guild = message.author;
		settings = client.defaultSettings;
	} else {
		guild = message.guild;
		settings = client.settings.get(guild.id);
	}
	let prefix = settings.prefix;
	
	// Check if message is a command
	let iscmd = false;
	if (message.content.startsWith(prefix)) iscmd = true;
	if (message.content.startsWith(client.user)) iscmd = true;
	if (message.channel.type == "dm") iscmd = true;
	
	// Stop if not a command
	if (!iscmd) return;
	
	// Replace bot mention with the prefix & add prefix if there is none in the DM channel
	let msg = message.content;
	if (message.content.startsWith(client.user)) msg = msg.replace(client.user + " ", "");
	//if (message.channel.type == "dm" && !msg.startsWith(prefix)) msg = msg;
	if (message.content.startsWith(prefix)) msg = msg.replace(prefix, "");
	
	// Commander args handler
	let command = msg.split(" ")[0];
	msg = msg.replace(command, "");

	let params = argsplit(msg);

	
	// Source formating for the server log
	let sourceLoc;
	if (message.channel.type == "dm" ) sourceLoc = `DM: ${message.channel.recipient.tag}`;
	if (message.channel.type == "group" ) sourceLoc = `GroupDM: ${message.channel.recipients}`;
	if (message.channel.type == "text" ) sourceLoc = `SERVER: ${message.guild.name} / ${message.channel.name}`;
	if (message.channel.type == "voice" ) sourceLoc = "Voice: This shoulden't happen?";
	
	// Command handler
	command = command.toLowerCase();
	// Check whether the command, or alias, exist in the collections defined
	var cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) {
		// If no command is found
		client.logger.cmd(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command} - ARGS: ${params}] [RESULT: Not found.]`);
		message.channel.send(`No command found. Type '${prefix}help'`, {code:"xl"});
		return;
	}

	// Perms handler, elevate the perm if necessary
	let perms = client.elevation(message);
	// Check the permission level for the command
	if (perms < cmd.conf.permLevel){
		// No permission!
		client.logger.cmd(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command} - ARGS: ${params}] [RESULT: No access.]`);
		message.channel.send("Access denied!", {code:"xl"});
		return;
	}

	//Reload the command before we run it. Only enable for debugging.
	var debug = true;
	if(debug) {
		client.reload(cmd.help.name)
		.then(() => {
			cmd = client.commands.get(cmd.help.name) || client.commands.get(client.aliases.get(cmd.help.name));

			// Log & run the command!
			client.logger.cmd(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command} - ARGS: ${params}] [RESULT: Success.]`);
			client.logger.debug("Command reloaded!");
			cmd.run(client, message, params, perms);
		})
		.catch(e => {
			// Log & run the command!
			client.logger.cmd(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command} - ARGS: ${params}] [RESULT: Success.]`);
			client.logger.debug("Failed to reload command: " + e.stack);
			cmd.run(client, message, params, perms);
		})

		return;
	}

	// Log & run the command!
	client.logger.cmd(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command} - ARGS: ${params}] [RESULT: Success.]`);
	cmd.run(client, message, params, perms);

};