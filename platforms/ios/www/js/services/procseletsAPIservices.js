angular.module('isgh.procseletsAPIservices', ['isgh.dbAPIservices'])

    .factory('FactoryProcselets', function ($q, $http, Constant, DB, $cordovaSQLite) {

        var db = DB;
        var table = Constant.database.tables.procselets;
        var columns = db.getColumns(table);
        var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
        // GET NEW ROWS
        var _procseletsWSgetLocStatus = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            
            $http.post(Constant.url_wsapp + 'processos_seletivos/?op=procselets&fu=GetByLocStatus', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };
    
        // INSERT ROWS IN TABLE
        var _populateByLocationStatus = function (data) {
            var deferred = $q.defer();
            
            _getProcSeletsByUnitStatus(data).then(function (response) {
                if (response.length > 0) {
                    deferred.resolve({ data: response });
                } else {
                    _procseletsWSgetLocStatus(data).then(function (response) {
                        if (response.data.length > 0) {
                            angular.forEach(response.data, function (obj) {
                                var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                db.query(query, [obj.catid, obj.code, obj.category, obj.description, obj.file, obj.unid, obj.unit, obj.status, obj.created, obj.files]);
                            });
                            deferred.resolve(response);
                        } else {
                            deferred.resolve(response);
                        }
                    }, function (erro) {
                        deferred.reject(erro);
                    });
                }
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
    
    
        //GET PROCSELECT BY LOCATION AND STATUS
        var _getProcSeletsByUnitStatus = function (data) {
            var query = "SELECT catid, code, category, created, file, unit, files FROM " + table.name + " WHERE unid in(" + data.units.join(",") + ") AND status in(" + data.status + ")"
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
            procseletsWSgetLocStatus: _procseletsWSgetLocStatus,
            populateByLocationStatus: _populateByLocationStatus,
            getProcSeletsByUnitStatus: _getProcSeletsByUnitStatus,
            getProcSeletsFiles: _getProcSeletsFiles,
            all: _all
        };

    })

    .factory('FactoryProcseletsLocal', function ($q, $http, Constant, DB) {
        
        var db = DB;
        var table = Constant.database.tables.procselets;
        
        // GET PROCSELETS ROWS COUNTS
        var _procseletsWSgetcounts = function () {
            var deferred = $q.defer();

            $http.get(Constant.url_wsapp + 'processos_seletivos/?op=procselets&fu=All').then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };
        
        //GET LOCAL TABLE
        var _getTbProcselets = function () {
            var tbProcselets = null;
            tbProcselets = localStorage.getItem("procselets");
            return (tbProcselets !== null) ? JSON.parse(tbProcselets) : tbProcselets;
        }
        
        //POPULATE LOCAL TABLE
        var _populateTbProcselets = function () {
            var deferred = $q.defer();

            var tbProcselets = _getTbProcselets();
            if (tbProcselets !== null) {
                deferred.resolve({ data: tbProcselets });
            } else {

                _procseletsWSgetcounts().then(function (response) {
                    if (response.data.length > 0) {
                        localStorage.setItem("procselets", JSON.stringify(response.data));
                        deferred.resolve(response);
                    } else {
                        deferred.reject("Restabelecendo conexão perdida com servidor");
                    }
                }, function (erro) {
                    deferred.reject(erro);
                });

            }

            return deferred.promise;
        }
        
        //REFRESH LOCAL TABLE
        var _refreshTbProcselets = function () {
            var deferred = $q.defer();
            _procseletsWSgetcounts().then(function (response) {
                
                db.dropTable(table);
                db.createTable(table);
                
                if (response.data.length > 0) {
                    localStorage.setItem("procselets", JSON.stringify(response.data));
                    deferred.resolve(response);
                } else {
                    deferred.reject("Restabelecendo conexão perdida com servidor");
                }
            }, function (erro) {
                deferred.reject(erro);
            });
            
            return deferred.promise;
        }

        return {
            procseletsWSgetcounts: _procseletsWSgetcounts,
            getTbProcselets: _getTbProcselets,
            populateTbProcselets: _populateTbProcselets,
            refreshTbProcselets: _refreshTbProcselets
        }
    });
