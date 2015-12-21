angular.module('isgh.lecturesAPIservices', ['isgh.dbAPIservices'])

  .factory('FactoryLectures', function ($q, $state, $http, Constant, DB, $cordovaSQLite) {
    
    var db = DB;
    var table = Constant.database.tables.lectures;
    var columns = db.getColumns(table);
    var fields = Array.apply(null, Array(columns.length)).map(function(){return "?"})
    
    // GET NEW ROWS
    var _lecturesWSget = function () {
      var deferred = $q.defer();

      $http.get(Constant.url_wsapp + 'site/?op=lectures&fu=All').then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
      });

      return deferred.promise;
    }
    
    // INSERT ROWS IN TABLE
    var _populate = function () {
      var deferred = $q.defer();
      
      _all().then(function (response) {
        if (response.length > 0) {
          deferred.resolve({ data: response });
        } else {
          _lecturesWSget().then(function (response) {
            if (response.data.length > 0) {
              angular.forEach(response.data, function (obj) {
                var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                db.query(query, [obj.id, obj.title, obj.image, obj.thumbnail, obj.location, obj.location_alias, obj.date, obj.filename, obj.form_date_up, obj.form_date_down, obj.form_workload, obj.form_location, obj.form_speaker, obj.form_audience, obj.form_investment, obj.form_content_1, obj.form_content_2, obj.form_content_3, obj.form_content_4, obj.form_link, obj.register_link, obj.register_planning, obj.status, obj.widgetkit_module, obj.widgetkit]);
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
      _lecturesWSget().then(function (response) {
        if (response.data.length > 0) {

          db.dropTable(table);
          db.createTable(table);
          
          angular.forEach(response.data, function (obj) {
            var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
            db.query(query, [obj.id, obj.title, obj.image, obj.thumbnail, obj.location, obj.location_alias, obj.date, obj.filename, obj.form_date_up, obj.form_date_down, obj.form_workload, obj.form_location, obj.form_speaker, obj.form_audience, obj.form_investment, obj.form_content_1, obj.form_content_2, obj.form_content_3, obj.form_content_4, obj.form_link, obj.register_link, obj.register_planning, obj.status, obj.widgetkit_module, obj.widgetkit]);
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
      var query = "SELECT * FROM "+table.name+" ORDER BY id DESC";
      return db.query(query).then(function (result) {
        return db.fetchAll(result);
      }, function (erro) {
        console.log(erro);
      });
    };
    
    var _get = function (id) {
      var query = "SELECT * FROM " + table.name + " WHERE id = " + id;
      return db.query(query).then(function (result) {
        return db.fetch(result);
      }, function (erro) {
        console.log(erro);
      });
    }
        
    return {
      lecturesWSget: _lecturesWSget,
      populate: _populate,
      refresh: _refresh,
      all: _all,
      get: _get
    };
    
});
