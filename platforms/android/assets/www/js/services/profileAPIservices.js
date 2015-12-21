angular.module('isgh.profileAPIservices', ['isgh.dbAPIservices'])

  .factory('FactoryProfile', function ($q, $http, Constant, DB, $cordovaSQLite) {

    // GET NEW ROW
    var _profileWSget = function (data) {
      var deferred = $q.defer();
      
      var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
      $http.post(Constant.url_wsapp + 'rheventos/?op=profile&fu=Get', data, headers).then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
      });

      return deferred.promise;
    };
    
    
    // INSERT ROW IN TABLE
    var _doLogin = function (data) {
      var deferred = $q.defer();
      
      _profileWSget(data).then(function (response) {
          deferred.resolve(response);
        }, function (erro) {
          deferred.reject(erro);
        });
      
      return deferred.promise;
    }
    
    // GET FILIAL FROM SERVER
    var _profileWSgetFilial = function () {
      var deferred = $q.defer();

      $http.get(Constant.url_wsapp + 'rheventos/?op=profile&fu=FilialGet').then(function (response) {
        deferred.resolve(response);
      }, function (erro) {
        deferred.reject("Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente");
      });

      return deferred.promise;
    };

    return {
      doLogin: _doLogin,
      profileWSget: _profileWSget,
      profileWSgetFilial: _profileWSgetFilial
    };

  })
  
  .factory('FactoryProfileLocal', function ($q, $http, Constant) { 
    
    function _getTbProfile () {
      var tbProfile = localStorage.getItem("profile");
      return (tbProfile !== null) ? JSON.parse(tbProfile) : tbProfile;  
    }
    
    return {
      getTbProfile: _getTbProfile
    }
    
  });
