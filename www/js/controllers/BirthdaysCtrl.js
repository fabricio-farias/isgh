angular.module('isgh.BirthdaysCtrl', ['ngSanitize'])

    .controller(
        'BirthdaysCtrl',
        function ($scope, $filter, $state, $rootScope, $timeout, $ionicLoading, ResolveBirthDays, FactoryBirthdays, Constant, Utility) {

            $scope.birthdays = ResolveBirthDays;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.has_header = (Constant.isIOS) ? 'has-header' : '';
            $scope.has_message = (ResolveBirthDays.message || ResolveBirthDays.length == 0) ? true : false;
            $scope.message = (ResolveBirthDays.message) ? ResolveBirthDays.message : 'Não há Aniversariantes para exibir no momento';
            var filterBarInstance;

            var init = function(){
                prepareDocument($scope.birthdays);
            };

            var prepareDocument = function(data){
                if(typeof (data) === 'undefined') return;

                data.map(function(item){
                    item.dsc_alias = $filter('CapNameFilter')(item.dsc_nome);
                    item.dsc_alias = $filter('limitTo')(item.dsc_alias, 2);
                    item.unit_color = Utility.getUnitColor(item.dsc_filial);
                    return item;
                });

                return data;
            }

            // REFRESH NOTICIAS
            $scope.doRefresh = function () {
                $rootScope.alert = null;
                FactoryBirthdays.refresh().then(function (response) {
                    $scope.birthdays = [];
                    $scope.has_message = false;
                    $scope.birthdays = prepareDocument(response.data);
                    $scope.reset();
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                    $scope.has_message = true;
                    $scope.message = 'Não há Aniversariantes para exibir no momento';
                    $scope.birthdays = [];
                });
            };
            
            $scope.reset = function () {
                $scope.data = { "day": "", "month": "" };
            }; $scope.reset();

            $scope.inputDays = [
                '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
                '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
            ];

            $scope.inputMonths = [
                { id: '01', desc: 'Janeiro' },
                { id: '02', desc: 'Fevereiro' },
                { id: '03', desc: 'Março' },
                { id: '04', desc: 'Abril' },
                { id: '05', desc: 'Maio' },
                { id: '06', desc: 'Junho' },
                { id: '07', desc: 'Julho' },
                { id: '08', desc: 'Agosto' },
                { id: '09', desc: 'Setembro' },
                { id: '10', desc: 'Outubro' },
                { id: '11', desc: 'Novembro' },
                { id: '12', desc: 'Dezembro' }
            ];

            $scope.searchBirthday = function (data) {
                if (data) {
                    $ionicLoading.show();
                    $rootScope.alert = null;

                    if (filterBarInstance) {
                        filterBarInstance();
                        filterBarInstance = null;
                    }

                    FactoryBirthdays.birthdaysWSgetByDate(data).then(function (response) {
                        $ionicLoading.hide();

                        $scope.birthdays = [];
                        $scope.birthdays = prepareDocument(response.data);
                    }, function (erro) {
                        $ionicLoading.hide();
                        $rootScope.alert = erro;
                    });

                }

            };

            init();
        });