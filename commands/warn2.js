
exports.run = function(client, message, args){

	let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if (!dUser) return message.channel.send("Can't find user!")

	const settings = client.getSettings(message.guild.id);
	let vilations = message.content.replace(settings.prefix + "warn2 " + args[0] + " ", "");

	let msg = `Dear ` + dUser.displayName + `,

This an official notice from the staff at Peanut Craft, to let you know you have
received 2 (two) strike on the official server, due to the severity of your offense.


You've been found guilty of the following rule violations:

` + vilations + `


Why have we decide to give you this strike?

We strive to be an open and friendly community for everyone. And that means we have to try and keep this server civilized in a friendly manner.
And we're very happy to have you keep playing with us. But we would like to remind you, that this is not Singleplayer. And you have to be considerate of others while in the multiplayer environment.


What does that one strike actually mean, and does it ever go away?

We here at Peanut Craft operates on a three strike basis:
- 1st Strike: Written warning. (It would have had been this message. If it weren't for the severity of your offense.)
- 2nd Strike: Temporarily Ban. (This could vary from a few hours, to days.)
- 3rd Strike: Permanent ban. (There's no appeal process. You're out, you're out.)

It is possible to receive any number of strikes for any violation. Which are left up to the Staff's discretion.
Once you've received a strike, there is no expiratory date. As long as we remember it. It's valid.

You will be removed from Peanut Craft after you removed this message. You're welcome to try and rejoin in a couple of days.

Please get in touch with staff if you have any questions.`;

	dUser.send(msg, {code : true});

	message.channel.send("This is a COPY of the warning that was sent to " + dUser + " (" + dUser.user.tag + ")\n```" + msg + "```");
	
	dUser.kick(violations)
		.then(usr => message.channel.send(usr + " (" + usr.user.tag + ") was kicked succesfully."))
		.catch(err => message.channel.send("Failed to kick " + dUser + " with the following reason:\n```" + err + "```"));

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "warn2",
	description: "Send a warning to someone! Gives 2 strikes.",
	usage: "warn <name> <message>"
};