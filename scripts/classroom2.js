const StateMachine = require('javascript-state-machine');
const solr = require('solr-client');
const client = solr.createClient();

getNouns = input => {
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


const fsm = StateMachine.create({
  // states: greet, standby, keywordsearch, assistedsearch, recommended, chatter
  initial: 'greet',
  events: [
    { name: 'goStandby',  from: ['greet', 'feedback'],  to: 'standby' },
    { name: 'goKeywordsearch', from: 'standby', to: 'keywordsearch' },
    { name: 'goAssistedsearch',  from: 'standby', to: 'assistedsearch' },
    { name: 'goRecommended', from: 'standby', to: 'recommended'  },
    { name: 'goChatter',  from: 'standby',    to: 'chatter' },
    { name: 'goFeedback',  from: ['keywordsearch', 'assistedsearch', 'recommended', 'chatter' ], to: 'feedback' }
  ],
  callbacks: {
    ongreet: (event, from, to) => {
      return module.exports = robot => {
        robot.hear(/(\w+)\s(\w+)/i, function(res) {
          res.reply('current state ***: '+fsm.current);
          var name, user;
          res.reply("Ok, lets start");
          fsm.goStandby();
        });
      }
    },
    onstandby: (event, from, to) => {
      return module.exports = robot => {
        robot.hear(/(.*)/i, res => {
          res.reply('current state !!!!!!: '+fsm.current);
          // return fsm.goKeywordsearch();
        })
      }
    },
    onkeywordsearch: (event, from, to) => {
      module.exports = robot => {
        robot.hear(/(.*)/i, res => {
          res.send(fsm.current)
          let input = res.match[1] // get the text inputted from user
          let nounArr = []
          nounArr.push(getNouns(input))
          nounArr.push(fsm.current)
          // convert array of words into string for output
          // this should be wikipedia links
          let output = nounArr.join()
          res.send(output)
        })
      }
    }

  }
});

// robot.respond(/is it (weekend|holiday)\s?\?/i, function(msg){
//     var today = new Date();
//     msg.reply(today.getDay() === 0 || today.getDay() === 6 ? "YES" : "NO");
// })
