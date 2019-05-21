const Discord = require("discord.js");

module.exports = (guild, member) => {
	//let guild = member.guild;
	let client = member.client;
	let settings = client.getSettings(guild.id);
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);

	if(settings.welcome == "false") return;

	const channel = client.defaultChannel(guild);
	
	if(settings.channel != "default"){
		if(guild.channels.has(guild.id)){
			channel = guild.channels.get(guild.id);
		} else
		if (guild.channels.find(chan => chan.name === settings.channel)){
			channel = guild.channels.find(chan => chan.name === settings.channel);
		}
	}

	const embed = new Discord.RichEmbed()
		//.setTitle("Status updated")
		.setColor(0x00FF00)
		.setDescription(`<@${member.user.id}> (${member.user.tag}) has just been un-banned from ${guild.name}.`);
	channel.send({embed});
};
