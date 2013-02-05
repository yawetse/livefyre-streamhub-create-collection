var http = require('http'),
	jwt  = require('jwt-simple'),
    argv = require('optimist')
    	   .usage('Usage: $0 -aid [article id] -title [title] -net [network] -site [site id] -secret [site secret] -url [url base] -save [true/false]')
    	   .demand(['aid','title','net','site','secret','url'])
    	   .default('save', true)
    	   .alias('aid','a')
    	   .describe('aid','livefyre artcile id')
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
    	   .describe('save','create(true) test(false)')
    	   .argv;

var __NETWORK = argv.net; //'labs-t402.fyre.co',
	__SITE_ID = argv.site; //303827,
	__SITE_SECRET = argv.secret; //'/=',
	__URL_BASE = argv.url; //'http://demos.livefyre.com/labs-t402/',
	__SAVE = argv.save; //true


if( __NETWORK 
	&& __SITE_ID 
	&& __SITE_SECRET 
	&& __URL_BASE 
	&& __SAVE
	&& argv.aid 
	&& argv.title){

	var collection_data = {
		article_id: argv.aid,
		title: argv.title
	}

	create_collection(collection_data)
}
else{
	console.log("missing data")

}
// if __name__ == "__main__":
// 	cols = [
// 	("Media", "media_0")
// 	]
// 	col_objs = [dict(title=k, article_id=v) for (k,v) in cols]
// 	create_collections(col_objs)


 
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
	var article_id = info['article_id']
	var title = info['title']
	var url = __URL_BASE + article_id
	var meta_jwt = collection_meta_jwt(__SITE_SECRET, article_id, title, url)
	var format = 'json'
	if(__SAVE){
		// post_url = "http://quill."+__NETWORK+"/api/v3.0/site/"+__SITE_ID+"/collection/create";
		// data_str = json.dumps({"collectionMeta": meta_jwt})
		// print ("Making request to {url} with data={data}".format(url=post_url, data=data_str))
		// resp = requests.post(post_url, data=data_str)
		// print "Response: {resp} {resptext}".format(
		// 	resp=resp,
		// 	resptext=resp.text)


		var http = require('http');

		var options = {
		  host: "quill."+__NETWORK,
		  path: "/api/v3.0/site/"+__SITE_ID+"/collection/create",
		  port: '80',
		  //This is the only line that is new. `headers` is an object with the headers to request
		  // headers: {'custom': 'Custom Header Demo works'}
		};

		callback = function(response) {
		  var str = ''
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var req = http.request(options, callback);
		req.end();
	}
	else{
		console.log(
			"Creating Collection for article_id="+article_id+", title="+title+", url="+url
		); 
	}
}
 



