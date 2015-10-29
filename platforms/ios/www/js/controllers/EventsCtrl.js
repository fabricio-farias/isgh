angular.module('isgh.EventsCtrl', ['ngSanitize'])

.controller('EventsCtrl', function ($scope, $filter, $rootScope, Constant, ResolveEvents, FactoryEvents) {

	$scope.url_site = Constant.url_site;

	if (angular.isArray(ResolveEvents)) {
		$scope.events = ResolveEvents;
	} else {
		$rootScope.alert = ResolveEvents;
	}
	
	
	// refresh na pagina sera incluido em breve
	$scope.doRefresh = function () {
		$rootScope.alert = null;
		FactoryEvents.refresh().then(function (response) {
			$scope.events = response.data;
		}, function (erro) {
			$rootScope.alert = { type: "", message: erro };
		});
		
		$scope.$broadcast('scroll.refreshComplete');
	}
	
})
.controller('EventCtrl', function ($scope, $sce, $css, $filter, Constant, ResolveEvent, $ionicModal, $ionicScrollDelegate) {
	
	$scope.event = ResolveEvent;
	$scope.url_intranet = Constant.url_intranet;
	
	$ionicModal.fromTemplateUrl('templates/events/event-addons.html', {
		scope: $scope,
		animation: 'slide-in-right'
	}).then(function (modal) {
		$scope.modal = modal;
		$scope.backButton = Constant.backButton;
	});
	
	
	// GATILHO PRA FECHAR MODAL
	$scope.closeModal = function() {
		$scope.modal.hide();
		$ionicScrollDelegate.$getByHandle('modalScroll').scrollTop();
		$ionicScrollDelegate.$getByHandle('modalScroll').zoomTo(1);
		
		if (window.StatusBar) {
	      StatusBar.styleLightContent();
	    }
		$css.remove('css/intranet/intranet.css');
	};
	
	// RENDERIZAR O HTML
	$scope.renderHTML = function (html) {
		if (html) {
			var newHTML = String(html).replace(/src=\"/igm, 'src="' + Constant.url_intranet);
			return $sce.trustAsHtml(newHTML);
		}
    };
	
	// GATILHO PRA ABRIR MODAL
	$scope.openModal = function (event) {
		$scope.modal.show();
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		$css.add('css/intranet/intranet.css');
		$scope.itemEvent = event;
	};
	
	$scope.ifExists = function (data) {
		return (data !== "") ? 'positive' : 'assertive' ;
	}
	
	$scope.externalLink = function (url) {
		window.open(url, "_system");
	}
	
})
