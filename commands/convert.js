const FixerIO = require('fixer-io-utility');
const Discord = require("discord.js");
const moment = require("moment");

exports.run = async function(client, message, args){
	
	var getRatesReturn = await getRates(client, message);
	var rates = getRatesReturn[0];
	var msg = getRatesReturn[1];
	var keys = Object.keys(rates);

	function checkInput(input, words) {
		return words.some(word => input.toLowerCase().includes(word.toLowerCase()));
	}
	if(checkInput(message.content, ["codes", "code"])){
		const embedInvalid = new Discord.MessageEmbed()
			.setDescription(`All avalible currency codes:\n\`\`\`${keys.map(key => `${key}	`).join("")}\`\`\``)
			.setColor(0x78FF00)
			.setFooter("Codes supplied by Fixer.io")
			.setTimestamp();

		if(msg){
			msg.edit(embedInvalid);
		} else {
			message.channel.send(embedInvalid);
		}
		return;
	} else
	if(checkInput(message.content, ["rates", "rate"])){
		ShowRates(client, message, msg, keys, rates);
		return;
	}

	var amount = args[0];
	var from = args[1];
	var to = args[2];


	function getSymbol(symbol) {
		var symbols = {
		  '$': 'USD',
		  '€': 'EUR',
		  '£': 'GBP',
		  '¥': 'JPY',
		  '฿': 'THB'
		};
		return (symbols[symbol] || symbol);
	};

	from = getSymbol(from);
	to = getSymbol(to);
	
	var isValid = true;
	var reason = [];
	// Check if the first arg is a number.
	if(isNaN(amount)){
		isValid = false;
		reason.push(amount? `\`${amount}\` is not a valid number.` : `Missing \`<amount>\` to convert.`);
	}
	// Check if the first rate exists.
	if(!from || !keys.includes(from.toUpperCase())){
		isValid = false;
		reason.push(from? `\`${from}\` is not a valid currency code.` : `Missing \`<from>\` currency code.`);
	}
	// Check if the second rate exists.
	if(!to || !keys.includes(to.toUpperCase())){
		isValid = false;
		reason.push(to? `\`${to}\` is not a valid currency code.` : `Missing \`<to>\` currency code.`);
	}

	if(!isValid) {
		var customKeys = ['USD', 'CAD', 'EUR', 'NOK', 'GBP', 'BTC'];
		const embedInvalid = new Discord.MessageEmbed()
			.setDescription(`${reason.join("\n")}\nPlease use: \n\`\`\`${client.getSettings(message.guild).prefix}${this.help.usage}\`\`\`\nCommon currency codes:\n\`\`\`${customKeys.map(key => `${key}	`).join("")}\`\`\``)
			.setColor(0xFA3C3C)
			.setFooter("Ooops! Something went wrong...")
			.setTimestamp();

		if(msg){
			msg.edit(embedInvalid);
		} else {
			message.channel.send(embedInvalid);
		}
		//message.channel.send(`Invalid format. Please use: \n\`\`\`${client.getSettings(message.guild).prefix}${this.help.usage}\`\`\``);
		return;
	}

	from = from.toUpperCase();
	to = to.toUpperCase();

	var fromAmount = amount / rates[from];
	var toAmount = fromAmount * rates[to];

	amount = new Intl.NumberFormat({ style: 'currency', currency: from }).format(amount);
	toAmount = new Intl.NumberFormat({ style: 'currency', currency: to }).format(Math.round(toAmount * 100) / 100);

	const embed = new Discord.MessageEmbed()
		.setTitle(`${amount} ${from} = ${toAmount} ${to}`) // ${Math.round(toAmount * 100) / 100}
		.setColor(0x78FF00)
		.setFooter("Converted using Fixer.io")
		.setTimestamp();

	if(msg){
		msg.edit(embed);
	} else {
		message.channel.send(embed);
	}
	

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["exchange", "conv", "currency"],
	permLevel: 0
};

