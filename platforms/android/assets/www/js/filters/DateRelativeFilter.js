angular.module('isgh.DateRelativeFilter', ['angularMoment']).filter("DateRelativeFilter", function (amMoment) {
    return function (date) {
        if (date) {
            var datetime = new Date(date);
            if (ionic.Platform.isIOS()) {
                return moment(date).fromNow();
            } else {
                return moment(datetime).fromNow();
            }
        }
    };
});