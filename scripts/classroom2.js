const fsm = require('./statemachine.js')
const Bot = require('./bot.js')
const Utils = require('./utils.js')
const async = require('asyncawait/async');
const await = require('asyncawait/await');

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
  //                        _______________
  // ______________________/ Utils API Calls \__

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

  let counter = 0

  robot.enter(function(res) {
    res.reply('Hello!');
  });

  robot.hear(/\/restart/, res => {
    bot.loadState('1')
  })

  robot.hear(/(.*)/i, res => {
    let input = res.match.input
    counter++
    // let input = input.replace(`myanbot2 `, ``) //only for slack, because they add myanbot2 before all my messages

    switch (bot.options) {
      case 'wiki':
        let wikikeywordsArr = utils.getNouns(input)
        let searchedWikiLinks = utils.getWiki(wikikeywordsArr)

        for (var i = 0; i < searchedWikiLinks.length; i++) {
          let id = i+1
          let link = searchedWikiLinks[i]
          res.reply(`Result ${id}: ${link}`)
        }
        break;
      case 'solr':
        let solrkeywordsArr = utils.getNouns(input)
        let searchSolr = utils.getSolr(solrkeywordsArr[0], (results)=>{
          console.log('searchSolrrrrrrrrrrrrrrrr', results)
          for (var i = 0; i < results.length; i++) {
            res.reply(results[i])
          }
        })
        break;
      default:
    }

    // seek response
    if (bot.readUserInput(input) && counter){
      bot.loadState(bot.readUserInput(input))
      counter = 0
      res.reply('Display Message: ' + bot.msg)
      res.reply('Select: ' + bot.getListenForWhichResponses())
    } else {

      console.log('COUNTERRRRRRRRRRR: ', counter)
      // res.reply('Command not found')
      res.reply('Display Message: ' + bot.msg)
      res.reply('Select: ' + bot.getListenForWhichResponses())
    }
    // let userid = res.message.user.id
    // let roomid = res.message.user.room
    // let login;
    // loginAuth(`myanbot2`, `myanbot2`, (body)=>{
    //   login = body
    // });
    // robot.brain.set(`userid`, userid)
    // robot.brain.set(`roomid`, roomid)


  })
}

// Old HUBOT for contingency
// switch (fsm.current) {
//   case `greet`:
//     // loginAuth(`myanbot2`, `myanbot2`, function(body){
//     //   let parsedbody = JSON.parse(body)
//     //   this.login = parsedbody.data
//     // })
//     // console.log('!!!!!!!1', thing.authToken, thing.userId)
//     // closeRoom(roomid, `myanbot2`, brain )
//     let name = robot.brain.get(`name`) || null
//     console.log(name)
//     if (name){
//       res.reply(`Hi ${name}!`);
//     }
//     res.reply(`I'm your SolarLeap Assistant`);
//     res.reply(`I can help you find what you need and get things done`);
//     res.reply(`To learn what you can do, pick any of the following options: 1) Keywordsearch, 2) Reccomendation, 3) Just chat`);
//     fsm.goStandby();
//     break;
//   case `standby`:
//     switch (input) {
//       case '1':
//         res.reply(`What are you looking for?`)
//         fsm.goKeywordsearch();
//         break;
//       case '2':
//         res.reply(input)
//         break;
//       case '3':
//         res.reply(input)
//         break;
//       default:
//         res.reply(`I didn't catch that`)
//     }
//     // return fsm.goKeywordsearch();
//     break;
//   case `keywordsearch`:
//     let nounArr = []
//     nounArr.push(bot.getNouns(input))
//     // convert array of words into string for output
//     // this should be wikipedia links
//     let output = nounArr.join()
//     res.reply(output)
//     res.reply(`Are you looking for anything else? y/n`)
//     if (input == `n`) {
//       fsm.goFeedback()
//     }
//     break;
//   case `feedback`:
//     res.reply(`did you get what you wanted? y/n`)
//     if (input == `y`) {
//       let satisfied = {satisfied: false}
//       robot.brain.set(satisfied);         fsm.goStandby();
//     } else if (input == `n`){
//       let satisfied = {satisfied: true}
//       robot.brain.set(satisfied);
//       fsm.goStandby();
//     }
//     break;
//   default:
//     console.log('no fsm.current found')
// }
