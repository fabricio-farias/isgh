angular.module('isgh.EventsCtrl', ['ngSanitize'])

    .controller(
        'EventsCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveEvents, FactoryEvents, Utility) {

            $scope.events = ResolveEvents;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.hasHeaderFooter = (Constant.isAndroid) ? 'has-footer' : 'has-header';
            $scope.has_message = (ResolveEvents.message || ResolveEvents.length == 0) ? true : false;
            $scope.message = (ResolveEvents.message) ? ResolveEvents.message : 'Não há Eventos para exibir no momento';

            var init = function(){
                prepareDocument($scope.events);
            };

            var prepareDocument = function(data){
                if(typeof(data.length) === 'undefined') return;

                data.map(function(item){
                    item.unit = (item.unit) ? item.unit : 'ISGH';
                    item.unit_color = Utility.getUnitColor(item.unit, 'app-units-');
                    item.unit_color_button = Utility.getUnitColor(item.unit, 'button-');
                    item.unit_color_item = Utility.getUnitColor(item.unit, 'item-');
                    item.date_relative = $filter('DateRelativeFilter')(item.date);
                    return item;
                });

                return data;
            };


            // refresh na pagina sera incluido em breve
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryEvents.refresh().then(function (response) {
                    $scope.events = [];
                    $scope.has_message = false;
                    $scope.events = prepareDocument(response.data);
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                    $scope.has_message = true;
                    $scope.message = 'Não há Eventos para exibir no momento';
                    $scope.events = [];
                });
            };

            init();

        })

    .controller(
        'EventCtrl',
        function ($scope, $filter, Constant, ResolveEvent) {

            $scope.event = ResolveEvent;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.hasHeaderFooter = (Constant.isAndroid) ? 'has-footer' : 'has-header';
            $scope.has_introtext = (ResolveEvent.introtext !== 'undefined') ? true : false;

        })

    .controller(
        'EventAddonsCtrl',
        function ($scope, $rootScope, $sce, $filter, $state, Constant, ResolveEventAddons, $ionicScrollDelegate) {

            $scope.addon = ResolveEventAddons.event;

            //ESCONDE TABS ENQUANTO A VIEW É tab.lecture-addons
            $rootScope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = false;
                if ($state.current.name === 'tab.event-addons') {
                    $rootScope.hideTabs = true;
                }
            });

            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
            };

            $scope.renderHTML = function (html) {
                if (html) {
                    $ionicScrollDelegate.$getByHandle('maddonScroll').zoomTo(1);
                    return $sce.trustAsHtml(html);
                }
            };
        });
