angular.module('isgh.ProfileCtrl', ['ngSanitize'])

	.controller('LoginCtrl', function ($scope, $filter, $ionicLoading, $rootScope, $ionicPopup, $state, Constant, FactoryProfile) {
		
		var objFiliais = [
			{isb_filial: "8", dsc_filial: "HGWA"},
			{isb_filial: "2", dsc_filial: "HRC"},
			{isb_filial: "7", dsc_filial: "HRN"},
			{isb_filial: "1", dsc_filial: "ISGH"},
			{isb_filial: "15", dsc_filial: "PRIMILAB GESTÃO DE LABORATÓRIO"},
			{isb_filial: "9", dsc_filial: "SMS"},
			{isb_filial: "4", dsc_filial: "UPA A. NUNES"},
			{isb_filial: "6", dsc_filial: "UPA CANINDEZINHO"},
			{isb_filial: "11", dsc_filial: "UPA C. CEARÁ"},
			{isb_filial: "13", dsc_filial: "UPA ITAPERY"},
			{isb_filial: "14", dsc_filial: "UPA JANGURUSSU"},
			{isb_filial: "10", dsc_filial: "UPA J. WALTER"},
			{isb_filial: "5", dsc_filial: "UPA MESSEJANA"},
			{isb_filial: "3", dsc_filial: "UPA P. FUTURO"},
			{isb_filial: "12", dsc_filial: "UPA PIRAMBU"}
		]
		
		FactoryProfile.profileWSgetFilial().then(function (response) {
			return (response.data.length > 0) ? $scope.filiais = response.data : $scope.filiais = objFiliais;
		})
		
		$scope.searchProfile = function (login) {
			if (login) {
				$ionicLoading.show();
				$scope.alert = null;
				
				FactoryProfile.doLogin(login).then(function (response) {
					$ionicLoading.hide();
					if (response.data.length > 0) {
						$ionicLoading.hide();
						$state.go('tab.news');
					} else {
						$ionicPopup.alert({
							title: 'Dados incorretos',
							template: 'Usuário, senha ou filial estão incorretos!'
						});
					}
					
				}, function (erro) {
					$ionicLoading.hide();
					$rootScope.alert = { type: "", message: erro };
				});
			}

		}

	})
	
	.controller('ProfileCtrl', function ($scope, $filter, $rootScope, ResolveProfile, Constant, FactoryProfile, $state) {
		$scope.profile = ResolveProfile;
		
		$scope.logoutProfile = function (profile) { 
			if (profile) {
				FactoryProfile.setLogout().then(function (response) {
					if (response.rowsAffected > 0) {
						$state.go('login');
					}
				})
			}
		}

	})