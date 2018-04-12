<template lang="pug">
.vue-newtab
	.cover
	.container
		blockquote
			.quote {{userInfo}}
			.author {{author}}
			hr
			
		.row
			.list.col.col--1-of-2.row1(v-for="list in linklists")
				h2 {{list.title}}
				ul
					li(v-for="item in list.items")
						a(href="item.url") item.title
</template>

<script charset="utf-8">
import PopsicleData from '../data.js'

export default {
	created() {
		console.log(PopsicleData)
	},
	methods: {
		getQuote() {

		}
	},
	data() {
		return {
			quote: "MyQuote",
			author: "authoor",

			userInfo: PopsicleData
		}
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
</script>
