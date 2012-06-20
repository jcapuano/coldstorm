var cai = cai || {};  

cai.Application = function() {
    var self = this;
    
    self.rolesViewModel = null;
    
    self.init = function() {
    	self.rolesViewModel = new cai.RolesViewModel([]);
        self.rolesViewModel.init();
        
        ko.applyBindings(self.rolesViewModel);
    };
    
    self.connectViews = function() {
        hub.registerRoleViewModel(self.rolesViewModel);
    }
    
    self.refreshViews = function() {
    	self.rolesViewModel.refresh();
    }
};

var app = null;
var hub = null;

$(document).ready(function(){
    
    cai.log("Initializing the Application");
    app = new cai.Application();
    app.init();
    
    now.ready(function() {
		cai.log("Now is ready");
	    
		cai.log("Initializing the Hub");
		hub = new cai.HubClient();
	    hub.init();
	    
		cai.log("Refreshing views");
	    app.connectViews();
		app.refreshViews();
	});
});


