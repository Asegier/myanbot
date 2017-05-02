data = JSON.stringify({
  params:{
    'q': "ottoman empire",
    'sort': 'score desc',
    'fl': ['title', 'resourcename', 'content_type','score'],
    'rows': 3,
    'indent': true,
    'dismax': true,
    'q.alt': 'ottoman'
  }
});

module.exports = robot => {
  robot.hear(/(.*)/i, res => {

    res.reply("Hello");

    robot.http(`http://192.168.100.105:8983/solr/gettingstarted/query`)
      .header(`Content-type`, `application/json`)
      .get(data)(function(err, httpRes, body){
        if(err){
          console.log(`login err:`, err)
        } else {
          var link = body.response.docs;
          var results = [];
          console.log(body);
          for (var i = 0; i < link.length; i++) {
            results.push(link[i].resourcename);
          }
          console.log(results);
      }
    });
  });
}
