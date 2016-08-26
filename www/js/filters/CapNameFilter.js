angular.module('isgh.CapNameFilter', []).filter('CapNameFilter', function () {
    return function (string) {
        if (string) {
            strArr = string.split(" ");

            var capName = "";
            for (var i = 0; i < strArr.length; i++) {
                if (/^(das?|des?|dos?)$/i.test(strArr[i])) continue;
                capName += strArr[i].charAt(0);
            }

            return capName;
        }
    };
});