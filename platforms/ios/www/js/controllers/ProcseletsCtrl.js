angular.module('isgh.ProcseletsCtrl', ['ngSanitize'])

    .controller(
        'ProcseletsCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveProcselets, FactoryProcseletsLocal) {

            $scope.url_site = Constant.url_site;
            $scope.locations = ResolveProcselets.map(function (item) {
                item.status = JSON.parse(item.status);
                item.units = JSON.parse(item.units);
                return item;
            });
            
            // refresh na pagina sera incluido em breve
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryProcseletsLocal.refreshTbProcselets().then(function (response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.locations = response.data.map(function (item) {
                        item.status = JSON.parse(item.status);
                        item.units = JSON.parse(item.units);
                        return item;
                    });
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                });

            }
        })

    .controller(
        'ProcseletsCategoriesCtrl',
        function ($scope, $timeout, $ionicScrollDelegate, $interpolate, Constant, ResolveProcseletsCategories) {

            $timeout(function() {
                if (ionic.Platform.isAndroid()) {
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, 46);
                } else {
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, 52);
                }
            }, 100);

            $scope.categories = [];
            $scope.distance = Constant.ionInfiniteScrollConfig.distance;
            var total = ResolveProcseletsCategories.data.length;
            var limit = Constant.ionInfiniteScrollConfig.interval;
            var offset = 0;

            
            $scope.loadMoreCategories = function () {
                if (total > limit)
                {
                    for (var i = offset; i < limit; i++){
                        ResolveProcseletsCategories.data[i].created = new Date(ResolveProcseletsCategories.data[i].created);
                        $scope.categories.push(ResolveProcseletsCategories.data[i]);
                    }
                    
                    $timeout(function () {
                        offset += Constant.ionInfiniteScrollConfig.interval;
                        limit += Constant.ionInfiniteScrollConfig.interval;
                    }, 100);
                }
                else
                {
                    $scope.categories = ResolveProcseletsCategories.data.map(function (item) {
                        item.created = new Date(item.created);
                        return item;
                    });
                }
                
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            
            $scope.checktotalCategories = function () {
                return ($scope.categories.length >= total) ? false : true;
            }

            $scope.stitle = ResolveProcseletsCategories.stitle;
            $scope.searchQuery = { value: null }
            $scope.$watch(
                $interpolate('{{searchQuery.value}}'),
                function(response) {
                    response = response.toLowerCase();
                    $scope.filterProcselet = function(category) {
                        return ( (category.category).toLowerCase().indexOf(response) >= 0 || (category.unit).toLowerCase().indexOf(response) >= 0 || (category.code).toLowerCase().indexOf(response) >= 0); 
                    }
                }
            );

            

            ////$ionicConfig.backButton.text(ResolveProcselet.lname);
        })

    .controller(
        'ProcseletsFilesCtrl',
        function ($scope, $rootScope, Constant, ResolveProcseletsFiles) {

            $scope.files = ResolveProcseletsFiles.category;
            $scope.stitle = ResolveProcseletsFiles.stitle;

            $scope.parseDate = function (date) {
                return new Date(date);
            }

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            }

            $scope.externalLink = function (file) {
                if (file) {
                    var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                    return (file.link_external !== "") ? window.open(file.link_external, "_blank", options) : openPDF(Constant.url_procseletivo + 'phocadownload/' + file.filename);
                }
            }

            $scope.getIcon = function (file) {
                if (file) {
                    return (file.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive';
                }
            }
        })