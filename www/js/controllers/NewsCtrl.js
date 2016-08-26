angular.module('isgh.NewsCtrl', ['ngSanitize'])

    .controller(
        'NewsCtrl',
        function ($scope, $filter, $ionicModal, $ionicScrollDelegate, $rootScope, FactoryNews, ResolveNews, FactoryNewsLocal, FactoryProfileLocal, Constant, Utility) {

            $scope.news = ResolveNews;
            $scope.button_class = (Constant.isAndroid) ? 'button-light' : 'button-info';
            $scope.has_message = (ResolveNews.message || ResolveNews.length == 0) ? true : false;
            $scope.message = (ResolveNews.message) ? ResolveNews.message : 'Não há notícias para exibir no momento';
            $scope.constant = Constant;
            $scope.like_explode = null;
            $scope.unlike_explode = null;

            var init = function(){
                prepareDocument($scope.news);
            };

            var prepareDocument = function(data){
                if(typeof(data.length) === 'undefined') return;

                data.map(function (item) {
                    item.images = (typeof (item.images) === 'string') ? JSON.parse(item.images) : item.images;
                    item.img_src = Constant.url_intranet + (item.images.image_fulltext || item.images.image_intro);
                    item.unit = (item.unit) ? item.unit : 'ISGH';
                    item.unit_color = Utility.getUnitColor(item.unit, 'app-units-');
                    item.created_relative = $filter('DateRelativeFilter')(item.created);
                    item.striptext_ellipsis = $filter('EllipsisFilter')(item.striptext, 200);

                    var checkLikeUnlike = FactoryNewsLocal.getTbLikedsById(item.id);

                    if (checkLikeUnlike !== undefined) {
                        item.liked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].liked : false;
                        item.unliked = (checkLikeUnlike.length > 0) ? checkLikeUnlike[0].unliked : false;
                    } else {
                        item.liked = false;
                        item.unliked = false;
                    }

                    item.liked_sum = $filter('number')((item.liked_sum !== 'undefined') ? item.liked_sum : 0);
                    item.unliked_sum = $filter('number')((item.unliked_sum !== 'undefined') ? item.unliked_sum : 0);
                    return item;
                });

                return data;
            };

            // REFRESH NOTICIAS
            $scope.doRefresh = function () {
                $rootScope.alert = null;

                FactoryNews.refresh().then(function (response) {
                    $scope.news = [];
                    $scope.has_message = false;
                    $scope.news = prepareDocument(response.data);
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (erro) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.alert = erro;
                    $scope.has_message = true;
                    $scope.message = 'Não há notícias para exibir no momento';
                    $scope.news = [];
                });

            };

            /****ADICIONAR AO CONTADOR VISUALIZAÇÕES****/
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
            };

            /****MODAL IMAGES****/
            $ionicModal.fromTemplateUrl('templates/news/new-images.html', {
                scope: $scope, animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.mimages = modal; $scope.closeButton = Constant.closeButton;
            });

            /****MODAL IMAGES ZOOM****/
            $scope.zoomOut = function () { $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1); };

            /****OPEN AND CLOSE MODAL IMAGES****/
            $scope.openMimages = function (itemNew) {
                if (window.StatusBar) { StatusBar.styleLightContent(); }
                $scope.mimages.show(); $scope.itemNew = itemNew;
            };

            $scope.closeMimages = function () {
                if (window.StatusBar) { StatusBar.styleDefault(); }
                $scope.mimages.hide(); $scope.zoomOut();
            };

            /****LIKE UNLIKE VARIATION****/
            var toggleLikeUnlike = function (itemNew) {
                if (itemNew) {
                    var profile = FactoryProfileLocal.getTbProfile();
                    FactoryNews.newsWSToggleLike({
                        content_id: itemNew.id,
                        user_id: profile.num_matricula,
                        liked: itemNew.liked,
                        unliked: itemNew.unliked
                    }).then(function (response) {
                        if (response.data) {
                            itemNew.liked_sum = response.data.liked_sum;
                            itemNew.unliked_sum = response.data.unliked_sum;
                            FactoryNews.newsSetLikeUnlikeSum(response.data);
                        }
                    }, function(error){
                        console.log(error);
                    });
                }
            };

            /****BOTÃO LIKE****/
            $scope.doLikeNews = function (itemNew) {
                if (itemNew.liked) {//curti
                    $scope.like_explode = 'app-animation-explode';
                    if (itemNew.unliked) {
                        $scope.unlike_explode = null;
                        itemNew.unliked = false;
                        toggleLikeUnlike(itemNew);
                    }
                    FactoryNewsLocal.toggleLocalLike(itemNew);
                    toggleLikeUnlike(itemNew);
                } else {//deixei de curti
                    $scope.like_explode = null;
                    FactoryNewsLocal.toggleLocalLike(itemNew);
                    toggleLikeUnlike(itemNew);
                }
            };

            /****BOTÃO UNLIKE****/
            $scope.doUnlikeNews = function (itemNew) {
                $scope.unlike_explode = 'app-animation-explode';
                if (itemNew.unliked) {//nao curti
                    if (itemNew.liked) {
                        $scope.like_explode = null;
                        itemNew.liked = false;
                        toggleLikeUnlike(itemNew);
                    }
                    FactoryNewsLocal.toggleLocalUnlike(itemNew);
                    toggleLikeUnlike(itemNew);
                } else {//deixei de nao curti
                    $scope.unlike_explode = null;
                    FactoryNewsLocal.toggleLocalUnlike(itemNew);
                    toggleLikeUnlike(itemNew);
                }
            };

            init();
        })

    .controller(
        'NewCtrl',
        function ($scope, $rootScope, $state, $stateParams, $filter, $sce, $ionicScrollDelegate, ResolveNew, FactoryNews, Constant) {

            $scope.new = ResolveNew;
            $scope.url_intranet = Constant.url_intranet;

            //ESCONDE TABS ENQUANTO A VIEW É tab.new
            $rootScope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = false;
                if ($state.current.name === 'tab.new') {
                    $rootScope.hideTabs = true;
                }
            });

            $scope.openPDF = function (url) {
                var nUrl = (Constant.isAndroid) ? 'http://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
                var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                window.open(nUrl, '_blank', options);
            };

            $scope.openLink = function (url) {
                if (url) {
                    if (url.indexOf('intranet') > -1 && url.indexOf('com_content') > -1) {
                        var regexp = new RegExp("id=(.*?)\\d{4,9}", "ig");
                        var id = url.match(regexp)[0].split("=")[1];
                        $state.go($state.current, { id: id }, { reload: true, inherit: false });
                    } else {
                        var options = (Constant.isAndroid) ? 'location=yes' : 'location=no';
                        window.open(url, "_system", options);
                    }
                }
            };

            $scope.zoomOut = function () {
                $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
            };

            // RENDERIZAR O HTML
            $scope.renderHTML = function (html) {
                if (html) {
                    $ionicScrollDelegate.$getByHandle('mimagesScroll').zoomTo(1);
                    return $sce.trustAsHtml(html.introtext);
                }
            };

        });