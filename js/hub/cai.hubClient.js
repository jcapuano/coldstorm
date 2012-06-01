var cai = cai || {};  

cai.HubClient = function() {
	var self = this;
    
    // General
    self.init = function() {
    }
    
    // Roles
    self.roleViewModel = null;
    
    self.registerRoleViewModel = function(vm) {
    	self.roleViewModel = vm;
    }
    
    self.getRoles = function() {
    	now.getRoles();
    }
    now.setRoles = function(roles) {
    	if (self.roleViewModel) {
        	self.roleViewModel.setRoles(roles);
        }
    }
    
    self.addRole = function(role) {
    	now.addRole(role);
    }
    now.roleAdded = function(role) {
    	if (self.roleViewModel) {
    		self.roleViewModel.roleAdded(role);
		}        
    }

    self.updateRole = function(role) {
    	now.updateRole(role);
    }
    now.roleUpdated = function(role) {
    	if (self.roleViewModel) {
	    	self.roleViewModel.roleUpdated(role);
        }
    }
    
    self.deleteRole = function(id) {
    	now.deleteRole(id);
    }
    now.roleDeleted = function(id) {
    	self.roleViewModel.roleDeleted(id);
    }
    
    now.onError = function(e) {
    	var msg = e.body;
    	app.setError(msg);
    }
    
};
