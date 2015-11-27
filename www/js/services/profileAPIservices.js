angular.module('isgh.profileAPIservices', ['isgh.dbAPIservices'])

  .factory('FactoryProfile', function ($q, $http, Constant, DB, $cordovaSQLite) {

    var db = DB;
    var table = Constant.database.tables.profile;
    var columns = db.getColumns(table);
    var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
    // GET NEW ROWS
    var _profileWSget = function (data) {
      var deferred = $q.defer();
      
      var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
      $http.post(Constant.url_wsapp + 'rheventos/?op=profile&fu=Get', data, headers).then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Sem conexão com a Internet");
      });

      return deferred.promise;
    };
    
    
    // INSERT ROWS IN TABLE
    var _doLogin = function (data) {
      var deferred = $q.defer();
      
       _profileWSget(data).then(function (response) {
          if (response.data.length > 0) {
            
            db.dropTable(table);
            db.createTable(table);
            
            angular.forEach(response.data, function (obj) {
              var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
              db.query(query, [obj.num_matricula, obj.num_pis, obj.dsc_nome, obj.dsc_funcao, obj.dsc_setor, obj.dsc_filial, obj.dat_nasc, 1]);
            });
            deferred.resolve(response);
          } else {
            // deferred.reject("Usuário, senha ou filial estão incorretos!");
            deferred.resolve(response);
          }
        }, function (erro) {
          deferred.reject(erro);
        });
      
      return deferred.promise;
    }
    
    //CHECK LOGGIN
    var _checkLogin = function () {
      var query = "SELECT dsc_logged FROM " + table.name;
      return db.query(query).then(function (result) {
        return db.fetchAll(result);
      }, function (erro) {
        console.log(erro);
      });
    };
    
    //CHECK LOGGIN
    var _setLogout = function () {
      var query = "UPDATE " + table.name + " SET dsc_logged = 0";
      return db.query(query).then(function (result) {
        return result;
      }, function (erro) {
        console.log(erro);
      });
    };
    
    // GET NEW ROWS
    var _profileWSgetFilial = function () {
      var deferred = $q.defer();

      $http.get(Constant.url_wsapp + 'rheventos/?op=profile&fu=FilialGet').then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Sem conexão com a Internet");
      });

      return deferred.promise;
    };
    
    var _getProfile = function () {
      var query = "SELECT * FROM " + table.name;
      return db.query(query).then(function (result) {
        return db.fetchAll(result);
      }, function (erro) {
        console.log(erro);
      });
    };

    return {
      doLogin: _doLogin,
      profileWSget: _profileWSget,
      checkLogin: _checkLogin,
      setLogout: _setLogout,
      profileWSgetFilial: _profileWSgetFilial,
      getProfile : _getProfile
    };

  });
