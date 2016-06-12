

module.exports = function(app, db){
    
    app.get('/', function(req, res) {
        res.sendfile(process.cwd() + "/client/index.html");
        
    });
}