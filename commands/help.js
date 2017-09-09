const settings = require('../settings.json');
exports.run = (client, message, params) => {
	if (!params[0]) {
		const commandNames = Array.from(client.commands.keys());
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		message.channel.send( `= Command List =\n\n[Use ${settings.prefix}help <command> for details]\n\n${client.commands.map(c => `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`, {code:'asciidoc'});
	} else {
		let command = params[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);

			const commandNames = Array.from(client.widgetsType.keys());
			const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
			const widgets = client.widgetsType.map(c => `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n//DATA: ${c.help.usage}]`).join('\n');

			message.channel.send( `= ${command.help.name.toUpperCase()} = \n${command.help.description}\n${settings.prefix}${command.help.usage}`.replace("{widgets}", widgets), {code:'asciidoc'});
		}
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help <command>'
};