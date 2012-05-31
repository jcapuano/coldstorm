var cai = cai || {};  

cai.RoleViewModel = function(role) {
	var self = this;
    
    self.Id = role.Id;
    self.Name = ko.observable(role.Name);
    self.Description = ko.observable(role.Description);
    self.Active = ko.observable(role.Active);
    self.editing = ko.observable(false);
    
    self.edit = function() {  
    	self.editing(true); 
    }
    
    self.stopEditing = function() { 
    	self.editing(false); 
	}
};

cai.RolesViewModel = function(roles) {
	var self = this;
    
    self.newRole = ko.observable("");
    self.Roles = ko.observableArray(ko.utils.arrayMap(roles, function(role) {
            return new cai.RoleViewModel(role);
        }));
    
	self.init = function() {
    
		ko.bindingHandlers.enterKey = {
	        init: function(element, valueAccessor, allBindingsAccessor, data) {
	            var wrappedHandler, newValueAccessor;

	            //wrap the handler with a check for the enter key
	            wrappedHandler = function(data, event) {
	                if (event.keyCode === 13) {
	                    valueAccessor().call(this, data, event);
	                }
	            };

	            //create a valueAccessor with the options that we would want to pass to the event binding
	            newValueAccessor = function() {
	                return { keyup: wrappedHandler };
	            };

	            //call the real event binding's init function
	            ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
	        }
	    };    
    }    
    
    //--------------------------------------
    //  PUBLIC
    //--------------------------------------
    self.refresh = function() {
    	// call hub to fetch roles
    	cai.log("Retrieving roles");
        hub.getRoles();
    }
    
    self.setRoles = function(roles) {
    	cai.log("Roles received");
        self.Roles([]);
    
    	if (roles) {
        	var rolesarray = $.evalJSON(roles);
	    	self.Roles(
	        	ko.utils.arrayMap(rolesarray, function(role) {
	                	return new cai.RoleViewModel(role);
	                })
			);
        }
    }
    
    self.roleAdded = function(role) {
    	cai.log("Role added: " + role.Name);
        
        var id = self.Roles.length + 1;
        self.Roles.push(new cai.RoleViewModel(role));
        
        self.newRole("");
    }
    
    self.roleUpdated = function(role) {
    	cai.log("Role updated: " + role.Name);
        
        var foundrole = ko.utils.arrayFilter(self.Roles(), function(r) {
	            return r.Name() === role.Name;
                });
		if (foundrole && foundrole.length > 0)
        {
        	foundrole[0].stopEditing();
        }   
        
    }
    
    self.roleDeleted = function(id) {
    	cai.log("Role deleted: " + id);
        
        var foundrole = ko.utils.arrayFilter(self.Roles(), function(r) {
	            return r.Id === id;
                });
		if (foundrole && foundrole.length > 0)
        {
        	self.Roles.remove(foundrole[0]);
        }   
    }
    
    //--------------------------------------
    //  EVENT HANDLERS
    //--------------------------------------
    
    self.addRole = function(e) {
    	try {
	    	var role = self.newRole();
	    	if (self.validateRole(role)) {
	    		// call hub to add role 
                hub.addRole({Id: -1, Name: role, Description: "", Active: true});
                
                app.clearError();
	        } else {
            	app.setError("Invalid role entered");
	        }
        } catch (ex) {
        	app.setError(ex);
        }
    }
    
    self.updateRole = function(role) {
    	try {
	    	if (self.validateRole(role.Name())) {
	    		// call hub to update role 
	        	hub.updateRole({Id: role.Id, Name: role.Name(), Description: role.Description(), Active: role.Active()});
	        
                app.clearError();
	        } else {
            	app.setError("Invalid role entered");
	        }
        } catch (ex) {
        	app.setError(ex);
        }
    }

    self.deleteRole = function(role) {
    	try {
	    	if (self.validateRole(role.Name())) {
	    		// call hub to remove role 
	        	hub.deleteRole(role.Id);
	        
                app.clearError();
	        } else {
            	app.setError("Invalid role entered");
	        }
        } catch (ex) {
        	app.setError(ex);
        }
    }
    
    //--------------------------------------
    //  PRIVATE
    //--------------------------------------
    
    //track whether the tooltip should be shown
    self.showTooltip = ko.observable(false);
    self.showTooltip.setTrue = function() { self.showTooltip(true); }; //avoid an anonymous function each time

    //watch the current value
    self.newRole.subscribe(function(newValue) {
        //if the value was just updated, then the tooltip should not be shown
        self.showTooltip(false);

        //clear the current timer, as it is actively being updated
        if (self.showTooltip.timer) {
            clearTimeout(self.showTooltip.timer);
        }

        //if there is a value and then show the tooltip after 1 second
        if (newValue) {
            self.showTooltip.timer = setTimeout(self.showTooltip.setTrue, 1000);
        }
    });
    
    self.validateRole = function(role) {
    	if (!role || role.length < 1)
        	return false;
        
        // check to see if role is duplicate
          
		return true;
    }
};

