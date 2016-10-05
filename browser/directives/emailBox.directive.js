app.directive('emailBox', function(){
	return {
		restrict: 'E',
		templateUrl: '/templates/emailBox.html',
		controller: 'EmailBoxCtrl',
		scope: {
			emails: '='
		}

	};
});