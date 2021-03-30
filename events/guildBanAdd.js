module.exports = (guild, member) => {
	//let guild = member.guild;
	let client = member.client;
	let settings = client.getSettings(guild.id);;
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);
	
	if(settings.welcome == "false") return;

	const channel = client.defaultChannel(guild);
	
	if(settings.channel != "default"){
		if(guild.channels.has(guild.id)){
			channel = guild.channels.cache.get(guild.id);
		} else
		if (guild.channels.cache.find(chan => chan.name === settings.channel)){
			channel = guild.channels.cache.find(chan => chan.name === settings.channel);
		}
	}
	
	const embed = new Discord.MessageEmbed()
		//.setTitle("Status updated")
		.setColor(0xFF0000)
		.setDescription(`<@${member.user.id}> (${member.user.tag}) has just been banned from ${guild.name}.`);
	channel.send({embed});
};
