app.directive('composeBox', function(){
	return {
		restrict: 'E',
		templateUrl: '/templates/compose.html',
		controller: 'ComposeCtrl',
		scope: { 
			show: '=',
			content: '=',
			contacts: '='
		}
	};
}) 