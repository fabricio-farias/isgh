angular.module('isgh.LecturesCtrl', ['ngSanitize'])

.controller('LecturesCtrl', function ($scope, $filter, $rootScope, Constant, ResolveLectures, FactoryLectures) {

	$scope.url_site = Constant.url_site;
	$scope.lectures = ResolveLectures.map(function (item) {
		item.status = JSON.parse(item.status);
		return item;
	});
	
	// refresh na pagina sera incluido em breve
	$scope.doRefresh = function () {
		$rootScope.alert = null;
		FactoryLectures.refresh().then(function (response) {
			$scope.lectures = response.data.map(function (item) {
				item.status = JSON.parse(item.status);
				return item;
			});
			$scope.$broadcast('scroll.refreshComplete');
		}, function (erro) {
			$scope.$broadcast('scroll.refreshComplete');
			$rootScope.alert = { type: "", message: erro };
		});
		
		// $scope.$broadcast('scroll.refreshComplete');
	}
	
})
.controller('LectureCtrl', function ($scope, $sce, $css, $filter, Constant, ResolveLecture, $ionicModal, $ionicScrollDelegate, EmailSender) {
	
	$scope.lecture = ResolveLecture;
	$scope.url_site = Constant.url_site;
	
	$ionicModal.fromTemplateUrl('templates/lectures/lecture-addons.html', {
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
			var newHTML = String(html).replace(/src=\"/igm, 'src="' + Constant.url_site);
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
	
	$scope.externalLink = function (url, target, lecture) {
		var year = new Date();
		
		if (lecture.status.status > 1) {
			var html = '';
			html += 'Seu nome: \n';
			html += 'Telefone: \n';
			html += 'Curso(s) de interesse: '+lecture.title+'\n';
			html += 'Município de interesse: \n';
			
			EmailSender.setSubject("Cursos "+year.getFullYear()+" Cadastro de Interessado");
			EmailSender.setBody(html);
			EmailSender.setTo(Constant.emails.cursos.to);
			EmailSender.setCc(Constant.emails.cursos.cc);
			EmailSender.send();

		} else {
			window.open(url, "_system");
		}
	}
	
})
