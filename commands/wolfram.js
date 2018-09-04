const Discord = require("discord.js");
const botSettings = require("../settings.json");
const token = botSettings.wolframAlphaID;

const { WolframClient } = require('node-wolfram-alpha');
const wolfram = new WolframClient(token);


exports.run = (client, message, args) => {
	
	//console.log("non-sync");
	
	async function query() {
		//console.log("async");
		try {
			// Query wolfram for 'population of France', but only return the first pod
			const result = await wolfram.query(args.join(" "), { podindex: 2 });
			
			if(result["data"]["queryresult"]["numpods"] == 0){
				const embed = new Discord.RichEmbed()
					.setTitle("Answer:")
					.setColor(0xDD1100)
					.setDescription( "Sorry! No results." )
					.setFooter( "Wolfram Alpha queried by " + message.author.username + "." )
				//.setThumbnail("http://i.imgur.com/2JUhMfW.png")
				//.setTimestamp()

				message.channel.send({embed});
			} else {
				const embed = new Discord.RichEmbed()
					.setTitle("Answer:")
					.setColor(0xFF7C00)
					.setDescription( result["data"]["queryresult"]["pods"][0]["subpods"][0]["plaintext"] )
					.addField("URL:", "http://www.wolframalpha.com/input/?i=" + encodeURI(args.join(" ")))
					.setFooter( "Wolfram Alpha queried by " + message.author.username + "." )
				//.addField("http://www.wolframalpha.com/input/?i=" + encodeURI(args.join(" ")))
				//.setThumbnail("http://i.imgur.com/2JUhMfW.png")
				//.setTimestamp()

				message.channel.send({embed});
			}
			
		
		} catch (e) {
        console.error(e);
		}	
	}
	query();
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["wolf", "alpha"],
	permLevel: 0
};

exports.help = {
	name: "wolfram",
	description: "Answers to all your questions.",
	usage: "wolfram <any question or mathematical equation>"
};