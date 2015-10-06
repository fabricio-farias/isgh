// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app.config(function ($stateProvider, $urlRouterProvider,  $httpProvider, $sceDelegateProvider, $ionicConfigProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['.*']);

  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  // $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
  // $ionicConfigProvider.tabs.position('bottom');
  // $ionicConfigProvider.tabs.style('standard');
    
    
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // .state('error', {
    //   url: "/error/:title/:message/:icon",
    //   templateUrl: "templates/error.html",
    //   controller: function ($scope, $stateParams) {
    //     $scope.title = $stateParams.title;
    //     $scope.message = $stateParams.message;
    //     $scope.icon = $stateParams.icon;
    //   }
    // })
  
  // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: function () {
        if (ionic.Platform.isAndroid()) {
          return  "templates/tabs-android.html";
        }
        return "templates/tabs-ios.html";
      }
    })

  // Each tab has its own nav history stack:

    .state('tab.news', {
      url: '/news',
      views: {
        'tab-news': {
          templateUrl: 'templates/tab-news.html',
          controller: 'NewsCtrl',
          resolve: {
            init: function (News, $ionicLoading) {
              $ionicLoading.show();
              return News.all().then(function (response) {
                angular.forEach(response, function (item) {
                  item.images = JSON.parse(item.images);
                });
                $ionicLoading.hide();
                return response;
              }, function (erro) {
                $ionicLoading.hide();
                console.log(erro);
              });
            }
          }
        }
      }
    })

    .state('tab.lectures-events', {
      url: '/lectures-events',
      views: {
        'tab-lectures-events': {
          templateUrl: 'templates/tab-lectures-events.html',
          controller: 'LectureseventsCtrl',
          resolve: {
            init: function (LecturesEvents, $ionicLoading) {
              $ionicLoading.show();
              return LecturesEvents.all().then(function (response) {
                angular.forEach(response, function (item) {
                  item.status = JSON.parse(item.status);
                });
                $ionicLoading.hide();
                return response;
              }, function (erro) {
                $ionicLoading.hide();
                console.log(erro);
              });
            }
          }
        }
      }
    })

    .state('tab.lecture-event', {
      url: '/lectures-events/:id/:planning',
      views: {
        'tab-lectures-events': {
          templateUrl: 'templates/lecture-event.html',
          controller: 'LectureeventCtrl',
          resolve: {
            init: function (LecturesEvents, $stateParams, Constant, EmailSender, $state) {
              return LecturesEvents.get($stateParams.id).then(function (response) {

                if ($stateParams.planning > 0) {
                  var html = '';
                  html += 'Seu nome: \n';
                  html += 'Telefone: \n';
                  html += 'Curso(s) de interesse: '+response.title+'\n';
                  html += 'Município de interesse: \n';
                  
                  EmailSender.setSubject("Cursos 2015 Cadastro de Interessado");
                  EmailSender.setBody(html);
                  EmailSender.setTo(Constant.emails.cursos.to);
                  EmailSender.setCc(Constant.emails.cursos.cc);
                  EmailSender.send();

                  $state.go($state.current, $stateParams, { reload: false, inherit: false });
                }
                
                response.status = JSON.parse(response.status);
                return response;

              });
            }
          }
        }
      }
    })

    .state('tab.selection-processes', {
      url: '/selection-processes',
      views: {
        'tab-selection-processes': {
          templateUrl: 'templates/tab-selection-processes.html',
          controller: 'SelectionProcessesCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/news');

});