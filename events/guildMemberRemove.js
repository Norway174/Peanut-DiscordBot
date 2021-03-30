const Discord = require("discord.js");

module.exports = async(member) => {
	/*

	STEP 1: Initiate variables.

	*/
	let guild = member.guild;
	let client = member.client;
	let settings = client.getSettings(guild.id);
	//guild.defaultChannel.send(`Please welcome ${member.user.username} to the server!`);


	/*

	STEP 2: Get the settings. And decides wether or not to post any message at all.

	*/
	if(settings.leave == "false") return;

	var channel = client.defaultChannel(guild);
	
	if(settings.channel != "default"){
		if(guild.channels.has(settings.channel)){
			channel = guild.channels.cache.get(settings.channel);
		} else
		if (guild.channels.cache.find(chan => chan.name === settings.channel)){
			channel = guild.channels.cache.find(chan => chan.name === settings.channel);
		}
	}

	/*

	STEP 3: Check if the user left on their own, got kicked, or got banned.

	*/

	var kicked = false;
	var banned = false;
	var leaveMsg = `<@${member.user.id}> (${member.user.tag}) has left ${guild.name}.`;

	//Check if user is kicked.
	const kick = await guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
	if (kick != null && kick.target.id === member.user.id && kick.createdTimestamp > (Date.now() - 5000)) {
		// If user is kicked.
		kicked = true;
		if (kick.reason === null) kick.reason = "No reason given.";
		leaveMsg = `<@${member.user.id}> (${member.user.tag}) has been kicked from ${guild.name} by ${kick.executor}, with the following reason: \`\`\`${kick.reason}\`\`\``;
	}
	else {
		// Check if user is banned. If he wasn't kicked.
		const ban = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
		if (ban != null && ban.target.id === member.user.id && ban.createdTimestamp > (Date.now() - 5000)) {
			banned = true;
			if (ban.reason === null) ban.reason = "No reason given.";
			leaveMsg = `<@${member.user.id}> (${member.user.tag}) has been banned from ${guild.name} by ${ban.executor}, with the following reason: \`\`\`${ban.reason}\`\`\``;
		}
	}

	/*

	STEP 4: Figure out if the server has an active whitelist widget, and then remove the user from the whitelist.

	*/
	var send = true;
	let widgets = client.widgets;
	widgets.forEach(widget => {
		//client.logger.log(`Processing ${require("util").inspect(widget)}`);
		/*
		widget = {
			serverID: widget.serverID,
			channelID: widget.channelID,
			messageID: widget.messageID,
			name: widget.name,
			type: widget.type,
			interval: widget.interval,
			intervalCount: 0,
			data: widget.data
		}
		*/

		if(widget.type == "whitelist" && widget.serverID == guild.id){
			console.log("Has widget!");

			var role = guild.roles.find(r => r.name == "Server Whitelisted");
			
			if(role != null && member.roles.has(role.id)){
				console.log("^ And user is whitelisted!");

				send = false

				var cmdName = "whitelist"
				client.reload(cmdName)
					.then(() => {
						cmd = client.commands.get(cmdName);
						params = [member.displayName, "-remove"];

						

						cmd.run(client, member, params, null, byCommand = false, leaveMsg, channel);

					});

			} else {
				console.log("^ And user is NOT whitelisted!");
			}
		} else {
			console.log("DO NOT have the widget!");
		}

	});

	/*

		STEP 5: Post the message. (& Log it.)

	*/
	if(send){
		var embed = new Discord.MessageEmbed()
			//.setTitle("Status updated")
			.setColor(0xF13F3F)
			.setDescription(leaveMsg);
		channel.send({embed});

		client.logger.log(leaveMsg);
	}
};
