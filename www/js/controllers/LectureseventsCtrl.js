angular.module('isgh.LectureseventsCtrl', ['ngSanitize'])

.controller('LectureseventsCtrl', function ($scope, $filter, Constant, init, LecturesEvents) {
	
	$scope.lecturesevents = init;
	$scope.url_site = Constant.url_site;
	
	// refresh na pagina sera incluido em breve
	$scope.doRefresh = function () {
		LecturesEvents.refresh().then(function (response) {
			angular.forEach(response.data, function (item) {
				item.status = JSON.parse(item.status);
			});
			$scope.lecturesevents = response.data;
			$scope.$broadcast('scroll.refreshComplete');
		}, function (erro) {
			console.log(erro);
		});
	}
	
})
.controller('LectureeventCtrl', function ($scope, $sce, $css, $filter, Constant, init, $ionicModal, $ionicScrollDelegate, EmailSender) {
	
	$scope.lectureevent = init;
	$scope.url_site = Constant.url_site;
	
	$ionicModal.fromTemplateUrl('templates/lecture-event-content.html', {
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
	
	$scope.externalLink = function (url, target, lectureevent) {
		if (lectureevent.status.status > 1) {
			var html = '';
			html += 'Seu nome: \n';
			html += 'Telefone: \n';
			html += 'Curso(s) de interesse: '+lectureevent.title+'\n';
			html += 'Município de interesse: \n';
			
			EmailSender.setSubject("Cursos 2015 Cadastro de Interessado");
			EmailSender.setBody(html);
			EmailSender.setTo(Constant.emails.cursos.to);
			EmailSender.setCc(Constant.emails.cursos.cc);
			EmailSender.send();

		} else {
			window.open(url, "_system");
		}
	}
	
})
