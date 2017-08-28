const moment = require('moment');
const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
module.exports = client => {
  log(`${client.user.tag} reconnected!`);
};
