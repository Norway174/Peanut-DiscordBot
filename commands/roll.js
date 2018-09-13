var Roll = require('rpg-dice-roller'),
  roll = new Roll.DiceRoller();

const util = require('util');

exports.run = function(client, message, args){

	var userInput = args.join(" ");
	var rolled = roll.roll(userInput);
	var output = rolled.output.replace(userInput + ": ", "");

	message.channel.send(`You rolled: **${rolled.total}**\n\`\`\`${output}\`\`\``);

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["dice"],
	permLevel: 0
};

exports.help = {
	name: "roll",
	description: "Roll a dice! Check out http://rpg.greenimp.co.uk/dice-roller/ for advanced features this command can do. (Uses the same base code.)",
	usage: "roll <1d20>"
};