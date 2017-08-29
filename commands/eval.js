const settings = require("../settings.json");

exports.run = function(client, message, args){
	//MAKE SURE ONLY THE HOST OF THIS BOT CAN RUN THIS COMMAND!
	//VERY DANGEROUS COMMAND TO GIVE ACCESS TOO!

	//Run Javascript, and output the result to chat.
	
	
	try {
		let code = args.join(" ");
		if(code.startsWith("```js")) code = code.replace("```js", "");
		if(code.endsWith("```")) code = code.replace("```", "");
		
		let evaled = eval(code);

		if (typeof evaled !== "string")
		evaled = require("util").inspect(evaled);

		message.channel.send(evalClean(evaled), {code:"xl"});
		
	} catch (err) {
	message.channel.send(`\`ERROR\` \`\`\`xl\n${evalClean(err)}\n\`\`\``);
	}
	
	function evalClean(text) {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["e"],
  permLevel: 4
};

exports.help = {
  name: 'eval',
  description: 'Run Javascript on the server, and output the result to the chat.',
  usage: 'eval <javascript>'
};
