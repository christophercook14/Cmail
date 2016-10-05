var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var models = require('../models');
var _ = require('lodash');
var Email = models.Email;
var EmailRecipient = models.EmailRecipient;
var EmailCopied = models.EmailCopied;
var User = models.User;
module.exports = router;

router.get('/users', function(req, res, next) {
	User.findAll()
	.then(function(users) {
		res.json(users);
	})
});

router.get('/user/:userId/sent', function(req, res, next) {
	Email.findAll({
		where: {deletedBySender: false},
		include: [{
	    	model: User,
	    	as: "Recipient",
  		}, {
  			model: User,
	    	as: "Sender", 
	    	where: {id: req.params.userId}
  		}, {
	    	model: User,
	    	as: "Copied",
  		}]
  	})
  	.then(function(email){
  		res.json(email);
  	});
});

router.get('/user/:userId/inbox', function(req, res, next) {
	Email.findAll({
		include: [{
	    	model: User,
	    	as: "Recipient",
	    	where: {id: req.params.userId}
  		}, {
  			model: User,
	    	as: "Sender", 
	   }, {
	    	model: User,
	    	as: "Copied",

  		}]
  	})
  	.then(function(emailReceived){
  		emailReceived = emailReceived.filter(function(email){
  			return !email.Recipient[0].email_recipient.deleted;
		});
  		Email.findAll({
			include: [{
		    	model: User,
		    	as: "Recipient",
	  		}, {
	  			model: User,
		    	as: "Sender", 
		   }, {
		    	model: User,
		    	as: "Copied",
		    	where: {id: req.params.userId}
	  		}]
	  	})
	  	.then(function(emailCopied) {
	  		var allEmails = emailReceived;
	  		emailCopied = emailCopied.filter(function(email){
	  			return !email.Copied[0].email_copied.deleted;
			});
	  		emailCopied.forEach(function(email){
	  			if (email.id === 588) {
	  				console.log(email.Copied)
	  			}

	  			var match = allEmails.filter(function(allEmail){
	  				if (allEmail.id === email.id) {
	  					return true;
	  				}
	  			});
	  			if (!match.length) {
	  				allEmails.push(email);
	  			}
	  		})
	  		res.json(allEmails);
	  	})
  	});

});

router.delete('/user/:userId/email/:emailId', function(req, res, next){
	var emailId = +req.params.emailId;
	var userId = +req.params.userId;

	var promise1 = EmailCopied.findOne({where: {emailId: emailId, userId: userId}})
	.then(function(record1) {
		if (record1) {
			record1.deleted = true;
			record1.save();
		}
	});
	var promise2 = EmailRecipient.findOne({where: {emailId: emailId, userId: userId}})
	.then(function(record2) {
		if (record2) {
			record2.deleted = true;
			record2.save();
		}
	});
	var promise3 = Email.findOne({where: {id: emailId, SenderId: userId}})
	.then(function(record3) {
		if (record3) {
			record3.deletedBySender = true;
			record3.save();
		}
	});

	Promise.all([promise1, promise2, promise3])
	.then(function() {
		res.end();
	});
});

router.get('/email/:emailId', function(req, res, next) {
	Email.findOne({
		where: {id: req.params.emailId},
		include: [{
	    	model: User,
	    	as: "Recipient",
  		}, {
  			model: User,
	    	as: "Sender", 
 		}, {
	    	model: User,
	    	as: "Copied",
  		}]
  	})
  	.then(function(email){
  		res.json(email);
  	});
});

router.post('/email/send', function(req, res, next) {
	var sender = req.body.sender;
	var recipients = req.body.recipients;
	var copies = req.body.copied;
	var email = req.body.email;

	Email.create(email)
	.then(function(email){
		return User.findOne({where: {address: sender}})
		.then(function(_sender) {
			email.setSender(_sender);
			recipientPromises = recipients.map(function(recipient) {
				return User.findOne({where: {address: recipient}})
				.then(function(_recipient) {
					email.addRecipient(_recipient);
				})
			});
			copiedPromises = copies.map(function(copy) {
				return User.findOne({where: {address: copy}})
				.then(function(_copy) {
					email.addCopied(_copy);
				})
			});
			return Promise.all([...recipientPromises, ...copiedPromises])
		})
	})
	.then(function(){
		res.send();
	})
});

router.put('/email/star', function(req, res, next) {
	var email = req.body.email;
	var currentUser = req.body.currentUser;
	var promise1 = EmailCopied.findOne({where: {emailId: email.id, userId: currentUser.id}})
	.then(function(record1) {
		if (record1) {
			record1.isStarred = !record1.isStarred;
			record1.save();
		}
	});
	var promise2 = EmailRecipient.findOne({where: {emailId: email.id, userId: currentUser.id}})
	.then(function(record2) {
		if (record2) {
			record2.isStarred = !record2.isStarred;
			record2.save();
		}
	});

	Promise.all([promise1, promise2])
	.then(function() {
		res.end();
	});
});

router.put('/email/read', function(req, res, next) {
	var email = req.body.email;
	var currentUser = req.body.currentUser;
	var promise1 = EmailCopied.findOne({where: {emailId: email.id, userId: currentUser.id}})
	.then(function(record1) {
		if (record1) {
			record1.isRead = !record1.isRead;
			record1.save();
		}
	});
	var promise2 = EmailRecipient.findOne({where: {emailId: email.id, userId: currentUser.id}})
	.then(function(record2) {
		if (record2) {
			record2.isRead = !record2.isRead;
			record2.save();
		}
	});

	Promise.all([promise1, promise2])
	.then(function() {
		res.end();
	});
});





