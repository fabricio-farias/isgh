angular.module('isgh.BirthdaysCtrl', ['ngSanitize'])

	.controller('BirthdaysCtrl', function ($scope, $filter, $rootScope, ResolveBirthDays, FactoryBirthdays, Constant) {

		$scope.birthdays = ResolveBirthDays;
	
		// REFRESH NOTICIAS
		$scope.doRefresh = function () {
			$rootScope.alert = null;
			ResolveBirthDays.refresh().then(function (response) {
				$scope.news = response.data;
				$scope.$broadcast('scroll.refreshComplete');
			}, function (erro) {
				$scope.$broadcast('scroll.refreshComplete');
				$rootScope.alert = { type: "", message: erro };
			});
			// $rootScope.$broadcast('scroll.refreshComplete');
		}

		


	})