var app = angular.module('Cmail', ['ui.router', 'ui.bootstrap']);

app.controller('MainCtrl', function($scope, $state, $rootScope, UserFactory){
	
	UserFactory.getAllUsers()
	.then(function(users) {
		$scope.users = users;
		$scope.selectedUser = users[0];
		$scope.changeUser();
	});

	$scope.changeUser = function(){
		$rootScope.currentUser = $scope.selectedUser;
		$rootScope.$broadcast('changeUser')
		$state.go('staging');
	};

	$scope.$state = $state;

	
});
