const moment = require("moment");

module.exports = client => {
	client.logger.log(`${client.user.tag} reconnected!`);
};
