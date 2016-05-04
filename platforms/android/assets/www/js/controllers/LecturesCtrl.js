angular.module('isgh.LecturesCtrl', ['ngSanitize'])

    .controller(
        'LecturesCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveLectures, FactoryLectures) {

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
                    $rootScope.alert = erro;
                });
            }

        })

    .controller(
        'LectureCtrl',
        function ($scope, $filter, Constant, ResolveLecture, EmailSender, $rootScope) {

            $scope.lecture = ResolveLecture;
            $scope.url_site = Constant.url_site;

            $scope.ifExists = function (data) {
                return (data !== "") ? 'positive' : 'assertive';
            }

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
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
                    if (target == '_system') {
                        var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                        window.open(url, '_system', options);
                    } else {
                        openPDF(url);
                    }
                }
            }

        })

    .controller(
        'LectureAddonsCtrl',
        function ($scope, $rootScope, $sce, $filter, $state, Constant, ResolveLectureAddons, $ionicScrollDelegate) {
            $scope.addon = ResolveLectureAddons;
            $scope.url_site = Constant.url_site;

            //ESCONDE TABS ENQUANTO A VIEW É tab.lecture-addons
            $rootScope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = false;
                if ($state.current.name === 'tab.lecture-addons') {
                    $rootScope.hideTabs = true;
                }
            });
            
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
