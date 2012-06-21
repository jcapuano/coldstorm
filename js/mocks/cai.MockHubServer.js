var now = now || {};  

var timer = null;
var tempRole = null;
var roles = cai.MockRoles;

now.getRoles = function() {
	timer = setTimeout('sendRolesToClient()', 1000);
	
	//now.setRoles(roles);
}

now.addRole = function(role) {
	role.Id = roles.length + 1;//Math.ceil(Math.random(1, 500)*500);
    roles.push(role);
	//now.roleAdded(role);
    tempRole = role;
	timer = setTimeout('addRoleToClient()', 2000);
}

now.updateRole = function(role) {
	//now.roleUpdated(role);
    for (var i=0; i<roles.length; i++) {
    	if (roles[i].Id == role.Id) {
        	roles[i] = role;
            break;
        }
    }
    tempRole = role;
	timer = setTimeout('updateRoleToClient()', 2000);
}

now.deleteRole = function(id) {
	//now.roleDeleted(id);
    for (var i=0; i<roles.length; i++) {
    	if (roles[i].Id == id) {
        	roles.splice(i,1);
            break;
        }
    }
    
    tempRole = id;
	timer = setTimeout('deleteRoleToClient()', 2000);
}

now.ready = function(callback) {
	callback();
}

var sendRolesToClient = function () {
	now.setRoles(roles);
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
