export default {
	defaults: {
		categories: ['business', 'art', 'life'],
		colors: {
			bg: '#F7F7F7',
			text: 'rgb(98, 98, 98)',
			quote: 'rgb(64, 64, 64)',
			link: 'rgb(64, 64, 64)'
		},
		visibility_helper: false,
		background: {
			"enabled": false,
			"image": "",
			"opacity": 100
		},
		links: {
			"col1": {
				"label": "Quick Links",
				"links": [
					{
						"label": "DuckDuckGo",
						"URL": "https://duckduckgo.com/"
					},
					{
						"label": "Proton Mail",
						"URL": "https://protonmail.com"
					},
					{
						"label": "Feedly",
						"URL": "https://feedly.com"
					},
					{
						"label": "Wikipedia",
						"URL": "https://www.wikipedia.org/"
					},
				]
			},
			"col2": {
				"label": "Social Media",
				"links": [
					{
						"label": "Twitter",
						"URL": "https://twitter.com/"
					},
					{
						"label": "YouTube",
						"URL": "https://youtube.com/"
					},
					{
						"label": "reddit",
						"URL": "https://reddit.com/"
					},
					{
						"label": "Imgur",
						"URL": "https://imgur.com/"
					}
				]
			}
		},
	},
	userInfo: {},
	propagateUserSettings() {
		userInfo = defaults
		// chrome.storage.sync.get(function(items){
		// 	if('popsicle_settings_sync' in items){
		// 		userInfo = items.popsicle_settings_sync
		// 	}else{
		// 		userInfo = defaults
		// 	}
		// })
		// chrome.storage.local.get(function(items){
		// 	// Local storage
		// })
	}
}

