//const settings = require("../config.js");
const Discord = require("discord.js");
exports.run = (client, message, params) => {

	let settings = client.getSettings(message.guild.id);
	let prefix = settings.prefix;

	if (!params[0]) {
		
		const myCommands = client.commands.filter(cmd => client.elevation(message) >= cmd.conf.permLevel /*&& cmd.conf.guildOnly !== true*/);

		const commandNames = Array.from(myCommands.keys());
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		message.channel.send( `= Command List =\n\n[Use ${prefix}help <command> for details]\n\n${myCommands.map(c => `${prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}`).join("\n") }`, {code:"asciidoc", split:true});
	} else {
		let command = params[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);

			const commandNames = Array.from(client.widgetsType.keys());
			const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
			const widgets = client.widgetsType.map(c => `${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n//DATA: ${c.help.usage}`).join("\n");

			message.channel.send( `= ${command.help.name.toUpperCase()} = \n${command.help.description}\n${prefix}${command.help.usage}`.replace("{widgets}", widgets).replace("{widgetPrefix}", prefix), {code:"asciidoc"});
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["h", "halp"],
	permLevel: 0
};

exports.help = {
	name: "help",
	description: "Displays all the available commands for your permission level.",
	usage: "help <command>"
};