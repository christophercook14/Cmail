var chalk = require('chalk');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/cmail', {
    logging: false,
});
console.log(chalk.yellow('Opening connection to PostgreSQL'));

var Email = db.define('email', {
	subject: {
		type: Sequelize.STRING
	},
	body: {
		type: Sequelize.TEXT
	},
	isStarred: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	deletedBySender: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		notNull: true
	},
	address: {
		type: Sequelize.STRING,
		validate: {
			isEmail: true
		}
	}
});

var EmailRecipient = db.define('email_recipient', {
	isStarred: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	isRead: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	deleted: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

var EmailCopied = db.define('email_copied', {
	isStarred: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	isRead: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	deleted: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

Email.belongsTo(User, {as: 'Sender'});
Email.belongsToMany(User, {as: 'Recipient', through: EmailRecipient});
Email.belongsToMany(User, {as: 'Copied', through: EmailCopied});
User.belongsToMany(Email, {as: 'Recipient', through: EmailRecipient});
User.belongsToMany(Email, {as: 'Copied', through: EmailCopied});



module.exports = {db, Email, User, EmailRecipient, EmailCopied};
