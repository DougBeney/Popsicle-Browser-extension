//variable set in data.js: default_categories

$(function(){
    var area = $('#category_area');

    var categories = [
        'business',
        'faith',
        'finance',
        'money',
        'art',
        'funny',
        'computers',
        'design',
        'intelligence',
        'government',
        'freedom',
        'happiness',
        'hope',
        'gardening',
        'failure',
        'history',
        'environmental',
        'diet',
        'teen',
        'thankful',
        'travel',
        'women',
        'work',
        'science',
        'romantic',
        'society',
        'religion',
        'fitness',
        'sports',
        'war',
        'famous',
        'life',
        'leadership',
        'dreams',
        'marriage',
        'strength',
    ];

    categories.sort();



    ////////////////////// START - CATEGORY LISTS ////////////////////////
        area.append('<div class="row categories">');
        $('.categories').append('<h2>Quote Categories</h2>');
        $('.categories').append('<div class="cat-column-1 col col--1-of-2">');

        for(var i = 0; i < categories.length/2; i++){
            $('.cat-column-1').append(_input({
                type: "checkbox",
                name: "popsicle_categories",
                value: categories[i],
                after: categories[i]
            }));
        }

        $('.categories').append('<div class="cat-column-2 col col--1-of-2">');
        for(var i = categories.length/2; i < categories.length; i++){
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

    chrome.storage.local.get(function(items){
        if('localBGImage' in items){
            localBGImage = items.localBGImage;
        }else{
            localBGImage = default_localBGImage;
        }
    });

    chrome.storage.sync.get(function(items){
        //colors
        if('userColors' in items && !isEmpty(items.userColors)){
            userColors = items.userColors;
        }else{
            userColors = default_colors;
        }

        //categories
        if('userCategories' in items){
            userCategories = items.userCategories;
        }else{
            userCategories = default_categories;
        }

        //links
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

        update_UI();
    });

    $('.opacity').on('change', function(){
        userBgImage.opacity = $(this).val();
    });

    $('#bgupload').on('change', function(){
        var preview = $('#placeholderimg');
        var file = $(this)[0].files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function(){
            var imageFormats = ['.jpg','.jpeg','.png','.gif'];
            if(stringContainsArrayItem(file.name, imageFormats)){
                preview.attr('src', reader.result);
                localBGImage = reader.result;
            }
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    $('button.save').on('click', function(){
        userCategories = [];
        categoryUI.each(function(index){
            var curCategory = $(this).attr('value');
            var checked = $(this).prop('checked');


            if(checked){
                userCategories.push(curCategory);
            }
        });
        colorUI.each(function(index){
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

        for(var i = 1; i <= 2; i++){

            userLinks['col'+i].label = $('.col'+i+' input[name="column_label"]').val();
            $('.col'+i+' .link-list .link').each(function(index){
                var theLabel = $(this).find('input[name="label"]').val();
                var theURL = $(this).find('input[name="url"]').val();

                userLinks['col'+i].links.push({
                    "label": theLabel,
                    "URL": theURL
                });
            });
        }
        $('#message').toggle(function(){
            $('#message').css('display', 'none');
        });

        update_UI();
    });

    $('button.reset').on('click', function(){
        userCategories = default_categories;
        userColors = default_colors;
        userLinks = default_links;
        userBgImage = default_bg_image;
        localBGImage = default_localBGImage;
        update_UI();
    });

    function update_UI(){
        //The update_UI loops through each category checkbox, checks if the category is user-selected, and updates accordingly.
        categoryUI.each(function(index){
            var curCategory = $(this).attr('value');

            if($.inArray(curCategory, userCategories) != -1){
                $(this).prop('checked', true);
            }else{
                $(this).prop('checked', false);
            }
        });
        colorUI.each(function(index){
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
        $('#placeholderimg').attr('src', localBGImage)

        if(userBgImage.enabled){
            $('#bgenabled').attr('checked', true);

            $('body').css('background-image', 'url('+localBGImage+')');
            $('.cover').css('opacity', userBgImage.opacity/100);
        }else{
            $('#bgenabled').attr('checked', false);
            $('body').css('background-image', 'none');
        }

        for(var i = 1; i <= 2; i++){
            $('.col'+i+' input[name="column_label"]').val(userLinks['col'+i].label);

            $('.col'+i+' .link-list').text('');
            var theArray = userLinks['col'+i].links;

            for(var x in theArray){
                $('.col'+i+' .link-list').append(_url_adder(theArray[x].label,theArray[x].URL));
            }
        }

        $('.cover').css('background-color', userColors['bg']);
        $('.container').css('color', userColors['text']);
        $('blockquote').css('color', userColors['quote']);
        $('.container a').css('color', userColors['link']);

    }

    for(var i = 1; i <= 2; i++){
        $('.col'+i+' button.addLink').on('click', function(){
            var colclass = $(this).parent().attr('class');
            var col = colclass.replace('col', '');

            $('.col'+col+' .link-list').append(_url_adder());
        });
    }

    $(document).on('click', '.removeLink', function(){
        $(this).parent().parent().remove();
    });



    function _url_adder(label, url){
        if(!label || !url || label == undefined || url == undefined){
            label = '';
            url = '';
        }
        var html = '';
        html+='<div class="link row">';
            html+='<div class="col col--5-of-12">';
                html+='<label class="middle">Label</label>';
                html+='<input type="text" name="label" placeholder="ex. Facebook" value="'+label+'">';
            html+='</div>';
            html+='<div class="col col--5-of-12">';
                html+='<label class="middle">URL</label>';
                html+='<input type="text" name="url" placeholder="ex. http://www.facebook.com/" value="'+url+'">';
            html+='</div>';
            html+='<div class="col col--2-of-12">';
                html+='<label class="middle">Remove</label>';
                html+='<button class="removeLink">X</button>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    function _input(options){
        var theClass = "popsicle-input";
        if(options.class){
            theClass = theClass + " " + options.class;
        }

        if(options.after){
            return _s('<input class="%s" type="%s" name="%s" value="%s" /><label>%s</label><br>', [theClass, options.type,options.name,options.value, options.after]);
        }else{
            return _s('<input class="%s" type="%s" name="%s" value="%s"><br>', [theClass, options.type,options.name,options.value]);
        }
    }

    function _s(string, array){
        var str_array = string.split('%s');

        var final_string = '';

        for(var i in array){
            final_string += str_array[i];
            final_string += array[i];
        }
        if(str_array.length > array.length){
            final_string += str_array[str_array.length-1];
        }

        return final_string;
    }

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    function stringContainsArrayItem(string, array){
        for(var i in array){
            if(string.includes(array[i])){
                return true;
            }
        }
        return false;
    }

});
