angular.module('isgh.NewsFilter', []).filter('NewsFilter', function(Constant, $ionicLoading, $timeout) {
  return function (text) {
    if (text !== undefined) { 
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      
        if (String(text) !== undefined) {
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
        }
        

        var str = String(text).replace(/src=\"/igm, 'src="' + Constant.url_intranet);
        var str1 = str.replace(/width=\"300\"/igm, 'width');
        //var str2 = str1.replace(/href=\"/igm, 'onClick=myFunction() ' + 'href="');
        return str1;

    }
    

   }
 })