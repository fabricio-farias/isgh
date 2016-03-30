angular.module('isgh.NewsCtrl', ['ngSanitize'])

    .controller(
        'NewsCtrl',
        function ($scope, $filter, $ionicModal, $ionicScrollDelegate, $rootScope, $ionicFilterBar, FactoryNews, ResolveNews, FactoryNewsLocal, FactoryProfileLocal, Constant) {

            $scope.url_intranet = Constant.url_intranet;
            $scope.news = ResolveNews.map(function (item) {
                item.images = JSON.parse(item.images);

                var checkLikeUnlike = FactoryNewsLocal.getTbLikedsById(item.id);

                if (checkLikeUnlike !== undefined) {
                    item.liked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].liked : false;
                    item.unliked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].unliked : false;
                } else {
                    item.liked = false;
                    item.unliked = false;
                }

                item.liked_sum = (item.liked_sum !== 'undefined') ? item.liked_sum : 0;
                item.unliked_sum = (item.unliked_sum !== 'undefined') ? item.unliked_sum : 0;
                return item;
            });
        
            // FILTRO NOTICIAS
            $scope.showFilterBar = function () {
                $ionicFilterBar.show({
                    cancelText: 'Cancelar',
                    items: $scope.news,
                    update: function (filtered) {
                        $scope.news = filtered;
                    },
                    filterProperties: 'title'
                });
            };
        
            // REFRESH NOTICIAS
            $scope.doRefresh = function () {
                $rootScope.alert = null;

                FactoryNews.refresh().then(function (response) {
                    $scope.news = [];
                    $scope.news = response.data.map(function (item) {

                        item.images = JSON.parse(item.images);

                        var checkLikeUnlike = FactoryNewsLocal.getTbLikedsById(item.id);
                        if (checkLikeUnlike !== undefined) {
                            item.liked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].liked : false;
                            item.unliked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].unliked : false;
                        } else {
                            item.liked = false;
                            item.unliked = false;
                        }

                        item.liked_sum = (item.liked_sum !== 'undefined') ? item.liked_sum : 0;
                        item.unliked_sum = (item.unliked_sum !== 'undefined') ? item.unliked_sum : 0;
                        return item;

                    });
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                });

            }
            
            // $scope.$on('$stateChangeSuccess', function () {
            //     SEMPRE QUE ENTRAR NO STATE DO NEWS TRAGA MAIS DO BANCO DE HOUVER
            //     console.log('stateChangeSuccess');
            // });
            

            //ADICIONAR AO CONTADOR VISUALIZAÇÕES
            $scope.setHits = function (data) {
                if (data) {
                    FactoryNews.newsWSsetHits(data.id).then(function (response) {
                        data.hits = response.data.hits;
                        FactoryNews.newsSetHits({ id: data.id, hits: data.hits });
                        return data.hits;

                    }, function (erro) {
                        $rootScope.alert = erro;
                    });
                }
            }
        
            /****MODAL IMAGES****/
            $ionicModal.fromTemplateUrl('templates/news/new-images.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.mimages = modal;
                $scope.closeButton = Constant.closeButton;
            });
        
            // GATILHO PRA ABRIR MODAL IMAGENS
            $scope.openMimages = function (itemNew) {
                $scope.mimages.show();
                $scope.itemNew = itemNew;
            };

            // GATILHO PRA FECHAR MODAL IMAGENS
            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
            }

            $scope.closeMimages = function () {
                $scope.mimages.hide();
                $scope.zoomOut();
            };
            /****MODAL IMAGES****/

            var toggleLikeUnlike = function (itemNew) {
                if (itemNew) {
                    var profile = FactoryProfileLocal.getTbProfile();
                    FactoryNews.newsWSToggleLike({ content_id: itemNew.id, user_id: profile.num_matricula, liked: itemNew.liked, unliked: itemNew.unliked }).then(function (response) {

                        if (response.data) {
                            itemNew.liked_sum = response.data.liked_sum;
                            itemNew.unliked_sum = response.data.unliked_sum;
                            FactoryNews.newsSetLikeUnlikeSum(response.data);
                        }
                    });
                }
            }
        
            /****BOTÃO LIKE****/
            $scope.doLikeNews = function (itemNew) {
                if (itemNew.liked) {
                    if (itemNew.unliked) {
                        itemNew.unliked = false;
                        toggleLikeUnlike(itemNew);
                    }

                    FactoryNewsLocal.toggleLocalLike(itemNew);
                    toggleLikeUnlike(itemNew);
                    console.log('curti');
                } else {
                    FactoryNewsLocal.toggleLocalLike(itemNew);
                    toggleLikeUnlike(itemNew);
                    console.log('deixei de curti');
                }
            }
            /****BOTÃO LIKE****/
        
            /****BOTÃO UNLIKE****/
            $scope.doUnlikeNews = function (itemNew) {
                if (itemNew.unliked) {
                    if (itemNew.liked) {
                        itemNew.liked = false;
                        toggleLikeUnlike(itemNew);
                    }

                    FactoryNewsLocal.toggleLocalUnlike(itemNew);
                    toggleLikeUnlike(itemNew);
                    console.log('nao curti');
                } else {
                    FactoryNewsLocal.toggleLocalUnlike(itemNew);
                    toggleLikeUnlike(itemNew);
                    console.log('deixei de nao curti');
                }
            }
            /****BOTÃO UNLIKE****/
        })

    .controller(
        'NewCtrl',
        function ($scope, $filter, $sce, $ionicScrollDelegate, ResolveNew, Constant) {

            $scope.new = ResolveNew;
            $scope.url_intranet = Constant.url_intranet;

            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
            }
            // RENDERIZAR O HTML
            $scope.renderHTML = function (html) {
                if (html) {
                    $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
                    return $sce.trustAsHtml(html.introtext);
                }
            };
        });