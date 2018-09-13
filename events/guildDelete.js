const Discord = require("discord.js");

module.exports = guild => {
	guild.client.settings.delete(guild.id);
	guild.client.logger.warn("Left guild: " + guild.name);
};