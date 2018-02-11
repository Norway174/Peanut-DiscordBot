const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = member => {
	let guild = member.guild;
	let client = member.client;
	let settings = client.settings.get(guild.id);
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);
	
	if(settings.welcomeMessageEnabled == false) return;

	const channel = client.defaultChannel(guild);
	
	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0x90FF00)
		.setDescription(`**Hi there, <@${member.user.id}>!** (${member.user.tag})\nWelcome to ${guild.name}! Feel free to introduce yourself; don't be afraid to ask any questions!\nYou may also use ` + "`" + `${settings.prefix}help` + "`" + " to see what I can do for you.\n\nEnjoy your stay!");
	channel.send({embed});
	
	client.log(`${member.user.tag} has joined ${guild.name}.`);
};
