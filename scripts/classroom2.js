const fsm = require('./statemachine.js')

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

module.exports = robot => {
  robot.hear(/(.*)/i, res => {
    switch (fsm.current) {
      case `greet`:
        res.reply('current state ***: '+fsm.current);
        var name, user;
        res.reply("Ok, lets start");
        // fsm.goStandby();
        break;
      case `standby`:
        res.reply('current state !!!!!!: '+fsm.current);
        // return fsm.goKeywordsearch();
        break;
      case `keywordsearch`:
        res.reply('current state !!!!!!: '+fsm.current);
        // return fsm.goKeywordsearch();
        // `keywordsearch`
        res.send(fsm.current)
        let input = res.match[1] // get the text inputted from user
        let nounArr = []
        nounArr.push(getNouns(input))
        nounArr.push(fsm.current)
        // convert array of words into string for output
        // this should be wikipedia links
        let output = nounArr.join()
        res.send(output)
        break;
      default:
        console.log('no fsm.current found')
    }
  })
}
