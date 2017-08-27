const settings = require('../settings.json');
const moment = require('moment');
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

module.exports = message => {
	
	let client = message.client;
	
	if (message.author.bot) return;
	
	let iscmd = false;
	if (message.content.startsWith(settings.prefix)) iscmd = true;
	if (message.content.startsWith(client.user)) iscmd = true;
	if (message.channel.type == "dm") iscmd = true;
	
	if (!iscmd) return;
	
	let msg = message.content;
	if (message.content.startsWith(client.user)) msg = msg.replace(client.user + " ", settings.prefix);
	if (message.channel.type == "dm") msg = settings.prefix + msg
	
	let command = msg.split(' ')[0].slice(settings.prefix.length);
	let params = msg.split(' ').slice(1);
	let perms = client.elevation(message);
	let cmd;
	
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	} else {
		log(message.author.username + " tried to run non-existing command " + msg)
		message.channel.send("No command found. Type '" + settings.prefix + "help'", {code:"xl"});
	}
	if (cmd) {
		if (perms < cmd.conf.permLevel){
			log(message.author.username + " tried to run " + message)
			message.channel.send("Access denied!", {code:"xl"});
			return;
		}
		cmd.run(client, message, params, perms);
		log(message.author.username + " successfully ran " + message)
	}

};