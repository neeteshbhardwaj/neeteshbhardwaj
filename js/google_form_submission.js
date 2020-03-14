(function(){
	var objectName = 'GoogleFormSubmitter';
	
	var prepareForm = function(formId, target, action, onsubmitFn){
		$(formId).attr('action', action);
		$(formId).attr('target', target);
		$(formId).attr('onsubmit', onsubmitFn);
	};
	
	var prepareIframe = function(formId, iframeId, refreshUrl, submittedValGetter, reloadOnSubmit, afterSubmitCallback) {
		var attrs = {
			id:  iframeId,
			name: iframeId,
			style: 'display:none'
		};
		var onloadFn = submittedValGetter + " && " + afterSubmitCallback + '()';
		if(reloadOnSubmit) {
			onloadFn += " && (window.location='" + refreshUrl + "')";
		}
		$('<iframe>', {
			id:  iframeId,
			name: iframeId,
			onload: onloadFn,
			style: 'display:none'
		}).appendTo(formId);
	};
	
	var papulateFieldNames = function(fields) {
		fields.forEach(function(field){
			$(field.formField).attr('name', field.googleFormFieldName);
		});
	};
	
	var instance = {
		register : function(jsonArr) {
			jsonArr.forEach(function(json){
				var formId = json.formId;
				var action = json.action;
				var reloadOnSubmit = json.reloadOnSubmit;
				var afterSubmitCallback = json.afterSubmitCallback;
				var fields = json.fields;
				
				window[objectName].data[formId] = {submitted : !1};
				var currentUrl = window.location.href;
				
				var iframeId = 'hidden_iframe_for_' + formId;
				var submittedValGetter = objectName + ".data['" + formId + "'].submitted";
				var onsubmitFn = submittedValGetter + ' = !0; this.reset();';
				
				formId = '#' + formId;
				prepareForm(formId, iframeId, action, onsubmitFn);
				prepareIframe(formId, iframeId, currentUrl, submittedValGetter, reloadOnSubmit, afterSubmitCallback);
				papulateFieldNames(fields);
				
			});
		},
		data: {}
	};
	
	window[objectName] = instance;
})();