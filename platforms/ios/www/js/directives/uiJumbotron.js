angular.module("uiJumbotron", []);
angular.module("uiJumbotron").run(function ($templateCache) {
    $templateCache.put("templates/directives/jumbotron.html", '<div class="jumbotron"><h1><i class="{{icon}}"></i></h1><p ng-transclude></p></div>');
});

angular.module("uiJumbotron").directive("uiJumbotron", function ($sce) {
    return {
        templateUrl: $sce.trustAsResourceUrl("templates/directives/jumbotron.html"),
        restrict: "AE",
        replace: true,
        scope: {
            icon: "@"
        },
        transclude: true
    }
})