app.directive('autocompleteCopied', function(){
	return {
		restrict: 'A',
		link: function(scope, elem) {
			elem.on('blur', function(){
				var address = scope.content.copied;
				if (address && (/[\w_]+\@[\w_]+\.[\w]+/).test(address)) {
					scope.completedCopied.push(address);
					scope.$digest();
					scope.content.copied = '';
					elem[0].value = '';
				}
			})
			elem.on('keyup', function(e){
				if (e.which === 9 || e.which === 32 || e.which === 186 || e.which === 188) {
					var address
					if (e.which===32 || e.which===9) {
						address = scope.content.copied;	
					} else {
						address = scope.content.copied.slice(0,-1);
					}
					if (address.length && (/[\w_]+\@[\w_]+\.[\w]+/).test(address)) {
						scope.completedCopied.push(address);
						scope.$digest();
					}
					scope.content.copied = '';
					elem[0].value = '';
				} else if (e.which === 8 && elem[0].value === '') {
					scope.completedCopied.pop();
					scope.$digest();
				}
			});
		}
	};
});