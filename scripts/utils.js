module.exports = robot => {
  //                        _______________
  // ______________________/ Utils API Calls \__
  const getNouns = input => {
    const corenlp = require("corenlp-js-interface");
    // pass input through coreNLP for results
    let nlptext = corenlp(input,9000/*port*/,"tokenize,ssplit,pos,lemma,ner"/*annotators*/,"json"/*format*/);
    let text = JSON.parse(nlptext);
    // sort through the JSON for the nouns
    let sentence = text.sentences[0]
    let tokens = sentence.tokens
    let filtered = tokens.filter(e => {
      // return objects with Noun(s) parts of speech
      return e.pos == 'NN' || e.pos == 'NNS';
    })
    let result = []
    let filtered2 = filtered.forEach( e => {
      // grab the lemma of the noun
      result.push(e.lemma)
    })
    return result
  }

  const loginAuth = (username, pwd, cb) => {
    let data = JSON.stringify({
      "username": `${username}`, "password": `${pwd}`
    })
    robot.http(`http://192.168.100.105:3000/api/v1/login`)
      .header(`Content-type`, `application/json`)
      .post(data)(function(err, res, body){
        if(err){
          console.log(`login err:`, err)
        } else {
          cb(body)
        }
      })
  }

  const closeRoom = (roomid, userid, authToken) => {
    let data = JSON.stringify({
      "msg": "method",
      "method": "eraseRoom",
      "id": "92",
      "params": [
          `${roomid}`
      ]
    });
    robot.http("http://192.168.100.105:3000/api/v1/im.close")
    .header('X-Auth-Token', authToken)
      .header('X-User-Id', userid)
      .header('Content-Type', 'application/json')
      .post(data)(function(err, res, body) {
        if(err){
          console.log(`room close err:`, err)
        } else {
          console.log(`room close body:`, body)
        }
      });
  }

  const loadBot = (cb) => {
    robot.http(`http://localhost:3000/api/script.get`)
    .header(`Content-type`, `application/json`)
    .get()(function(err, res, body){
      if(err){
        console.log(`getdata err:`, err)
      } else {
        cb (body)
      }
    })
  }
}
