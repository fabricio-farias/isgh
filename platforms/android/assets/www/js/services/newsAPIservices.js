angular.module('isgh.newsAPIservices', ['isgh.dbAPIservices'])

    .factory('FactoryNews', function ($q, $http, Constant, DB, $cordovaSQLite) {

        var db = DB;
        var table = Constant.database.tables.news;
        var columns = db.getColumns(table);
        var fields = Array.apply(null, Array(columns.length)).map(function () { return "?" });
    
        // GET NEW ROWS
        var _newsWSget = function () {
            var deferred = $q.defer();

            $http.get(Constant.url_wsapp + 'intranet/?op=news&fu=All').then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject({ type: "alert-bar-dark", message: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente" });
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
                    _newsWSget().then(function (response) {
                        if (response.status == 200) {
                            angular.forEach(response.data, function (obj) {
                                var query = "INSERT OR REPLACE INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                                db.query(query, [obj.id, obj.title, obj.images, obj.created, obj.introtext, obj.striptext, obj.category, obj.unit, obj.hits, obj.liked_sum, obj.unliked_sum]);
                            });
                            deferred.resolve(response);
                        } else if (response.status == 204) {
                            deferred.reject({ type: "alert-bar-assertive", message: "Não há Notícias disponíveis no momento" });
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
            _newsWSget().then(function (response) {
                if (response.status == 200) {

                    db.truncateTable(table);

                    angular.forEach(response.data, function (obj) {
                        var query = "INSERT OR REPLACE INTO " + table.name + " (" + columns.join(",") + ") values (" + fields.join(",") + ")";
                        db.query(query, [obj.id, obj.title, obj.images, obj.created, obj.introtext, obj.striptext, obj.category, obj.unit, obj.hits, obj.liked_sum, obj.unliked_sum]);
                    });

                    deferred.resolve(response);
                } else if (response.status == 204) {
                    db.truncateTable(table);
                    deferred.reject({ type: "alert-bar-assertive", message: "Não há Notícias disponíveis no momento" });
                } else {
                    deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
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

        var _newsWSsetHits = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=news&fu=SetHits', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
            });

            return deferred.promise;
        };

        var _newsSetHits = function (data) {
            var query = "UPDATE " + table.name + " SET hits = ? WHERE id = ?";
            db.query(query, [data.hits, data.id]);
        }

        var _newsSetLikeUnlikeSum = function (data) {
            var query = "UPDATE " + table.name + " SET liked_sum = ?, unliked_sum = ? WHERE id = ?";
            db.query(query, [data.liked_sum, data.unliked_sum, data.content_id]);
        }

        var _newsWSToggleLike = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=news&fu=ToggleLike', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
            });

            return deferred.promise;
        }

        var _newsWSToggleUnlike = function (data) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=news&fu=ToggleUnlike', data, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
            });

            return deferred.promise;
        }

        var _newsWSgetToggleLikeds = function (profile) {
            var deferred = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
            $http.post(Constant.url_wsapp + 'intranet/?op=news&fu=GetToggleLikeds', profile, headers).then(function (response) {
                deferred.resolve(response);
            }, function (erro) {
                deferred.reject({ type: "alert-bar-dark", message: "Restabelecendo conexão perdida com servidor" });
            });

            return deferred.promise;
        }

        return {
            newsWSget: _newsWSget,
            newsWSsetHits: _newsWSsetHits,
            newsSetHits: _newsSetHits,
            newsSetLikeUnlikeSum: _newsSetLikeUnlikeSum,
            newsWSToggleLike: _newsWSToggleLike,
            newsWSToggleUnlike: _newsWSToggleUnlike,
            newsWSgetToggleLikeds: _newsWSgetToggleLikeds,
            populate: _populate,
            refresh: _refresh,
            all: _all
        };

    })

    .factory('FactoryNewsLocal', function ($q, $http, Constant, FactoryProfileLocal) {
    
        // ATIVAR OU DESATIVAR CURTIR
        var _toggleLocalLike = function (data) {

            var tbLikeds, profile = null;
            tbLikeds = _getTbLikeds();
            profile = FactoryProfileLocal.getTbProfile();

            if (data.liked) {
                if (tbLikeds !== null) {

                    var pos = tbLikeds.map(function (e) { return e.id; }).indexOf(data.id);
                    if (pos !== -1) {
                        tbLikeds.splice(pos, 1, { id: data.id, liked: data.liked, unliked: data.unliked });
                    } else {
                        tbLikeds.push({ id: data.id, liked: data.liked, unliked: data.unliked });
                    }

                    localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(tbLikeds));

                } else {

                    var objLocalNew = [{ id: data.id, liked: data.liked, unliked: data.unliked }];
                    localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(objLocalNew));

                }
            } else {

                var pos = tbLikeds.map(function (e) { return e.id; }).indexOf(data.id);
                tbLikeds.splice(pos, 1);
                localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(tbLikeds));

            }

        }

        var _toggleLocalUnlike = function (data) {

            var tbLikeds, profile = null;
            tbLikeds = _getTbLikeds();
            profile = FactoryProfileLocal.getTbProfile();

            if (data.unliked) {
                if (tbLikeds !== null) {

                    var pos = tbLikeds.map(function (e) { return e.id; }).indexOf(data.id);
                    if (pos !== -1) {
                        tbLikeds.splice(pos, 1, { id: data.id, liked: data.liked, unliked: data.unliked });
                    } else {
                        tbLikeds.push({ id: data.id, liked: data.liked, unliked: data.unliked });
                    }

                    localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(tbLikeds));

                } else {
                    var objLocalNew = [{ id: data.id, liked: data.liked, unliked: data.unliked }];
                    localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(objLocalNew));
                }
            } else {

                var pos = tbLikeds.map(function (e) { return e.id; }).indexOf(data.id);
                tbLikeds.splice(pos, 1);
                localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(tbLikeds));

            }

        }

        function _getTbLikeds() {
            var tbLikeds, profile = null;
            profile = FactoryProfileLocal.getTbProfile();
            tbLikeds = localStorage.getItem(profile.num_matricula + "_liked");
            return (tbLikeds !== null) ? JSON.parse(tbLikeds) : tbLikeds;
        }

        var _getTbLikedsById = function (id) {
            var tbLikeds = null;
            tbLikeds = _getTbLikeds();
            if (tbLikeds !== null) {
                var pos = tbLikeds.map(function (e) { return parseInt(e.id) }).indexOf(parseInt(id));
                if (pos > -1) {
                    return tbLikeds.splice(pos, 1);
                }
            }
        }

        return {
            toggleLocalLike: _toggleLocalLike,
            toggleLocalUnlike: _toggleLocalUnlike,
            getTbLikeds: _getTbLikeds,
            getTbLikedsById: _getTbLikedsById
        }

    });
