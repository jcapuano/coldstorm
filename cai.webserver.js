var cai = cai || {};  

cai.WebServer = function(port, folder) {
	var self = this;
    
	self.Port = port || 8080;
    self.Folder = folder || process.cwd();
    self.defaultHtml = 'main.html';
    
    this.start = function(port, folder) {
    	if (!port) port = self.Port;
        self.Port = port;
        
        if (!folder) folder = self.Folder;
        self.Folder = folder;
    
    	console.log('Starting Web Server');
    	console.log('Referencing resources from [' + self.Folder + ']');
        
		var http = require('http');
        var fs = require('fs');
        var path = require('path'); 
        
		http.createServer(function (request, response) {     
			console.log('request received: ' + request.url);         
		    
		    var filePath = request.url;    
		    if (filePath == '/')        
            	filePath = '/' + self.defaultHtml;             
            filePath = self.Folder + filePath
		    var extname = path.extname(filePath);    
		    var contentType = 'text/html';    
		    switch (extname) {        
		    	case '.js':            
		        	contentType = 'text/javascript';            
		            break;        
				case '.css':            
		        	contentType = 'text/css';            
		            break;    
			}         
		    path.exists(filePath, function(exists) {             
		    	if (exists) {            
		        	fs.readFile(filePath, function(error, content) {                
		            	if (error) {                    
		                	response.writeHead(500);                    
		                    response.end();                
						}                
		                else {                    
		                	response.writeHead(200, { 'Content-Type': contentType });                    
		                    response.end(content, 'utf-8');                
		                }            
					});        
				}        
		        else {            
		        	response.writeHead(404);            
		            response.end();        
				}    
			});     
		        
		}).listen(self.Port);
        
        console.log('Web Server running at http://127.0.0.1:' + self.Port + '/');
	}
};

cai.Main = function() {

	try {
    	console.log('Creating Web Server');
        var port = process.argv.length > 2 ? process.argv[2] : 8080;
        var folder = process.argv.length > 3 ? process.argv[3] : process.cwd();
    
		var ws = new cai.WebServer();
        
		ws.start(port, folder);
    } catch (ex) {
    	console.log('Error in creating Web Server: ' + ex);
    }

};

cai.Main();

