var cai = cai || {};  

cai.RoleViewModel = function(id, name, description, active, isnew) {
	var self = this;
    
    self.Id = id;
    self.Name = ko.observable(name);
    self.Description = ko.observable(description);
    self.Active = ko.observable(active);
    self.IsNew = isnew;
    self.IsDelete = false;
    
    self.editName = ko.observable(name);
    self.editDescription = ko.observable(description);
    self.editActive = ko.observable(active);
    
    self.IsValid = function() {
    	if (!self.editName() || self.editName().length < 1) {
        	return false;
        }
    	return true;
    }
    
    //persist edits to real values on accept
    self.accept = function() {
        //this.Name(this.editName()).Description(this.editDescription()).Active(this.editActive());
    }.bind(this);

    //reset to originals on cancel
    self.cancel = function() {
        //this.editName(this.Name()).editDescription(this.Description()).editActive(this.Active());
    }.bind(this);
};

cai.RolesViewModel = function() {
	var self = this;
    
    self.Error = ko.observable("");
    self.Roles = ko.observableArray(
	        	ko.utils.arrayMap([], function(role) {
	                	return new cai.RoleViewModel(role.Id, role.Name, role.Description, role.Active, false);
	                })
				);
	self.dummyRole = new cai.RoleViewModel(-1, "", "", false, false);
    self.selectedRole = ko.observable(self.dummyRole);
    	//ko.observable();
    self.displayDetail = ko.computed(function() {
    	var role = self.selectedRole();
        if (role && role.Id != -1) {
        	return true;
        }
        return false;
    });
	self.displayDeleteConfirm = ko.computed(function() {
    	var role = self.selectedRole();
        if (role && role.Id != -1 && role.IsDelete) {
        	return true;
        }
        return false;
    });
    
	self.init = function() {
    
		cai.log("Initializing the Role View Model");
        
		//custom binding to initialize a jQuery UI dialog
		ko.bindingHandlers.jqDialog = {
		    init: function(element, valueAccessor) {
		        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
		        
		        //handle disposal
		        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
		            $(element).dialog("destroy");
		        });
		        
		        $(element).dialog(options);  
		    }
		};

		//custom binding handler that opens/closes the dialog
		ko.bindingHandlers.openDialog = {
		    update: function(element, valueAccessor) {
		        var value = ko.utils.unwrapObservable(valueAccessor());
		        if (value) {
		            $(element).dialog("open");
		        } else {
		            $(element).dialog("close");
		        }
		    }
		};

		//custom binding to initialize a jQuery UI button
		ko.bindingHandlers.jqButton = {
		    init: function(element, valueAccessor) {
		        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
		        
		        //handle disposal
		        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
		            $(element).button("destroy");
		        });
		        
		        $(element).button(options);  
		    }    
		};
        
		//custom binding to initialize a jQuery TableSorter
		ko.bindingHandlers.jqTableSorter = {
		    init: function(element, valueAccessor) {
		        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
		        
		        //handle disposal
		        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
		            $(element).button("destroy");
		        });
		        
		        $(element).tablesorter(options);  
		    }    
		};
        
		ko.bindingHandlers.readOnly = {
		    update: function(element, valueAccessor) {
		        var value = ko.utils.unwrapObservable(valueAccessor());
		        if (value) {
		            element.setAttribute("readOnly", true);
		        }  else {
		            element.removeAttribute("readOnly");
		        }  
		    }  
		};
        
        /*
		$("#rolesTable").tablesorter({
			// striping looking
			widgets: ['zebra']
		});
        */
    }    
    
    //--------------------------------------
    //  PUBLIC
    //--------------------------------------
    self.refresh = function() {
    	// call hub to fetch roles
    	cai.log("Retrieving roles");
        hub.getRoles();
        
        self.startGetWait();
    }
    
    self.setRoles = function(roles) {
    	cai.log("Roles received");
        
        self.stopWait();
        
        self.Roles.removeAll();
        
    	if (roles) {
        	var rolesarray = (typeof roles == "string") ? $.evalJSON(roles) : roles;
            for (var i=0; i<rolesarray.length; i++) {
            	var role = rolesarray[i];
            	self.Roles.push(new cai.RoleViewModel(role.Id, role.Name, role.Description, role.Active, false));
            };
        }
    }
    
    self.roleAdded = function(role) {
    	cai.log("Role added: " + role.Name);
        
        self.Roles.push(new cai.RoleViewModel(role.Id, role.Name, role.Description, role.Active, false));
        
        self.stopWait();
    }
    
    self.roleUpdated = function(role) {
    	cai.log("Role updated: " + role.Name);
        
        var foundrole = ko.utils.arrayFilter(self.Roles(), function(r) {
	            return r.Id === role.Id;
                });
		if (foundrole && foundrole.length > 0)
        {
			// there is a better way to do this, but too lazy for now
			foundrole[0].Name(role.Name);
			foundrole[0].Description(role.Description);
			foundrole[0].Active(role.Active);
        }        
        
        self.stopWait();
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
        
        self.stopWait();
    }
    
    //--------------------------------------
    //  EVENT HANDLERS
    //--------------------------------------
    
    self.addRole = function() {
        self.selectedRole(new cai.RoleViewModel(0, "New Role", "", true, true));
    }
    
    self.editRole = function(role) {
    	role.IsDelete = false;
        self.selectedRole(role);
    }
    
    self.deleteRole = function(role) {
    	role.IsDelete = true;
        self.selectedRole(role);
    }
    
    self.accept = function() {
    	try {
        	self.Error("");
            
            var role = self.selectedRole();
	    	if (self.validateRole(role)) {
            
            	role.accept();
		        
		        if (role.IsNew) {
		    		// call hub to add role 
                    cai.log("Adding role");
                    
                    self.startAddWait();
                    
	                hub.addRole({Id: role.Id, Name: role.editName(), Description: role.editDescription(), Active: role.editActive()});
		        }
                else if (role.IsDelete) {
                	role.IsDelete = false;
                    
                	cai.log("Deleting role");
                    
                    self.startDeleteWait();
			        
                    // call hub to remove role 
                    hub.deleteRole(role.Id);
				}                    
	            else {
	            	// edit
		    		cai.log("Updating role");
                    
                    self.startUpdateWait();
                    
                    // call hub to update role 
	                hub.updateRole({Id: role.Id, Name: role.editName(), Description: role.editDescription(), Active: role.editActive()});
	            }
                
                self.selectedRole(self.dummyRole);
	        } 
            else {
            	self.Error("Invalid role entered");
	        }
                
        } catch (ex) {
        	self.Error(ex);
        }
    }
    
    self.cancel = function() {
        self.selectedRole().cancel();
        self.selectedRole(self.dummyRole);
    }
    
    //--------------------------------------
    //  PRIVATE
    //--------------------------------------
    
    self.startGetWait = function() {
    	self.startWait("Retrieving Roles...");
    }
    self.startAddWait = function() {
    	self.startWait("Adding Roles...");
    }
    self.startUpdateWait = function() {
    	self.startWait("Updating Roles...");
    }
    self.startDeleteWait = function() {
    	self.startWait("Deleting Role...");
    }
    
    self.startWait = function(title) {
        $.blockUI({ message: '<h1><img src="img/ajax-loader.gif" /> ' + title + '</h1>' });
    }
    
    self.stopWait = function() {
        $.unblockUI();
	}      
    
    self.validateRole = function(role) {
    	if (!role || !role.IsValid)
        	return false;
        
        // check to see if role is duplicate
          
		return true;
    }
};

