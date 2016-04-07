angular.module('isgh.EventsCtrl', ['ngSanitize'])

    .controller(
        'EventsCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveEvents, FactoryEvents) {

            $scope.url_site = Constant.url_site;
            $scope.events = ResolveEvents;

            // refresh na pagina sera incluido em breve
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryEvents.refresh().then(function (response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.events = response.data;
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                });
            
                // $scope.$broadcast('scroll.refreshComplete');
            }

        })

    .controller(
        'EventCtrl',
        function ($scope, $filter, Constant, ResolveEvent) {

            $scope.event = ResolveEvent;
            $scope.url_intranet = Constant.url_intranet;

        })

    .controller(
        'EventAddonsCtrl',
        function ($scope, $sce, $filter, Constant, ResolveEventAddons, $ionicScrollDelegate) {

            $scope.addon = ResolveEventAddons.event;
            $scope.url_intranet = Constant.url_intranet;

            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
            }

            $scope.renderHTML = function (html) {
                if (html) {
                    $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
                    return $sce.trustAsHtml(html);
                }
            };
        });
