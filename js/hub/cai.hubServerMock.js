var now = now || {};  

now.getRoles = function() {
	var roles = [
    	{'roleName': 'admin'},
    	{'roleName': 'tester'}
    ];
	now.setRoles(roles);
}

now.addRole = function(role) {
	now.roleAdded(role);
}

now.updateRole = function(role) {
	now.roleUpdated(role);
}

now.deleteRole = function(role) {
	now.roleDeleted(role);
}
