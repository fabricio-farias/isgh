angular.module('isgh.SearchCtrl', ['ngSanitize'])

    .controller(
        'SearchCtrl',
        function ($scope, $filter, $state, $timeout, $ionicTabsDelegate, $stateParams, $rootScope, Constant) {
            $scope.url_intranet = Constant.url_intranet;
            $scope.url_site = Constant.url_site;
            $scope.tab = $stateParams.tab;
            $scope.inputSearch = { value: null }; //precisa ser objeto para funcionar

            $timeout(function () { $ionicTabsDelegate.$getByHandle('searchtabs').select($stateParams.tab); }, 100);
            $scope.clearSearch = function() { $scope.inputSearch.value = null; }
            
        })

    .controller(
        'SearchCtrlNews',
        function ($scope, $rootScope, $filter, $timeout, $ionicModal, $ionicScrollDelegate, FactoryNews, $interpolate, Constant) { 
            // BANCO LOCAL
            var Sctrln = this;
            Sctrln.sNews = [];
            Sctrln.distance = Constant.ionInfiniteScrollConfig.distance;

            Sctrln.total = null;
            Sctrln.offset = 0;
            Sctrln.limit = Constant.ionInfiniteScrollConfig.interval;

            FactoryNews.total().then(function(response) { Sctrln.total = response.rows.item(0).total; });

            Sctrln.loadMoreNews = function () {
                FactoryNews.all(Sctrln.offset, Sctrln.limit).then(function (response) {
                    response.map(function (item) {
                        item.images = JSON.parse(item.images);
                        Sctrln.sNews.push(item);
                    });
                });
                $timeout(function () {
                    Sctrln.offset += Constant.ionInfiniteScrollConfig.interval;
                    Sctrln.limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            Sctrln.checkTotalNews = function () { return (Sctrln.sNews.length >= Sctrln.total) ? false : true; }
            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrln.filterNewsByField = function(iNew) {
                        return ( (iNew.title).toLowerCase().indexOf(response) >= 0 || (iNew.unit).toLowerCase().indexOf(response) >= 0 || (iNew.category).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            Sctrln.zoomOut = function () { $ionicScrollDelegate.$getByHandle('mnewsScroll').zoomTo(1); }
            
            /****MODAL NOTICIAS****/
            $ionicModal.fromTemplateUrl('templates/search/news-modal.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.mnew = modal; $scope.backButton = Constant.backButton;
            });

            // GATILHO PRA ABRIR MODAL NOTICIAS
            Sctrln.openMnew = function (iNew) { $scope.mnew.show(); $scope.iNew = iNew; };
            Sctrln.closeMnew = function () { $scope.mnew.hide(); Sctrln.zoomOut(); };
        })

    .controller(
        'SearchCtrlLectures',
        function ($rootScope, $scope, $filter, $timeout, $interpolate, $ionicModal, $ionicScrollDelegate, EmailSender, FactoryLectures, Constant) { 
            // BANCO LOCAL
            var Sctrll = this;
            Sctrll.url_site = Constant.url_site;
            Sctrll.sLectures = [];

            FactoryLectures.all().then(function (response) { Sctrll.sLectures = response.map(function (item) { item.status = JSON.parse(item.status); return item; }); });

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrll.filterLecturesByField = function(lecture) {
                        return ( (lecture.title).toLowerCase().indexOf(response) >= 0 || (lecture.location).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            Sctrll.zoomOut = function () { $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1); }
            
            /****MODAL CURSOS****/
            $ionicModal.fromTemplateUrl('templates/search/lectures-modal.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.mlecture = modal; $scope.backButton = Constant.backButton;
            });

            // GATILHO PRA ABRIR MODAL CURSOS
            Sctrll.openMlecture = function (lecture) { $scope.mlecture.show(); $scope.lecture = lecture; };
            Sctrll.closeMlecture = function () { $scope.mlecture.hide(); };

            /****MODAL CURSOS ADDONS****/
            $ionicModal.fromTemplateUrl('templates/search/lectures-modal-addons.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.mlectureaddon = modal; $scope.backButton = Constant.backButton;
            });

            // GATILHO PRA ABRIR MODAL ADDON CURSOS
            Sctrll.openMlectureAddon = function(data) { $scope.mlectureaddon.show(); $scope.item = data; };
            Sctrll.closeMlectureAddon = function () { $scope.mlectureaddon.hide(); Sctrll.zoomOut(); };
            Sctrll.ifExists = function (data) { return (data !== "") ? 'positive' : 'assertive'; }

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            }

            Sctrll.externalLink = function (url, target, lecture) {
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
        'SearchCtrlEvents',
        function ($scope, $filter, $timeout, $interpolate, $ionicModal, $ionicScrollDelegate, FactoryEvents, Constant) { 
            // BANCO LOCAL
            var Sctrle = this;
            Sctrle.sEvents = [];

            FactoryEvents.all().then(function (response) {
                Sctrle.sEvents = response;
            });

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrle.filterEventsByField = function(event) {
                        return ( (event.title).toLowerCase().indexOf(response) >= 0 || (event.unit).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );
            /****MODAL EVENTOS****/            
            $ionicModal.fromTemplateUrl('templates/search/events-modal.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function(modal) {
                $scope.mevent = modal; $scope.backButton = Constant.backButton;
            });

            Sctrle.zoomOut = function() { $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1); }
            Sctrle.openMevent = function(event) { $scope.mevent.show(); $scope.event = event; };
            Sctrle.closeMevent = function () { $scope.mevent.hide(); Sctrle.zoomOut(); };

            /****MODAL EVENTOS ADDONS****/
            $ionicModal.fromTemplateUrl('templates/search/events-modal-addons.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.meventaddon = modal; $scope.backButton = Constant.backButton;
            });

            Sctrle.openMeventAddon = function(data) { $scope.meventaddon.show(); $scope.item = data; };
            Sctrle.closeMeventAddon = function () { $scope.meventaddon.hide(); Sctrle.zoomOut(); };

        })

    .controller(
        'SearchCtrlProcselets',
        function ($rootScope, $scope, $filter, $timeout, $ionicModal ,FactoryProcselets, $interpolate, Constant) { 
            // BANCO LOCAL
            var Sctrlp = this;
            Sctrlp.sProcselets = [];
            Sctrlp.wsProcselets = null;
            Sctrlp.distance = Constant.ionInfiniteScrollConfig.distance;
            Sctrlp.procseletsTitles = Constant.procseletsTitles;

            Sctrlp.total = null;
            Sctrlp.offset = 0;
            Sctrlp.limit = Constant.ionInfiniteScrollConfig.interval;


            // FactoryProcselets.procseletsWSget().then(function(response) {
            //     Sctrlp.total = response.data.length;// response.data = _(response.data).chain().sortBy('code').reverse().sortBy('unid').value();
            //     response.data = _(response.data).chain().sortBy('code').reverse().value();
            //     Sctrlp.wsProcselets = response;
            // })

            FactoryProcselets.total().then(function (response) { Sctrlp.total = response.rows.item(0).total });

            Sctrlp.loadMoreProcselets = function() {

                // if (Sctrlp.total > Sctrlp.limit)
                // {
                //     for (var i = Sctrlp.offset; i < Sctrlp.limit; i++) {// Sctrlp.wsProcselets.data[i].created = new Date(Sctrlp.wsProcselets.data[i].created);
                //         Sctrlp.sProcselets.push(Sctrlp.wsProcselets.data[i]);
                //     }

                //     $timeout(function () {
                //         Sctrlp.offset += Constant.ionInfiniteScrollConfig.interval;
                //         Sctrlp.limit += Constant.ionInfiniteScrollConfig.interval;
                //     }, 100);
                // } else {
                //     Sctrlp.sProcselets = Sctrlp.wsProcselets.data.map(function(item) {
                //         item.created = new Date(item.created);
                //         return item;
                //     })
                // }

                FactoryProcselets.all(Sctrlp.offset, Sctrlp.limit).then(function (response) {
                    response.map(function (item) {
                        Sctrlp.sProcselets.push(item);
                    });
                });
                $timeout(function () {
                    Sctrlp.offset += Constant.ionInfiniteScrollConfig.interval;
                    Sctrlp.limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            Sctrlp.checkTotalProcselets = function () { return (Sctrlp.sProcselets.length >= Sctrlp.total) ? false : true; }

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrlp.filterProcseletsByField = function(procselect) {
                        return ( (procselect.category).toLowerCase().indexOf(response) >= 0 || (procselect.unit).toLowerCase().indexOf(response) >= 0 || (procselect.code).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            /****MODAL PROCSELETS ADDONS****/
            $ionicModal.fromTemplateUrl('templates/search/procselets-modal.html', {
                scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.mprocselets = modal; $scope.backButton = Constant.backButton;
            });

            Sctrlp.openMprocselet = function(procselet) { $scope.mprocselets.show(); procselet.files = (typeof (procselet.files) === 'string') ? JSON.parse(procselet.files) : procselet.files; procselet.stitle = Constant.procseletsTitles[procselet.status]; $scope.files = procselet; };
            Sctrlp.closeMprocselet = function () { $scope.mprocselets.hide(); };
            Sctrlp.parseDate = function (date) { return new Date(date); }
            Sctrlp.getIcon = function (file) { if (file) { return (file.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive'; } }

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            }

            Sctrlp.externalLink = function (file) {
                if (file) {
                    var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                    return (file.link_external !== "") ? window.open(file.link_external, "_blank", options) : openPDF(Constant.url_procseletivo + 'phocadownload/' + file.filename);
                }
            }

        })

    .controller(
        'SearchCtrlBirthdays',
        function ($scope, $filter, $timeout, FactoryBirthdays, $interpolate, Constant) { 
            // BANCO LOCAL
            var Sctrlb = this;
            Sctrlb.sBirthdays = [];
            Sctrlb.distance = Constant.ionInfiniteScrollConfig.distance;

            var total = null;
            var offset = 0;
            var limit = Constant.ionInfiniteScrollConfig.interval;

            FactoryBirthdays.total().then(function (response) { Sctrlb.total = response.rows.item(0).total; });

            Sctrlb.loadMoreBirthdays = function () {
                FactoryBirthdays.all(Sctrlb.offset, Sctrlb.limit).then(function (response) {
                    response.map(function (item) {
                        Sctrlb.sBirthdays.push(item);
                    });
                });
                $timeout(function () {
                    Sctrlb.offset += Constant.ionInfiniteScrollConfig.interval;
                    Sctrlb.limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            Sctrlb.checkTotalBirthdays = function () { return (Sctrlb.sBirthdays.length >= Sctrlb.total) ? false : true; }

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrlb.filterBirthdaysByField = function(birthday) {
                        return ( (birthday.dsc_nome).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_funcao).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_setor).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_filial).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );
        })