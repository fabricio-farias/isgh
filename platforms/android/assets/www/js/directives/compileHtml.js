angular.module('compileHtml', ['ionic']);
angular.module('compileHtml')
    .directive('compileHtml', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.compileHtml, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
})