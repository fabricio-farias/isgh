angular.module('isgh.dbAPIservices', ['isgh.Constant'])

    .factory('DB', function ($q, Constant, $cordovaSQLite, $ionicPopup, $ionicPlatform) {

        var self = this;
        self.db = null;

        self.init = function () {
            if (window.cordova) {
                self.db = $cordovaSQLite.openDB({ name: Constant.database.name, bgType: 1 });
            } else {
                self.db = window.openDatabase(Constant.database.name, '1', 'database', -1);
            }

            angular.forEach(Constant.database.tables, function (table) {
                var columns = [];

                angular.forEach(table.columns, function (column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + '(' + columns.join(',') + ')';
                self.query(query);
            });
        };

        self.query = function (query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            $ionicPlatform.ready(function () {
                $cordovaSQLite.execute(self.db, query, bindings).then(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
            });

            return deferred.promise;

        };

        self.fetchAll = function (result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };

        self.fetch = function (result) {
            return result.rows.item(0);
        };

        self.createTable = function (table) {
            if (table) {
                var columns = [];
                angular.forEach(table.columns, function (column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + '(' + columns.join(',') + ')';
                self.query(query);
            }
        }

        self.dropTable = function (table) {
            if (table) {
                var query = 'DROP TABLE ' + table.name;
                self.query(query);
            }
        }
        
        self.getColumns = function (table) {
            var output = [];

            for (var i = 0; i < table.columns.length; i++) {
                output.push(table.columns[i].name);
            }

            return output;

        }

        return self;
    });
