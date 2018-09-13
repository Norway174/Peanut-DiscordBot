var fetch = require("node-fetch");

exports.run = function(client, message){

	fetch("https://icanhazdadjoke.com/", { headers: {"Accept":"text/plain", "User-Agent":"Peanut (https://github.com/Norway174/Peanut-DiscordBot)"}})
		.then(res => {
			return res.text();
		}).then(function(body) {
			client.logger.log("JOKE: " + body);
			message.channel.send(body);
		});


	
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "joke",
	description: "The best dad jokes! Courtesy of https://icanhazdadjoke.com/",
	usage: "joke"
};