angular.module('isgh.EllipsisFilter', []).filter("EllipsisFilter", function(){
	return function (str, size) {
		if(str.length <= size) return str;
		var output = str.substring(0, (size || 5)) + "...";
		return output;
	};
});