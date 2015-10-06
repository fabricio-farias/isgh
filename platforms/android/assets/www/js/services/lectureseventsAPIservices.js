angular.module('isgh.lectureseventsAPIservices', ['isgh.dbAPIservices'])

  .factory('LecturesEvents', function ($q, $state, $http, Constant, DB, $cordovaSQLite) {
    
    var db = DB;
    var table = Constant.database.tables.lecturesevents;
    var columns = db.getColumns(table);
    var fields = Array.apply(null, Array(columns.length)).map(function(){return "?"})
    
    // GET NEW ROWS
    var _lectureseventsWSget = function () {
      var deferred = $q.defer();

      $http.get(Constant.url_wsapp + 'site/?func=letsAll').then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Sem conexão com a Internet");
      });

      return deferred.promise;
    }
    
    // INSERT ROWS IN TABLE
    var _populate = function (refresh) {
      var deferred = $q.defer();
      var refresh = typeof refresh !== 'undefined' ? true : false;


      _lectureseventsWSget().then(function (response) {

        if (response.data.length > 0) { 
          if (refresh) {
            db.dropTable(table);
            db.createTable(table);
          }
          
          angular.forEach(response.data, function (obj) {
            var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
            db.query(query, [obj.id, obj.title, obj.image, obj.thumbnail, obj.location, obj.location_alias, obj.date, obj.filename, obj.form_date_up, obj.form_date_down, obj.form_workload, obj.form_location, obj.form_speaker, obj.form_audience, obj.form_investment, obj.form_content_1, obj.form_content_2, obj.form_content_3, obj.form_content_4, obj.form_link, obj.register_link, obj.register_planning, obj.status]);
          });
          
          deferred.resolve(_all());
          
        } else {
          deferred.reject("Restabelecendo conexão perdida com ISGH");
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
      lectureseventsWSget: _lectureseventsWSget,
      populate: _populate,
      all: _all,
      get: _get
    };
    
});
