
    // var HeaderContainer = angular.module('headerContainerApp', []);
	layout.directive("headerContainer",['$http',function($http){
		return {
			directive:'E',
			templateUrl:'/partials/directiveHTML/headerContainer.html',
			controller:function(){
				var kitchen = this;
				this.nbRecettes = 0;
		
				$http.get('/json/recettes.json').success(function(data){
					kitchen.nbRecettes = data.length;
				});
			},
			controllerAs:'HeaderCtrl'
		}
	}]);



	// var HeaderContainer = angular.module('headerContainerApp', []);
	layout.directive("recipeThumbNail",function(){
		return {
			directive:'E',
			templateUrl:'/partials/directiveHTML/recipeThumbNail.html'
		}
	});

	/*// var HeaderContainer = angular.module('headerContainerApp', []);
	layout.directive("recipeContainer",function(){
		return {
			directive:'E',
			templateUrl:'/partials/directiveHTML/recipeContainer.html',
			controller:,
			controllerAs:'HeaderCtrl'
		}
	});*/


