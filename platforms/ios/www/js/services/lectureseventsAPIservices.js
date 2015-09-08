angular.module('isgh.lectureseventsAPIservices', ['isgh.dbAPIservices'])

  .factory('LecturesEvents', function ($q, $http, Constant, DB, $cordovaSQLite, $ionicPopup) {
    
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
        deferred.reject("Falha na conexão");
      });

      return deferred.promise;
    }
    
    // INSERT ROWS IN TABLE
    var _populate = function (refresh) {

      var refresh = typeof refresh !== 'undefined' ? true : false;

      if (refresh) {
        db.dropTable(table);
        db.createTable(table);
      }

      return _lectureseventsWSget().then(function (response) {
        angular.forEach(response.data, function (obj) {
          var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
          db.query(query, [obj.id, obj.title, obj.image, obj.thumbnail, obj.location, obj.location_alias, obj.register_opened, obj.register_closed, obj.event_closed, obj.filename, obj.form_date_up, obj.form_date_down, obj.form_workload, obj.form_location, obj.form_speaker, obj.form_audience, obj.form_investment, obj.form_content_1, obj.form_content_2, obj.form_content_3, obj.form_content_4, obj.form_link, obj.register_link, obj.status]);
        });
      }, function (erro) {
        $ionicPopup.alert({
          title: erro,
          content: "Verifique se você está conectado à internet e tente novamente."
        });
      });

    }
    
    //SELECT ALL
    var _all = function () {
      var query = "SELECT * FROM "+table.name+" ORDER BY id DESC";
      return db.query(query).then(function (result) {
        return db.fetchAll(result);
      });
    };
    
    var _get = function (id) {
      var query = "SELECT * FROM " + table.name + " WHERE id = " + id;
      return db.query(query).then(function (result) {
        return db.fetch(result);
      });
    }
    // var _get = function (id) {
    //   return $http.get(Constant.url_appserver + 'site/?func=letsById&id='+id);
    // }
    
    return {
      lectureseventsWSget: _lectureseventsWSget,
      populate: _populate,
      all: _all,
      get: _get
    };
    
});
