const Discord = require("discord.js");
const moment = require('moment');
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
const colors = Array(0xE7F32E, 0xABF32E, 0x37F32E, 0x2EF3DE, 0x2E8FF3, 0x662EF3, 0x62E7A1, 0x1BC10E, 0x97F207);
const color = () => {
	return colors[Math.floor(Math.random()*colors.length)];
};

exports.run = (client, message, params) => {
  if (!params[0]) {
    message.channel.send("Missing options.", {code:'asciidoc'});
  } else {
    //let command = params[0];
	
	let time = 1;
	let question = [];
	let reactions = [];
	
	let p = 0;
	
	// REGEX to find Unicode Emoji
	const regex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{2934}-\u{1f18e}]/gu;
	
	// REGEX to find Discord Custom Emoji
	const regex2 = /<.[a-zA-Z0-9]*.[0-9]*>/g;

	let i = parseInt(params[0]);
	if(i){
		time = i;
		question.splice(1, 1);
	}
	
	//console.log(params + "\n" + params.length)

	const str = params.join();
	
	let m;
	while ((m = regex.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
		regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			//console.log(`Found Unicode, group ${groupIndex}: ${match}`);
			
			reactions.push(match);
			
			let index = params.indexOf(match);
			//console.log(`Removing Index of Unicode: ${index}: ${match}`);
			if(index != -1) {
				params.splice(index, 1);
			}
		});
	}
	
	
	let m2;
	while ((m2 = regex2.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m2.index === regex2.lastIndex) {
			regex2.lastIndex++;
		}
		
		// The result can be accessed through the `m`-variable.
		//log(m2);
		
		m2.forEach((match, groupIndex) => {
		//console.log(`Found Custom, group ${groupIndex}: ${match}`);
		
		reactions.push(match.replace(/\D/g,''));
		
		let index = params.indexOf(match);
		//console.log(`Removing Index of Custom: ${index}: ${match}`);
		if(index != -1) {
			params.splice(index, 1);
		}
		});
	}

	if(reactions.length == 0){
		reactions.push("1⃣", "2⃣");
	}
	
	const embed = new Discord.RichEmbed()
			.setTitle("Poll in progress...")
			.setColor(color())
			.setDescription( `**POLL:** ${params.join(" ")}\n**TIME:** ${moment.duration(time, "minutes").humanize()}.`)
			.setFooter("Please vote by clicking one of the reactions bollow. You may add more reactions, however, they will not be counted.")
			.setTimestamp()
	
	//Send the message.
	message.channel.send({embed})
	.then(message2 => {
		//log("Poll started!")
		
		reactions.forEach(emoji => {
			message2.react(emoji);
			//log("Reactions: " + emoji);
		});
	
		// Create a reaction collector
		const collector = message2.createReactionCollector(
			(reaction, user) => (reactions.includes(reaction.emoji.name) || reactions.includes(reaction.emoji.id)) && !user.bot,
			{ time: moment.duration(time, 'minutes') }
		);
		collector.on('collect', r => {
			//console.log(`Collected ${require("util").inspect(r)}`);
		});
		collector.on('end', collected => {
			//console.log(`Collected ${require("util").inspect(collected)} items`);
			
			let resultBuilder = "";
			collected.forEach(item => {
				let voters = "";
				item.users.forEach(user => {
					if(client.user.id != user.id){
						//log("Users who voted: " + user.username);
						voters += user.username + ", ";
					}
					
				});
				
				let emoji = item.emoji.name;
				if(item.emoji.id) emoji = client.emojis.get(item.emoji.id);
				resultBuilder += `**${item.users.size - 1}** - ${emoji} Voters: ${voters}\n`;
				//log("result builder: " + item.emoji.name);
			});
			
			const embed = new Discord.RichEmbed()
				.setTitle("Poll closed!")
				.setColor(0xF32E2E)
				.setDescription( `**POLL:** ${params.join(" ")}\n**TIME:** ${moment.duration(time, "minutes").humanize()}.\n**RESULT:**\n${resultBuilder}`)
				.setFooter("Thanks for your vote.")
				.setTimestamp()
			
			//Send the message.
			message2.edit({embed})
			
		});
		
	});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['p', 'vote'],
  permLevel: 2
};

exports.help = {
  name: 'poll',
  description: 'Creates a poll where all users can vote. Default time: 1 minute.',
  usage: 'poll [Time] <Question> [Option 1] [Option 2] [Option 3] ...'
};