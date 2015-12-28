// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['.*']);

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.scrolling.jsScrolling(true);

    $ionicFilterBarConfigProvider.placeholder('Buscar');
    if (ionic.Platform.isIOS()) {
        $ionicFilterBarConfigProvider.theme('light');
    } else if (ionic.Platform.isAndroid()) {
        $ionicFilterBarConfigProvider.theme('info');
    }
  
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login/login.html',
            controller: 'LoginCtrl',
            cache: false
        })
    
    //TAB
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
    //TAB.NEWS
        .state('tab.news', {
            url: '/news',
            cache: false,
            views: {
                'tab-news': {
                    templateUrl: 'templates/news/news.html',
                    controller: 'NewsCtrl',
                    resolve: {
                        ResolveNews: function (FactoryNews, $ionicLoading, $rootScope) {
                            $rootScope.alert = null;
                            $ionicLoading.show();

                            return FactoryNews.populate().then(function (response) {
                                $ionicLoading.hide();
                                return response.data;

                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })
    //TAB.NEW
        .state('tab.new', {
            url: '/news',
            params: { itemNew: null },
            views: {
                'tab-news': {
                    templateUrl: 'templates/news/new.html',
                    controller: 'NewCtrl',
                    resolve: {
                        ResolveNew: function (FactoryNews, $stateParams) {
                            return $stateParams.itemNew;
                        }
                    }
                }
            }
        })
    //TAB.LECTURES
        .state('tab.lectures', {
            url: '/lectures',
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/lectures/lectures.html',
                    controller: 'LecturesCtrl',
                    resolve: {
                        ResolveLectures: function (FactoryLectures, $ionicLoading, $rootScope) {
                            $rootScope.alert = null;
                            $ionicLoading.show();

                            return FactoryLectures.populate().then(function (response) {
                                $ionicLoading.hide();
                                return response.data;

                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })
    //TAB.LECTURE
        .state('tab.lecture', {
            url: '/lectures',
            params: { lecture: null },
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/lectures/lecture.html',
                    controller: 'LectureCtrl',
                    resolve: {
                        ResolveLecture: function ($stateParams, Constant, EmailSender, $state) {

                            var year = new Date();
                            if ($stateParams.lecture.register_planning > 0) {
                                var html = '';
                                html += 'Seu nome: \n';
                                html += 'Telefone: \n';
                                html += 'Curso(s) de interesse: ' + $stateParams.lecture.title + '\n';
                                html += 'Município de interesse: \n';

                                EmailSender.setSubject("Cursos " + year.getFullYear() + " Cadastro de Interessado");
                                EmailSender.setBody(html);
                                EmailSender.setTo(Constant.emails.cursos.to);
                                EmailSender.setCc(Constant.emails.cursos.cc);
                                EmailSender.send();

                                $state.go($state.current, $stateParams.lecture, { reload: false, inherit: false });

                            } else {
                                if ($stateParams.lecture.widgetkit_module > 0) {
                                    $stateParams.lecture.widgetkit = (typeof ($stateParams.lecture.widgetkit) === 'string') ? JSON.parse($stateParams.lecture.widgetkit) : $stateParams.lecture.widgetkit;
                                }
                                return $stateParams.lecture;
                            }
                        }
                    }
                }
            }
        })
    //TAB.LECTURE-ADDONS
        .state('tab.lecture-addons', {
            url: '/lectures/addons',
            params: { content: null, title: null },
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/lectures/lecture-addons.html',
                    controller: 'LectureAddonsCtrl',
                    resolve: {
                        ResolveLectureAddons: function ($stateParams) {
                            return $stateParams;
                        }
                    }
                }
            }
        })
    //TAB.EVENTS
        .state('tab.events', {
            url: '/events',
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/events/events.html',
                    controller: 'EventsCtrl',
                    resolve: {
                        ResolveEvents: function (FactoryEvents, $ionicLoading, $rootScope) {
                            $rootScope.alert = null;
                            $ionicLoading.show();

                            return FactoryEvents.populate().then(function (response) {
                                $ionicLoading.hide();
                                return response.data;

                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })
    //TAB.EVENT
        .state('tab.event', {
            url: '/events',
            params: { event: null },
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/events/event.html',
                    controller: 'EventCtrl',
                    resolve: {
                        ResolveEvent: function ($stateParams, Constant) {
                            return $stateParams.event;
                        }
                    }
                }
            }
        })
    //TAB.EVENT-ADDONS
        .state('tab.event-addons', {
            url: '/events/addons',
            params: { title: null, created: null, unit: null, introtext: null },
            views: {
                'tab-lectures': {
                    templateUrl: 'templates/events/event-addons.html',
                    controller: 'EventAddonsCtrl',
                    resolve: {
                        ResolveEventAddons: function ($stateParams) {
                            return $stateParams;
                        }
                    }
                }
            }
        })
    //TAB.PROCSELETS
        .state('tab.procselets', {
            url: '/procselets',
            views: {
                'tab-procselets': {
                    templateUrl: 'templates/procselets/procselets.html',
                    controller: 'ProcseletsCtrl',
                    resolve: {
                        ResolveProcselets: function (FactoryProcseletsLocal, $ionicLoading, $rootScope) {
                            $rootScope.alert = null;
                            $ionicLoading.show();

                            return FactoryProcseletsLocal.populateTbProcselets().then(function (response) {
                                $ionicLoading.hide();
                                return response.data;

                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })

        .state('tab.procselets-categories', {
            url: '/procselets/categories',
            params: { units: null, status: null, stitle: null },
            views: {
                'tab-procselets': {
                    templateUrl: 'templates/procselets/procselet-categories.html',
                    controller: 'ProcseletsCategoriesCtrl',
                    resolve: {
                        ResolveProcseletsCategories: function (FactoryProcselets, $stateParams, $ionicLoading, $rootScope) {
                            $ionicLoading.show();
                            
                            var units = $stateParams.units.map(function (e) { return e.id; });
                            return FactoryProcselets.populateByLocationStatus({ units: units, status: $stateParams.status }).then(function (response) {
                                $ionicLoading.hide();
                                response.stitle = $stateParams.stitle; 
                                return response;
                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })

        .state('tab.procselets-files', {
            url: '/procselets/files',
            params: { category: null, stitle: null },
            views: {
                'tab-procselets': {
                    templateUrl: 'templates/procselets/procselet-files.html',
                    controller: 'ProcseletsFilesCtrl',
                    resolve: {
                        ResolveProcseletsFiles: function ($stateParams) {
                            $stateParams.category.files = (typeof ($stateParams.category.files) === 'string') ? JSON.parse($stateParams.category.files) : $stateParams.category.files;
                            return $stateParams;
                        }
                    }
                }
            }
        })

        .state('tab.birthdays', {
            url: '/birthdays',
            views: {
                'tab-birthdays': {
                    templateUrl: 'templates/birthdays/birthdays.html',
                    controller: 'BirthdaysCtrl',
                    resolve: {
                        ResolveBirthDays: function (FactoryBirthdays, $ionicLoading, $rootScope) {
                            $rootScope.alert = null;
                            $ionicLoading.show();
                            return FactoryBirthdays.populate().then(function (response) {
                                $ionicLoading.hide();
                                return response.data;

                            }, function (erro) {
                                $ionicLoading.hide();
                                return $rootScope.alert = { type: "", message: erro };
                            });

                            $ionicLoading.hide();
                        }
                    }
                }
            }
        })

        .state('tab.profile', {
            url: '/profile',
            cache: false,
            views: {
                'tab-profile': {
                    templateUrl: 'templates/profile/profile.html',
                    controller: 'ProfileCtrl',
                    resolve: {
                        ResolveProfile: function (FactoryProfileLocal, $ionicLoading, $rootScope) {
                            return FactoryProfileLocal.getTbProfile();
                        }
                    }
                }
            }
        })
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});