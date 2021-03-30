exports.run = function(client, message, args){
	
	const guild = message.guild;
	const channel = message.channel;
	let guildSettings = client.getSettings(guild.id);
	let twitch = client.twitch;

	if(!args[1]){
		channel.send("Missing or wrong arguments. Streamer was not added to the list.");
		return;
	}

	let action = args[0];
	action = action.toLowerCase();

	args.splice(0, 1);
	let streamerName = args.join(" ");

	if(!streamerName){
		channel.send("Missing or wrong Streamer name. Streamer was not added to the list.");
		return;
	}

	if(action == "add" ){

		var val = {
			"offline": true,
			"channel": channel.id,
			"streamer": streamerName,
			"message": null
		}

		client.twitch.set(channel.id + "-" + streamerName, val);
		
	} else if (action == "remove" || action == "delete" ){
		client.twitch.delete(channel.id + "-" + streamerName);
	} else {
		channel.send("Unknown action: `" + action + "`. Please use either `add` or `remove`.");
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "twitch",
	description: "Notifies channel when a Twitch stream goes live.",
	usage: "twitch <add|remove|list> <streamer name>"
};
