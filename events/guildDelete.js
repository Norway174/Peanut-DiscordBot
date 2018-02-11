const Discord = require("discord.js");

module.exports = guild => {
	guild.client.settings.delete(guild.id);
	guild.client.log("Left guild: " + guild.name);
};