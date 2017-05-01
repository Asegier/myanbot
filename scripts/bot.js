const axios = require ('axios')

let Bot = function(input){
  let self = this
  self.brain = null
  self.script = null
  // state
  self.currentState = 'greet'
  self.msg = 'Hello! say hi'
  self.listenfor = [ {
        "toState": "menu",
        "usrResponse": [
          "hi"
        ]
      }]
  self.options = 'butt'

  self.loadBot = () => {
    axios({
      method:'get',
      url:'http://localhost:3000/api/script.get'
    })
    .then(function(response) {
      self.brain = response.data[0]
      self.script = JSON.parse(self.brain.script)
    });
  }

  self.loadState = (statename) => {
    self.script.forEach((e)=>{
      if(statename == e.thisState){
        self.currentState = e.thisState
        self.botMsg = e.botMsg
        self.listenfor = e.listener
        if (e.options) {
          self.options = e.options
        }
      }
    })
  }

  self.readUserInput = (input) => {
    let result = null
    self.listenfor.forEach((e)=>{
      e.usrResponse.forEach((el)=>{
        if (input == el){
          result = e.toState
          console.log('!!!!!!!!!!!!!!!!!!', result)
          return result
        }
      })
    })
  }

  self.getNouns = (input) => {
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
}

module.exports = Bot
