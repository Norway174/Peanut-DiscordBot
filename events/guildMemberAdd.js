const Discord = require("discord.js");
const settings = require('../settings.json');

module.exports = member => {
	let guild = member.guild;
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);

	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0x90FF00)
		.setDescription(`**Hi there, ${member.user.tag}!**\nWelcome to ${guild.name}! Feel free to introduce yourself; don't be afraid to ask any questions!\nYou may also use ` + "`" + `${settings.prefix}help` + "`" + ` to see what I can do for you.\n\nEnjoy your stay!`)
	guild.defaultChannel.send({embed});
};
