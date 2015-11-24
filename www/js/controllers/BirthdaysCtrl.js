angular.module('isgh.BirthdaysCtrl', ['ngSanitize'])

	.controller('BirthdaysCtrl', function ($scope, $filter, $rootScope, ResolveBirthDays, FactoryBirthdays, Constant) {

		$scope.birthdays = ResolveBirthDays;
	
		// REFRESH NOTICIAS
		$scope.doRefresh = function () {
			$rootScope.alert = null;
			FactoryBirthdays.all().then(function (response) {
				$scope.birthdays = response;
				$scope.reset();
				$scope.$broadcast('scroll.refreshComplete');
			}, function (erro) {
				$scope.$broadcast('scroll.refreshComplete');
				$rootScope.alert = { type: "", message: erro };
			});
		}
		
		$scope.checkSelectedDay = function (n) {
			var data = new Date();
			return (data.getDate() == n) ? true : false;
		}
		
		$scope.checkSelectedMonths = function (n) {
			var data = new Date();
			return (data.getMonth()+1 == n) ? true : false;
		}
		
		$scope.reset = function () {
			var date = new Date();
			$scope.data = {"day":date.getDate(), "month":date.getMonth()+1};
		};
		$scope.reset();
		
		$scope.getDays = function () {
			// return new Array(12);
			var days = [
				'01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
				'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
			]
			return days;
		}
		
		$scope.getMonths = function () {
			// return new Array(12);
			var months = [
				'01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
			]
			return months;
		}
		
		$scope.searchBirthday = function (data) {
			if (data) {

				$rootScope.alert = null;
				//data.day = (data.day < 10) ? ('0' + data.day) : data.day;
				//data.month = (data.month < 10) ? ('0' + data.month) : data.month;
				FactoryBirthdays.birthdaysWSgetByDate(data).then(function (response) {
					$scope.$broadcast('scroll.refreshComplete');
					$scope.birthdays = response.data;
				}, function (erro) {
					$scope.$broadcast('scroll.refreshComplete');
					$rootScope.alert = { type: "", message: erro };
				});

			}
			
		}


	})