var cai = cai || {};  

cai.log = function(args) {
	if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
    	console.log(args);
	}
};
