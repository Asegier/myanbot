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
        let name = robot.brain.get() || null
        if (name){
          res.reply(`Hi ${name}!`);
        }
        res.reply("I'm your SolarLeap Assistant");
        res.reply("I can help you find what you need and get things done");
        res.reply("To learn what you can do, pick any of the following options: 1) Keywordsearch, 2) Reccomendation, 3) Just chat");
        fsm.goStandby();
        break;
      case `standby`:
        switch (res.match[1]) {
          case '1':
            res.reply(`What are you looking for?`)
            fsm.goKeywordsearch();
            break;
          case '2':
            res.reply(res.match[1])
            break;
          case '3':
            res.reply(res.match[1])
            break;
          default:
            res.reply(`I didn't catch that`)
        }
        // return fsm.goKeywordsearch();
        break;
      case `keywordsearch`:
        let input = res.match.input // get the text inputted from user
        let nounArr = []
        nounArr.push(getNouns(input))
        // convert array of words into string for output
        // this should be wikipedia links
        let output = nounArr.join()
        res.reply(output)
        break;
      default:
        console.log('no fsm.current found')
    }
  })
}
