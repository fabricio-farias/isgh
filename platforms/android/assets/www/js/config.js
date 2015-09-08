// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, $ionicConfigProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['.*']);
  // $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  
    
  // $httpProvider.defaults.useXDomain = true;
  // $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl',
        resolve: {
          init: function (News) {
            return News.all().then(function (response) {
              angular.forEach(response, function (item) {
                item.images = JSON.parse(item.images);
              })

              return response;
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
          init: function (LecturesEvents) {
            return LecturesEvents.all().then(function (response) {
              angular.forEach(response, function (item) {
                item.status = JSON.parse(item.status);
              })

              return response;
            });
          }
        }
      }
    }
  })
  
  .state('tab.lecture-event', {
    url: '/lectures-events/:id',
    views: {
      'tab-lectures-events': {
        templateUrl: 'templates/lecture-event.html',
        controller: 'LectureeventCtrl',
        resolve: {
          init: function (LecturesEvents, $stateParams) {
            return LecturesEvents.get($stateParams.id).then(function (response) { 
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
        controller: 'SelectionprocessesCtrl'
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