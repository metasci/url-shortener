

module.exports = function(app, db){
    
    app.get('/:url', function(req, res){
        var url = "https://" + req.headers.host + "/" + req.params.url;
        checkDB(url, db, res);
    });
    
    app.get('/new/:url*', function(req, res){
        var url = req.url.slice(5);
        
        var urlObj = {};
        
        if(testUrl(url)){
            urlObj = {
                "original_url" : url,
                "short_url" : "https://" + req.headers.host + "/" + generator()
            };
            save(req.url.slice(5), res, urlObj, db);
        }else{
            res.send('Not A Valid URL!')
        }
    });
        
        
    
        
        
}


// is the url valid?
function testUrl(url){
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}


// check database for url
function checkDB(url, db, res){
        
    var collection = db.collection('shortUrls');
    
    collection.findOne({
        "short_url": url
    }, function(err, result){
        if(err) throw "checkDB() findOne() ERROR: "+ err;
        
        if(result){
            res.redirect(result.original_url);
        }else {
            res.send({
                "error": "This url is not in the database."
              });
        }
    });
}


// generate short_url
function generator(){
    var num = Math.floor(1000 + Math.random() * 9000);
    return num.toString();
}


// save url to database
function save(url, res, obj, db){
    var collection = db.collection('shortUrls');
    
    collection.findOne({
        "original_url": url
    }, function(err, result){
        if(err) throw "checkDB() findOne() ERROR: "+ err;
        
        if(result){
            // if already exists, send existing info
            console.log('already exists, not resaved')
            res.send({
                 "original_url" : result.original_url,
                 "short_url" : result.short_url
            });
        }else {
            collection.save(obj, function(err, result){
                if(err) throw err;
                console.log('saved');
            });
        }
    });
    
    
}