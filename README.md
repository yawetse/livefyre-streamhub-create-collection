livefyre-streamhub-create-collection
====================================

quick way to create livefyre collection ids

    Usage: node ./app.js -col [article id] -title [title] -net [network] -site [site id] -secret [site secret] -url [url base] -save [true/false]
  
    Options:
      --title, -t   livefyre collection title                           [required]
      --net, -n     livefyre network, ex: labs-t402.fyre.co             [required]
      --site, -s    livefyre site id, ex: 303827                        [required]
      --secret, -k  livefyre site secret, ex: [user token]              [required]
      --url, -u     url base, ex: http://demos.livefyre.com/labs-t402/  [required]
      --save, -e    create(true) test(false)                          
      --col, -c     livefyre artcile/collection id                      [required]
