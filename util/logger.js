
// Borrowed from https://github.com/AnIdiotsGuide/guidebot/blob/master/modules/Logger.js

// **Modified by Norway174**

/*
Logger class for easy and aesthetically pleasing console logging 
*/

const path = require('path');
const appRoot = path.resolve(__dirname);
config = require( appRoot + "/.././config.js");

const chalk = require("chalk");
const moment = require("moment");

const webhook = require("webhook-discord");
const Hook = new webhook.Webhook(config.webhook);

exports.log = (content, type = "log") => {
	const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;

	const msg = new webhook.MessageBuilder()
		.setName("Peanut Console")
		.addField("", content)
	//Hook.send(msg);

	switch (type) {
    case "log": {
		msg.setColor("#0084FF")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
    }
    case "warn": {
		msg.setColor("#FFE400")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
    }
    case "error": {
		msg.setColor("#FF0000")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case "debug": {
		msg.setColor("#00FFDE")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case "cmd": {
		msg.setColor("#C000FF")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case "ready": {
		msg.setColor("#06FF00")
		Hook.send(msg);
		return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");