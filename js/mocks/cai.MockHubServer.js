var now = now || {};  

var timer = null;
var tempRole = null;

now.getRoles = function() {
	timer = setTimeout('sendRolesToClient()', 5000);
	
	//now.setRoles(cai.MockRoles);
}

now.addRole = function(role) {
	role.Id = Math.random(1, 500);
	//now.roleAdded(role);
    tempRole = role;
	timer = setTimeout('addRoleToClient()', 2500);
}

now.updateRole = function(role) {
	//now.roleUpdated(role);
    tempRole = role;
	timer = setTimeout('updateRoleToClient()', 2500);
}

now.deleteRole = function(id) {
	//now.roleDeleted(id);
    tempRole = id;
	timer = setTimeout('deleteRoleToClient()', 2500);
}

now.ready = function(callback) {
	callback();
}

var sendRolesToClient = function () {
	now.setRoles(cai.MockRoles);
}
var addRoleToClient = function () {
	now.roleAdded(tempRole);
}
var updateRoleToClient = function () {
	now.roleUpdated(tempRole);
}
var deleteRoleToClient = function () {
	now.roleDeleted(tempRole);
}
