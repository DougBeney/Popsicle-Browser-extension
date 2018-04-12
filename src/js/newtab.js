import Vue from 'vue'
import NewTab from './components/newtab-ui.vue'

var userCategories = [];
var userColors = [];
var userLinks = [];
var localBGImage = '';
var userBgImage = {};
var finishedLoadingCount = 0;
var customUserQuoteList = [];

new Vue({
	el: "#app",
	render: h => h(NewTab),
})

$(document).ready(function () {
	chrome.storage.sync.get(function(items){
		if('userCategories' in items){
			userCategories = items.userCategories;
		}else{
			userCategories = default_categories;
		}
		initQuotes();
		console.log(userCategories)

		if('userColors' in items){
			userColors = items.userColors;
		}else{
			userColors = default_colors;
		}

		if('userLinks' in items){
			userLinks = items.userLinks;
		}else{
			userLinks = default_links;
		}

		//background image
		if('userBgImage' in items){
			userBgImage = items.userBgImage;
		}else{
			userBgImage = default_bg_image;
		}

		chrome.storage.local.get(function(items){
			if('localBGImage' in items){
				localBGImage = items.localBGImage;
			}else{
				localBGImage = default_localBGImage;
			}

			if(userBgImage.enabled){
				$('#bgenabled').attr('checked', true);

				$('body').css('background-image', 'url('+localBGImage+')');
				$('.cover').css('opacity', userBgImage.opacity/100);
			}else{
				$('#bgenabled').attr('checked', false);
				$('body').css('background-image', 'none');
			}
		});

		initLinks();

		$('.cover').css('background-color', userColors['bg']);
		$('.container').css('color', userColors['text']);
		$('blockquote').css('color', userColors['quote']);
		$('.container a').css('color', userColors['link']);
	});
});

function initLinks(){
	for (var i = 1; i <= 2; i++){
		var linkCol = $('.row'+i);
		linkCol.find("h2").text(userLinks['col'+i].label);

		var linkList = userLinks['col'+i].links;

		for(var x in linkList){
			var html = '';
			html+='<li>';
			html+='<a href="'+linkList[x].URL+'">';
			html+=linkList[x].label;
			html+='</a>';
			html+='</li>';
			linkCol.find("ul").append(html);
		}
	}
}

function initQuotes(){
	for(var i in userCategories){
		loadQuotes(userCategories[i], function(quotes){
			finishedLoadingCount++;
			for(var i in quotes){
				customUserQuoteList.push(quotes[i]);
			}

			if(finishedLoadingCount == userCategories.length){
				//Loading all user categories completed

				var randomIndex = Math.floor((Math.random() * customUserQuoteList.length-1) + 1);
				var theQuote = customUserQuoteList[randomIndex].quote;
				var theAuthor = customUserQuoteList[randomIndex].author;

				//Do whatever you want with the quote and author

				if (wordCount(theQuote) > 30) {
					$('blockquote .quote').css('font-size', '30px');
				}

				$('blockquote .quote').text(theQuote);
				$('blockquote .author').text(theAuthor);
				$('body').animate({opacity: 1}, 500);

			}
		});
	}
}

function loadQuotes(category, callback) {
	loadJSON('/json/'+category+".json", function( data ) {
		callback(data);
	});
}

function loadJSON(path, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					callback(JSON.parse(xhr.responseText));
			} else {
				if (error)
					console.error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function wordCount( val ){
	var wom = val.match(/\S+/g);
	return wom ? wom.length : 0;
}
