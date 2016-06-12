

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
    var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
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