var cai = cai || {};  

cai.Application = function() {
    var self = this;
    
    self.appViewModel = null;
    self.logonViewModel = null;
    self.rolesViewModel = null;
    
    self.init = function() {
    	self.appViewModel = new cai.AppViewModel(null);
        self.appViewModel.init();
        $(document).data("index", self.appViewModel);
        ko.applyBindings(self.appViewModel);
        
    	self.logonViewModel = new cai.LogonViewModel();
        self.logonViewModel.init();
        $(document).data("logon", self.logonViewModel);
        
    	self.rolesViewModel = new cai.RolesViewModel([]);
        self.rolesViewModel.init();
        $(document).data("role", self.rolesViewModel);
    };
    
    self.connectViews = function() {
        hub.registerRoleViewModel(self.rolesViewModel);
    }
    
    self.refreshViews = function() {
    	self.rolesViewModel.refresh();
    }
    
    self.getUser = function() {
    	return self.appViewModel.getUser();
    }
    
    self.setUser = function(user) {
    	self.appViewModel.setUser(user);
    }
    
    self.changePage = function(pageID, pageTitle, data) {
    	self.appViewModel.changePage(pageID, pageTitle, data);
    }
    
    self.setError = function(e) {
    	self.appViewModel.setError(e);
    }
    
    self.clearError = function() {
    	self.appViewModel.setError('');
    }
};

var app = null;
var hub = null;

$(document).ready(function(){
	cai.log("Initializing the Application");
	app = new cai.Application();
	app.init();
});

now.ready(function() {
	cai.log("Now is ready");
    
	cai.log("Initializing the Hub");
	hub = new cai.HubClient();
    hub.init();
    
	cai.log("Refreshing views");
    app.connectViews();
	app.refreshViews();
});
