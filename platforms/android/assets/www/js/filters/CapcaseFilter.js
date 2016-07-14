angular.module('isgh.CapcaseFilter', []).filter('CapcaseFilter', function () {
    return function (string) {
        if (string !== undefined) {
            strArr = string.split(" ");

            var newStr = strArr.map(function (elem) {
                if (/^(ISGH|HGWA|HRC|HRN|UPA|APS)$/i.test(elem)) return elem.toUpperCase();;
                if (/^(da|de|do|em|na|ne|no)$/i.test(elem)) return elem.toLowerCase();
                return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
            });

            return newStr.join(" ");
        }
    };
});