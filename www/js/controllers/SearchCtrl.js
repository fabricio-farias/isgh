angular.module('isgh.SearchCtrl', ['ngSanitize'])

    .controller(
        'SearchCtrl',
        function ($scope, $filter, $state, $timeout, $ionicTabsDelegate, $stateParams, $rootScope, Constant) {
            $scope.url_intranet = Constant.url_intranet;
            $scope.url_site = Constant.url_site;
            $scope.tab = $stateParams.tab;
            $scope.inputSearch = { value: null }; //precisa ser objeto para funcionar

            $timeout(function () {
                $ionicTabsDelegate.$getByHandle('searchtabs').select($stateParams.tab);
            }, 100);

            $scope.clearSearch = function() {
                $scope.inputSearch.value = null;
            }

            
        })

    .controller(
        'SearchCtrlNews',
        function ($scope, $rootScope, $filter, $timeout, FactoryNews, $interpolate, Constant) { 
            // BANCO LOCAL
            $scope.sNews = [];
            $scope.distance = Constant.ionInfiniteScrollConfig.distance;

            var total = null;
            var offset = 0;
            var limit = Constant.ionInfiniteScrollConfig.interval;

            FactoryNews.total().then(function(response) {
                total = response.rows.item(0).total;
            });

            $scope.loadMoreNews = function () {
                FactoryNews.all(offset, limit).then(function (response) {
                    response.map(function (item) {
                        item.images = JSON.parse(item.images);
                        $scope.sNews.push(item);
                    });
                });
                $timeout(function () {
                    offset += Constant.ionInfiniteScrollConfig.interval;
                    limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            $scope.checkTotalNews = function () {
                return ($scope.sNews.length >= total) ? false : true;
            }

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    $scope.filtering = (response !== null) ? response : "";
                }
            );
        })

    .controller(
        'SearchCtrlLectures',
        function ($scope, $filter, $timeout, $interpolate, FactoryLectures) { 
            // BANCO LOCAL
            $scope.sLectures = [];

            FactoryLectures.all().then(function (response) {
                $scope.sLectures = response.map(function (item) {
                    item.status = JSON.parse(item.status);
                    return item;
                });
            });


            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    $scope.filtering = (response !== null) ? response : "";
                }
            );
        })

    .controller(
        'SearchCtrlEvents',
        function ($scope, $filter, $timeout, $interpolate, FactoryEvents) { 
            // BANCO LOCAL
            $scope.sEvents = [];

            FactoryEvents.all().then(function (response) {
                $scope.sEvents = response;
            });

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    $scope.filtering = (response !== null) ? response : "";
                }
            );
        })

    .controller(
        'SearchCtrlProcselets',
        function ($scope, $filter, $timeout, FactoryProcselets, $interpolate, Constant) { 
            // BANCO LOCAL
            $scope.sProcselets = [];
            $scope.distance = Constant.ionInfiniteScrollConfig.distance;
            $scope.procseletsTitles = Constant.procseletsTitles;

            var total = null;
            var offset = 0;
            var limit = Constant.ionInfiniteScrollConfig.interval;

            FactoryProcselets.total().then(function (response) {
                total = response.rows.item(0).total
            });

            $scope.loadMoreProcselets = function () {
                FactoryProcselets.all(offset, limit).then(function (response) {
                    response.map(function (item) {
                        $scope.sProcselets.push(item);
                    });
                });
                $timeout(function () {
                    offset += Constant.ionInfiniteScrollConfig.interval;
                    limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            $scope.checkTotalProcselets = function () {
                return ($scope.sProcselets.length >= total) ? false : true;
            }

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    $scope.filtering = (response !== null) ? response : "";
                }
            );
        })

    .controller(
        'SearchCtrlBirthdays',
        function ($scope, $filter, $timeout, FactoryBirthdays, $interpolate, Constant) { 
            // BANCO LOCAL
            $scope.sBirthdays = [];
            $scope.distance = Constant.ionInfiniteScrollConfig.distance;

            var total = null;
            var offset = 0;
            var limit = Constant.ionInfiniteScrollConfig.interval;

            FactoryBirthdays.total().then(function (response) {
                total = response.rows.item(0).total;
            });

            $scope.loadMoreBirthdays = function () {
                FactoryBirthdays.all(offset, limit).then(function (response) {
                    response.map(function (item) {
                        $scope.sBirthdays.push(item);
                    });
                });
                $timeout(function () {
                    offset += Constant.ionInfiniteScrollConfig.interval;
                    limit += Constant.ionInfiniteScrollConfig.interval;
                }, 100);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            $scope.checkTotalBirthdays = function () {
                return ($scope.sBirthdays.length >= total) ? false : true;
            }

            $scope.$watch(
                $interpolate('{{inputSearch.value}}'),
                function(response) {
                    $scope.filtering = (response !== null) ? response : "";
                }
            );
        })