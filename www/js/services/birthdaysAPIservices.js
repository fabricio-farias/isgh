angular.module('isgh.birthdaysAPIservices', ['isgh.dbAPIservices'])

    .factory('FactoryBirthdays', function ($q, $http, Constant, DB, $cordovaSQLite) {

        var db = DB;
        var table = Constant.database.tables.birthdays;
        var columns = db.getColumns(table);
        var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
        // GET NEW ROWS
        var _birthdaysWSget = function () {
            var deferred = $q.defer();

            $http.get(Constant.url_wsapp + 'intranet/?op=birthdays&fu=All').then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };
    
        // INSERT ROWS IN TABLE
        var _populate = function () {
            var deferred = $q.defer();

            _all().then(function (response) {
                if (response.length > 0) {
                    deferred.resolve({ data: response });
                } else {

                    _birthdaysWSget().then(function (response) {
                        if (response.data.length > 0) {

                            db.dropTable(table);
                            db.createTable(table);

                            angular.forEach(response.data, function (obj) {
                                var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                db.query(query, [obj.num_matricula, obj.dsc_nome, obj.dsc_funcao, obj.dsc_setor, obj.dsc_filial, obj.dat_nasc]);
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
            _birthdaysWSget().then(function (response) {
                if (response.data.length > 0) {

                    db.dropTable(table);
                    db.createTable(table);

                    angular.forEach(response.data, function (obj) {
                        var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                        db.query(query, [obj.num_matricula, obj.dsc_nome, obj.dsc_funcao, obj.dsc_setor, obj.dsc_filial, obj.dat_nasc]);
                    });
                    deferred.resolve(response);
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
            var query = "SELECT * FROM " + table.name + " ORDER BY dsc_nome ASC";
            return db.query(query).then(function (result) {
                return db.fetchAll(result);
            }, function (erro) {
                console.log(erro);
            });
        };
    
        // GET NEW BIRTHDATES SERVER BY DATE
        var _birthdaysWSgetByDate = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=birthdays&fu=ByDate', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };
    
        // GET NEW BIRTHDATES SERVER BY LIKE NAME
        var _birthdaysWSgetByLike = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=birthdays&fu=ByLike', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
            });

            return deferred.promise;
        };

        return {
            birthdaysWSget: _birthdaysWSget,
            birthdaysWSgetByDate: _birthdaysWSgetByDate,
            birthdaysWSgetByLike: _birthdaysWSgetByLike,
            populate: _populate,
            refresh: _refresh,
            all: _all
        };

    });
