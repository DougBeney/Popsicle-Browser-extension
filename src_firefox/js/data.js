(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
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
				"links": [{
					"label": "DuckDuckGo",
					"URL": "https://duckduckgo.com/"
				}, {
					"label": "Proton Mail",
					"URL": "https://protonmail.com"
				}, {
					"label": "Feedly",
					"URL": "https://feedly.com"
				}, {
					"label": "Wikipedia",
					"URL": "https://www.wikipedia.org/"
				}]
			},
			"col2": {
				"label": "Social Media",
				"links": [{
					"label": "Twitter",
					"URL": "https://twitter.com/"
				}, {
					"label": "YouTube",
					"URL": "https://youtube.com/"
				}, {
					"label": "reddit",
					"URL": "https://reddit.com/"
				}, {
					"label": "Imgur",
					"URL": "https://imgur.com/"
				}]
			}
		}
	},
	userInfo: {},
	propagateUserSettings: function propagateUserSettings() {
		userInfo = defaults;
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
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZTRiOWM5ZjkuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJjYXRlZ29yaWVzIiwiY29sb3JzIiwiYmciLCJ0ZXh0IiwicXVvdGUiLCJsaW5rIiwidmlzaWJpbGl0eV9oZWxwZXIiLCJiYWNrZ3JvdW5kIiwibGlua3MiLCJ1c2VySW5mbyIsInByb3BhZ2F0ZVVzZXJTZXR0aW5ncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBQWU7QUFDZEEsV0FBVTtBQUNUQyxjQUFZLENBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsTUFBcEIsQ0FESDtBQUVUQyxVQUFRO0FBQ1BDLE9BQUksU0FERztBQUVQQyxTQUFNLGlCQUZDO0FBR1BDLFVBQU8saUJBSEE7QUFJUEMsU0FBTTtBQUpDLEdBRkM7QUFRVEMscUJBQW1CLEtBUlY7QUFTVEMsY0FBWTtBQUNYLGNBQVcsS0FEQTtBQUVYLFlBQVMsRUFGRTtBQUdYLGNBQVc7QUFIQSxHQVRIO0FBY1RDLFNBQU87QUFDTixXQUFRO0FBQ1AsYUFBUyxhQURGO0FBRVAsYUFBUyxDQUNSO0FBQ0MsY0FBUyxZQURWO0FBRUMsWUFBTztBQUZSLEtBRFEsRUFLUjtBQUNDLGNBQVMsYUFEVjtBQUVDLFlBQU87QUFGUixLQUxRLEVBU1I7QUFDQyxjQUFTLFFBRFY7QUFFQyxZQUFPO0FBRlIsS0FUUSxFQWFSO0FBQ0MsY0FBUyxXQURWO0FBRUMsWUFBTztBQUZSLEtBYlE7QUFGRixJQURGO0FBc0JOLFdBQVE7QUFDUCxhQUFTLGNBREY7QUFFUCxhQUFTLENBQ1I7QUFDQyxjQUFTLFNBRFY7QUFFQyxZQUFPO0FBRlIsS0FEUSxFQUtSO0FBQ0MsY0FBUyxTQURWO0FBRUMsWUFBTztBQUZSLEtBTFEsRUFTUjtBQUNDLGNBQVMsUUFEVjtBQUVDLFlBQU87QUFGUixLQVRRLEVBYVI7QUFDQyxjQUFTLE9BRFY7QUFFQyxZQUFPO0FBRlIsS0FiUTtBQUZGO0FBdEJGO0FBZEUsRUFESTtBQTREZEMsV0FBVSxFQTVESTtBQTZEZEMsc0JBN0RjLG1DQTZEVTtBQUN2QkQsYUFBV1YsUUFBWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6RWEsQyIsImZpbGUiOiJmYWtlX2U0YjljOWY5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuXHRkZWZhdWx0czoge1xuXHRcdGNhdGVnb3JpZXM6IFsnYnVzaW5lc3MnLCAnYXJ0JywgJ2xpZmUnXSxcblx0XHRjb2xvcnM6IHtcblx0XHRcdGJnOiAnI0Y3RjdGNycsXG5cdFx0XHR0ZXh0OiAncmdiKDk4LCA5OCwgOTgpJyxcblx0XHRcdHF1b3RlOiAncmdiKDY0LCA2NCwgNjQpJyxcblx0XHRcdGxpbms6ICdyZ2IoNjQsIDY0LCA2NCknXG5cdFx0fSxcblx0XHR2aXNpYmlsaXR5X2hlbHBlcjogZmFsc2UsXG5cdFx0YmFja2dyb3VuZDoge1xuXHRcdFx0XCJlbmFibGVkXCI6IGZhbHNlLFxuXHRcdFx0XCJpbWFnZVwiOiBcIlwiLFxuXHRcdFx0XCJvcGFjaXR5XCI6IDEwMFxuXHRcdH0sXG5cdFx0bGlua3M6IHtcblx0XHRcdFwiY29sMVwiOiB7XG5cdFx0XHRcdFwibGFiZWxcIjogXCJRdWljayBMaW5rc1wiLFxuXHRcdFx0XHRcImxpbmtzXCI6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiRHVja0R1Y2tHb1wiLFxuXHRcdFx0XHRcdFx0XCJVUkxcIjogXCJodHRwczovL2R1Y2tkdWNrZ28uY29tL1wiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiUHJvdG9uIE1haWxcIixcblx0XHRcdFx0XHRcdFwiVVJMXCI6IFwiaHR0cHM6Ly9wcm90b25tYWlsLmNvbVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiRmVlZGx5XCIsXG5cdFx0XHRcdFx0XHRcIlVSTFwiOiBcImh0dHBzOi8vZmVlZGx5LmNvbVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiV2lraXBlZGlhXCIsXG5cdFx0XHRcdFx0XHRcIlVSTFwiOiBcImh0dHBzOi8vd3d3Lndpa2lwZWRpYS5vcmcvXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0XCJjb2wyXCI6IHtcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvY2lhbCBNZWRpYVwiLFxuXHRcdFx0XHRcImxpbmtzXCI6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XHRcdFx0XCJVUkxcIjogXCJodHRwczovL3R3aXR0ZXIuY29tL1wiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwiWW91VHViZVwiLFxuXHRcdFx0XHRcdFx0XCJVUkxcIjogXCJodHRwczovL3lvdXR1YmUuY29tL1wiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcImxhYmVsXCI6IFwicmVkZGl0XCIsXG5cdFx0XHRcdFx0XHRcIlVSTFwiOiBcImh0dHBzOi8vcmVkZGl0LmNvbS9cIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJsYWJlbFwiOiBcIkltZ3VyXCIsXG5cdFx0XHRcdFx0XHRcIlVSTFwiOiBcImh0dHBzOi8vaW1ndXIuY29tL1wiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0fSxcblx0dXNlckluZm86IHt9LFxuXHRwcm9wYWdhdGVVc2VyU2V0dGluZ3MoKSB7XG5cdFx0dXNlckluZm8gPSBkZWZhdWx0c1xuXHRcdC8vIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KGZ1bmN0aW9uKGl0ZW1zKXtcblx0XHQvLyBcdGlmKCdwb3BzaWNsZV9zZXR0aW5nc19zeW5jJyBpbiBpdGVtcyl7XG5cdFx0Ly8gXHRcdHVzZXJJbmZvID0gaXRlbXMucG9wc2ljbGVfc2V0dGluZ3Nfc3luY1xuXHRcdC8vIFx0fWVsc2V7XG5cdFx0Ly8gXHRcdHVzZXJJbmZvID0gZGVmYXVsdHNcblx0XHQvLyBcdH1cblx0XHQvLyB9KVxuXHRcdC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChmdW5jdGlvbihpdGVtcyl7XG5cdFx0Ly8gXHQvLyBMb2NhbCBzdG9yYWdlXG5cdFx0Ly8gfSlcblx0fVxufVxuXG4iXX0=
},{}]},{},[1])