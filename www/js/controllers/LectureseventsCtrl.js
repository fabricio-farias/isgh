angular.module('isgh.LectureseventsCtrl', ['ngSanitize'])

.controller('LectureseventsCtrl', function ($scope, $filter, $ionicScrollDelegate, Constant, init, LecturesEvents) {
	
	$scope.lecturesevents = init;
	$scope.url_site = Constant.url_site;
	
	// refresh na pagina sera incluido em breve
	$scope.doRefresh = function () {
		LecturesEvents.populate(true).then(function (response) {
			LecturesEvents.all().then(function (response) {
				angular.forEach(response, function (item) {
					item.status = JSON.parse(item.status);
				});

				$scope.lecturesevents = response;
				$scope.$broadcast('scroll.refreshComplete');
			});
		});
	}
	
})
.controller('LectureeventCtrl', function ($scope, $sce, $css, $filter, Constant, init, $ionicModal) {
	
	$scope.lectureevent = init;
	$scope.url_site = Constant.url_site;
	
	$ionicModal.fromTemplateUrl('templates/lecture-event-content.html', {
		scope: $scope,
		animation: 'slide-in-right'
	}).then(function (modal) {
		$scope.modal = modal;
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
	$scope.openModal = function (content, title) {
		if (content) {
			$scope.modal.show();
			if (window.StatusBar) {
				StatusBar.styleDefault();	
		    }
			$css.add('css/intranet/intranet.css');
			$scope.content = content;
			$scope.title = title;
		}
	};
	
	$scope.ifExists = function (data) {
		return (data !== "") ? 'positive' : 'assertive' ;
	}
	
	$scope.externalLink = function (url, target) {
		window.open(url, "_system");
	}
	
})
