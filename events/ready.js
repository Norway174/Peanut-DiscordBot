const moment = require("moment");

module.exports = client => {
	client.logger.log(`${client.user.tag} ready!`, "ready");

	client.guilds.forEach(function(guild){
		//client.logger.log(`${guild.name} checked!`);
		if(client.settings.get(guild.id) == null) {
			//ADD SETTINGS HERE IF NONE IS FOUND!
			//client.logger.log("^ No settings!");

			client.settings.set(guild.id, client.defaultSettings);
		} else {
			//client.logger.log("^ Have settings!");
		}
	});
};