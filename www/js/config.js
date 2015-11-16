// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, $ionicConfigProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['.*']);

  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  //$ionicConfigProvider.scrolling.jsScrolling(false);
  // $ionicConfigProvider.tabs.position('bottom');
  // $ionicConfigProvider.tabs.style('standard');
    
    
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

    .state('tab.news', {
      url: '/news',
      views: {
        'tab-news': {
          templateUrl: 'templates/news/news.html',
          controller: 'NewsCtrl',
          resolve: {
            ResolveNews: function (FactoryNews, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              return FactoryNews.populate().then(function (response) {
                $ionicLoading.hide();
                return response.data;

              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.lectures', {
      url: '/lectures',
      views: {
        'tab-lectures': {
          templateUrl: 'templates/lectures/lectures.html',
          controller: 'LecturesCtrl',
          resolve: {
            ResolveLectures: function (FactoryLectures, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              return FactoryLectures.populate().then(function (response) {
                $ionicLoading.hide();
                return response.data;

              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.lecture', {
      url: '/lectures/:id/:planning',
      views: {
        'tab-lectures': {
          templateUrl: 'templates/lectures/lecture.html',
          controller: 'LectureCtrl',
          resolve: {
            ResolveLecture: function (FactoryLectures, $stateParams, Constant, EmailSender, $state) {
              return FactoryLectures.get($stateParams.id).then(function (response) {
                var year = new Date();

                if ($stateParams.planning > 0) {
                  var html = '';
                  html += 'Seu nome: \n';
                  html += 'Telefone: \n';
                  html += 'Curso(s) de interesse: ' + response.title + '\n';
                  html += 'Município de interesse: \n';

                  EmailSender.setSubject("Cursos " + year.getFullYear() + " Cadastro de Interessado");
                  EmailSender.setBody(html);
                  EmailSender.setTo(Constant.emails.cursos.to);
                  EmailSender.setCc(Constant.emails.cursos.cc);
                  EmailSender.send();

                  $state.go($state.current, $stateParams, { reload: false, inherit: false });
                }

                response.status = JSON.parse(response.status);
                if (response.widgetkit_module > 0) {
                  response.widgetkit = JSON.parse(response.widgetkit);
                }

                return response;

              });
            }
          }
        }
      }
    })

    .state('tab.events', {
      url: '/events',
      views: {
        'tab-lectures': {
          templateUrl: 'templates/events/events.html',
          controller: 'EventsCtrl',
          resolve: {
            ResolveEvents: function (FactoryEvents, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              return FactoryEvents.populate().then(function (response) {
                $ionicLoading.hide();
                return response.data;

              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.event', {
      url: '/events/:id',
      views: {
        'tab-lectures': {
          templateUrl: 'templates/events/event.html',
          controller: 'EventCtrl',
          resolve: {
            ResolveEvent: function (FactoryEvents, $stateParams, Constant) {
              return FactoryEvents.get($stateParams.id).then(function (response) {
                return response;
              });
            }
          }
        }
      }
    })

    .state('tab.procselets', {
      url: '/procselets',
      views: {
        'tab-procselets': {
          templateUrl: 'templates/procselets/procselets.html',
          controller: 'ProcseletsCtrl',
          resolve: {
            ResolveProcselets: function (FactoryProcselets, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              return FactoryProcselets.populate().then(function (response) {
                $ionicLoading.hide();
                return response.data;

              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.procselets-categories', {
      url: '/procselets/categories/:locid/:status',
      views: {
        'tab-procselets': {
          templateUrl: 'templates/procselets/procselet-categories.html',
          controller: 'ProcseletsCategoriesCtrl',
          resolve: {
            ResolveProcseletsCategories: function (FactoryProcselets, $stateParams, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              var status = JSON.parse($stateParams.status);
              return FactoryProcselets.getProcSeletsByLoc($stateParams.locid, status.id).then(function (response) {
                $ionicLoading.hide();
                return { data: response, sname: status.name };

              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.procselets-files', {
      url: '/procselets/files/:catid/:sname',
      views: {
        'tab-procselets': {
          templateUrl: 'templates/procselets/procselet-files.html',
          controller: 'ProcseletsFilesCtrl',
          resolve: {
            ResolveProcseletsFiles: function (FactoryProcselets, $stateParams, $ionicLoading, $rootScope) {
              $ionicLoading.show();

              return FactoryProcselets.getProcSeletsFiles($stateParams.catid).then(function (response) {
                $ionicLoading.hide();
                return { data: response, sname: $stateParams.sname };
                
              }, function (erro) {
                $ionicLoading.hide();
                return $rootScope.alert = { type: "", message: erro };
              });
            }
          }
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html'
        }
      }
    })
    
    
    

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/news');

});