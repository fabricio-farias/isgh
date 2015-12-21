angular.module("uiAlertBar", []);
angular.module("uiAlertBar").run(function ($templateCache) {
	var html = '<div id="alert-bar" class="alert-bar" ng-class="[getColor(alert.type), isActive(alert)]"><div>{{alert.message}}</div><i class="ion-android-close" ng-click="hideBar()"></i></div>';
	$templateCache.put("templates/directives/alert-bar.html", html);
});

angular.module("uiAlertBar").directive("uiAlertBar", function($timeout, $sce){
	return {
		templateUrl: $sce.trustAsResourceUrl("templates/directives/alert-bar.html"),
		restrict: "AE",
		replace: true,
		scope:{
			type: "@",
			alert: "="
		},
		transclude: true,
		link: function(scope, element, attrs){

			scope.getColor = function(color){
				return color;
			}
			scope.isActive = function (alert) {
				if (alert) return "bar-active";
			}
			scope.hideBar = function () {
				angular.element(document.querySelector('#alert-bar')).removeClass("bar-active");
			}
			$timeout(function() {
				return angular.element(document.querySelector('#alert-bar')).removeClass("bar-active");
			}, 15000);
			
		}
	}
})