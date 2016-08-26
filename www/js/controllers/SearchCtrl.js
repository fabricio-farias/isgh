angular.module('isgh.SearchCtrl', ['ngSanitize'])

    .controller(
        'SearchCtrl',
        function ($scope, $filter, $state, $timeout, $ionicTabsDelegate, $stateParams, $rootScope, Constant) {
            $scope.url_intranet = Constant.url_intranet;
            $scope.url_site = Constant.url_site;

            $scope.app_header = (Constant.isAndroid) ? 'app-header-search-android' : 'app-header-search-ios';
            $scope.has_header = (Constant.isIOS) ? 'has-header' : '';

            $scope.tab = $stateParams.tab;
            $scope.inputSearch = { value: null }; //precisa ser objeto para funcionar

            $timeout(function () { var tab = ($stateParams.tab === null) ? 0 : $stateParams.tab; $ionicTabsDelegate.$getByHandle('searchtabs').select(tab); }, 100);
            $scope.clearSearch = function() { $scope.inputSearch.value = null; }
            
        })

    .controller(
        'SearchCtrlNews',
        function ($scope, $rootScope, $filter, $state, $timeout, $ionicModal, $ionicScrollDelegate, FactoryNews, $interpolate, Constant, Utility) {
            // BANCO LOCAL
            var Sctrln = this;

            Sctrln.sNews = [];
            Sctrln.distance = Constant.ionInfiniteScrollConfig.distance;
            Sctrln.constant = Constant;

            var total = null;
            var limit = parseInt(Constant.ionInfiniteScrollConfig.interval);
            var offset = 0;

            var init = function () {
                $timeout(function(){ checkTotalNews(); }, 500);
            };

            var _prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                data.images = (typeof (data.images) === 'string') ? JSON.parse(data.images) : data.images;
                data.img_src = Constant.url_intranet + (data.images.image_fulltext || data.images.image_intro);
                data.unit = (data.unit) ? data.unit : 'ISGH';
                data.unit_color = Utility.getUnitColor(data.unit);
                data.unit_i_color = Utility.getUnitColor(data.unit, 'item-');
                data.unit_b_color = Utility.getUnitColor(data.unit, 'button-');
                data.created_relative = $filter('DateRelativeFilter')(data.created);

                return data;
            };

            var prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                if(data.length > 0){
                    data.map(function(item){
                        item = _prepareDocument(item);
                        return item;
                    });
                }else{
                    data = _prepareDocument(data);
                }

                return data;
            };

            FactoryNews.total().then(function (response) { total = response.rows.item(0).total; });

            Sctrln.loadMoreNews = function () {

                FactoryNews.all(offset, parseInt(Constant.ionInfiniteScrollConfig.interval)).then(function (response) {
                    response.map(function (item) {
                        Sctrln.sNews.push(_prepareDocument(item));
                    });
                });
                $timeout(function () {
                    offset += parseInt(Constant.ionInfiniteScrollConfig.interval);
                    limit += parseInt(Constant.ionInfiniteScrollConfig.interval);
                }, 100);


                if (total <= limit){
                   Sctrln.checkTNews = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            var checkTotalNews = function () {
                Sctrln.checkTNews = (Sctrln.sNews.length >= total) ? false : true;
            };

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrln.filterNewsByField = function(iNew) {
                        return ( (iNew.title).toLowerCase().indexOf(response) >= 0 || (iNew.unit).toLowerCase().indexOf(response) >= 0 || (iNew.category).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            /****MODAL NOTICIAS ZOOM****/
            Sctrln.zoomOut = function () { $ionicScrollDelegate.$getByHandle('mnewsScroll').zoomTo(1); };
            
            /****MODAL NOTICIAS****/
            $ionicModal.fromTemplateUrl('templates/search/news-modal.html', { scope: $scope, animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.mnew = modal; $scope.backButton = Constant.backButton; $scope.bar_color = (Constant.isAndroid) ? 'bar-info' : 'bar-light';
                $scope.openPDF = function (url) {
                    var nUrl = (Constant.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                    var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                    window.open(nUrl, '_blank', options);
                };
                $scope.openLink = function (url) {
                    if (url) {
                        if (url.indexOf('intranet') > -1 && url.indexOf('com_content') > -1) {
                            var regexp = new RegExp("id=(.*?)\\d{4,9}", "ig");
                            var id = url.match(regexp)[0].split("=")[1];

                            FactoryNews.newsWSget(id).then(function (response) {
                                response.data.map(function (resp) {
                                    resp.images = JSON.parse(resp.images);
                                    resp.unit_color_i = Utility.getUnitColor(resp.unit, 'item-');
                                    resp.unit_color_b = Utility.getUnitColor(resp.unit, 'button-');
                                    return resp;
                                });
                                $scope.iNew = _prepareDocument(response.data[0]);
                                $scope.mnew.show();
                            })

                        } else {
                            var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                            window.open(url, "_system", options);
                        }
                    }
                };
            });

            /****OPEN AND CLOSE MODAL NOTICIAS****/
            Sctrln.openMnew = function (iNew) { $scope.mnew.show(); $scope.iNew = iNew; };
            Sctrln.closeMnew = function () { $scope.mnew.hide(); Sctrln.zoomOut(); };

            init();
        })

    .controller(
        'SearchCtrlLectures',
        function ($rootScope, $scope, $filter, $timeout, $interpolate, $ionicModal, $ionicScrollDelegate, EmailSender, FactoryLectures, Constant) { 
            // BANCO LOCAL
            var Sctrll = this;
            Sctrll.url_site = Constant.url_site;
            Sctrll.sLectures = [];

            var init = function(){
                FactoryLectures.all().then(function (response) {
                    Sctrll.sLectures = prepareDocument(response);
                });

                /****MODAL CURSOS****/
                $ionicModal.fromTemplateUrl('templates/search/lectures-modal.html', {
                    scope: $scope, animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.mlecture = modal; $scope.backButton = Constant.backButton; $scope.bar_color = (Constant.isAndroid === true) ? 'bar-info' : 'bar-light';
                });

                /****MODAL CURSOS ADDONS****/
                $ionicModal.fromTemplateUrl('templates/search/lectures-modal-addons.html', {
                    scope: $scope, animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.mlectureaddon = modal; $scope.backButton = Constant.backButton; $scope.bar_color = (Constant.isAndroid === true) ? 'bar-info' : 'bar-light';
                });
            };

            var _prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                data.status = (typeof (data.status) === 'string') ? JSON.parse(data.status) : data.status;

                data.img_src = Constant.url_site + data.thumbnail;
                data.file_link = Constant.url_site + 'lecturesevents/' + data.filename;
                data.status.description = data.status.desc1 +" "+ data.status.desc2;
                data.status.button_color = 'button-' + data.status.color;

                data.fc1_class = (data.form_content_1 !== "") ? 'positive' : 'assertive';
                data.fc2_class = (data.form_content_2 !== "") ? 'positive' : 'assertive';
                data.fc3_class = (data.form_content_3 !== "") ? 'positive' : 'assertive';
                data.fc4_class = (data.form_content_4 !== "") ? 'positive' : 'assertive';

                if(typeof data.widgetkit === 'object'){
                    data.widgetkit.forEach(function(item){
                        item.fwc_class = (item.content !== "") ? 'positive' : 'assertive';
                    });
                }

                return data;
            };

            var prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                if(data.length > 0){
                    data.map(function(item){
                        item =  _prepareDocument(item);
                        return item;
                    });
                }else{
                    data = _prepareDocument(data);
                }

                return data;
            };

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrll.filterLecturesByField = function(lecture) {
                        return ( (lecture.title).toLowerCase().indexOf(response) >= 0 || (lecture.location).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            /****MODAL CURSOS ZOOM****/
            Sctrll.zoomOut = function () { $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1); };

            /****OPEN AND CLOSE MODAL CURSOS****/
            Sctrll.openMlecture = function (lecture) { $scope.mlecture.show(); $scope.lecture = lecture; };
            Sctrll.closeMlecture = function () { $scope.mlecture.hide(); };

            /****OPEN AND CLOSE MODAL CURSOS ADDONS****/
            Sctrll.openMlectureAddon = function (data) { $scope.mlectureaddon.show(); $scope.item = data; };
            Sctrll.closeMlectureAddon = function () { $scope.mlectureaddon.hide(); Sctrll.zoomOut(); };

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            };

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
            };

            init();
        })

    .controller(
        'SearchCtrlEvents',
        function ($scope, $filter, $timeout, $interpolate, $ionicModal, $ionicScrollDelegate, FactoryEvents, FactoryNews, Constant, Utility) {
            // BANCO LOCAL
            var Sctrle = this;
            Sctrle.sEvents = [];

            var init = function(){
                FactoryEvents.all().then(function (response) {
                    Sctrle.sEvents = prepareDocument(response);
                });

                /****MODAL EVENTOS****/
                $ionicModal.fromTemplateUrl('templates/search/events-modal.html', {
                    scope: $scope, animation: 'slide-in-right'
                }).then(function(modal) {
                    $scope.mevent = modal;
                    $scope.backButton = Constant.backButton;
                    $scope.bar_color = (Constant.isAndroid === true) ? 'bar-info' : 'bar-light';
                });

                /****MODAL EVENTOS ADDONS****/
                $ionicModal.fromTemplateUrl('templates/search/events-modal-addons.html', {
                    scope: $scope, animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.meventaddon = modal; $scope.backButton = Constant.backButton;
                    $scope.bar_color = (Constant.isAndroid === true) ? 'bar-info' : 'bar-light';
                    $scope.openPDF = function (url) {
                        var nUrl = (Constant.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                        var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                        window.open(nUrl, '_blank', options);
                    };
                    $scope.openLink = function (url) {
                        if (url) {
                            if (url.indexOf('intranet') > -1 && url.indexOf('com_content') > -1) {
                                var regexp = new RegExp("id=(.*?)\\d{4,9}", "ig");
                                var id = url.match(regexp)[0].split("=")[1];

                                FactoryNews.newsWSget(id).then(function (response) {
                                    response.data.map(function (resp) {
                                        resp.images = JSON.parse(resp.images);
                                        resp.unit_color = Utility.getUnitColor(resp.unit, 'item-');
                                        resp.unit = (resp.unit) ? resp.unit : 'ISGH';
                                        resp.date_relative = $filter('DateRelativeFilter')(resp.created);
                                        return resp;
                                    });
                                    $scope.item = response.data;
                                    $scope.meventaddon.show();

                                })

                            } else {
                                var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                                window.open(url, "_system", options);
                            }
                        }
                    };
                    
                });
            };

            var _prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                data.unit = (data.unit) ? data.unit : 'ISGH';
                data.unit_color = Utility.getUnitColor(data.unit, 'app-units-');
                data.unit_color_button = Utility.getUnitColor(data.unit, 'button-');
                data.unit_color_item = Utility.getUnitColor(data.unit, 'item-');
                data.date_relative = $filter('DateRelativeFilter')(data.date);

                return data;
            };

            var prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;

                if(data.length > 0){
                    data.map(function(item){
                        item =  _prepareDocument(item);
                        return item;
                    });
                }else{
                    data = _prepareDocument(data);
                }

                return data;
            };

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrle.filterEventsByField = function(event) {
                        return ( (event.title).toLowerCase().indexOf(response) >= 0 || (event.unit).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            /****MODAL EVENTOS ZOOM****/
            Sctrle.zoomOut = function() { $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1); };

            /****OPEN AND CLOSE MODAL EVENTOS ****/
            Sctrle.openMevent = function (event) { $scope.mevent.show(); $scope.event = event; $scope.has_introtext = (event.introtext.length > 0) ? true : false; };
            Sctrle.closeMevent = function () { $scope.mevent.hide(); Sctrle.zoomOut(); };

            /****OPEN AND CLOSE MODAL EVENTOS ADDONS****/
            Sctrle.openMeventAddon = function(data) { $scope.meventaddon.show(); $scope.item = data; };
            Sctrle.closeMeventAddon = function () { $scope.meventaddon.hide(); Sctrle.zoomOut(); };

            init();
        })

    .controller(
        'SearchCtrlProcselets',
        function ($rootScope, $scope, $filter, $timeout, $ionicModal ,FactoryProcselets, $interpolate, Constant, Utility) {
            // BANCO LOCAL
            var Sctrlp = this;

            Sctrlp.sProcselets = [];
            Sctrlp.wsProcselets = null;
            Sctrlp.distance = Constant.ionInfiniteScrollConfig.distance;
            Sctrlp.procseletsTitles = Constant.procseletsTitles;

            var total = null;
            var offset = 0;
            var limit = parseInt(Constant.ionInfiniteScrollConfig.interval);

            var init = function(){
                $timeout(function(){checkTotalProcselets();}, 500);
            };

            var _prepareDocument = function(data){
                if(typeof (data) === 'undefined') return;
                var exp = /\d{1,2}\/\d{1,2}\/\d{4}/;

                if(exp.test(data.created) === false){
                    data.created = new Date(data.created);
                    data.created = $filter('date')(data.created, 'dd/MM/yyyy');
                }

                data.files = (typeof (data.files) === 'string') ? JSON.parse(data.files) : data.files;
                if(typeof (data.files) !== 'undefined'){
                    data.files.forEach(function(item){
                        item.icon = (item.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive';
                        if(exp.test(item.date) === false){
                            item.date = new Date(item.date);
                            item.date = $filter('date')(item.date, 'dd/MM/yyyy');
                        }

                        return item;
                    });
                }

                data.unit_color = Utility.getUnitColor(data.unit, 'app-units-');
                return data;
            };

            var prepareDocument = function(data){ if (typeof(data) === 'undefined') return; if (data.length > 0){ data.map(function (item){ item = _prepareDocument(item); return item; }); } else { data = _prepareDocument(data); } return data; }

            FactoryProcselets.total().then(function (response) { total = response.rows.item(0).total });

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

                FactoryProcselets.all(offset, parseInt(Constant.ionInfiniteScrollConfig.interval)).then(function (response) {
                    response.map(function (item) {
                        Sctrlp.sProcselets.push(_prepareDocument(item));
                    });
                });
                $timeout(function () {
                    offset += parseInt(Constant.ionInfiniteScrollConfig.interval);
                    limit += parseInt(Constant.ionInfiniteScrollConfig.interval);
                }, 100);

                if (total <= limit){
                    Sctrlp.checkTprocselets = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            var checkTotalProcselets = function () { Sctrlp.checkTprocselets = (Sctrlp.sProcselets.length >= total) ? false : true; };

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
                $scope.mprocselets = modal;
                $scope.backButton = Constant.backButton;
                $scope.bar_color = (Constant.isAndroid === true) ? 'bar-info' : 'bar-light';
                $scope.has_header = (Constant.isIOS === true) ? 'has-header' : '';
            });

            Sctrlp.openMprocselet = function (procselet) { $scope.mprocselets.show(); procselet.stitle = Constant.procseletsTitles[procselet.status]; $scope.files = procselet; };
            Sctrlp.closeMprocselet = function () { $scope.mprocselets.hide(); };

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            };

            Sctrlp.externalLink = function (file) {
                if (file) {
                    var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                    return (file.link_external !== "") ? window.open(file.link_external, "_blank", options) : openPDF(Constant.url_procseletivo + 'phocadownload/' + file.filename);
                }
            };

            init();

        })

    .controller(
        'SearchCtrlBirthdays',
        function ($scope, $filter, $timeout, FactoryBirthdays, $interpolate, Constant, Utility) {
            // BANCO LOCAL
            var Sctrlb = this;

            Sctrlb.sBirthdays = [];
            Sctrlb.distance = Constant.ionInfiniteScrollConfig.distance;

            var total = null;
            var limit = parseInt(Constant.ionInfiniteScrollConfig.interval);
            var offset = 0;

            var init = function(){
                $timeout(function () { checkTotalBirthdays(); }, 500);
            };

            var _prepareDocument = function(data){
                if(typeof (data) === 'undefined') return;

                data.dsc_alias = $filter('CapNameFilter')(data.dsc_nome);
                data.dsc_alias = $filter('limitTo')(data.dsc_alias, 2);
                data.unit_color = Utility.getUnitColor(data.dsc_filial);

                return data;
            };

            FactoryBirthdays.total().then(function (response) { total = response.rows.item(0).total; });

            Sctrlb.loadMoreBirthdays = function () {
                FactoryBirthdays.all(offset, parseInt(Constant.ionInfiniteScrollConfig.interval)).then(function (response) {
                    response.map(function (item) {
                        Sctrlb.sBirthdays.push(_prepareDocument(item));
                    });
                });
                $timeout(function () {
                    offset += parseInt(Constant.ionInfiniteScrollConfig.interval);
                    limit += parseInt(Constant.ionInfiniteScrollConfig.interval);
                }, 100);

                if(total <= limit){
                    Sctrlb.checkTBirthdays = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');

            };

            var checkTotalBirthdays = function () {
                Sctrlb.checkTBirthdays = (Sctrlb.sBirthdays.length >= total) ? false : true;
            };

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    Sctrlb.filterBirthdaysByField = function(birthday) {
                        return ( (birthday.dsc_nome).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_funcao).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_setor).toLowerCase().indexOf(response) >= 0 || (birthday.dsc_filial).toLowerCase().indexOf(response) >= 0);
                    };
                }
            );

            init();
        });