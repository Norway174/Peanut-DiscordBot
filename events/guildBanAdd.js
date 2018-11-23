module.exports = (guild, member) => {
	//let guild = member.guild;
	let client = member.client;
	let settings = client.getSettings(guild.id);;
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);
	
	if(settings.welcomeMessageEnabled == false) return;

	const channel = client.defaultChannel(guild);
	
	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0xFF0000)
		.setDescription(`<@${member.user.id}> (${member.user.tag}) has just been banned from ${guild.name}.`);
	channel.send({embed});
};
