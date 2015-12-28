angular.module('isgh.ProcseletsCtrl', ['ngSanitize'])

    .controller('ProcseletsCtrl', function ($scope, $filter, $rootScope, Constant, ResolveProcselets, FactoryProcseletsLocal) {

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
                $rootScope.alert = { type: "", message: erro };
            });

        }

    })

    .controller('ProcseletsCategoriesCtrl', function ($scope, $ionicFilterBar, Constant, ResolveProcseletsCategories) {

        $scope.categories = ResolveProcseletsCategories.data

        $scope.showFilterBar = function () {
            $ionicFilterBar.show({
                cancelText: 'Cancelar',
                items: $scope.categories,
                update: function (filtered) {
                    $scope.categories = filtered;
                },
                filterProperties: 'category'
            });
        };

        $scope.stitle = ResolveProcseletsCategories.stitle;
        ////$ionicConfig.backButton.text(ResolveProcselet.lname);
		
    })

    .controller('ProcseletsFilesCtrl', function ($scope, $ionicFilterBar, Constant, ResolveProcseletsFiles) {
        
        $scope.files = ResolveProcseletsFiles.category;

        $scope.showFilterBar = function () {
            $ionicFilterBar.show({
                cancelText: 'Cancelar',
                items: $scope.files.files,
                update: function (filtered) {
                    $scope.files.files = filtered;
                }
            });
        };

        $scope.stitle = ResolveProcseletsFiles.stitle;

        $scope.parseDate = function (date) {
            return new Date(date);
        }

        $scope.externalLink = function (file) {
            if (file) {
                return (file.link_external !== "") ? window.open(file.link_external, "_system") : window.open(Constant.url_procseletivo + 'phocadownload/' + file.filename, "_system");
            }
        }

        $scope.getIcon = function (file) {
            if (file) {
                return (file.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive';
            }
        }
    })