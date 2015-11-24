angular.module('isgh.ProcseletsCtrl', ['ngSanitize'])

	.controller('ProcseletsCtrl', function ($scope, $filter, $rootScope, Constant, ResolveProcselets, FactoryProcselets) {

		$scope.url_site = Constant.url_site;

		$scope.statusObj = [
			{ id: 1, name: 'Inscrições Abertas' },
			{ id: 2, name: 'Em andamento' },
			{ id: 3, name: 'Processo Finalizado' }
		];
		
		FactoryProcselets.allLocations().then(function (locations) {
			locations.map(function (l) {
				FactoryProcselets.getUnitsById(l.locid).then(function (result) {
					return l.units = result;
				});
			});

			$scope.locations = locations;
		});
		
		$scope.getTotal = function (locid, n) {
			var filtered = ResolveProcselets.filter(function (item) {
				return (locid === item.locid && n === item.status);
			});
			return (filtered[0] !== undefined) ? filtered[0].total : 0 
		}
		
		// refresh na pagina sera incluido em breve
		$scope.doRefresh = function () {
			$rootScope.alert = null;
			FactoryProcselets.refresh().then(function (response) {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.procselets = response;
			}, function (erro) {
				$scope.$broadcast('scroll.refreshComplete');
				$rootScope.alert = { type: "", message: erro };
			});

			// $scope.$broadcast('scroll.refreshComplete');
		}

	})
	
	.controller('ProcseletsCategoriesCtrl', function ($scope, Constant, ResolveProcseletsCategories) {

		$scope.categories = ResolveProcseletsCategories.data.map(function (item) {
			item.category = item.category.split("::");
			return item;
		});

		$scope.sname = ResolveProcseletsCategories.sname;
		//$ionicConfig.backButton.text(ResolveProcselet.lname);
		
	})
	
	.controller('ProcseletsFilesCtrl', function ($scope, Constant, ResolveProcseletsFiles) {

		$scope.files = ResolveProcseletsFiles.data.map(function (item) {
			item.category = item.category.split("::");
			item.files = JSON.parse(item.files);
			return item;
		});
		
		$scope.sname = ResolveProcseletsFiles.sname;
		
		$scope.parseDate = function (date) {
			return new Date(date);
		}
		
		$scope.externalLink = function (file) {
			if (file) {
				return (file.link_external !== "") ? window.open(file.link_external, "_system") : window.open(Constant.url_procseletivo+'phocadownload/'+file.filename, "_system"); 
			}
		}
		
		$scope.getIcon = function (file) {
			if (file) {
				return (file.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive'; 
			}
		}
	})