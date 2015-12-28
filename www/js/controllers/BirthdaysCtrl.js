angular.module('isgh.BirthdaysCtrl', ['ngSanitize'])

	.controller('BirthdaysCtrl', function ($scope, $filter, $rootScope, $timeout, $ionicFilterBar, $ionicLoading, ResolveBirthDays, FactoryBirthdays, Constant) {

		$scope.birthdays = ResolveBirthDays;
		var filterBarInstance ;
		
		$scope.showFilterBar = function () {
			filterBarInstance = $ionicFilterBar.show({
				cancelText: 'Cancelar',
				items: $scope.birthdays,
				filterProperties: 'dsc_nome',
				expression: function (filterText, value, index, array) {
					if (filterText.length >= 3) {

                        FactoryBirthdays.birthdaysWSgetByLike(filterText).then(function (response) {
                            $scope.birthdays = response.data;
                        }, function (erro) {
                            $rootScope.alert = { type: "", message: erro };
                        });

					}
				}
			});
		};
	
		// REFRESH NOTICIAS
		$scope.doRefresh = function () {
			$rootScope.alert = null;
			FactoryBirthdays.refresh().then(function (response) {
				$scope.birthdays = response.data;
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
			$scope.data = { "day": date.getDate(), "month": date.getMonth() + 1 };
			if (filterBarInstance) {
				filterBarInstance();
				filterBarInstance = null;
			}

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
				$ionicLoading.show();
				$rootScope.alert = null;
				if (filterBarInstance) {
					filterBarInstance();
					filterBarInstance = null;
				}
				//data.day = (data.day < 10) ? ('0' + data.day) : data.day;
				//data.month = (data.month < 10) ? ('0' + data.month) : data.month;
				FactoryBirthdays.birthdaysWSgetByDate(data).then(function (response) {
					$ionicLoading.hide();
					$scope.birthdays = response.data;
				}, function (erro) {
					$ionicLoading.hide();
					$rootScope.alert = { type: "", message: erro };
				});

			}
			
		}


	})