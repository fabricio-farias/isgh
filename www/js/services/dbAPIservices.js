angular.module('isgh.dbAPIservices', ['isgh.Constant'])

    .factory(
        'DB',
        function ($q, Constant, $cordovaSQLite, $ionicPlatform) {

            var self = this;
            self.db = null;

            self.init = function () {
                var deferred = $q.defer();

                if (window.cordova) {
                    self.db = $cordovaSQLite.openDB({ name: Constant.database.name, bgType: 1 });
                } else {
                    self.db = window.openDatabase(Constant.database.name, '1', 'database', -1);
                }
                deferred.resolve(self.db);

                angular.forEach(Constant.database.tables, function (table) {
                    // self.dropTable(table);
                    self.createTable(table);
                });

                return deferred.promise;
            };

            self.query = function (query, bindings) {
                bindings = typeof bindings !== 'undefined' ? bindings : [];
                var deferred = $q.defer();

                $ionicPlatform.ready(function () {

                    self.db.transaction(function (tx) {
                        tx.executeSql(query, bindings, function (tx, result) {
                            deferred.resolve(result);
                        }, function (transaction, error) {
                            deferred.reject("SQLiteErro: " + error.message + " Código: " + error.code);
                        });
                    });

                });

                return deferred.promise;

            };
        
            // self.query = function (query, bindings) {
            //     bindings = typeof bindings !== 'undefined' ? bindings : [];
            //     var deferred = $q.defer();

            //     $ionicPlatform.ready(function () {
            //         $cordovaSQLite.execute(self.db, query, bindings).then(function (result) {
            //             deferred.resolve(result);
            //         }, function (error) {
            //             deferred.reject("SQLiteErro: "+error.message+" Código: "+error.code);
            //         });
            //     });

            //     return deferred.promise;
            // };

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

                    var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + '(' + table.columns.join(',') + ')';
                    self.query(query);

                    var indexed = 'CREATE INDEX IF NOT EXISTS ' + table.name + '_idx ON ' + table.name + '(' + table.indexes.join(',') + ')';
                    self.query(indexed);
                }
            }

            self.dropTable = function (table) {
                if (table) {
                    var query = 'DROP TABLE ' + table.name;
                    self.query(query);
                }
            }

            self.truncateTable = function (table) {
                if (table) {
                    var query = 'DELETE FROM ' + table.name;
                    self.query(query);
                }
            }

            self.getColumns = function (table) {
                var output = [];
                for (var i = 0; i < table.columns.length; i++) {
                    output.push(table.columns[i].split(" ")[0]);
                }
                return output;
            }

            return self;
        });
