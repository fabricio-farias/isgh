angular.module('isgh.procseletsAPIservices', ['isgh.dbAPIservices'])

    .factory('FactoryProcselets', function ($q, $http, Constant, DB, $cordovaSQLite) {

        var db = DB;
        var table = Constant.database.tables.procselets;
        var columns = db.getColumns(table);
        var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
        // GET NEW ROWS
        var _procseletsWSget = function () {
            var deferred = $q.defer();

            $http.get(Constant.url_wsapp + 'processos_seletivos/?op=procselets&fu=All').then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };
    
        // INSERT ROWS IN TABLE
        var _populate = function () {
            var deferred = $q.defer();

            _allLocationsStatus().then(function (response) {

                if (response.length > 0) {
                    deferred.resolve({ data: response });
                } else {
                    _procseletsWSget().then(function (response) {
                        if (response.data.length > 0) {
                            angular.forEach(response.data, function (obj) {
                                var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                db.query(query, [obj.catid, obj.category, obj.file, obj.unid, obj.unit, obj.status, obj.created, obj.locid, obj.location, obj.files]);
                            });
                            deferred.resolve(response);
                        } else {
                            deferred.reject("Restabelecendo conexão perdida com servidor");
                        }
                    }, function (erro) {
                        deferred.reject(erro);
                    });
                }
            });

            return deferred.promise;
        }
    
        // REFRESH TABLE
        var _refresh = function () {
            var deferred = $q.defer();
            _procseletsWSget().then(function (response) {
                if (response.data.length > 0) {

                    db.dropTable(table);
                    db.createTable(table);

                    angular.forEach(response.data, function (obj) {
                        var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                        db.query(query, [obj.catid, obj.category, obj.file, obj.unid, obj.unit, obj.status, obj.created, obj.locid, obj.location, obj.files]);
                    });

                    _allLocationsStatus().then(function (response) {
                        deferred.resolve(response);
                    })
                } else {
                    deferred.reject("Restabelecendo conexão perdida com servidor");
                }
            }, function (erro) {
                deferred.reject(erro);
            });

            return deferred.promise;
        }
    
        //SELECT ALL
        var _all = function () {
            var query = "SELECT * FROM " + table.name + " ORDER BY created DESC";
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        //SELECT ALL LOCATIONS with status
        var _allLocationsStatus = function () {
            var query = "SELECT locid, status, count(status) as total from " + table.name + " group by 1,2";
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        //GET ALL LOCATIONS
        var _allLocations = function () {
            var query = "SELECT locid, location FROM " + table.name + " group by 1,2";
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        //GET UNITS by ID
        var _getUnitsById = function (id) {
            var query = "SELECT unit FROM " + table.name + " where locid in(" + id + ") group by 1 order by unid"
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        //GET PROCSELECT BY LOCATION AND STATUS
        var _getProcSeletsByLoc = function (locid, status) {
            var query = "SELECT catid, category, file, unit FROM " + table.name + " WHERE locid in(" + locid + ") AND status in(" + status + ")"
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        //GET PROCSELECT FILES by CATID
        var _getProcSeletsFiles = function (catid) {
            var query = "SELECT files, category, unit FROM " + table.name + " WHERE catid in(" + catid + ")"
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };

        return {
            procseletsWSget: _procseletsWSget,
            populate: _populate,
            refresh: _refresh,
            all: _all,
            allLocationsStatus: _allLocationsStatus,
            allLocations: _allLocations,
            getUnitsById: _getUnitsById,
            getProcSeletsByLoc: _getProcSeletsByLoc,
            getProcSeletsFiles: _getProcSeletsFiles
        };

    });
