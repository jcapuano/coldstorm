var cai = cai || {};  

cai.AppViewModel = function(user) {
	var self = this;
    
	self.User = ko.observable(user);
    self.Error = ko.observable("");
    
    var appTitle = document.title;
    var pageData = {};
    
    //--------------------------------------
    //  PUBLIC
    //--------------------------------------
    
    self.init = function() {
        
		cai.log("Initializing the Application View Model");
        
        // use jQuery address for app navigation
        $.address.init(self.addressInit)
        		.change(self.addressChange);
                
		Handlebars.registerHelper("roles", self.rolePresenter);
    }   
    
    self.getUser = function() {
    	return self.User();
    }
    
    self.setUser = function(user) {
    	self.User(user);
        if (user) {
        	self.setCookie('userIdentity', $.toJSON(user));
        } else {
        	self.setCookie('userIdentity', '', 0);
		}                
    }
    
    self.setError = function(e) {
    	self.Error(e);
    }
    
    //--------------------------------------
    //  NAVIGATION
    //--------------------------------------
    
    self.changePage = function(pageID, pageTitle, data) {
        // update page data
        if (!data) {
            self.pageData = {}
        } else {
            self.pageData = data;    
        }
        
        // update title
        if (pageTitle) {
            if (appTitle) {
                $.address.title(appTitle+' | '+pageTitle);
            } else {
                $.address.title(pageTitle);
            }
        }
        
        // update page
        $.address.value(pageID);
    }
    
    self.updateContent = function(pageName) {
        
        try {
        	self.Error('');
            //self.hideError();
        
			cai.log("Updating content to page [" + pageName + "]");
        
	        var pageID = '#'+pageName;
	        
	        // empty content
            var contentview = $('#content');
	        contentview.empty();
	        
	        if (!self.pageData) {
	            self.pageData = {};
	        }
	        
	        // add size name to data for use in templates
	        self.pageData.size = sizeit.size;
	        
	        // add user name to page data by default
	        self.pageData.userIdentity = self.User();
	        
	        if (!$(pageID+'Template').length) {
	            // if no page template, throw error, go to default page
	            console.error(pageID+'Template not found');
	        }
	        
	        // add the content
            var pagetemplate = Handlebars.compile($(pageID+'Template').html());
            contentview.html(pagetemplate(self.pageData));
            
            var viewmodel = contentview.data(pageName);
            if (!viewmodel) {
            	viewmodel = $(document).data(pageName);
            	contentview.data(pageName, viewmodel);
    		}
            ko.applyBindings(viewmodel, contentview[0]);            
            
	        
            var footerview = $('#footer-user');
            footerview.empty();
	        if (self.User()) {
            	var usertemplate = Handlebars.compile($('#userTemplate').html());
				footerview.html(usertemplate(self.User()));
                
                /*
	            var viewmodel = footerview.data('user');
	            if (!viewmodel) {
	            	var viewmodel = $(document).data('user');
	                ko.applyBindings(viewmodel, footerview[0]);
	            	footerview.data('user', viewmodel);
	    		}
                */
	        }
            
	        // If using jQuery mobile, use page() to refresh styles to the new content,
	        // wrap it in a conditional if mixing mobile and desktop
	        //
	        // if (isMobile) {
	        //    $(pageID).page(); 
	        // }
	        
	        // Scroll to top
	        window.scrollTo(0,0);    
        } catch (ex) {
        	self.Error(ex);
            //self.displayError(ex);
        }
    }
    
    self.addressInit  = function(event) {
    	/*
        var cookie = self.getCookie('userIdentity');
        if (cookie)
        	self.User($.evalJSON(cookie));
        if (self.User()) {
            // if user is signed in go dashboard
            self.changePage('dashboard','Dashboard');
        } else {
            // otherwise, go to logon screen (welcome)
            self.changePage('logon','Welcome');
        }  
        */
        self.changePage('role','Roles');
    }
    
    self.addressChange = function(event) {
    	self.updateContent(event.value.substring(1));
	}
        
    //--------------------------------------
    //  USER
    //--------------------------------------
    
    self.signOut = function(e) {
        self.setUser(null);
        self.changePage('logon', 'Welcome');
	}
    
    self.rolePresenter = function(roles, fn, elseFn) {
    	if (roles && roles.length > 0) {
        	var buffer = "";
            for (var i = 0, j = roles.length; i < j; i++) {
            	var role = roles[i];
	 			
                // show the inside of the block
                buffer += fn(role).trim();
                if (i<j-1)
                	buffer += ", ";
			}
            
            // return the finished buffer
            return buffer;
		}
        else {
        	return elseFn();
		}
	}
    
    //--------------------------------------
    //  COOKIES
    //--------------------------------------
	
    self.getCookie = function(cookieName) {
        var i, x, y, cookies = document.cookie.split(';');
        var cookieValue = '';
        for (i = 0; i < cookies.length; i++)
        {
            x = cookies[i].substr(0, cookies[i].indexOf('='));
            y = cookies[i].substr(cookies[i].indexOf('=')+1);
            x = x.replace(/^\s+|\s+$/g,'');
            if (x == cookieName) {
                cookieValue = unescape(y);
            }
        }
        return cookieValue;
    }
    
    self.setCookie = function(cookieName, value, expDays) {
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + expDays);
        var cookieValue = escape(value) + ((expDays === null) ? '' : '; expires='+expDate.toUTCString());
        document.cookie = cookieName + '=' + cookieValue;
    }
};

