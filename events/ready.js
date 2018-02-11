const moment = require("moment");

module.exports = client => {
	client.log(`${client.user.tag} ready!`);

	client.guilds.forEach(function(guild){
		//client.log(`${guild.name} checked!`);
		if(client.settings.get(guild.id) == null) {
			//ADD SETTINGS HERE IF NONE IS FOUND!
			//client.log("^ No settings!");

			client.settings.set(guild.id, client.defaultSettings);
		} else {
			//client.log("^ Have settings!");
		}
	});
};