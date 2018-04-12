(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(function () {
	var area = $('#category_area');

	var categories = ['business', 'faith', 'finance', 'money', 'art', 'funny', 'computers', 'design', 'intelligence', 'government', 'freedom', 'happiness', 'hope', 'gardening', 'failure', 'history', 'environmental', 'diet', 'teen', 'thankful', 'travel', 'women', 'work', 'science', 'romantic', 'society', 'religion', 'fitness', 'sports', 'war', 'famous', 'life', 'leadership', 'dreams', 'marriage', 'strength'];

	categories.sort();

	// Quote Category List Selection
	area.append('<div class="row categories">');
	$('.categories').append('<h2>Quote Categories</h2>');
	$('.categories').append('<div class="cat-column-1 col col--1-of-2">');

	for (var i = 0; i < categories.length / 2; i++) {
		$('.cat-column-1').append(_input({
			type: "checkbox",
			name: "popsicle_categories",
			value: categories[i],
			after: categories[i]
		}));
	}

	$('.categories').append('<div class="cat-column-2 col col--1-of-2">');
	for (var i = categories.length / 2; i < categories.length; i++) {
		$('.cat-column-2').append(_input({
			type: "checkbox",
			name: "popsicle_categories",
			value: categories[i],
			after: categories[i]
		}));
	}
	var colorUI = $('.jscolor');
	var categoryUI = $('.categories input[type="checkbox"]');
	var userCategories = [];
	var userColors = {};
	var userLinks = {};
	var userBgImage = {};
	var localBGImage = '';

	chrome.storage.local.get(function (items) {
		if ('localBGImage' in items) {
			localBGImage = items.localBGImage;
		} else {
			localBGImage = default_localBGImage;
		}
	});

	chrome.storage.sync.get(function (items) {
		//colors
		if ('userColors' in items && !isEmpty(items.userColors)) {
			userColors = items.userColors;
		} else {
			userColors = default_colors;
		}

		//categories
		if ('userCategories' in items) {
			userCategories = items.userCategories;
		} else {
			userCategories = default_categories;
		}

		//links
		if ('userLinks' in items) {
			userLinks = items.userLinks;
		} else {
			userLinks = default_links;
		}

		//background image
		if ('userBgImage' in items) {
			userBgImage = items.userBgImage;
		} else {
			userBgImage = default_bg_image;
		}

		update_UI();
	});

	$('.opacity').on('change', function () {
		userBgImage.opacity = $(this).val();
	});

	$('#bgupload').on('change', function () {
		var preview = $('#placeholderimg');
		var file = $(this)[0].files[0];
		var reader = new FileReader();

		reader.addEventListener('load', function () {
			var imageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
			if (stringContainsArrayItem(file.name, imageFormats)) {
				preview.attr('src', reader.result);
				localBGImage = reader.result;
			}
		}, false);

		if (file) {
			reader.readAsDataURL(file);
		}
	});

	$('button.save').on('click', function () {
		userCategories = [];
		categoryUI.each(function (index) {
			var curCategory = $(this).attr('value');
			var checked = $(this).prop('checked');

			if (checked) {
				userCategories.push(curCategory);
			}
		});
		colorUI.each(function (index) {
			var curColorName = $(this).attr('name');
			var curColor = $(this).css('background-color');
			userColors[curColorName] = curColor;
		});

		//backgroundimage
		userBgImage.enabled = $('#bgenabled')[0].checked;

		userLinks = {
			"col1": {
				"label": "",
				"links": []
			},
			"col2": {
				"label": "",
				"links": []
			}
		};

		for (var i = 1; i <= 2; i++) {

			userLinks['col' + i].label = $('.col' + i + ' input[name="column_label"]').val();
			$('.col' + i + ' .link-list .link').each(function (index) {
				var theLabel = $(this).find('input[name="label"]').val();
				var theURL = $(this).find('input[name="url"]').val();

				userLinks['col' + i].links.push({
					"label": theLabel,
					"URL": theURL
				});
			});
		}
		$('#message').toggle(function () {
			$('#message').css('display', 'none');
		});

		update_UI();
	});

	$('button.reset').on('click', function () {
		userCategories = default_categories;
		userColors = default_colors;
		userLinks = default_links;
		userBgImage = default_bg_image;
		localBGImage = default_localBGImage;
		update_UI();
	});

	function update_UI() {
		//The update_UI loops through each category checkbox, checks if the category is user-selected, and updates accordingly.
		categoryUI.each(function (index) {
			var curCategory = $(this).attr('value');

			if ($.inArray(curCategory, userCategories) != -1) {
				$(this).prop('checked', true);
			} else {
				$(this).prop('checked', false);
			}
		});
		colorUI.each(function (index) {
			var curColorName = $(this).attr('name');
			var picker = $(this)[0];

			picker.jscolor.fromString(userColors[curColorName]);
		});

		//saves settings
		chrome.storage.sync.set({
			userCategories: userCategories,
			userColors: userColors,
			userLinks: userLinks,
			userBgImage: userBgImage
		});

		chrome.storage.local.set({
			localBGImage: localBGImage
		});

		$('.opacity').val(userBgImage.opacity);
		$('#placeholderimg').attr('src', localBGImage);

		if (userBgImage.enabled) {
			$('#bgenabled').attr('checked', true);

			$('body').css('background-image', 'url(' + localBGImage + ')');
			$('.cover').css('opacity', userBgImage.opacity / 100);
		} else {
			$('#bgenabled').attr('checked', false);
			$('body').css('background-image', 'none');
		}

		for (var i = 1; i <= 2; i++) {
			$('.col' + i + ' input[name="column_label"]').val(userLinks['col' + i].label);

			$('.col' + i + ' .link-list').text('');
			var theArray = userLinks['col' + i].links;

			for (var x in theArray) {
				$('.col' + i + ' .link-list').append(_url_adder(theArray[x].label, theArray[x].URL));
			}
		}

		$('.cover').css('background-color', userColors['bg']);
		$('.container').css('color', userColors['text']);
		$('blockquote').css('color', userColors['quote']);
		$('.container a').css('color', userColors['link']);
	}

	for (var i = 1; i <= 2; i++) {
		$('.col' + i + ' button.addLink').on('click', function () {
			var colclass = $(this).parent().attr('class');
			var col = colclass.replace('col', '');

			$('.col' + col + ' .link-list').append(_url_adder());
		});
	}

	$(document).on('click', '.removeLink', function () {
		$(this).parent().parent().remove();
	});

	function _url_adder(label, url) {
		if (!label || !url || label == undefined || url == undefined) {
			label = '';
			url = '';
		}
		var html = '';
		html += '<div class="link row">';
		html += '<div class="col col--5-of-12">';
		html += '<label class="middle">Label</label>';
		html += '<input type="text" name="label" placeholder="ex. Facebook" value="' + label + '">';
		html += '</div>';
		html += '<div class="col col--5-of-12">';
		html += '<label class="middle">URL</label>';
		html += '<input type="text" name="url" placeholder="ex. http://www.facebook.com/" value="' + url + '">';
		html += '</div>';
		html += '<div class="col col--2-of-12">';
		html += '<label class="middle">Remove</label>';
		html += '<button class="removeLink">X</button>';
		html += '</div>';
		html += '</div>';
		return html;
	}

	function _input(options) {
		var theClass = "popsicle-input";
		if (options.class) {
			theClass = theClass + " " + options.class;
		}

		if (options.after) {
			return _s('<input class="%s" type="%s" name="%s" value="%s" /><label>%s</label><br>', [theClass, options.type, options.name, options.value, options.after]);
		} else {
			return _s('<input class="%s" type="%s" name="%s" value="%s"><br>', [theClass, options.type, options.name, options.value]);
		}
	}

	function _s(string, array) {
		var str_array = string.split('%s');

		var final_string = '';

		for (var i in array) {
			final_string += str_array[i];
			final_string += array[i];
		}
		if (str_array.length > array.length) {
			final_string += str_array[str_array.length - 1];
		}

		return final_string;
	}

	function isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}

		return JSON.stringify(obj) === JSON.stringify({});
	}

	function stringContainsArrayItem(string, array) {
		for (var i in array) {
			if (string.includes(array[i])) {
				return true;
			}
		}
		return false;
	}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYjNjYzcyOTQuanMiXSwibmFtZXMiOlsiJCIsImFyZWEiLCJjYXRlZ29yaWVzIiwic29ydCIsImFwcGVuZCIsImkiLCJsZW5ndGgiLCJfaW5wdXQiLCJ0eXBlIiwibmFtZSIsInZhbHVlIiwiYWZ0ZXIiLCJjb2xvclVJIiwiY2F0ZWdvcnlVSSIsInVzZXJDYXRlZ29yaWVzIiwidXNlckNvbG9ycyIsInVzZXJMaW5rcyIsInVzZXJCZ0ltYWdlIiwibG9jYWxCR0ltYWdlIiwiY2hyb21lIiwic3RvcmFnZSIsImxvY2FsIiwiZ2V0IiwiaXRlbXMiLCJkZWZhdWx0X2xvY2FsQkdJbWFnZSIsInN5bmMiLCJpc0VtcHR5IiwiZGVmYXVsdF9jb2xvcnMiLCJkZWZhdWx0X2NhdGVnb3JpZXMiLCJkZWZhdWx0X2xpbmtzIiwiZGVmYXVsdF9iZ19pbWFnZSIsInVwZGF0ZV9VSSIsIm9uIiwib3BhY2l0eSIsInZhbCIsInByZXZpZXciLCJmaWxlIiwiZmlsZXMiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImltYWdlRm9ybWF0cyIsInN0cmluZ0NvbnRhaW5zQXJyYXlJdGVtIiwiYXR0ciIsInJlc3VsdCIsInJlYWRBc0RhdGFVUkwiLCJlYWNoIiwiaW5kZXgiLCJjdXJDYXRlZ29yeSIsImNoZWNrZWQiLCJwcm9wIiwicHVzaCIsImN1ckNvbG9yTmFtZSIsImN1ckNvbG9yIiwiY3NzIiwiZW5hYmxlZCIsImxhYmVsIiwidGhlTGFiZWwiLCJmaW5kIiwidGhlVVJMIiwibGlua3MiLCJ0b2dnbGUiLCJpbkFycmF5IiwicGlja2VyIiwianNjb2xvciIsImZyb21TdHJpbmciLCJzZXQiLCJ0ZXh0IiwidGhlQXJyYXkiLCJ4IiwiX3VybF9hZGRlciIsIlVSTCIsImNvbGNsYXNzIiwicGFyZW50IiwiY29sIiwicmVwbGFjZSIsImRvY3VtZW50IiwicmVtb3ZlIiwidXJsIiwidW5kZWZpbmVkIiwiaHRtbCIsIm9wdGlvbnMiLCJ0aGVDbGFzcyIsImNsYXNzIiwiX3MiLCJzdHJpbmciLCJhcnJheSIsInN0cl9hcnJheSIsInNwbGl0IiwiZmluYWxfc3RyaW5nIiwib2JqIiwiaGFzT3duUHJvcGVydHkiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5jbHVkZXMiXSwibWFwcGluZ3MiOiI7O0FBQUFBLEVBQUUsWUFBVTtBQUNYLEtBQUlDLE9BQU9ELEVBQUUsZ0JBQUYsQ0FBWDs7QUFFQSxLQUFJRSxhQUFhLENBQ2hCLFVBRGdCLEVBRWhCLE9BRmdCLEVBR2hCLFNBSGdCLEVBSWhCLE9BSmdCLEVBS2hCLEtBTGdCLEVBTWhCLE9BTmdCLEVBT2hCLFdBUGdCLEVBUWhCLFFBUmdCLEVBU2hCLGNBVGdCLEVBVWhCLFlBVmdCLEVBV2hCLFNBWGdCLEVBWWhCLFdBWmdCLEVBYWhCLE1BYmdCLEVBY2hCLFdBZGdCLEVBZWhCLFNBZmdCLEVBZ0JoQixTQWhCZ0IsRUFpQmhCLGVBakJnQixFQWtCaEIsTUFsQmdCLEVBbUJoQixNQW5CZ0IsRUFvQmhCLFVBcEJnQixFQXFCaEIsUUFyQmdCLEVBc0JoQixPQXRCZ0IsRUF1QmhCLE1BdkJnQixFQXdCaEIsU0F4QmdCLEVBeUJoQixVQXpCZ0IsRUEwQmhCLFNBMUJnQixFQTJCaEIsVUEzQmdCLEVBNEJoQixTQTVCZ0IsRUE2QmhCLFFBN0JnQixFQThCaEIsS0E5QmdCLEVBK0JoQixRQS9CZ0IsRUFnQ2hCLE1BaENnQixFQWlDaEIsWUFqQ2dCLEVBa0NoQixRQWxDZ0IsRUFtQ2hCLFVBbkNnQixFQW9DaEIsVUFwQ2dCLENBQWpCOztBQXVDQUEsWUFBV0MsSUFBWDs7QUFFQztBQUNBRixNQUFLRyxNQUFMLENBQVksOEJBQVo7QUFDQUosR0FBRSxhQUFGLEVBQWlCSSxNQUFqQixDQUF3QiwyQkFBeEI7QUFDQUosR0FBRSxhQUFGLEVBQWlCSSxNQUFqQixDQUF3Qiw0Q0FBeEI7O0FBRUEsTUFBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSUgsV0FBV0ksTUFBWCxHQUFrQixDQUFyQyxFQUF3Q0QsR0FBeEMsRUFBNEM7QUFDM0NMLElBQUUsZUFBRixFQUFtQkksTUFBbkIsQ0FBMEJHLE9BQU87QUFDaENDLFNBQU0sVUFEMEI7QUFFaENDLFNBQU0scUJBRjBCO0FBR2hDQyxVQUFPUixXQUFXRyxDQUFYLENBSHlCO0FBSWhDTSxVQUFPVCxXQUFXRyxDQUFYO0FBSnlCLEdBQVAsQ0FBMUI7QUFNQTs7QUFFREwsR0FBRSxhQUFGLEVBQWlCSSxNQUFqQixDQUF3Qiw0Q0FBeEI7QUFDQSxNQUFJLElBQUlDLElBQUlILFdBQVdJLE1BQVgsR0FBa0IsQ0FBOUIsRUFBaUNELElBQUlILFdBQVdJLE1BQWhELEVBQXdERCxHQUF4RCxFQUE0RDtBQUMzREwsSUFBRSxlQUFGLEVBQW1CSSxNQUFuQixDQUEwQkcsT0FBTztBQUNoQ0MsU0FBTSxVQUQwQjtBQUVoQ0MsU0FBTSxxQkFGMEI7QUFHaENDLFVBQU9SLFdBQVdHLENBQVgsQ0FIeUI7QUFJaENNLFVBQU9ULFdBQVdHLENBQVg7QUFKeUIsR0FBUCxDQUExQjtBQU1BO0FBQ0YsS0FBSU8sVUFBVVosRUFBRSxVQUFGLENBQWQ7QUFDQSxLQUFJYSxhQUFhYixFQUFFLG9DQUFGLENBQWpCO0FBQ0EsS0FBSWMsaUJBQWlCLEVBQXJCO0FBQ0EsS0FBSUMsYUFBYSxFQUFqQjtBQUNBLEtBQUlDLFlBQVksRUFBaEI7QUFDQSxLQUFJQyxjQUFjLEVBQWxCO0FBQ0EsS0FBSUMsZUFBZSxFQUFuQjs7QUFFQUMsUUFBT0MsT0FBUCxDQUFlQyxLQUFmLENBQXFCQyxHQUFyQixDQUF5QixVQUFTQyxLQUFULEVBQWU7QUFDdkMsTUFBRyxrQkFBa0JBLEtBQXJCLEVBQTJCO0FBQzFCTCxrQkFBZUssTUFBTUwsWUFBckI7QUFDQSxHQUZELE1BRUs7QUFDSkEsa0JBQWVNLG9CQUFmO0FBQ0E7QUFDRCxFQU5EOztBQVFBTCxRQUFPQyxPQUFQLENBQWVLLElBQWYsQ0FBb0JILEdBQXBCLENBQXdCLFVBQVNDLEtBQVQsRUFBZTtBQUN0QztBQUNBLE1BQUcsZ0JBQWdCQSxLQUFoQixJQUF5QixDQUFDRyxRQUFRSCxNQUFNUixVQUFkLENBQTdCLEVBQXVEO0FBQ3REQSxnQkFBYVEsTUFBTVIsVUFBbkI7QUFDQSxHQUZELE1BRUs7QUFDSkEsZ0JBQWFZLGNBQWI7QUFDQTs7QUFFRDtBQUNBLE1BQUcsb0JBQW9CSixLQUF2QixFQUE2QjtBQUM1QlQsb0JBQWlCUyxNQUFNVCxjQUF2QjtBQUNBLEdBRkQsTUFFSztBQUNKQSxvQkFBaUJjLGtCQUFqQjtBQUNBOztBQUVEO0FBQ0EsTUFBRyxlQUFlTCxLQUFsQixFQUF3QjtBQUN2QlAsZUFBWU8sTUFBTVAsU0FBbEI7QUFDQSxHQUZELE1BRUs7QUFDSkEsZUFBWWEsYUFBWjtBQUNBOztBQUVEO0FBQ0EsTUFBRyxpQkFBaUJOLEtBQXBCLEVBQTBCO0FBQ3pCTixpQkFBY00sTUFBTU4sV0FBcEI7QUFDQSxHQUZELE1BRUs7QUFDSkEsaUJBQWNhLGdCQUFkO0FBQ0E7O0FBRURDO0FBQ0EsRUE5QkQ7O0FBZ0NBL0IsR0FBRSxVQUFGLEVBQWNnQyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLFlBQVU7QUFDcENmLGNBQVlnQixPQUFaLEdBQXNCakMsRUFBRSxJQUFGLEVBQVFrQyxHQUFSLEVBQXRCO0FBQ0EsRUFGRDs7QUFJQWxDLEdBQUUsV0FBRixFQUFlZ0MsRUFBZixDQUFrQixRQUFsQixFQUE0QixZQUFVO0FBQ3JDLE1BQUlHLFVBQVVuQyxFQUFFLGlCQUFGLENBQWQ7QUFDQSxNQUFJb0MsT0FBT3BDLEVBQUUsSUFBRixFQUFRLENBQVIsRUFBV3FDLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBWDtBQUNBLE1BQUlDLFNBQVMsSUFBSUMsVUFBSixFQUFiOztBQUVBRCxTQUFPRSxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFVO0FBQ3pDLE9BQUlDLGVBQWUsQ0FBQyxNQUFELEVBQVEsT0FBUixFQUFnQixNQUFoQixFQUF1QixNQUF2QixDQUFuQjtBQUNBLE9BQUdDLHdCQUF3Qk4sS0FBSzNCLElBQTdCLEVBQW1DZ0MsWUFBbkMsQ0FBSCxFQUFvRDtBQUNuRE4sWUFBUVEsSUFBUixDQUFhLEtBQWIsRUFBb0JMLE9BQU9NLE1BQTNCO0FBQ0ExQixtQkFBZW9CLE9BQU9NLE1BQXRCO0FBQ0E7QUFDRCxHQU5ELEVBTUcsS0FOSDs7QUFRQSxNQUFJUixJQUFKLEVBQVU7QUFDVEUsVUFBT08sYUFBUCxDQUFxQlQsSUFBckI7QUFDQTtBQUNELEVBaEJEOztBQWtCQXBDLEdBQUUsYUFBRixFQUFpQmdDLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFlBQVU7QUFDdENsQixtQkFBaUIsRUFBakI7QUFDQUQsYUFBV2lDLElBQVgsQ0FBZ0IsVUFBU0MsS0FBVCxFQUFlO0FBQzlCLE9BQUlDLGNBQWNoRCxFQUFFLElBQUYsRUFBUTJDLElBQVIsQ0FBYSxPQUFiLENBQWxCO0FBQ0EsT0FBSU0sVUFBVWpELEVBQUUsSUFBRixFQUFRa0QsSUFBUixDQUFhLFNBQWIsQ0FBZDs7QUFHQSxPQUFHRCxPQUFILEVBQVc7QUFDVm5DLG1CQUFlcUMsSUFBZixDQUFvQkgsV0FBcEI7QUFDQTtBQUNELEdBUkQ7QUFTQXBDLFVBQVFrQyxJQUFSLENBQWEsVUFBU0MsS0FBVCxFQUFlO0FBQzNCLE9BQUlLLGVBQWVwRCxFQUFFLElBQUYsRUFBUTJDLElBQVIsQ0FBYSxNQUFiLENBQW5CO0FBQ0EsT0FBSVUsV0FBV3JELEVBQUUsSUFBRixFQUFRc0QsR0FBUixDQUFZLGtCQUFaLENBQWY7QUFDQXZDLGNBQVdxQyxZQUFYLElBQTJCQyxRQUEzQjtBQUNBLEdBSkQ7O0FBTUE7QUFDQXBDLGNBQVlzQyxPQUFaLEdBQXNCdkQsRUFBRSxZQUFGLEVBQWdCLENBQWhCLEVBQW1CaUQsT0FBekM7O0FBR0FqQyxjQUFZO0FBQ1gsV0FBUTtBQUNOLGFBQVMsRUFESDtBQUVOLGFBQVM7QUFGSCxJQURHO0FBS1gsV0FBUTtBQUNOLGFBQVMsRUFESDtBQUVOLGFBQVM7QUFGSDtBQUxHLEdBQVo7O0FBV0EsT0FBSSxJQUFJWCxJQUFJLENBQVosRUFBZUEsS0FBSyxDQUFwQixFQUF1QkEsR0FBdkIsRUFBMkI7O0FBRTFCVyxhQUFVLFFBQU1YLENBQWhCLEVBQW1CbUQsS0FBbkIsR0FBMkJ4RCxFQUFFLFNBQU9LLENBQVAsR0FBUyw2QkFBWCxFQUEwQzZCLEdBQTFDLEVBQTNCO0FBQ0FsQyxLQUFFLFNBQU9LLENBQVAsR0FBUyxtQkFBWCxFQUFnQ3lDLElBQWhDLENBQXFDLFVBQVNDLEtBQVQsRUFBZTtBQUNuRCxRQUFJVSxXQUFXekQsRUFBRSxJQUFGLEVBQVEwRCxJQUFSLENBQWEscUJBQWIsRUFBb0N4QixHQUFwQyxFQUFmO0FBQ0EsUUFBSXlCLFNBQVMzRCxFQUFFLElBQUYsRUFBUTBELElBQVIsQ0FBYSxtQkFBYixFQUFrQ3hCLEdBQWxDLEVBQWI7O0FBRUFsQixjQUFVLFFBQU1YLENBQWhCLEVBQW1CdUQsS0FBbkIsQ0FBeUJULElBQXpCLENBQThCO0FBQzdCLGNBQVNNLFFBRG9CO0FBRTdCLFlBQU9FO0FBRnNCLEtBQTlCO0FBSUEsSUFSRDtBQVNBO0FBQ0QzRCxJQUFFLFVBQUYsRUFBYzZELE1BQWQsQ0FBcUIsWUFBVTtBQUM5QjdELEtBQUUsVUFBRixFQUFjc0QsR0FBZCxDQUFrQixTQUFsQixFQUE2QixNQUE3QjtBQUNBLEdBRkQ7O0FBSUF2QjtBQUNBLEVBbEREOztBQW9EQS9CLEdBQUUsY0FBRixFQUFrQmdDLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLFlBQVU7QUFDdkNsQixtQkFBaUJjLGtCQUFqQjtBQUNBYixlQUFhWSxjQUFiO0FBQ0FYLGNBQVlhLGFBQVo7QUFDQVosZ0JBQWNhLGdCQUFkO0FBQ0FaLGlCQUFlTSxvQkFBZjtBQUNBTztBQUNBLEVBUEQ7O0FBU0EsVUFBU0EsU0FBVCxHQUFvQjtBQUNuQjtBQUNBbEIsYUFBV2lDLElBQVgsQ0FBZ0IsVUFBU0MsS0FBVCxFQUFlO0FBQzlCLE9BQUlDLGNBQWNoRCxFQUFFLElBQUYsRUFBUTJDLElBQVIsQ0FBYSxPQUFiLENBQWxCOztBQUVBLE9BQUczQyxFQUFFOEQsT0FBRixDQUFVZCxXQUFWLEVBQXVCbEMsY0FBdkIsS0FBMEMsQ0FBQyxDQUE5QyxFQUFnRDtBQUMvQ2QsTUFBRSxJQUFGLEVBQVFrRCxJQUFSLENBQWEsU0FBYixFQUF3QixJQUF4QjtBQUNBLElBRkQsTUFFSztBQUNKbEQsTUFBRSxJQUFGLEVBQVFrRCxJQUFSLENBQWEsU0FBYixFQUF3QixLQUF4QjtBQUNBO0FBQ0QsR0FSRDtBQVNBdEMsVUFBUWtDLElBQVIsQ0FBYSxVQUFTQyxLQUFULEVBQWU7QUFDM0IsT0FBSUssZUFBZXBELEVBQUUsSUFBRixFQUFRMkMsSUFBUixDQUFhLE1BQWIsQ0FBbkI7QUFDQSxPQUFJb0IsU0FBUy9ELEVBQUUsSUFBRixFQUFRLENBQVIsQ0FBYjs7QUFFQStELFVBQU9DLE9BQVAsQ0FBZUMsVUFBZixDQUEwQmxELFdBQVdxQyxZQUFYLENBQTFCO0FBQ0EsR0FMRDs7QUFPQTtBQUNBakMsU0FBT0MsT0FBUCxDQUFlSyxJQUFmLENBQW9CeUMsR0FBcEIsQ0FBd0I7QUFDdkJwRCxtQkFBZ0JBLGNBRE87QUFFdkJDLGVBQVlBLFVBRlc7QUFHdkJDLGNBQVdBLFNBSFk7QUFJdkJDLGdCQUFhQTtBQUpVLEdBQXhCOztBQU9BRSxTQUFPQyxPQUFQLENBQWVDLEtBQWYsQ0FBcUI2QyxHQUFyQixDQUF5QjtBQUN4QmhELGlCQUFjQTtBQURVLEdBQXpCOztBQUlBbEIsSUFBRSxVQUFGLEVBQWNrQyxHQUFkLENBQWtCakIsWUFBWWdCLE9BQTlCO0FBQ0FqQyxJQUFFLGlCQUFGLEVBQXFCMkMsSUFBckIsQ0FBMEIsS0FBMUIsRUFBaUN6QixZQUFqQzs7QUFFQSxNQUFHRCxZQUFZc0MsT0FBZixFQUF1QjtBQUN0QnZELEtBQUUsWUFBRixFQUFnQjJDLElBQWhCLENBQXFCLFNBQXJCLEVBQWdDLElBQWhDOztBQUVBM0MsS0FBRSxNQUFGLEVBQVVzRCxHQUFWLENBQWMsa0JBQWQsRUFBa0MsU0FBT3BDLFlBQVAsR0FBb0IsR0FBdEQ7QUFDQWxCLEtBQUUsUUFBRixFQUFZc0QsR0FBWixDQUFnQixTQUFoQixFQUEyQnJDLFlBQVlnQixPQUFaLEdBQW9CLEdBQS9DO0FBQ0EsR0FMRCxNQUtLO0FBQ0pqQyxLQUFFLFlBQUYsRUFBZ0IyQyxJQUFoQixDQUFxQixTQUFyQixFQUFnQyxLQUFoQztBQUNBM0MsS0FBRSxNQUFGLEVBQVVzRCxHQUFWLENBQWMsa0JBQWQsRUFBa0MsTUFBbEM7QUFDQTs7QUFFRCxPQUFJLElBQUlqRCxJQUFJLENBQVosRUFBZUEsS0FBSyxDQUFwQixFQUF1QkEsR0FBdkIsRUFBMkI7QUFDMUJMLEtBQUUsU0FBT0ssQ0FBUCxHQUFTLDZCQUFYLEVBQTBDNkIsR0FBMUMsQ0FBOENsQixVQUFVLFFBQU1YLENBQWhCLEVBQW1CbUQsS0FBakU7O0FBRUF4RCxLQUFFLFNBQU9LLENBQVAsR0FBUyxhQUFYLEVBQTBCOEQsSUFBMUIsQ0FBK0IsRUFBL0I7QUFDQSxPQUFJQyxXQUFXcEQsVUFBVSxRQUFNWCxDQUFoQixFQUFtQnVELEtBQWxDOztBQUVBLFFBQUksSUFBSVMsQ0FBUixJQUFhRCxRQUFiLEVBQXNCO0FBQ3JCcEUsTUFBRSxTQUFPSyxDQUFQLEdBQVMsYUFBWCxFQUEwQkQsTUFBMUIsQ0FBaUNrRSxXQUFXRixTQUFTQyxDQUFULEVBQVliLEtBQXZCLEVBQTZCWSxTQUFTQyxDQUFULEVBQVlFLEdBQXpDLENBQWpDO0FBQ0E7QUFDRDs7QUFFRHZFLElBQUUsUUFBRixFQUFZc0QsR0FBWixDQUFnQixrQkFBaEIsRUFBb0N2QyxXQUFXLElBQVgsQ0FBcEM7QUFDQWYsSUFBRSxZQUFGLEVBQWdCc0QsR0FBaEIsQ0FBb0IsT0FBcEIsRUFBNkJ2QyxXQUFXLE1BQVgsQ0FBN0I7QUFDQWYsSUFBRSxZQUFGLEVBQWdCc0QsR0FBaEIsQ0FBb0IsT0FBcEIsRUFBNkJ2QyxXQUFXLE9BQVgsQ0FBN0I7QUFDQWYsSUFBRSxjQUFGLEVBQWtCc0QsR0FBbEIsQ0FBc0IsT0FBdEIsRUFBK0J2QyxXQUFXLE1BQVgsQ0FBL0I7QUFFQTs7QUFFRCxNQUFJLElBQUlWLElBQUksQ0FBWixFQUFlQSxLQUFLLENBQXBCLEVBQXVCQSxHQUF2QixFQUEyQjtBQUMxQkwsSUFBRSxTQUFPSyxDQUFQLEdBQVMsaUJBQVgsRUFBOEIyQixFQUE5QixDQUFpQyxPQUFqQyxFQUEwQyxZQUFVO0FBQ25ELE9BQUl3QyxXQUFXeEUsRUFBRSxJQUFGLEVBQVF5RSxNQUFSLEdBQWlCOUIsSUFBakIsQ0FBc0IsT0FBdEIsQ0FBZjtBQUNBLE9BQUkrQixNQUFNRixTQUFTRyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLEVBQXhCLENBQVY7O0FBRUEzRSxLQUFFLFNBQU8wRSxHQUFQLEdBQVcsYUFBYixFQUE0QnRFLE1BQTVCLENBQW1Da0UsWUFBbkM7QUFDQSxHQUxEO0FBTUE7O0FBRUR0RSxHQUFFNEUsUUFBRixFQUFZNUMsRUFBWixDQUFlLE9BQWYsRUFBd0IsYUFBeEIsRUFBdUMsWUFBVTtBQUNoRGhDLElBQUUsSUFBRixFQUFReUUsTUFBUixHQUFpQkEsTUFBakIsR0FBMEJJLE1BQTFCO0FBQ0EsRUFGRDs7QUFNQSxVQUFTUCxVQUFULENBQW9CZCxLQUFwQixFQUEyQnNCLEdBQTNCLEVBQStCO0FBQzlCLE1BQUcsQ0FBQ3RCLEtBQUQsSUFBVSxDQUFDc0IsR0FBWCxJQUFrQnRCLFNBQVN1QixTQUEzQixJQUF3Q0QsT0FBT0MsU0FBbEQsRUFBNEQ7QUFDM0R2QixXQUFRLEVBQVI7QUFDQXNCLFNBQU0sRUFBTjtBQUNBO0FBQ0QsTUFBSUUsT0FBTyxFQUFYO0FBQ0FBLFVBQU0sd0JBQU47QUFDQ0EsVUFBTSxnQ0FBTjtBQUNDQSxVQUFNLHFDQUFOO0FBQ0FBLFVBQU0sdUVBQXFFeEIsS0FBckUsR0FBMkUsSUFBakY7QUFDRHdCLFVBQU0sUUFBTjtBQUNBQSxVQUFNLGdDQUFOO0FBQ0NBLFVBQU0sbUNBQU47QUFDQUEsVUFBTSxxRkFBbUZGLEdBQW5GLEdBQXVGLElBQTdGO0FBQ0RFLFVBQU0sUUFBTjtBQUNBQSxVQUFNLGdDQUFOO0FBQ0NBLFVBQU0sc0NBQU47QUFDQUEsVUFBTSx1Q0FBTjtBQUNEQSxVQUFNLFFBQU47QUFDREEsVUFBTSxRQUFOO0FBQ0EsU0FBT0EsSUFBUDtBQUNBOztBQUVELFVBQVN6RSxNQUFULENBQWdCMEUsT0FBaEIsRUFBd0I7QUFDdkIsTUFBSUMsV0FBVyxnQkFBZjtBQUNBLE1BQUdELFFBQVFFLEtBQVgsRUFBaUI7QUFDaEJELGNBQVdBLFdBQVcsR0FBWCxHQUFpQkQsUUFBUUUsS0FBcEM7QUFDQTs7QUFFRCxNQUFHRixRQUFRdEUsS0FBWCxFQUFpQjtBQUNoQixVQUFPeUUsR0FBRywwRUFBSCxFQUErRSxDQUFDRixRQUFELEVBQVdELFFBQVF6RSxJQUFuQixFQUF3QnlFLFFBQVF4RSxJQUFoQyxFQUFxQ3dFLFFBQVF2RSxLQUE3QyxFQUFvRHVFLFFBQVF0RSxLQUE1RCxDQUEvRSxDQUFQO0FBQ0EsR0FGRCxNQUVLO0FBQ0osVUFBT3lFLEdBQUcsdURBQUgsRUFBNEQsQ0FBQ0YsUUFBRCxFQUFXRCxRQUFRekUsSUFBbkIsRUFBd0J5RSxRQUFReEUsSUFBaEMsRUFBcUN3RSxRQUFRdkUsS0FBN0MsQ0FBNUQsQ0FBUDtBQUNBO0FBQ0Q7O0FBRUQsVUFBUzBFLEVBQVQsQ0FBWUMsTUFBWixFQUFvQkMsS0FBcEIsRUFBMEI7QUFDekIsTUFBSUMsWUFBWUYsT0FBT0csS0FBUCxDQUFhLElBQWIsQ0FBaEI7O0FBRUEsTUFBSUMsZUFBZSxFQUFuQjs7QUFFQSxPQUFJLElBQUlwRixDQUFSLElBQWFpRixLQUFiLEVBQW1CO0FBQ2xCRyxtQkFBZ0JGLFVBQVVsRixDQUFWLENBQWhCO0FBQ0FvRixtQkFBZ0JILE1BQU1qRixDQUFOLENBQWhCO0FBQ0E7QUFDRCxNQUFHa0YsVUFBVWpGLE1BQVYsR0FBbUJnRixNQUFNaEYsTUFBNUIsRUFBbUM7QUFDbENtRixtQkFBZ0JGLFVBQVVBLFVBQVVqRixNQUFWLEdBQWlCLENBQTNCLENBQWhCO0FBQ0E7O0FBRUQsU0FBT21GLFlBQVA7QUFDQTs7QUFFRCxVQUFTL0QsT0FBVCxDQUFpQmdFLEdBQWpCLEVBQXNCO0FBQ3JCLE9BQUksSUFBSXhDLElBQVIsSUFBZ0J3QyxHQUFoQixFQUFxQjtBQUNwQixPQUFHQSxJQUFJQyxjQUFKLENBQW1CekMsSUFBbkIsQ0FBSCxFQUNDLE9BQU8sS0FBUDtBQUNEOztBQUVELFNBQU8wQyxLQUFLQyxTQUFMLENBQWVILEdBQWYsTUFBd0JFLEtBQUtDLFNBQUwsQ0FBZSxFQUFmLENBQS9CO0FBQ0E7O0FBRUQsVUFBU25ELHVCQUFULENBQWlDMkMsTUFBakMsRUFBeUNDLEtBQXpDLEVBQStDO0FBQzlDLE9BQUksSUFBSWpGLENBQVIsSUFBYWlGLEtBQWIsRUFBbUI7QUFDbEIsT0FBR0QsT0FBT1MsUUFBUCxDQUFnQlIsTUFBTWpGLENBQU4sQ0FBaEIsQ0FBSCxFQUE2QjtBQUM1QixXQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0E7QUFFRCxDQXhWRCIsImZpbGUiOiJmYWtlX2IzY2M3Mjk0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuXHR2YXIgYXJlYSA9ICQoJyNjYXRlZ29yeV9hcmVhJyk7XG5cblx0dmFyIGNhdGVnb3JpZXMgPSBbXG5cdFx0J2J1c2luZXNzJyxcblx0XHQnZmFpdGgnLFxuXHRcdCdmaW5hbmNlJyxcblx0XHQnbW9uZXknLFxuXHRcdCdhcnQnLFxuXHRcdCdmdW5ueScsXG5cdFx0J2NvbXB1dGVycycsXG5cdFx0J2Rlc2lnbicsXG5cdFx0J2ludGVsbGlnZW5jZScsXG5cdFx0J2dvdmVybm1lbnQnLFxuXHRcdCdmcmVlZG9tJyxcblx0XHQnaGFwcGluZXNzJyxcblx0XHQnaG9wZScsXG5cdFx0J2dhcmRlbmluZycsXG5cdFx0J2ZhaWx1cmUnLFxuXHRcdCdoaXN0b3J5Jyxcblx0XHQnZW52aXJvbm1lbnRhbCcsXG5cdFx0J2RpZXQnLFxuXHRcdCd0ZWVuJyxcblx0XHQndGhhbmtmdWwnLFxuXHRcdCd0cmF2ZWwnLFxuXHRcdCd3b21lbicsXG5cdFx0J3dvcmsnLFxuXHRcdCdzY2llbmNlJyxcblx0XHQncm9tYW50aWMnLFxuXHRcdCdzb2NpZXR5Jyxcblx0XHQncmVsaWdpb24nLFxuXHRcdCdmaXRuZXNzJyxcblx0XHQnc3BvcnRzJyxcblx0XHQnd2FyJyxcblx0XHQnZmFtb3VzJyxcblx0XHQnbGlmZScsXG5cdFx0J2xlYWRlcnNoaXAnLFxuXHRcdCdkcmVhbXMnLFxuXHRcdCdtYXJyaWFnZScsXG5cdFx0J3N0cmVuZ3RoJyxcblx0XTtcblxuXHRjYXRlZ29yaWVzLnNvcnQoKTtcblxuXHRcdC8vIFF1b3RlIENhdGVnb3J5IExpc3QgU2VsZWN0aW9uXG5cdFx0YXJlYS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJyb3cgY2F0ZWdvcmllc1wiPicpO1xuXHRcdCQoJy5jYXRlZ29yaWVzJykuYXBwZW5kKCc8aDI+UXVvdGUgQ2F0ZWdvcmllczwvaDI+Jyk7XG5cdFx0JCgnLmNhdGVnb3JpZXMnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJjYXQtY29sdW1uLTEgY29sIGNvbC0tMS1vZi0yXCI+Jyk7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGgvMjsgaSsrKXtcblx0XHRcdCQoJy5jYXQtY29sdW1uLTEnKS5hcHBlbmQoX2lucHV0KHtcblx0XHRcdFx0dHlwZTogXCJjaGVja2JveFwiLFxuXHRcdFx0XHRuYW1lOiBcInBvcHNpY2xlX2NhdGVnb3JpZXNcIixcblx0XHRcdFx0dmFsdWU6IGNhdGVnb3JpZXNbaV0sXG5cdFx0XHRcdGFmdGVyOiBjYXRlZ29yaWVzW2ldXG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0JCgnLmNhdGVnb3JpZXMnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJjYXQtY29sdW1uLTIgY29sIGNvbC0tMS1vZi0yXCI+Jyk7XG5cdFx0Zm9yKHZhciBpID0gY2F0ZWdvcmllcy5sZW5ndGgvMjsgaSA8IGNhdGVnb3JpZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0JCgnLmNhdC1jb2x1bW4tMicpLmFwcGVuZChfaW5wdXQoe1xuXHRcdFx0XHR0eXBlOiBcImNoZWNrYm94XCIsXG5cdFx0XHRcdG5hbWU6IFwicG9wc2ljbGVfY2F0ZWdvcmllc1wiLFxuXHRcdFx0XHR2YWx1ZTogY2F0ZWdvcmllc1tpXSxcblx0XHRcdFx0YWZ0ZXI6IGNhdGVnb3JpZXNbaV1cblx0XHRcdH0pKTtcblx0XHR9XG5cdHZhciBjb2xvclVJID0gJCgnLmpzY29sb3InKTtcblx0dmFyIGNhdGVnb3J5VUkgPSAkKCcuY2F0ZWdvcmllcyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblx0dmFyIHVzZXJDYXRlZ29yaWVzID0gW107XG5cdHZhciB1c2VyQ29sb3JzID0ge307XG5cdHZhciB1c2VyTGlua3MgPSB7fTtcblx0dmFyIHVzZXJCZ0ltYWdlID0ge307XG5cdHZhciBsb2NhbEJHSW1hZ2UgPSAnJztcblxuXHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoZnVuY3Rpb24oaXRlbXMpe1xuXHRcdGlmKCdsb2NhbEJHSW1hZ2UnIGluIGl0ZW1zKXtcblx0XHRcdGxvY2FsQkdJbWFnZSA9IGl0ZW1zLmxvY2FsQkdJbWFnZTtcblx0XHR9ZWxzZXtcblx0XHRcdGxvY2FsQkdJbWFnZSA9IGRlZmF1bHRfbG9jYWxCR0ltYWdlO1xuXHRcdH1cblx0fSk7XG5cblx0Y2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoZnVuY3Rpb24oaXRlbXMpe1xuXHRcdC8vY29sb3JzXG5cdFx0aWYoJ3VzZXJDb2xvcnMnIGluIGl0ZW1zICYmICFpc0VtcHR5KGl0ZW1zLnVzZXJDb2xvcnMpKXtcblx0XHRcdHVzZXJDb2xvcnMgPSBpdGVtcy51c2VyQ29sb3JzO1xuXHRcdH1lbHNle1xuXHRcdFx0dXNlckNvbG9ycyA9IGRlZmF1bHRfY29sb3JzO1xuXHRcdH1cblxuXHRcdC8vY2F0ZWdvcmllc1xuXHRcdGlmKCd1c2VyQ2F0ZWdvcmllcycgaW4gaXRlbXMpe1xuXHRcdFx0dXNlckNhdGVnb3JpZXMgPSBpdGVtcy51c2VyQ2F0ZWdvcmllcztcblx0XHR9ZWxzZXtcblx0XHRcdHVzZXJDYXRlZ29yaWVzID0gZGVmYXVsdF9jYXRlZ29yaWVzO1xuXHRcdH1cblxuXHRcdC8vbGlua3Ncblx0XHRpZigndXNlckxpbmtzJyBpbiBpdGVtcyl7XG5cdFx0XHR1c2VyTGlua3MgPSBpdGVtcy51c2VyTGlua3M7XG5cdFx0fWVsc2V7XG5cdFx0XHR1c2VyTGlua3MgPSBkZWZhdWx0X2xpbmtzO1xuXHRcdH1cblxuXHRcdC8vYmFja2dyb3VuZCBpbWFnZVxuXHRcdGlmKCd1c2VyQmdJbWFnZScgaW4gaXRlbXMpe1xuXHRcdFx0dXNlckJnSW1hZ2UgPSBpdGVtcy51c2VyQmdJbWFnZTtcblx0XHR9ZWxzZXtcblx0XHRcdHVzZXJCZ0ltYWdlID0gZGVmYXVsdF9iZ19pbWFnZTtcblx0XHR9XG5cblx0XHR1cGRhdGVfVUkoKTtcblx0fSk7XG5cblx0JCgnLm9wYWNpdHknKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcblx0XHR1c2VyQmdJbWFnZS5vcGFjaXR5ID0gJCh0aGlzKS52YWwoKTtcblx0fSk7XG5cblx0JCgnI2JndXBsb2FkJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHByZXZpZXcgPSAkKCcjcGxhY2Vob2xkZXJpbWcnKTtcblx0XHR2YXIgZmlsZSA9ICQodGhpcylbMF0uZmlsZXNbMF07XG5cdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cblx0XHRyZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgaW1hZ2VGb3JtYXRzID0gWycuanBnJywnLmpwZWcnLCcucG5nJywnLmdpZiddO1xuXHRcdFx0aWYoc3RyaW5nQ29udGFpbnNBcnJheUl0ZW0oZmlsZS5uYW1lLCBpbWFnZUZvcm1hdHMpKXtcblx0XHRcdFx0cHJldmlldy5hdHRyKCdzcmMnLCByZWFkZXIucmVzdWx0KTtcblx0XHRcdFx0bG9jYWxCR0ltYWdlID0gcmVhZGVyLnJlc3VsdDtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cblx0XHRpZiAoZmlsZSkge1xuXHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCdidXR0b24uc2F2ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0dXNlckNhdGVnb3JpZXMgPSBbXTtcblx0XHRjYXRlZ29yeVVJLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGN1ckNhdGVnb3J5ID0gJCh0aGlzKS5hdHRyKCd2YWx1ZScpO1xuXHRcdFx0dmFyIGNoZWNrZWQgPSAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKTtcblxuXG5cdFx0XHRpZihjaGVja2VkKXtcblx0XHRcdFx0dXNlckNhdGVnb3JpZXMucHVzaChjdXJDYXRlZ29yeSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29sb3JVSS5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBjdXJDb2xvck5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcblx0XHRcdHZhciBjdXJDb2xvciA9ICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG5cdFx0XHR1c2VyQ29sb3JzW2N1ckNvbG9yTmFtZV0gPSBjdXJDb2xvcjtcblx0XHR9KTtcblxuXHRcdC8vYmFja2dyb3VuZGltYWdlXG5cdFx0dXNlckJnSW1hZ2UuZW5hYmxlZCA9ICQoJyNiZ2VuYWJsZWQnKVswXS5jaGVja2VkO1xuXG5cblx0XHR1c2VyTGlua3MgPSB7XG5cdFx0XHRcImNvbDFcIjoge1xuXHRcdFx0XHRcdFwibGFiZWxcIjogXCJcIixcblx0XHRcdFx0XHRcImxpbmtzXCI6IFtdXG5cdFx0XHR9LFxuXHRcdFx0XCJjb2wyXCI6IHtcblx0XHRcdFx0XHRcImxhYmVsXCI6IFwiXCIsXG5cdFx0XHRcdFx0XCJsaW5rc1wiOiBbXVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIGkgPSAxOyBpIDw9IDI7IGkrKyl7XG5cblx0XHRcdHVzZXJMaW5rc1snY29sJytpXS5sYWJlbCA9ICQoJy5jb2wnK2krJyBpbnB1dFtuYW1lPVwiY29sdW1uX2xhYmVsXCJdJykudmFsKCk7XG5cdFx0XHQkKCcuY29sJytpKycgLmxpbmstbGlzdCAubGluaycpLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHR2YXIgdGhlTGFiZWwgPSAkKHRoaXMpLmZpbmQoJ2lucHV0W25hbWU9XCJsYWJlbFwiXScpLnZhbCgpO1xuXHRcdFx0XHR2YXIgdGhlVVJMID0gJCh0aGlzKS5maW5kKCdpbnB1dFtuYW1lPVwidXJsXCJdJykudmFsKCk7XG5cblx0XHRcdFx0dXNlckxpbmtzWydjb2wnK2ldLmxpbmtzLnB1c2goe1xuXHRcdFx0XHRcdFwibGFiZWxcIjogdGhlTGFiZWwsXG5cdFx0XHRcdFx0XCJVUkxcIjogdGhlVVJMXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCQoJyNtZXNzYWdlJykudG9nZ2xlKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCcjbWVzc2FnZScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0fSk7XG5cblx0XHR1cGRhdGVfVUkoKTtcblx0fSk7XG5cblx0JCgnYnV0dG9uLnJlc2V0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHR1c2VyQ2F0ZWdvcmllcyA9IGRlZmF1bHRfY2F0ZWdvcmllcztcblx0XHR1c2VyQ29sb3JzID0gZGVmYXVsdF9jb2xvcnM7XG5cdFx0dXNlckxpbmtzID0gZGVmYXVsdF9saW5rcztcblx0XHR1c2VyQmdJbWFnZSA9IGRlZmF1bHRfYmdfaW1hZ2U7XG5cdFx0bG9jYWxCR0ltYWdlID0gZGVmYXVsdF9sb2NhbEJHSW1hZ2U7XG5cdFx0dXBkYXRlX1VJKCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZV9VSSgpe1xuXHRcdC8vVGhlIHVwZGF0ZV9VSSBsb29wcyB0aHJvdWdoIGVhY2ggY2F0ZWdvcnkgY2hlY2tib3gsIGNoZWNrcyBpZiB0aGUgY2F0ZWdvcnkgaXMgdXNlci1zZWxlY3RlZCwgYW5kIHVwZGF0ZXMgYWNjb3JkaW5nbHkuXG5cdFx0Y2F0ZWdvcnlVSS5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBjdXJDYXRlZ29yeSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcblxuXHRcdFx0aWYoJC5pbkFycmF5KGN1ckNhdGVnb3J5LCB1c2VyQ2F0ZWdvcmllcykgIT0gLTEpe1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29sb3JVSS5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBjdXJDb2xvck5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcblx0XHRcdHZhciBwaWNrZXIgPSAkKHRoaXMpWzBdO1xuXG5cdFx0XHRwaWNrZXIuanNjb2xvci5mcm9tU3RyaW5nKHVzZXJDb2xvcnNbY3VyQ29sb3JOYW1lXSk7XG5cdFx0fSk7XG5cblx0XHQvL3NhdmVzIHNldHRpbmdzXG5cdFx0Y2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe1xuXHRcdFx0dXNlckNhdGVnb3JpZXM6IHVzZXJDYXRlZ29yaWVzLFxuXHRcdFx0dXNlckNvbG9yczogdXNlckNvbG9ycyxcblx0XHRcdHVzZXJMaW5rczogdXNlckxpbmtzLFxuXHRcdFx0dXNlckJnSW1hZ2U6IHVzZXJCZ0ltYWdlXG5cdFx0fSk7XG5cblx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuXHRcdFx0bG9jYWxCR0ltYWdlOiBsb2NhbEJHSW1hZ2Vcblx0XHR9KTtcblxuXHRcdCQoJy5vcGFjaXR5JykudmFsKHVzZXJCZ0ltYWdlLm9wYWNpdHkpO1xuXHRcdCQoJyNwbGFjZWhvbGRlcmltZycpLmF0dHIoJ3NyYycsIGxvY2FsQkdJbWFnZSlcblxuXHRcdGlmKHVzZXJCZ0ltYWdlLmVuYWJsZWQpe1xuXHRcdFx0JCgnI2JnZW5hYmxlZCcpLmF0dHIoJ2NoZWNrZWQnLCB0cnVlKTtcblxuXHRcdFx0JCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJytsb2NhbEJHSW1hZ2UrJyknKTtcblx0XHRcdCQoJy5jb3ZlcicpLmNzcygnb3BhY2l0eScsIHVzZXJCZ0ltYWdlLm9wYWNpdHkvMTAwKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQoJyNiZ2VuYWJsZWQnKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuXHRcdFx0JCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XG5cdFx0fVxuXG5cdFx0Zm9yKHZhciBpID0gMTsgaSA8PSAyOyBpKyspe1xuXHRcdFx0JCgnLmNvbCcraSsnIGlucHV0W25hbWU9XCJjb2x1bW5fbGFiZWxcIl0nKS52YWwodXNlckxpbmtzWydjb2wnK2ldLmxhYmVsKTtcblxuXHRcdFx0JCgnLmNvbCcraSsnIC5saW5rLWxpc3QnKS50ZXh0KCcnKTtcblx0XHRcdHZhciB0aGVBcnJheSA9IHVzZXJMaW5rc1snY29sJytpXS5saW5rcztcblxuXHRcdFx0Zm9yKHZhciB4IGluIHRoZUFycmF5KXtcblx0XHRcdFx0JCgnLmNvbCcraSsnIC5saW5rLWxpc3QnKS5hcHBlbmQoX3VybF9hZGRlcih0aGVBcnJheVt4XS5sYWJlbCx0aGVBcnJheVt4XS5VUkwpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKCcuY292ZXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB1c2VyQ29sb3JzWydiZyddKTtcblx0XHQkKCcuY29udGFpbmVyJykuY3NzKCdjb2xvcicsIHVzZXJDb2xvcnNbJ3RleHQnXSk7XG5cdFx0JCgnYmxvY2txdW90ZScpLmNzcygnY29sb3InLCB1c2VyQ29sb3JzWydxdW90ZSddKTtcblx0XHQkKCcuY29udGFpbmVyIGEnKS5jc3MoJ2NvbG9yJywgdXNlckNvbG9yc1snbGluayddKTtcblxuXHR9XG5cblx0Zm9yKHZhciBpID0gMTsgaSA8PSAyOyBpKyspe1xuXHRcdCQoJy5jb2wnK2krJyBidXR0b24uYWRkTGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY29sY2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLmF0dHIoJ2NsYXNzJyk7XG5cdFx0XHR2YXIgY29sID0gY29sY2xhc3MucmVwbGFjZSgnY29sJywgJycpO1xuXG5cdFx0XHQkKCcuY29sJytjb2wrJyAubGluay1saXN0JykuYXBwZW5kKF91cmxfYWRkZXIoKSk7XG5cdFx0fSk7XG5cdH1cblxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnJlbW92ZUxpbmsnLCBmdW5jdGlvbigpe1xuXHRcdCQodGhpcykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7XG5cdH0pO1xuXG5cblxuXHRmdW5jdGlvbiBfdXJsX2FkZGVyKGxhYmVsLCB1cmwpe1xuXHRcdGlmKCFsYWJlbCB8fCAhdXJsIHx8IGxhYmVsID09IHVuZGVmaW5lZCB8fCB1cmwgPT0gdW5kZWZpbmVkKXtcblx0XHRcdGxhYmVsID0gJyc7XG5cdFx0XHR1cmwgPSAnJztcblx0XHR9XG5cdFx0dmFyIGh0bWwgPSAnJztcblx0XHRodG1sKz0nPGRpdiBjbGFzcz1cImxpbmsgcm93XCI+Jztcblx0XHRcdGh0bWwrPSc8ZGl2IGNsYXNzPVwiY29sIGNvbC0tNS1vZi0xMlwiPic7XG5cdFx0XHRcdGh0bWwrPSc8bGFiZWwgY2xhc3M9XCJtaWRkbGVcIj5MYWJlbDwvbGFiZWw+Jztcblx0XHRcdFx0aHRtbCs9JzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsYWJlbFwiIHBsYWNlaG9sZGVyPVwiZXguIEZhY2Vib29rXCIgdmFsdWU9XCInK2xhYmVsKydcIj4nO1xuXHRcdFx0aHRtbCs9JzwvZGl2Pic7XG5cdFx0XHRodG1sKz0nPGRpdiBjbGFzcz1cImNvbCBjb2wtLTUtb2YtMTJcIj4nO1xuXHRcdFx0XHRodG1sKz0nPGxhYmVsIGNsYXNzPVwibWlkZGxlXCI+VVJMPC9sYWJlbD4nO1xuXHRcdFx0XHRodG1sKz0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVybFwiIHBsYWNlaG9sZGVyPVwiZXguIGh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiIHZhbHVlPVwiJyt1cmwrJ1wiPic7XG5cdFx0XHRodG1sKz0nPC9kaXY+Jztcblx0XHRcdGh0bWwrPSc8ZGl2IGNsYXNzPVwiY29sIGNvbC0tMi1vZi0xMlwiPic7XG5cdFx0XHRcdGh0bWwrPSc8bGFiZWwgY2xhc3M9XCJtaWRkbGVcIj5SZW1vdmU8L2xhYmVsPic7XG5cdFx0XHRcdGh0bWwrPSc8YnV0dG9uIGNsYXNzPVwicmVtb3ZlTGlua1wiPlg8L2J1dHRvbj4nO1xuXHRcdFx0aHRtbCs9JzwvZGl2Pic7XG5cdFx0aHRtbCs9JzwvZGl2Pic7XG5cdFx0cmV0dXJuIGh0bWw7XG5cdH1cblxuXHRmdW5jdGlvbiBfaW5wdXQob3B0aW9ucyl7XG5cdFx0dmFyIHRoZUNsYXNzID0gXCJwb3BzaWNsZS1pbnB1dFwiO1xuXHRcdGlmKG9wdGlvbnMuY2xhc3Mpe1xuXHRcdFx0dGhlQ2xhc3MgPSB0aGVDbGFzcyArIFwiIFwiICsgb3B0aW9ucy5jbGFzcztcblx0XHR9XG5cblx0XHRpZihvcHRpb25zLmFmdGVyKXtcblx0XHRcdHJldHVybiBfcygnPGlucHV0IGNsYXNzPVwiJXNcIiB0eXBlPVwiJXNcIiBuYW1lPVwiJXNcIiB2YWx1ZT1cIiVzXCIgLz48bGFiZWw+JXM8L2xhYmVsPjxicj4nLCBbdGhlQ2xhc3MsIG9wdGlvbnMudHlwZSxvcHRpb25zLm5hbWUsb3B0aW9ucy52YWx1ZSwgb3B0aW9ucy5hZnRlcl0pO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIF9zKCc8aW5wdXQgY2xhc3M9XCIlc1wiIHR5cGU9XCIlc1wiIG5hbWU9XCIlc1wiIHZhbHVlPVwiJXNcIj48YnI+JywgW3RoZUNsYXNzLCBvcHRpb25zLnR5cGUsb3B0aW9ucy5uYW1lLG9wdGlvbnMudmFsdWVdKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfcyhzdHJpbmcsIGFycmF5KXtcblx0XHR2YXIgc3RyX2FycmF5ID0gc3RyaW5nLnNwbGl0KCclcycpO1xuXG5cdFx0dmFyIGZpbmFsX3N0cmluZyA9ICcnO1xuXG5cdFx0Zm9yKHZhciBpIGluIGFycmF5KXtcblx0XHRcdGZpbmFsX3N0cmluZyArPSBzdHJfYXJyYXlbaV07XG5cdFx0XHRmaW5hbF9zdHJpbmcgKz0gYXJyYXlbaV07XG5cdFx0fVxuXHRcdGlmKHN0cl9hcnJheS5sZW5ndGggPiBhcnJheS5sZW5ndGgpe1xuXHRcdFx0ZmluYWxfc3RyaW5nICs9IHN0cl9hcnJheVtzdHJfYXJyYXkubGVuZ3RoLTFdO1xuXHRcdH1cblxuXHRcdHJldHVybiBmaW5hbF9zdHJpbmc7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuXHRcdGZvcih2YXIgcHJvcCBpbiBvYmopIHtcblx0XHRcdGlmKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSlcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopID09PSBKU09OLnN0cmluZ2lmeSh7fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpbmdDb250YWluc0FycmF5SXRlbShzdHJpbmcsIGFycmF5KXtcblx0XHRmb3IodmFyIGkgaW4gYXJyYXkpe1xuXHRcdFx0aWYoc3RyaW5nLmluY2x1ZGVzKGFycmF5W2ldKSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxufSk7XG4iXX0=
},{}]},{},[1])