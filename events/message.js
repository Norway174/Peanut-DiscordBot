//const = require("../json");
const moment = require("moment");

module.exports = message => {
	if (message.author.bot) return;

	let client = message.client;
	let guild = message.guild;
	let settings = client.settings.get(guild.id);
	let prefix = settings.prefix;
	
	let iscmd = false;
	if (message.content.startsWith(prefix)) iscmd = true;
	if (message.content.startsWith(client.user)) iscmd = true;
	if (message.channel.type == "dm") iscmd = true;
	
	if (!iscmd) return;
	
	let msg = message.content;
	if (message.content.startsWith(client.user)) msg = msg.replace(client.user + " ", prefix);
	if (message.channel.type == "dm" && !msg.startsWith(prefix)) msg = prefix + msg;
	
	let command = msg.split(" ")[0].slice(prefix.length).toLowerCase();
	let params = msg.split(" ").slice(1);
	let perms = client.elevation(message);
	let cmd;
	
	let sourceLoc;
	if (message.channel.type == "dm" ) sourceLoc = `DM: ${message.channel.recipient.tag}`;
	if (message.channel.type == "group" ) sourceLoc = `GroupDM: ${message.channel.recipients}`;
	if (message.channel.type == "text" ) sourceLoc = `SERVER: ${message.guild.name} / ${message.channel.name}`;
	if (message.channel.type == "voice" ) sourceLoc = "Voice: This shoulden't happen?";
	
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	} else {
		client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${msg}] [RESULT: Not found.]`);
		message.channel.send(`No command found. Type '${prefix}help'`, {code:"xl"});
	}
	if (cmd) {
		if (perms < cmd.conf.permLevel){
			client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${msg}] [RESULT: No access.]`);
			message.channel.send("Access denied!", {code:"xl"});
			return;
		}
		client.log(`[USER: ${message.author.tag}] [${sourceLoc}] [COMMAND: ${msg}] [RESULT: Success.]`);
		cmd.run(client, message, params, perms);
	}

};