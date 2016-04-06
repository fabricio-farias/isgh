// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module(
    'isgh',
    ['ionic', 'ionic.service.core', 'angular.filter', 'ion-gallery', 'ionicLazyLoad', 'ngCordova', 'door3.css', 'angularMoment', 'isgh.Constant', 'isgh.ionicLoadingConfig', 'isgh.emailAPIprovider', 'isgh.dbAPIservices', 'isgh.NewsCtrl', 'isgh.LecturesCtrl', 'isgh.EventsCtrl', 'isgh.ProcseletsCtrl', 'isgh.BirthdaysCtrl', 'isgh.SearchCtrl', 'isgh.ProfileCtrl', 'isgh.EllipsisFilter', 'isgh.CapcaseFilter', 'isgh.DateRelativeFilter', 'isgh.newsAPIservices', 'isgh.lecturesAPIservices', 'isgh.eventsAPIservices', 'isgh.procseletsAPIservices', 'isgh.birthdaysAPIservices', 'isgh.profileAPIservices', 'uiAlertBar', 'uiJumbotron', 'hideTabs', 'compileHtml', 'tabSlideBox'])

    .run(function($ionicPlatform, $rootScope, $cordovaSQLite, amMoment, DB) {

        function onDeviceReady() {

            //QUANDO INICI A APLICACAO RODA SO UMA VEZ
            console.log('run() -->>>>>>>>>> onDeviceReady carregar todas as informações do webserver <<<<<<<<<<--');

            //QQUANDO SAI DA APLICACAO PARA OUTRA MAS NAO FECHA
            document.addEventListener("pause", function(event) {
                // $rootScope.$broadcast('cordovaPauseEvent');
                console.log('run() -->>>>>>>>>> PAUSE The event fires when an application is put into the background. <<<<<<<<<<--');
            });

            document.addEventListener("resume", function(event) {
                // $rootScope.$broadcast('cordovaResumeEvent');
                console.log('run() -->>>>>>>>>> RESUME The resume event fires when the native platform pulls the application out from the background <<<<<<<<<<--');
            });

            document.addEventListener("online", function(event) {
                // $rootScope.$broadcast('cordovaResumeEvent');
                console.log('run() -->>>>>>>>>> ONLINE This event fires when an application goes online, and the device becomes connected to the Internet. <<<<<<<<<<--');
            });

            document.addEventListener("offline", function(event) {
                // $rootScope.$broadcast('cordovaResumeEvent');
                console.log('run() -->>>>>>>>>> OFFLINE The event fires when an application goes offline, and the device is not connected to the Internet. <<<<<<<<<<--');
            });
        }

        $ionicPlatform.ready(function() {

            DB.init();
            amMoment.changeLocale('pt');
            document.addEventListener("deviceready", onDeviceReady, false);

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                screen.lockOrientation('portrait');
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }

            $rootScope.isWebView = ionic.Platform.isWebView();
            $rootScope.isIPad = ionic.Platform.isIPad();
            $rootScope.isIOS = ionic.Platform.isIOS();
            $rootScope.isAndroid = ionic.Platform.isAndroid();
            $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();
            $rootScope.iLLoader = ionic.Platform.isAndroid() ? "android" : "ios";
            // GATILHO PARA ALTERAR A COR DA UNIDADE
            $rootScope.checkColor = function(elem, prefix) {
                var binding = (prefix !== undefined) ? prefix : "";

                var units = [
                    { name: "ISGH", color: "info" },
                    { name: "HGWA", color: "success" },
                    { name: "HRN", color: "success" },
                    { name: "HRC", color: "success" },
                    { name: "UPA", color: "danger" },
                    { name: "APS", color: "warning" },
                    { name: "SMS", color: "warning" },
                ];

                var filtered = units.filter(function(unit) {
                    var search = new RegExp(unit.name, "i");
                    return search.test(elem);
                });

                return binding + ((filtered[0]) ? filtered[0].color : 'isgh');

            }

        });
    });

