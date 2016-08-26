angular.module('isgh.utilityAPIprovider', [])
    .provider('Utility', function(Constant){

        this.$get = function () {
            return {
                getUnitColor: function(elem, prefix){
                    var binding = (prefix !== undefined) ? prefix : "";
                    var units = Constant.units;

                    var filtered = units.filter(function(unit) {
                        var search = new RegExp(unit.name, "i");
                        return search.test(elem);
                    });

                    return binding + ((filtered[0]) ? filtered[0].color : 'isgh');
                }
            }
        }

    });
