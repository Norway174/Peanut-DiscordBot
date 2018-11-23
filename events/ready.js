const moment = require("moment");

module.exports = client => {
	client.logger.log(`${client.user.tag} ready!`, "ready");

	/*
	!!! DEPRICATED !!!

	CHECK GUILD SETTINGS
	Make sure there is guild settings for every guild the bot is a part of.

	This is being depricated because it's much more difficult to compare settings if I update guild settings later.
	And it's much easier to only save the unique settings, and use the default settings for the rest.

	/*

	/*client.guilds.forEach(function(guild){
		//client.logger.log(`${guild.name} checked!`);
		if(client.settings.get(guild.id) == null) {
			//ADD SETTINGS HERE IF NONE IS FOUND!
			//client.logger.log("^ No settings!");

			client.settings.set(guild.id, client.defaultSettings);
		} else {
			//client.logger.log("^ Have settings!");
		}
	});*/
};