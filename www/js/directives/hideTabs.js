angular.module("hideTabs", []);
angular.module("hideTabs").directive('hideTabs', function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, $el) {
            $scope.$on("$ionicView.beforeEnter", function () {
                $rootScope.hideTabs = true;
            });
            $scope.$on("$ionicView.beforeLeave", function () {
                $rootScope.hideTabs = false;
            });
        }
        // restrict: 'A',
        // link: function($scope, $el) {
        //     $rootScope.hideTabs = 'tabs-item-hide';
        //     $scope.$on('$destroy', function() {
        //         $rootScope.hideTabs = '';
        //     });
        // }
    };
});