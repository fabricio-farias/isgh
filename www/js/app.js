// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module(
    'isgh',
    ['ionic', 'ngCordova', 'ionic.service.core', 'ionic.service.push', 'angular.filter', 'ion-gallery', 'ionicLazyLoad', 'door3.css', 'angularMoment', 'isgh.Constant', 'isgh.ionicLoadingConfig', 'isgh.emailAPIprovider', 'isgh.utilityAPIprovider', 'isgh.dbAPIfactory', 'isgh.NewsCtrl', 'isgh.LecturesCtrl', 'isgh.EventsCtrl', 'isgh.ProcseletsCtrl', 'isgh.BirthdaysCtrl', 'isgh.SearchCtrl', 'isgh.ProfileCtrl', 'isgh.EllipsisFilter', 'isgh.CapcaseFilter', 'isgh.CapNameFilter', 'isgh.DateRelativeFilter', 'isgh.newsAPIfactory', 'isgh.lecturesAPIfactory', 'isgh.eventsAPIfactory', 'isgh.procseletsAPIfactory', 'isgh.birthdaysAPIfactory', 'isgh.profileAPIfactory', 'uiAlertBar', 'uiJumbotron', 'compileHtml', 'tabSlideBox'])

    .run(function($ionicPlatform, $rootScope, $cordovaSQLite, amMoment, DB, FactoryNews, FactoryLectures, FactoryEvents, FactoryProcselets, FactoryProcseletsLocal, FactoryBirthdays, FactoryProfileLocal) {

        function onDeviceReady() {

            DB.init();

            document.addEventListener("pause", function(event) {
                $rootScope.$broadcast('cordovaPauseEvent');
                console.log('run() -->>>>>>>>>> PAUSE <<<<<<<<<<--');
            });

            document.addEventListener("resume", function(event) {
                $rootScope.$broadcast('cordovaResumeEvent');
                //var profile = FactoryProfileLocal.getTbProfile();
                //if (profile !== undefined) {
                    //FactoryNews.refresh(); FactoryLectures.refresh(); FactoryEvents.refresh(); FactoryBirthdays.refresh(); FactoryProcseletsLocal.refreshTbProcselets(); FactoryProcselets.refresh();
                //}
                console.log('run() -->>>>>>>>>> RESUME <<<<<<<<<<--');
            });

            document.addEventListener("online", function(event) {
                $rootScope.$broadcast('cordovaOnlineEvent');
                console.log('run() -->>>>>>>>>> ONLINE <<<<<<<<<<--');
            });

            document.addEventListener("offline", function(event) {
                $rootScope.$broadcast('cordovaOfflineEvent');
                console.log('run() -->>>>>>>>>> OFFLINE <<<<<<<<<<--');
            });
        }

        $ionicPlatform.ready(function() {

            // Apenas para devices
            document.addEventListener("deviceready", onDeviceReady, false);

            // Apenas para desenvolvimento usando BROWSER
            if (Object.keys(ionic.Platform.device()).length == 0) {
                DB.init();
            }

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                screen.lockOrientation('portrait');
            }

            if (window.StatusBar) {
                StatusBar.overlaysWebView(true);
                StatusBar.styleDefault(); //preto
            }

            $rootScope.isWebView = ionic.Platform.isWebView();
            $rootScope.isIPad = ionic.Platform.isIPad();
            $rootScope.isIOS = ionic.Platform.isIOS();
            $rootScope.isAndroid = ionic.Platform.isAndroid();
            $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();
            $rootScope.iLLoader = ionic.Platform.isAndroid() ? "android" : "ios";

            amMoment.changeLocale('pt');

        });
    });

