const Discord = require("discord.js");

module.exports = member => {
	let guild = member.guild;
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);

	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0xF13F3F)
		.setDescription(`${member.user.username} has left ${guild.name}.`)
	guild.defaultChannel.send({embed});
};