exports.help = {
	name: "convert",
	description: "Convert from one currency to another.",
	usage: "convert <amount> <from> <to>\n{prefix}convert codes OR rates"
};

async function getRates(client, message){
	
	const fixerUtility = new FixerIO(client.config.fixer);

	exchangeRates = client.exchangeRates.get("");

	var fetch = false;
	if(!exchangeRates){

		fetch = true;

	} else {

		var now = moment();
		var timestamp = moment(exchangeRates.timestamp).add(1, 'h'); // Cached for 1 hour.

		if(timestamp.isSameOrBefore(now)){
			
			fetch = true;
		}

	}

	client.logger.log("Updating Rates: " + fetch + " | Timestamp: " + moment(timestamp).format("HH:mm:ss") + " | Now: " + moment(now).format("HH:mm:ss"));

	var msg = false;
	if(fetch){
		console.time("getRates");

		const embed = new Discord.MessageEmbed()
			.setTitle("Fetching rates from the API... Please wait...")
			.setColor(0xFFF000)
			.setFooter("Converting using Fixer.io")
			.setTimestamp();

		 await message.channel.send(embed)
		.then( async (mesg) => {
			msg = mesg
		})
		.catch(err => {
			client.logger.error(err);
		});

		exchangeRates = await fixerUtility.request('latest')
		.then((response) => {
			//console.log(response);
			return response;
		})
		.catch(err => {
			client.logger.error(err);
		});

		console.timeEnd("getRates");

		exchangeRates.timestamp = moment();
		client.exchangeRates.set("", exchangeRates);
		
	}

	return [exchangeRates.rates, msg];

};

async function ShowRates(client, message, msg, keys, rates){

	const embedRates = new Discord.MessageEmbed()
		.setDescription(`All avalible currency rates:`)
		.setColor(0x78FF00)
		.setFooter("Rates supplied by Fixer.io")
		.setTimestamp();

	var ratesBuilder = [];
	for (let index = 0; index < 25; index++) {
			//var index = {index : []};		
			ratesBuilder.push([]);
	}

	keys.forEach(key => {
		var index = 0;
		var next = false;
		ratesBuilder.forEach(rateBuild => {
			if(next) {
				return;
			}

			var len = rateBuild.join("").length;
			if(len < 500){
				ratesBuilder[index].push(`${key}: ${rates[key]}`)
				next = true;
				return;
			} else {
				index += 1;
			}
		});
	});

	

	var page = 1;
	ratesBuilder.forEach(rateBuild => {
		if(rateBuild.length <= 0) return;
		var everyOther = false;
		const longest = rateBuild.reduce((long, str) => Math.max(long, str.length), 0);
		
		embedRates.addField(`Page number: ${page}`, `\`\`\`${rateBuild.map(key => {everyOther = !everyOther; return `${key}${everyOther ? " ".repeat(longest - key.length + 2) : "\n"}`;}).join("")}\`\`\``);

		page += 1;
	});

	message.author.send(embedRates)
	.then(msg => {
		const embed2 = new Discord.MessageEmbed()
			.setColor(0x78FF00)
			.setDescription(`A list of all the rates has been compiled, and PMed to: <@${message.author.id}>. (${message.author.tag})`)
			.setFooter("Rates supplied by Fixer.io")
			.setTimestamp();
	
		if(msg){
			msg.edit(embed2);
		} else {
			message.channel.send(embed2);
		}
	})
	.catch(err => {
		const embed2 = new Discord.MessageEmbed()
			.setColor(0xFA3C3C)
			.setDescription(`Unable to PM: <@${message.author.id}>. (${message.author.tag})`)
			.setFooter("Uh oh...")
			.setTimestamp()
			.addField("Error: ", `\`\`\`${err}\`\`\``);
	
		if(msg){
			msg.edit(embed2);
		} else {
			message.channel.send(embed2);
		}
	});

	

}