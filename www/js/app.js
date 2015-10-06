// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('isgh', ['ionic', 'ionic.service.core', 'ngCordova', 'door3.css', 'isgh.Constant', 'isgh.ionicLoadingConfig', 'isgh.emailAPIprovider', 'isgh.dbAPIservices', 'isgh.NewsCtrl', 'isgh.LectureseventsCtrl', 'isgh.SelectionProcessesCtrl', 'isgh.AccountCtrl', 'isgh.EllipsisFilter', 'isgh.CapcaseFilter', 'angularMoment', 'isgh.DateRelativeFilter', 'isgh.newsAPIservices', 'isgh.lectureseventsAPIservices','uiAlertBar','uiJumbotron'])

  .run(function ($ionicPlatform, $cordovaInAppBrowser, $cordovaSQLite, amMoment, DB) {

    $ionicPlatform.ready(function () {
       
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
      
      DB.init();
      amMoment.changeLocale('pt');

    });
  });

