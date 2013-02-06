var http = require('http'),
    jwt  = require('jwt-simple'),
    querystring = require('querystring'),
    argv = require('optimist')
           .usage('Usage: $0 -col [article id] -title [title] -net [network] -site [site id] -secret [site secret] -url [url base] -save [true/false]')
           .demand(['title','net','site','secret','url','col'])
           .alias('title','t')
           .describe('title','livefyre collection title')
           .alias('net','n')
           .describe('net','livefyre network, ex: labs-t402.fyre.co')
           .alias('site','s')
           .describe('site','livefyre site id, ex: 303827')
           .alias('secret','k')
           .describe('secret','livefyre site secret, ex: [user token]')
           .alias('url','u')
           .describe('url','url base, ex: http://demos.livefyre.com/labs-t402/')
              .alias('save','e')
           .describe('save','create(true) test(false)')
           .alias('col','c')
           .describe('col','livefyre artcile/collection id')
           .argv;


var __NETWORK = argv.net; //'labs-t402.fyre.co',
    __SITE_ID = argv.site[0]; //303827,
    __SITE_SECRET = argv.secret; //'/=',
    __URL_BASE = argv.url; //'http://demos.livefyre.com/labs-t402/',
    __SAVE = (argv.save == 'f' || argv.save == 'false' || argv.save == false ) ? false : true; //true

if( __NETWORK
    && __SITE_ID
    && __SITE_SECRET
    && __URL_BASE
    && argv.col
    && argv.title){

    var collection_data = {
        article_id: argv.col,
        title: argv.title
    }

    // console.log(JSON.stringify(collection_data))

    create_collection(collection_data)
}
else{
    console.log("missing data")
}

function collection_meta_jwt(site_secret, article_id, title, url, tags){
    // Create JSON Obj
    data = {
        articleId: article_id,
        title: title,
        url: url
    }
    if (tags){
        data['tags'] = tags
    }
    return jwt.encode(data, site_secret);
}


function create_collections(infos){
    for(x in infos){
        var info = infos[x];
        create_collection(info)
    }
}

function create_collection(info){
    var post_data = {
            article_id : info['article_id'],
            title: info['title'],
            url: __URL_BASE + info['article_id'],
            collectionMeta : collection_meta_jwt(__SITE_SECRET, info['article_id'], info['title'], __URL_BASE + info['article_id'])
        }
    var post_data_string = JSON.stringify(post_data);
    var http = require('http');
    var post_options = {
              host: "quill."+__NETWORK,
              path: "/api/v3.0/site/"+__SITE_ID+"/collection/create",
              port: '80',
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': post_data_string.length
            }
        };


    if(__SAVE){
        callback = function(response) {
            var str = ''

            response.setEncoding('utf-8');

            response.on('data', function (chunk) {
            str += chunk;
            });

            response.on('end', function () {
            console.log(str);
            });
        }

        var req = http.request(post_options, callback);
        req.write(JSON.stringify(post_data))
        req.end();
    }
    else{
        console.log(
            "Creating Collection for article_id="+post_data.article_id+", title="+post_data.title+", url="+post_data.url
        );
    }
}




