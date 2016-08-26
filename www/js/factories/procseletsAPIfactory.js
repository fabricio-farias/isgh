angular.module('isgh.procseletsAPIfactory', ['isgh.dbAPIfactory'])

    .factory(
        'FactoryProcselets',
        function ($q, $http, Constant, DB, $cordovaSQLite) {

            var db = DB;
            var table = Constant.database.tables.procselets;
            var columns = db.getColumns(table);
            var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
            // GET NEW ROWS
            var _procseletsWSgetLocStatus = function (data) {
                var deferred = $q.defer();
                var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };

                $http.post(Constant.url_wsapp + 'ps/?op=procselets&fu=GetByLocStatus', data, headers).then(function (response) {
                    deferred.resolve(response);
                }, function (erro) {
                    deferred.reject({ type: "alert-bar-dark", message: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente" });
                });

                return deferred.promise;
            };

            // GET NEW ROWS
            var _procseletsWSget = function () {
                var deferred = $q.defer();

                $http.get(Constant.url_wsapp + 'ps/?op=procselets&fu=GetByAll').then(function (response) {
                    deferred.resolve(response);
                }, function (erro) {
                    deferred.reject({ type: "alert-bar-dark", message: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente" });
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
                            if (response.status == 200) {
                                angular.forEach(response.data, function (obj) {
                                    var query = "INSERT OR REPLACE INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                    db.query(query, [obj.catid, obj.code, obj.category, obj.description, obj.file, obj.unid, obj.unit, obj.status, obj.created, obj.files]);
                                });
                                deferred.resolve(response);
                            } else if (response.status == 204) {
                                deferred.reject({ type: "alert-bar-assertive", message: "Não há " + Constant.procseletsTitles[response.statusText] + " disponíveis no momento" });
                            } else {
                                deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
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
                    if (response.status == 200) {

                        db.truncateTable(table);

                        angular.forEach(response.data, function (obj) {
                                    var query = "INSERT OR REPLACE INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                    db.query(query, [obj.catid, obj.code, obj.category, obj.description, obj.file, obj.unid, obj.unit, obj.status, obj.created, obj.files]);
                                });
                        deferred.resolve(response);
                    } else if (response.status == 204) {
                        db.truncateTable(table);
                        deferred.reject({ type: "alert-bar-assertive", message: "Não há Processos Seletivos disponíveis no momento" });
                    } else {
                        deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
                    }
                }, function (erro) {
                    deferred.reject(erro);
                });

                return deferred.promise;
            }
    
            //SELECT ALL
            var _all = function (offset, limit) {
                limit = (offset > 0 || limit > 0) ? " LIMIT " + offset + ", " + limit : "";

                var query = "SELECT * FROM " + table.name + " ORDER BY created DESC" + limit;
                return db.query(query).then(function (result) {
                    return db.fetchAll(result);
                }, function (erro) {
                    console.log(erro);
                });
            };

            var _total = function () {
                var query = "SELECT count(catid) as total FROM " + table.name;
                return db.query(query).then(function (result) {
                    return result;
                }, function (erro) {
                    console.log(erro);
                });
            };
    
    
            //GET PROCSELECT BY LOCATION AND STATUS
            var _getProcSeletsByUnitStatus = function (data) {
                var query = "SELECT catid, code, category, created, file, unit, unid, files FROM " + table.name + " WHERE unid in(" + data.units.join(",") + ") AND status in(" + data.status + ")"
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
                procseletsWSgetLocStatus: _procseletsWSgetLocStatus,
                populateByLocationStatus: _populateByLocationStatus,
                getProcSeletsByUnitStatus: _getProcSeletsByUnitStatus,
                getProcSeletsFiles: _getProcSeletsFiles,
                refresh:_refresh,
                total: _total,
                all: _all
            };

        })

    .factory(
        'FactoryProcseletsLocal',
        function ($q, $http, Constant, DB) {

            var db = DB;
            var table = Constant.database.tables.procselets;
        
            // GET PROCSELETS ROWS COUNTS
            var _procseletsWSgetcounts = function () {
                var deferred = $q.defer();

                $http.get(Constant.url_wsapp + 'ps/?op=procselets&fu=All').then(function (response) {
                    deferred.resolve(response);
                }, function (erro) {
                    deferred.reject({ type: "alert-bar-dark", message: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente" });
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
                        if (response.status == 200) {
                            localStorage.setItem("procselets", JSON.stringify(response.data));
                            deferred.resolve(response);
                        } else if (response.status == 204) {
                            deferred.reject({ type: "alert-bar-assertive", message: "Não há Processos disponíveis no momento" });
                        } else {
                            deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
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

                    db.truncateTable(table);

                    if (response.status == 200) {
                        localStorage.setItem("procselets", JSON.stringify(response.data));
                        deferred.resolve(response);
                    } else if (response.status == 204) {
                        db.truncateTable(table);
                        deferred.reject({ type: "alert-bar-assertive", message: "Não há Processos disponíveis no momento" });
                    } else {
                        deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
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
