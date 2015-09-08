angular.module('isgh.DateRelativeFilter', ['angularMoment']).filter("DateRelativeFilter", function(amMoment){
	return function (date) {
		if (date) {
			var datetime = new Date(date);
			return moment(datetime).fromNow(); 
		}
	};
});