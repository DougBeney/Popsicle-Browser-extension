//Background.js

var redirectURLS = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

chrome.tabs.onCreated.addListener(function(tab){

	for (var i = 0; i < redirectURLS.length; i++) {
		//console.log(tab);
		if(tab.url === redirectURLS[i])
			break; // user is trying to open startpage
		if(i == redirectURLS.length - 1)
			return; // Tab is not trying to open a startpage
	};

	chrome.tabs.update(tab.id, {url:"index.html"});

});
