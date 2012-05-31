var cai = cai || {};  

cai.UserIdentity = function(id, username, token, roles) {
	this.Id = id;
	this.Username = username;
    this.Token = token;
    this.Roles = roles;
    
    this.isValid = function() {
    	return (Token != null && Token.length > 0);
    }
};

cai.UserRole = function(id, name, decription, active) {
	this.Id = id;
	this.Name = name;
	this.Description = decription;
    this.Active = active;
};