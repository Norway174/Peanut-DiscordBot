//const = require("../json");
const moment = require("moment");
const argsplit = require("argsplit");

module.exports = message => {
	// Ignore other bots!
	if (message.author.bot) return;

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

	// Perms handler, elevate the perm if necessary
	let perms = client.elevation(message);

	// Define a null command.
	let cmd;
	
	// Source formating for the server log
	let sourceLoc;
	if (message.channel.type == "dm" ) sourceLoc = `DM: ${message.channel.recipient.tag}`;
	if (message.channel.type == "group" ) sourceLoc = `GroupDM: ${message.channel.recipients}`;
	if (message.channel.type == "text" ) sourceLoc = `SERVER: ${message.guild.name} / ${message.channel.name}`;
	if (message.channel.type == "voice" ) sourceLoc = "Voice: This shoulden't happen?";
	
	// Command handler
	command = command.toLowerCase();
	if (client.commands.has(command)) {
		// Get command from name
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		// Get command from alias
		cmd = client.commands.get(client.aliases.get(command));
	} else {
		// If no command is found
		client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command}] [RESULT: Not found.]`);
		message.channel.send(`No command found. Type '${prefix}help'`, {code:"xl"});
	}
	// If the command is found
	if (cmd) {
		// Check the permission level for the command
		if (perms < cmd.conf.permLevel){
			// No permission!
			client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command}] [RESULT: No access.]`);
			message.channel.send("Access denied!", {code:"xl"});
			return;
		}
		// Log & run the command!
		client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${command}] [RESULT: Success.]`);
		cmd.run(client, message, params, perms);
	}

};