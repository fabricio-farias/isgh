angular.module('isgh.MomentFilter', []).filter('MomentFilter', function () {
    return function (date) {
        date = new Date('2015-05-01 13:00:00');

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / (60 * 60 * 60 * 24));
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / (60 * 60 * 24));
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / (60 * 60));
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
})