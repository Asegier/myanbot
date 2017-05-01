const fsm = require('./statemachine.js')
const Bot = require('./bot.js')
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// json: [branch, from, to, options, message, listenfor]
let bot = new Bot();
let startbot = async (()=>{
  await (bot.loadBot())
})

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

  robot.hear(/(.*)/i, res => {
    let raw = res.match.input
    // let input = raw.replace(`myanbot2 `, ``) //only for slack, because they add myanbot2 before all my messages

    // send msg
    res.reply(bot.msg)

    // seek response
    res.reply(bot.readUserInput(raw))
    res.reply(!!bot.readUserInput(raw))

    // if (bot.readUserInput(raw)){
    //   res.reply('changing state')
    //   bot.loadState(readUserInput(raw))
    // } else {
    //   res.reply('command not found')
    // }

    // let userid = res.message.user.id
    // let roomid = res.message.user.room
    // let login;
    // loginAuth(`myanbot2`, `myanbot2`, (body)=>{
    //   login = body
    // });
    // robot.brain.set(`userid`, userid)
    // robot.brain.set(`roomid`, roomid)


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
  })
}
/*
var data;

data = JSON.stringify({
  foo: 'bar'
});

robot.http("https://midnight-train").header('Content-Type', 'application/json').post(data)(function(err, res, body) {});
 */
/*
robot.respond(/hey, create a branch plz/i, function(res) {
  var name, user;
  res.reply("Ok, lets start");
  user = {
    stage: 1
  };
  name = res.message.user.name.toLowerCase();
  return robot.brain.set(name, user);
});

robot.hear(/(\w+)\s(\w+)/i, function(msg) {
  var answer, name, user;
  name = msg.message.user.name.toLowerCase();
  user = robot.brain.get(name) || null;
  if (user !== null) {
    answer = msg.match[2];
    switch (user.stage) {
      case 1:
        msg.reply("How should I name it?");
        break;
      case 2:
        user.name = answer;
        msg.reply("Are you sure (y/n) ?");
        break;
      case 3:
        user.confimation = answer;
    }
    user.stage += 1;
    robot.brain.set(name, user);
    if (user.stage > 3) {
      if (/y/i.test(user.confimation)) {
        msg.reply("Branch " + user.name + " created.");
      } else {
        msg.reply("Branch creation aborted");
      }
      return robot.brain.remove(name);
    }
  }
});
*/
/*
// sample data

{
  thisState: 'menu',
  fromState: 'greet',
  parentID: 'mn21b3mnv41m2v3'
  botMsg: 'what can I get you',
  listener: [
    { toState: 'bookSearch',
      usrResponse: ['books', '1'] },
    { toState: 'videoSearch',
      usrResponse: ['video', '1'] }
  ],
  responsetime: 123451
}

{
  thisState: 'bookSearch',
  fromState: 'menu',
  parentID: 'xc9897xc9v7x'
  botMsg: 'what kind of book do you want?',
  listener: [
    { toState: 'bookResults',
      usrResponse: ['(.*)'] }
  ],
  responsetime: 123451
}
 */
