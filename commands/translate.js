const Discord = require("discord.js");
const translate = require("@vitalets/google-translate-api");

exports.run = (client, message, args) => {
	
	let language = "en";
	let detection = "Detected: ";
	
	if (args[0].startsWith("-")){
		language = args.shift().replace("-", "");
		//detection = "Selected: ";
	}
	
	const embed = new Discord.RichEmbed()
			.setColor(0xFEF44D)
			.setFooter( "Translating for " + message.author.username + "." )
			.addField("From: ", args.join(" "), true)
			.addBlankField(true)
			.addField("To: " + langs[language], "Please wait...", true);

	message.channel.send({embed})
	.then(msg => {
		translate(args.join(" "), {to: language}).then(res => {
		
			let lang = res.from.language.iso;
			
			const embed = new Discord.RichEmbed()
				.setColor(0x4D90FE)
				.setFooter( "Translated for " + message.author.username + "." )
				.addField("To: " + langs[language], res.text, true)
				.addBlankField(true)
				.addField("From: " + detection + langs[lang], args.join(" "), true);

			msg.edit({embed});

			client.logger.debug("Translated to: " + res.text);
			
		}).catch(err => {
			client.logger.error(err);

			const embed = new Discord.RichEmbed()
			.setColor(0xFE4D4D)
			.setFooter( "Translated for " + message.author.username + "." )
			.addField("From: ", args.join(" "), true)
			.addBlankField(true)
			.addField("Error translating to:", err, true);

			msg.edit({embed});
		});
	})
	
	
	//message.delete(5);

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["t"],
	permLevel: 0
};

exports.help = {
	name: "translate",
	description: "Translates the given text to English by default or spesificed language.",
	usage: "translate -[language code] <any text>"
};


const langs = {
	"auto": "Automatic",
	"af": "Afrikaans",
	"sq": "Albanian",
	"am": "Amharic",
	"ar": "Arabic",
	"hy": "Armenian",
	"az": "Azerbaijani",
	"eu": "Basque",
	"be": "Belarusian",
	"bn": "Bengali",
	"bs": "Bosnian",
	"bg": "Bulgarian",
	"ca": "Catalan",
	"ceb": "Cebuano",
	"ny": "Chichewa",
	"zh-cn": "Chinese Simplified",
	"zh-tw": "Chinese Traditional",
	"co": "Corsican",
	"hr": "Croatian",
	"cs": "Czech",
	"da": "Danish",
	"nl": "Dutch",
	"en": "English",
	"eo": "Esperanto",
	"et": "Estonian",
	"tl": "Filipino",
	"fi": "Finnish",
	"fr": "French",
	"fy": "Frisian",
	"gl": "Galician",
	"ka": "Georgian",
	"de": "German",
	"el": "Greek",
	"gu": "Gujarati",
	"ht": "Haitian Creole",
	"ha": "Hausa",
	"haw": "Hawaiian",
	"iw": "Hebrew",
	"hi": "Hindi",
	"hmn": "Hmong",
	"hu": "Hungarian",
	"is": "Icelandic",
	"ig": "Igbo",
	"id": "Indonesian",
	"ga": "Irish",
	"it": "Italian",
	"ja": "Japanese",
	"jw": "Javanese",
	"kn": "Kannada",
	"kk": "Kazakh",
	"km": "Khmer",
	"ko": "Korean",
	"ku": "Kurdish (Kurmanji)",
	"ky": "Kyrgyz",
	"lo": "Lao",
	"la": "Latin",
	"lv": "Latvian",
	"lt": "Lithuanian",
	"lb": "Luxembourgish",
	"mk": "Macedonian",
	"mg": "Malagasy",
	"ms": "Malay",
	"ml": "Malayalam",
	"mt": "Maltese",
	"mi": "Maori",
	"mr": "Marathi",
	"mn": "Mongolian",
	"my": "Myanmar (Burmese)",
	"ne": "Nepali",
	"no": "Norwegian",
	"ps": "Pashto",
	"fa": "Persian",
	"pl": "Polish",
	"pt": "Portuguese",
	"ma": "Punjabi",
	"ro": "Romanian",
	"ru": "Russian",
	"sm": "Samoan",
	"gd": "Scots Gaelic",
	"sr": "Serbian",
	"st": "Sesotho",
	"sn": "Shona",
	"sd": "Sindhi",
	"si": "Sinhala",
	"sk": "Slovak",
	"sl": "Slovenian",
	"so": "Somali",
	"es": "Spanish",
	"su": "Sundanese",
	"sw": "Swahili",
	"sv": "Swedish",
	"tg": "Tajik",
	"ta": "Tamil",
	"te": "Telugu",
	"th": "Thai",
	"tr": "Turkish",
	"uk": "Ukrainian",
	"ur": "Urdu",
	"uz": "Uzbek",
	"vi": "Vietnamese",
	"cy": "Welsh",
	"xh": "Xhosa",
	"yi": "Yiddish",
	"yo": "Yoruba",
	"zu": "Zulu"
};