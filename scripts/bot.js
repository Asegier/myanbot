const axios = require ('axios')

let Bot = function(input){
  let self = this
  self.brain = null
  self.script = null
  // state
  self.currentState = 'greet'
  self.msg = 'Hello! say hi, or bye'
  self.listenfor = [ {
        "toState": "bye",
        "usrResponse": [
          "bye"
        ]
      },
      {
            "toState": "menu",
            "usrResponse": [
              "hi", "hola"
            ]
          }]
  self.options = null

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
    console.log('loadState: ', statename)
    self.script.forEach((e)=>{
      if(e.thisState == statename){
        console.log('loadState: changing state')
        self.currentState = e.thisState
        self.msg = e.botMsg
        self.listenfor = e.listener
        if (e.options) {
          self.options = e.options
        } else {
          self.options = null
        }
      }
    })
  }

  self.readState = () => {
    console.log('!!!!!!!!!!!Read State!!!!!!!!!!!!!')
    console.log('bot.currentState:', self.currentState)
    console.log('bot.msg:', self.msg)
    console.log('bot.listenfor:', self.listenfor)
    console.log('bot.options:', self.options)
    console.log('!!!!!!!!!!! End !!!!!!!!!!!!!')
  }

  self.readUserInput = (input) => {
    let result = null
    console.log(self.listenfor)
    self.listenfor.forEach((e)=>{
      e.usrResponse.forEach((el)=>{
        if (input == el){
          result = e.toState
        }
      })
    })
    console.log('readUserInput- result: ', result)
    return result
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
