const Discord = require("discord.js");

module.exports = member => {
	let guild = member.guild;
	let client = member.client;
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);

	const channel = client.defaultChannel(guild);
	
	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0xF13F3F)
		.setDescription(`${member.user.tag} has left ${guild.name}.`)
		channel.send({embed});

	client.log(`${member.user.tag} has left ${guild.name}.`);
};
