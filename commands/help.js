//const settings = require("../config.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {

	let settings = client.getSettings(message.guild.id);
	let prefix = settings.prefix;

	var cmd = args[0]

	var single = false
	
	var full = false;
	if(message.content.toLowerCase().includes("all")){
		full = true;
	}

	const embed = new Discord.RichEmbed()
	.setTitle(`Peanut Commands`) // ${Math.round(toAmount * 100) / 100}
	.setColor(0x78FF00)
	
	.setDescription(`Use \`${prefix}help <command name/'all'>\` for more information.\nNote: Use of the \`all\` keyword will PM you a big list.`)
	.setTimestamp();

	var myCommands = client.commands.filter(cmd => client.elevation(message) >= cmd.conf.permLevel /*&& cmd.conf.guildOnly == false*/ )

	if (cmd && client.commands.has(cmd)) {
		myCommands = myCommands.filter(com => com.help.name == cmd);
		single = true;
	}

	const commandNames = Array.from(client.widgetsType.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
	const widgets = client.widgetsType.map(c => `${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n//DATA: ${c.help.usage}`).join("\n");

	var countCmds = 0;
	myCommands.forEach(command => {
		countCmds += 1;
		
		if(full || single) {
			embed.addField(`${prefix}${command.help.name}`, `${command.help.description} \`[Usability: ${PermName(command.conf.permLevel)}]\`\n\`\`\`asciidoc\n${prefix}${command.help.usage}\`\`\``.replace(/{prefix}/mg, prefix).replace("{widgets}", widgets), true)
		} else {
			embed.addField(`\u200b`, `\`\`\`${prefix}${command.help.name}\`\`\``, true)
		}
		
	});
	embed.setFooter(`Your permission level: ${PermName(client.elevation(message))} | Showing ${countCmds} out of ${client.commands.size} total commands`)

	if(full){
		message.author.send(embed);
		const embed2 = new Discord.RichEmbed()
			.setTitle(`Peanut Commands`) // ${Math.round(toAmount * 100) / 100}
			.setColor(0x78FF00)
			.setFooter("Your permission level: " + PermName(client.elevation(message)))
			.setDescription(`A list of all the commands has been compiled, and PMed to: <@${message.author.id}>. (${message.author.tag})`)
			.setTimestamp();
		message.channel.send(embed2);
	} else {
		message.channel.send(embed);
	}
	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "help",
	description: "Displays all the available commands for your permission level.",
	usage: "help [<command>]"
};

function PermName(permLevel) {
	var perms = {
		'0': 'Everyone',
		'2': 'Moderators',
		'3': 'Administrators',
		'4': 'Owner'
	};
	return (perms[permLevel] || permLevel);
};