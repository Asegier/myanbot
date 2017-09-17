const axios = require ('axios')
// const async = require('asyncawait/async');
// const await = require('asyncawait/await');
const async = require('async')

let Utils = function(input){
  let self = this

  self.getSolr = (searchterm, cb) => {
    let data = {
      params:{
        'q': `${searchterm}`,
        'sort': 'score desc',
        'fl': ['title', 'resourcename', 'content_type','score'],
        'rows': 3,
        'indent': true,
        'dismax': true,
        'q.alt': `${searchterm}`
      }
    };

    axios({
      method:'get',
      url:'http://192.168.100.105:8983/solr/gettingstarted/query',
      data: data
    })
    .then(function(res) {
      let results = []
      let foundArr = res.data.response.docs;
      for (var i = 0; i < foundArr.length; i++) {
        let solrlink = foundArr[i].resourcename[0]
        let str = solrlink.replace(`/media/RACHEL/rachel`, `http://192.168.88.1`)
        let newstr = str.split(` `).join(`%20`)
        console.log(newstr)
        results.push(newstr)
      }
      cb(results)
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  self.getWiki = (keywordsArr) => {
    let result = []
    keywordsArr.forEach((e)=>{
      let wikilink = `http://192.168.88.1:81/search?content=wikipedia_en_all_2016-02&pattern=${e}`
      result.push(wikilink)
    })
    return result
  }

  self.getNouns = input => {
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

module.exports = Utils

  // self.loadBot = () => {
  //   axios({
  //     method:'get',
  //     url:'http://localhost:3000/api/script.get'
  //   })
  //   .then(function(response) {
  //     self.brain = response.data[0]
  //     self.script = JSON.parse(self.brain.script)
  //   });
  // }
