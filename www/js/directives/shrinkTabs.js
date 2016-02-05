angular.module("shrinkTabs", ['ionic']);
angular.module("shrinkTabs").directive('shrinkTabs', function ($rootScope, $document, $ionicScrollDelegate) {
    var fadeAmt;
    
    var shrink = function (e, c, amt, max) {

        amt = Math.min(44, amt);
        fadeAmt = 1 - amt / 44;
        
        ionic.requestAnimationFrame(function () {
            c.style.top = (ionic.Platform.isAndroid() === true) ? (93 - amt) + 'px' : c.style.top = (44 - amt) + 'px';
            e.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
            for(var i = 0, j = e.children.length; i < j; i++) {
                e.children[i].style.opacity = fadeAmt;
            }

        });
    };
    
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            var start = $scope.$eval($attr.shrinkTabs) || 0;
            var tabs = $document[0].body.querySelector('#tab-android .tabs');

            if (tabs) { var tabsHeight = tabs.offsetHeight; }
            
            $element.bind('scroll', function(e) {
                var scrollTop = null;

                scrollTop = (e.detail) ? e.detail.scrollTop : e.target.scrollTop;

                if (scrollTop > start) {
                    var shrinkAmt = tabsHeight - Math.max(0, (0 + tabsHeight) - scrollTop);
                    if (tabs) {
                        shrink(tabs, $element[0], shrinkAmt, tabsHeight);
                        start = scrollTop;
                    }
                } else {
                    if (tabs) { 
                        shrink(tabs, $element[0], 0, tabsHeight);
                        start = scrollTop;
                    }
                }
                
            });
            
        }
    };
});