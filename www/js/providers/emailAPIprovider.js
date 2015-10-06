angular.module('isgh.emailAPIprovider', [])

	.provider('EmailSender', function () { 

		var _subject = "";
		var _body = "";
		var _to = [];
		var _cc = [];
		var _bcc = [];
		var _att = [];
		var _attData = [];
		var _isHTML = false;
		
		this.getSubject = function () { return _subject; }
		this.setSubject = function (subject) { _subject = subject; }
	
		this.getBody = function () { return _body; }
		this.setBody = function (body) { _body = body; }
		
		this.getTo = function () { return _to; }
		this.setTo = function (to) { _to.push(to); }
		
		this.getCc = function () { return _cc; }
		this.setCc = function (cc) { _cc.push(cc); }
		
		this.getBcc = function () { return _bcc;}
		this.setBcc = function (bcc) { _bcc.push(bcc); }
		
		this.getAtt = function () { return _att; }
		this.setAtt = function (att) { _att.push(att); }
	
		this.getAttData = function () { return _attData; }
		this.setAttData = function (attData) { _attData.push(attData); }
	
		this.getIsHtml = function () { return _isHTML; }
		this.setIsHtml = function (isHTML) { _isHTML = isHTML;}
	
		this.$get = function () {
			return {
				send: function () {
					if(window.plugins && window.plugins.emailComposer) {
						window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
							console.log("Response: EmailSender -> " + result);
						}, 
						_subject,				// Subject
						_body,					// Body
						_to,					// To
						_cc,					// CC
						_bcc,					// BCC
						_isHTML,				// isHTML
						_att,					// Attachments
						_attData);				// Attachment Data
					}
				},
				getSubject: function () { return _subject; },
				setSubject: function (subject) { _subject = subject; },
				getBody: function () { return _body; },
				setBody: function (body) { _body = body; },
				getTo: function () { return _to; },
				setTo: function (to) { _to.push(to); },
				getCc: function () { return _cc; },
				setCc: function (cc) { _cc.push(cc); },
				getBcc: function () { return _bcc;},
				setBcc: function (bcc) { _bcc.push(bcc); },
				getAtt: function () { return _att; },
				setAtt: function (att) { _att.push(att); },
				getAttData: function () { return _attData; },
				setAttData: function (attData) { _attData.push(attData); },
				getIsHtml: function () { return _isHTML; },
				setIsHtml: function (isHTML) { _isHTML = isHTML;}
			}
		}
});