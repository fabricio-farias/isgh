angular.module('isgh.newsAPIservices', ['isgh.dbAPIservices'])

  .factory('News', function ($q, $http, Constant, DB, $cordovaSQLite, $ionicPopup) {

    var db = DB;
    var table = Constant.database.tables.news;
    var columns = db.getColumns(table);
    var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" })
    
    // GET NEW ROWS
    var _newsWSget = function () {
      var deferred = $q.defer();

      $http.get(Constant.url_wsapp + 'intranet/?func=newsAll').then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Falha na conexão");
      });

      return deferred.promise;
    };
    
    // INSERT ROWS IN TABLE
    var _populate = function (refresh) {

      var refresh = typeof refresh !== 'undefined' ? true : false;

      if (refresh) {
        db.dropTable(table);
        db.createTable(table);
      }

      return _newsWSget().then(function (response) {
        angular.forEach(response.data, function (obj) {
          var query = "INSERT INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
          db.query(query, [obj.id, obj.title, obj.images, obj.created, obj.introtext, obj.striptext, obj.category, obj.unit]);
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
    // var _all = function () { 
    //   return $http.get(Constant.url_wsapp + 'intranet/?func=newsAll');
    // });
    
    return {
      newsWSget: _newsWSget,
      populate: _populate,
      all: _all
    };

  });
