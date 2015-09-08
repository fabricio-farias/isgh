angular.module('isgh.IframeDirective', []).directive("iframeDirective", function () {
	return {
		replace: true,
		restrict: "EA",
		scope: {
			src: "@",
			articleId: "@"	
		},
		template: '<iframe sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation" src="%url%"></iframe>',
		link: function (scope, element, attrs) {
			var url = (attrs.articleId) ? 'http://www.isgh.org.br/intranet/index.php?option=com_content&view=article&id=' + attrs.articleId + '&path=&tmpl=component' : attrs.src ;
			element[0].outerHTML = element[0].outerHTML.replace('%url%',url);
		}
	};
})