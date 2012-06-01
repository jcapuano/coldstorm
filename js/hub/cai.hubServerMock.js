var now = now || {};  

now.getRoles = function() {
	var roles = [
    	{Id: 1, Name: 'admin', Description: 'Administrators', Active: true},
    	{Id: 2, Name: 'tester', Description: 'Testers', Active: true}
    ];
	now.setRoles(roles);
}

now.addRole = function(role) {
	now.roleAdded(role);
}

now.updateRole = function(role) {
	now.roleUpdated(role);
}

now.deleteRole = function(id) {
	now.roleDeleted(id);
}

now.ready = function(callback) {
	setTimeout(function(){
    	callback();
	}, 300);
}
