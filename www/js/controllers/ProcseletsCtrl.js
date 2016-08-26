angular.module('isgh.ProcseletsCtrl', ['ngSanitize'])

    .controller(
        'ProcseletsCtrl',
        function ($scope, $filter, $rootScope, Constant, ResolveProcselets, FactoryProcseletsLocal, Utility) {

            $scope.locations = ResolveProcselets;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.has_message = (ResolveProcselets.message || ResolveProcselets.length == 0) ? true : false;
            $scope.has_header = (Constant.isIOS) ? 'has-header' : '';
            $scope.message = (ResolveProcselets.message) ? ResolveProcselets.message : 'Não há Processos para exibir no momento';

            var init =  function(){
                prepareDocument($scope.locations);
            };

            var prepareDocument = function(data){
                if(typeof(data.length) === 'undefined') return;

                data.map(function(item){
                    item.status = (typeof (item.status) === 'string') ? JSON.parse(item.status) : item.status;
                    item.units = (typeof (item.units) === 'string') ? JSON.parse(item.units) : item.units;
                    if(typeof (item.units) === 'object'){
                        item.units.map(function(i){
                            i.short_title_color = Utility.getUnitColor(i.short_title);
                            return i;
                        });
                    }
                    return item;
                });

                return data;
            };

            // refresh na pagina sera incluido em breve
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryProcseletsLocal.refreshTbProcselets().then(function (response) {
                    $scope.locations = [];
                    $scope.has_message = false;
                    $scope.locations = prepareDocument(response.data);
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                    $scope.has_message = true;
                    $scope.message = 'Não há Processos para exibir no momento';
                    $scope.locations = [];
                });

            };

            init();
        })

    .controller(
        'ProcseletsCategoriesCtrl',
        function ($scope, $timeout, $filter, $ionicScrollDelegate, $interpolate, Constant, ResolveProcseletsCategories, Utility) {

            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.hasHeaderFooter = (Constant.isAndroid) ? '' : 'has-header';

            var init = function(){
                checktotalCategories();
            };

            var prepareDocument = function(data){
                if(typeof(data) === 'undefined') return;
                var exp = /\d{1,2}\/\d{1,2}\/\d{4}/;
                
                if(data.length > 0){
                    data.map(function(item){
                        if(exp.test(item.created) === false){
                            item.created = new Date(item.created);
                            item.created = $filter('date')(item.created, 'dd/MM/yyyy');
                        }
                        item.unit_color = Utility.getUnitColor(item.unit, 'app-units-');
                        return item;
                    });
                }else{
                    if(exp.test(data.created) === false){
                        data.created = new Date(data.created);
                        data.created = $filter('date')(data.created, 'dd/MM/yyyy');
                    }

                    data.unit_color = Utility.getUnitColor(data.unit, 'app-units-');
                }

                return data;
            }

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
            var limit = parseInt(Constant.ionInfiniteScrollConfig.interval);
            var offset = 0;

            
            $scope.loadMoreCategories = function () {
                if (total > limit)
                {
                    for (var i = offset; i < limit; i++){
                        $scope.categories.push(prepareDocument(ResolveProcseletsCategories.data[i]));
                    }
                    
                    $timeout(function () {
                        offset += parseInt(Constant.ionInfiniteScrollConfig.interval);
                        limit += parseInt(Constant.ionInfiniteScrollConfig.interval);
                    }, 100);
                }
                else
                {
                    $scope.categories = prepareDocument(ResolveProcseletsCategories.data);
                    $scope.checkTCats = false;
                }
                
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            var checktotalCategories = function () {
                $scope.checkTCats  = ($scope.categories.length >= total) ? false : true;
            };

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

            init();
            ////$ionicConfig.backButton.text(ResolveProcselet.lname);
        })

    .controller(
        'ProcseletsFilesCtrl',
        function ($scope, $rootScope, $filter, Constant, ResolveProcseletsFiles, Utility) {

            $scope.files = ResolveProcseletsFiles.category;
            $scope.stitle = ResolveProcseletsFiles.stitle;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.hasHeaderFooter = (Constant.isAndroid) ? '' : 'has-header';

            var init = function(){
                prepareDocument($scope.files);
            };

            var prepareDocument = function(data){

                if(typeof(data) === 'undefined') return;
                var exp = /\d{1,2}\/\d{1,2}\/\d{4}/;

                data.files.forEach(function(item){
                    item.icon = (item.link_external !== "") ? 'ion-link positive' : 'ion-document-text assertive';
                    if(exp.test(item.date) === false){
                        item.date = new Date(item.date);
                        item.date = $filter('date')(item.date, 'dd/MM/yyyy');
                    }

                    return item;
                });

                data.unit_color = Utility.getUnitColor(data.unit, 'app-units-')

                return data;
            };

            var openPDF = function (url) {
                var nUrl = ($rootScope.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            };

            $scope.externalLink = function (file) {
                if (file) {
                    var options = ($rootScope.isAndroid) ? 'location=yes' : 'location=no';
                    return (file.link_external !== "") ? window.open(file.link_external, "_blank", options) : openPDF(Constant.url_procseletivo + 'phocadownload/' + file.filename);
                }
            };

            init();

        });