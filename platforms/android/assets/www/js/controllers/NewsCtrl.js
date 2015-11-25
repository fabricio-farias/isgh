angular.module('isgh.NewsCtrl', ['ngSanitize'])

.controller('NewsCtrl', function ($scope, $filter, $sce, $css, $ionicModal, $ionicScrollDelegate, $rootScope, $ionicFilterBar, ResolveNews, FactoryNews, Constant) {

	$scope.url_intranet = Constant.url_intranet;
	$scope.news = ResolveNews.map(function (item) {
		item.images = JSON.parse(item.images);
		return item;
	});
	
	
	$scope.showFilterBar = function () {
		$ionicFilterBar.show({
		cancelText: 'Cancelar',
        items: $scope.news,
        update: function (filtered) {
          $scope.news = filtered;
        },
		filterProperties: 'title'
      });
    };
	
	
	
	
	// REFRESH NOTICIAS
	$scope.doRefresh = function () {
		$rootScope.alert = null;
		FactoryNews.refresh().then(function (response) {
			$scope.news = response.data.map(function (item) {
				item.images = JSON.parse(item.images);
				return item;
			});
			$scope.$broadcast('scroll.refreshComplete');
		}, function (erro) {
			$scope.$broadcast('scroll.refreshComplete');
			$rootScope.alert = { type: "", message: erro };
		});
		
		// $rootScope.$broadcast('scroll.refreshComplete');
	}
	
	// DEFININDO MODAL
	$ionicModal.fromTemplateUrl('templates/news/new.html', {
		scope: $scope,
		animation: 'slide-in-right'
	}).then(function (modal) {
		$scope.modal = modal;
		$scope.backButton = Constant.backButton;
	});
	
	// GATILHO PRA FECHAR MODAL
	$scope.closeModal = function () {
		$scope.modal.hide();
		$ionicScrollDelegate.$getByHandle('modalScroll').scrollTop();
		$ionicScrollDelegate.$getByHandle('modalScroll').zoomTo(1);
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
		$css.remove('css/intranet/intranet.css');
	};
	
	// RENDERIZAR O IFRAME
	$scope.renderIFRAME = function (id) {
		if (id) {
			var iframe = '<iframe class="app-item-page" data-tap-disabled="true" sandbox="allow-same-origin allow-forms allow-scripts" src="http://www.isgh.org.br/intranet/index.php?option=com_content&view=article&id=' + id + '&path=&tmpl=component"></iframe>';
			return $sce.trustAsHtml(iframe);
		}
    };
	
	// RENDERIZAR O HTML
	$scope.renderHTML = function (html) {
		if (html) {
			var newHTML = String(html).replace(/src=\"/igm, 'src="' + Constant.url_intranet);
			return $sce.trustAsHtml(newHTML);
		}
    };
	
	// GATILHO PRA ABRIR MODAL
	$scope.openModal = function (itemNew) {

		//var options = {location: 'yes',clearcache: 'yes',toolbar: 'yes'};
		//$cordovaInAppBrowser.open('http://www.isgh.org.br/intranet/index.php?option=com_content&view=article&id='+id+'&path=&tmpl=component', '_blank', options);
		
		$scope.modal.show();
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		$css.add('css/intranet/intranet.css');
		$scope.itemNew = itemNew;

	};
	
	//GATILHO MODAL IMAGES
	$ionicModal.fromTemplateUrl('templates/news/new-images.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.mimages = modal;
		$scope.closeButton = Constant.closeButton;
	});

	$scope.openMimages = function (itemNew) {
		$scope.mimages.show();
		$scope.zoomMin = 1;
		$scope.itemNew = itemNew;
    };

    $scope.closeMimages = function () {
		$scope.mimages.hide();
		$ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
    };

})