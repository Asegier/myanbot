const corenlp = require("corenlp-js-interface");
const solr = require('solr-client');
const client = solr.createClient();

module.exports = robot => {
  robot.respond(/is it (weekend|holiday)\s?\?/i, function(msg){
      var today = new Date();
      msg.reply(today.getDay() === 0 || today.getDay() === 6 ? "YES" : "NO");
  })

  robot.hear(/(.*)/i, res => {
    let input = res.match[1] // get the text inputted from user
    let nlptext = corenlp(input,9000/*port*/,"pos,lemma,depparse,ner"/*annotators*/,"json"/*format*/);
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
    // convert array of words into string for output
    // this should be wikipedia links
    let output = result.join()
    return res.send(output)

  })
}
