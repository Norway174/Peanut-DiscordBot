var steam = require('steam-provider')
var provider = new steam.SteamProvider();

exports.run = function(client, message, args){
	var search = args.join(" ");

	//console.log("Search: " + search)
	provider.search(search, 1, "en", "us").then(result => {
		//console.log(result)

		if(result.length >= 1){
			//console.log("Found One!");
			message.channel.send(result[0]["url"]);
		} else {
			//console.log("No results!");
			message.channel.send(`Sorry! **${search}** did not yield any results.`);
		}
	})

	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "steam",
	description: "Search the Steam store.",
	usage: "steam <game name>"
};