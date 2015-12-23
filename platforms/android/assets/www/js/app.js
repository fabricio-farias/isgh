// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('isgh', ['ionic','ionic.service.core', 'jett.ionic.filter.bar', 'ngCordova', 'door3.css', 'isgh.Constant', 'isgh.ionicLoadingConfig', 'isgh.emailAPIprovider', 'isgh.dbAPIservices', 'isgh.NewsCtrl', 'isgh.LecturesCtrl', 'isgh.EventsCtrl', 'isgh.ProcseletsCtrl', 'isgh.BirthdaysCtrl', 'isgh.profileAPIservices', 'isgh.ProfileCtrl', 'isgh.EllipsisFilter', 'isgh.CapcaseFilter', 'angularMoment', 'isgh.DateRelativeFilter', 'isgh.newsAPIservices', 'isgh.lecturesAPIservices', 'isgh.eventsAPIservices', 'isgh.procseletsAPIservices', 'isgh.birthdaysAPIservices', 'isgh.profileAPIservices', 'uiAlertBar','uiJumbotron','hideTabs'])

  .run(function ($ionicPlatform, $cordovaInAppBrowser, $rootScope, $cordovaSQLite, amMoment, DB) {

    $ionicPlatform.ready(function () {
        console.log("**********************************************ESTOU AKI NO INICIO***********************************************");
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs) 
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        window.open = cordova.InAppBrowser.open;
      }

      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }
      
      $rootScope.isWebView = ionic.Platform.isWebView();
      $rootScope.isIPad = ionic.Platform.isIPad();
      $rootScope.isIOS = ionic.Platform.isIOS();
      $rootScope.isAndroid = ionic.Platform.isAndroid();
      $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();
      
      // GATILHO PARA ALTERAR A COR DA UNIDADE
      $rootScope.checkColor = function (elem, prefix) {
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
        
        var filtered = units.filter(function (unit) {
          var search = new RegExp(unit.name, "i");
          return search.test(elem);
        });
        
        return binding + ((filtered[0]) ? filtered[0].color : 'isgh');
        
      }
            
      DB.init();
      amMoment.changeLocale('pt');

    });
  });

