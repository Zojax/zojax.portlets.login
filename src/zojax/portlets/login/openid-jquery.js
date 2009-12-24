var portlet_openid_providers = {
    google: {
        name: 'Google',
	username: false,
        url: 'https://www.google.com/accounts/o8/id'
    },
    yahoo: {
        name: 'Yahoo',      
	username: false,
        url: 'http://yahoo.com/'
    },    
    aol: {
        name: 'AOL',     
	username: true,
        url: 'http://openid.aol.com/{username}/'
    },
    openid: {
        name: 'OpenID',
	username: false,
        url: null
    },
    myopenid: {
        name: 'MyOpenID',
	username: true,
        url: 'http://{username}.myopenid.com/'
    },
    livejournal: {
        name: 'LiveJournal',
	username: true,
        url: 'http://{username}.livejournal.com/'
    },
    flickr: {
        name: 'Flickr',        
	username: true,
        url: 'http://flickr.com/{username}/'
    },
    technorati: {
        name: 'Technorati',
	username: true,
        url: 'http://technorati.com/people/technorati/{username}/'
    },
    wordpress: {
        name: 'Wordpress',
	username: true,
        url: 'http://{username}.wordpress.com/'
    },
    blogger: {
        name: 'Blogger',
	username: true,
        url: 'http://{username}.blogspot.com/'
    },
    verisign: {
        name: 'Verisign',
	username: true,
        url: 'http://{username}.pip.verisignlabs.com/'
    },
    vidoop: {
        name: 'Vidoop',
	username: true,
        url: 'http://{username}.myvidoop.com/'
    },
    verisign: {
        name: 'Verisign',
	username: true,
        url: 'http://{username}.pip.verisignlabs.com/'
    },
    claimid: {
        name: 'ClaimID',
	username: true,
        url: 'http://claimid.com/{username}'
    }
};
var portlet_openid_allproviders = $.extend({}, portlet_openid_providers);

var portlet_openid = {

	cookie_expires: 6*30,	// 6 months.
	cookie_name: 'openid_provider',
	cookie_path: '/',
	
	img_path: '@@/portlet_login_images/',

	input_id: null,
	provider_url: null,
	
    init: function(input_id) {
        
        var openid_btns = $('#portlet_openid_btns');
        
        this.input_id = input_id;

	var portal = $('HEAD').attr('portal');
	if (portal) {
	    this.img_path = portal + '@@/portlet_login_images/';
	}
        
        $('#portlet_openid_choice').show();
        $('#portlet_openid_input_area').empty();
        
        // add box for each provider
	for (id in portlet_openid_providers) {
	    openid_btns.append(this.getBoxHTML(portlet_openid_providers[id], '.ico'));
        }
        
        $('#portlet_openid_form').submit(this.submit);
        
        var box_id = this.readCookie();
        if (box_id) {
            this.signin(box_id, true);
        }
    },

    getBoxHTML: function(provider, image_ext) {            
        var box_id = provider["name"].toLowerCase();
        return '<a title="'+provider["name"]+'" href="javascript: portlet_openid.signin(\''+ box_id +'\');"' +
            ' style="background: #FFF url(' + this.img_path + box_id + image_ext + ') no-repeat center center;" class="portlet_openid_btn" />';    
    },

    /* Provider image click */
    signin: function(box_id, onload) {
    	var provider = portlet_openid_providers[box_id];
  	if (! provider) {
  	    return;
  	}

	this.setCookie(box_id);
	this.provider_url = provider['url'];
		
	// prompt user for input?
	if (provider['username']) {
	    this.useInputBox(provider);
	} else {
	    this.setOpenIdUrl(provider['url']);
	    if (! onload) {
		$('#portlet_openid_form').submit();
	    }
	}
    },

    /* Sign-in button click */
    submit: function() {
    	var url = portlet_openid.provider_url; 
    	if (url) {
    	    url = url.replace('{username}', $('#openid_username').val());
    	    portlet_openid.setOpenIdUrl(url);
    	}
    	return true;
    },

    setOpenIdUrl: function (url) {
    	var hidden = $('#'+this.input_id);
    	if (hidden.length > 0) {
    	    hidden.attr('value', url);
    	} else {
    	    $('#portlet_openid_form').append('<input type="hidden" id="' + this.input_id + '" name="' + this.input_id + '" value="'+url+'"/>');
    	}
    },

    setCookie: function (value) {	
	var date = new Date();
	date.setTime(date.getTime()+(this.cookie_expires*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
	
	document.cookie = this.cookie_name+"="+value+expires+"; path=" + this.cookie_path;
    },

    readCookie: function () {
	var nameEQ = this.cookie_name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	    var c = ca[i];
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
    },

    useInputBox: function (provider) {   	
	var input_area = $('#portlet_openid_input_area');
	
	var html = '';
	var id = 'openid_username';
	var value = '';
	var label = provider['label'];
	var style = '';
	
	html = '<div class="field"><label>'+provider['name']+': User name</label><br />';
	if (provider['name'] == 'OpenID') {
	    id = this.input_id;
	    value = 'http://';
	}
	html += '<input id="'+id+'" type="text" size="15" name="'+id+'" value="'+value+'" />' + 
	    '<div class="z-form-controls">' +
	    '<input class="z-form-button" id="openid_submit" type="submit" value="Log in" />' +
	    '</div></div>';

	input_area.empty();
	input_area.append(html);
	
	$('#'+id).focus();
    }
};


$(document).ready(function() {
    portlet_openid.init('openid_identifier');
});
