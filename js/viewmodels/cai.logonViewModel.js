var cai = cai || {};  

cai.LogonViewModel = function() {
	var self = this;
    
    self.userName = ko.observable("");
    self.userPassword = ko.observable("");
    
	self.init = function() {
		cai.log("Initializing the Logon View Model");
    }    
    
    //--------------------------------------
    //  EVENT HANDLERS
    //--------------------------------------
    
    self.logon = function(e) {
    	try {
            // check that the user is valid, etc...
            if (self.validateUser(self.userName(), self.userPassword())) {	
            	var user = self.logonUser(self.userName(), self.userPassword());
                if (user && user.isValid) { 
			    	app.clearError();
			        app.setUser(user);
                    //self.userName("");
                    self.userPassword("");
			        app.changePage('dashboard','Dashboard');
                } else {
                	app.setError("Authentication for User [" + self.userName() + "]  failed");
                }
            } else {
            	app.setError("Invalid Username / Password entered");
            }
        } catch (ex) {
        	app.setError(ex);
        }
    }
    
    //--------------------------------------
    //  PRIVATE
    //--------------------------------------
    
    self.validateUser = function(username, password) {
    	if (!username || username.length < 1)
        	return false;
            
    	if (!password || password.length < 1)
        	return false;
            
		return true;
    }
    
    self.logonUser = function(username, password) {
    	// call hub to authenticate user
        // hub.authenticateUser(username, password);
        
		if (password != 'mudbatch')
        	return null;
        
        var roles = [];
        roles.push(new cai.UserRole(1, "admin"));
        roles.push(new cai.UserRole(2, "planner"));
        roles.push(new cai.UserRole(3, "operator"));
        
        return new cai.UserIdentity(1, username, username+"+"+password, roles);
    }
};

