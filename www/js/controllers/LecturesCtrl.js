angular.module('isgh.LecturesCtrl', ['ngSanitize'])

    .controller('LecturesCtrl', function ($scope, $filter, $rootScope, $ionicFilterBar, Constant, ResolveLectures, FactoryLectures) {

        $scope.url_site = Constant.url_site;
        $scope.lectures = ResolveLectures.map(function (item) {
            item.status = JSON.parse(item.status);
            return item;
        });

        $scope.showFilterBar = function () {
            $ionicFilterBar.show({
                cancelText: 'Cancelar',
                items: $scope.lectures,
                update: function (filtered) {
                    $scope.lectures = filtered;
                },
                filterProperties: 'title'
            });
        };
	
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
        }

    })
    .controller('LectureCtrl', function ($scope, $filter, Constant, ResolveLecture, EmailSender) {

        $scope.lecture = ResolveLecture;
        $scope.url_site = Constant.url_site;

        $scope.ifExists = function (data) {
            return (data !== "") ? 'positive' : 'assertive';
        }

        $scope.externalLink = function (url, target, lecture) {
            var year = new Date();

            if (lecture.status.status > 1) {
                var html = '';
                html += 'Seu nome: \n';
                html += 'Telefone: \n';
                html += 'Curso(s) de interesse: ' + lecture.title + '\n';
                html += 'Município de interesse: \n';

                EmailSender.setSubject("Cursos " + year.getFullYear() + " Cadastro de Interessado");
                EmailSender.setBody(html);
                EmailSender.setTo(Constant.emails.cursos.to);
                EmailSender.setCc(Constant.emails.cursos.cc);
                EmailSender.send();

            } else {
                window.open(url, "_system");
            }
        }

    })

    .controller('LectureAddonsCtrl', function ($scope, $sce, $filter, Constant, ResolveLectureAddons, $ionicScrollDelegate) {
        $scope.addon = ResolveLectureAddons;
        $scope.url_site = Constant.url_site;

        $scope.zoomOut = function () {
            $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
        }

        $scope.renderHTML = function (html) {
            if (html) {
                $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
                return $sce.trustAsHtml(html);
            }
        };
    });
