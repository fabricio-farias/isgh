angular.module("hideTabs", []);
angular.module("hideTabs").directive('hideTabs', function ($rootScope, $state) {
    return {
        restrict: 'A',
        link: function ($scope, $el) {
            //Controller referente a view decide se exibe ou não as tabs
            // $scope.$on("$ionicView.beforeEnter", function () {
            //     $rootScope.hideTabs = true;
            // });
            
            // $scope.$on("$ionicView.beforeLeave", function () {
            //     $rootScope.hideTabs = false;
            // });
        }
    };
});