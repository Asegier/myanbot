// const fsm = require('./statemachine.js')
const Bot = require('./bot.js')
const Utils = require('./utils.js')

// json: [branch, from, to, options, message, listenfor]
let utils = new Utils()
let bot = new Bot()
let startbot = ()=>{
  bot.loadBot( null, ()=>{
    console.log(bot.script)
    bot.loadState('1')
  })
  console.log('..........starting bot ........')
}
startbot();

module.exports = robot => {
  let counter = 0

  robot.enter(function(res) {
    res.reply(`Hello from robot.enter!`)
  });

  robot.hear(/\/restart/, res => {
    bot.loadState('1')
  })

  robot.hear(/\/reload/, res => {
    bot.loadBot()
  })

  robot.hear(/(.*)/i, res => {
    debugger;
    let input = res.match.input
    console.log('res.match.input !!!!!!!!!!!!!!!!!!!!!!', res.match.input)

    counter++;

    switch (bot.options) {
      case 'wiki':
        // let wikikeywordsArr = utils.getNouns(input) // parse NLP
        let wikikeywordsArr = [] // comment this out to use NLP
        wikikeywordsArr.push(input) // comment htis out to use NLP
        let searchedWikiLinks = utils.getWiki(wikikeywordsArr)

        for (var i = 0; i < searchedWikiLinks.length; i++) {
          let id = i+1
          let link = searchedWikiLinks[i]
          res.reply(`Result ${id}: ${link}`)
        }
        break;

      case 'solr':
        // let solrkeywordsArr = utils.getNouns(input) // parse NLP
        let solrkeywordsArr = []
        solrkeywordsArr.push(input)
        let searchSolr = utils.getSolr(solrkeywordsArr[0], (results)=>{

          for (var i = 0; i < results.length; i++) {
            res.reply(results[i])
          }
        })
        break;

      default:
    }

    // seek response
    if (bot.readUserInput(input, counter) && counter){
      bot.loadState(bot.readUserInput(input, counter))
      counter = 0
      res.reply(bot.msg)
      res.reply('Select: ' + bot.getListenForWhichResponses())
    } else {
      // res.reply('Command not found')
      res.reply(bot.msg)
      res.reply('Select: ' + bot.getListenForWhichResponses())
    }
  })
}
