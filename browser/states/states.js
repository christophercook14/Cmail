app.config(function($stateProvider, $locationProvider){
	$locationProvider.html5Mode(true);

	$stateProvider
	.state('inbox', {
		url: '/inbox',
		templateUrl: '/templates/inbox.html',
		controller: 'InboxCtrl',
		resolve: {
			inboxEmails: function(EmailFactory) {
				return EmailFactory.getInbox();
			}
		}
	})
	.state('sent', {
		url: '/sent',
		templateUrl: '/templates/sent.html',
		controller: 'SentCtrl',
		resolve: {
			sentEmails: function(EmailFactory) {
				return EmailFactory.getSentItems();
			}
		}
	})
	.state('singleEmail', {
		url: '/email/:id',
		templateUrl: '/templates/singleEmail.html',
		controller: 'SingleEmailCtrl'
	})
	.state('compose', {
		url: '/compose',
		templateUrl: '/templates/compose.html',
		controller: 'ComposeCtrl'
	})
	.state('staging', {
		url: '/staging',
		controller: function($state){
			$state.go('inbox');
		}
	});

})