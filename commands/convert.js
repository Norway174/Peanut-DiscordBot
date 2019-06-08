const FixerIO = require('fixer-io-utility');
const Discord = require("discord.js");
const moment = require("moment");

exports.run = async function(client, message, args){
	
	var getRatesReturn = await getRates(client, message);
	var rates = getRatesReturn[0];
	var msg = getRatesReturn[1];
	var keys = Object.keys(rates)

	//console.log("Fetched Rates.");

	var amount = args[0];
	var from = args[1].toUpperCase();
	var to = args[2].toUpperCase();

	var isValid = true

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
	
	// Check if the first arg is a number.
	if(isNaN(amount)){
		isValid = false
	}
	// Check if the first rate exists.
	if(!keys.includes(from)){
		isValid = false
	}
	// Check if the second rate exists.
	if(!keys.includes(to)){
		isValid = false
	}

	if(!isValid) {
		message.channel.send(`Invalid format. Please use: \n\`\`\`${client.getSettings(message.guild).prefix}${this.help.usage}\`\`\``);
		return;
	}

	var fromAmount = amount / rates[from];
	var toAmount = fromAmount * rates[to];

	amount = new Intl.NumberFormat({ style: 'currency', currency: from }).format(amount);
	toAmount = new Intl.NumberFormat({ style: 'currency', currency: to }).format(Math.round(toAmount * 100) / 100);

	const embed = new Discord.RichEmbed()
	.setTitle(`${amount} ${from} = ${toAmount} ${to}`) // ${Math.round(toAmount * 100) / 100}
	.setColor(0x78FF00)
	.setFooter("Converted used Fixer.io")
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
	usage: "convert <amount> <from> <to>"
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

		const embed = new Discord.RichEmbed()
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