angular.module('isgh.LecturesCtrl', ['ngSanitize'])

    .controller(
        'LecturesCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveLectures, FactoryLectures) {

            $scope.lectures = ResolveLectures;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.hasHeaderFooter = (Constant.isAndroid) ? 'has-footer' : 'has-header';
            $scope.constant = Constant;

            $scope.has_message = (ResolveLectures.message || ResolveLectures.length == 0) ? true : false;
            $scope.message = (ResolveLectures.message) ? ResolveLectures.message : 'Não há Cursos para exibir no momento';

            var init = function(){
                prepareDocument($scope.lectures);
            };

            var prepareDocument = function(data){
                if(typeof(data.length) === 'undefined') return;

                data.map(function (item) {
                    item.img_src = Constant.url_site + item.image;
                    item.status = (typeof (item.status) === 'string') ? JSON.parse(item.status) : item.status;
                    item.status.button_color = 'button-' + item.status.color;
                    item.status.description = item.status.desc1 +" "+ item.status.desc2;
                    item.title = $filter('CapcaseFilter')(item.title);
                    return item;
                });

                return data
            };

            // refresh na pagina sera incluido em breve
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryLectures.refresh().then(function (response) {
                    $scope.lectures = [];
                    $scope.has_message = false;
                    $scope.lectures = prepareDocument(response.data);
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                    $scope.has_message = true;
                    $scope.message = 'Não há Cursos para exibir no momento';
                    $scope.lectures = [];
                });
            };

            init();

        })

    .controller(
        'LectureCtrl',
        function ($scope, $filter, Constant, ResolveLecture, EmailSender) {

            $scope.lecture = ResolveLecture;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';

            var init = function(){
                prepareDocument($scope.lecture);
            };

            var prepareDocument = function(lecture){
                lecture.img_src = Constant.url_site + lecture.thumbnail;
                lecture.file_link = Constant.url_site + 'lecturesevents/' + lecture.filename;
                lecture.fc1_class = (lecture.form_content_1 !== "") ? 'positive' : 'assertive';
                lecture.fc2_class = (lecture.form_content_2 !== "") ? 'positive' : 'assertive';
                lecture.fc3_class = (lecture.form_content_3 !== "") ? 'positive' : 'assertive';
                lecture.fc4_class = (lecture.form_content_4 !== "") ? 'positive' : 'assertive';

                if(typeof lecture.widgetkit === 'object'){
                    lecture.widgetkit.forEach(function(item){
                        item.fwc_class = (item.content !== "") ? 'positive' : 'assertive';
                    });
                }

                return lecture;
            };

            var openPDF = function (url) {
                var nUrl = (Constant.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            };

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
                        var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                        window.open(url, '_system', options);
                    } else {
                        openPDF(url);
                    }
                }
            };

            init();

        })

    .controller(
        'LectureAddonsCtrl',
        function ($scope, $rootScope, $sce, $filter, $state, Constant, ResolveLectureAddons, $ionicScrollDelegate) {
            $scope.addon = ResolveLectureAddons;

            //ESCONDE TABS ENQUANTO A VIEW É tab.lecture-addons
            $rootScope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = false;
                if ($state.current.name === 'tab.lecture-addons') {
                    $rootScope.hideTabs = true;
                }
            });
            
            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
            };

            $scope.renderHTML = function (html) {
                if (html) {
                    $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
                    return $sce.trustAsHtml(html);
                }
            };
        });
