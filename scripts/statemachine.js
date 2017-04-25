const StateMachine = require('javascript-state-machine');
const solr = require('solr-client');
const client = solr.createClient();

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

      console.log(this);

    //  console.log('current state *********** '+fsm.current)
      // module.exports = robot => {
      //   debugger;
      //   robot.hear(/(\w+)\s(\w+)/i, function(res) {
      //     res.reply('current state ***: '+fsm.current);
      //     var name, user;
      //     res.reply("Ok, lets start");
      //     fsm.goStandby();
      //   });
      // }
    },
    onenterstandby: (event, from, to) => {
      //console.log('current state !!!!!!: '+fsm.current)
      // module.exports = robot => {
      //   robot.hear(/(.*)/i, res => {
      //
      //
      //
      //     res.reply('current state !!!!!!: '+fsm.current);
      //     // return fsm.goKeywordsearch();
      //   })
      // }
    },
    onkeywordsearch: (event, from, to) => {
      // module.exports = robot => {
      //   robot.hear(/(.*)/i, res => {
      //     res.send(fsm.current)
      //     let input = res.match[1] // get the text inputted from user
      //     let nounArr = []
      //     nounArr.push(getNouns(input))
      //     nounArr.push(fsm.current)
      //     // convert array of words into string for output
      //     // this should be wikipedia links
      //     let output = nounArr.join()
      //     res.send(output)
      //   })
      // }
    }

  }
});

module.exports = fsm;

// robot.respond(/is it (weekend|holiday)\s?\?/i, function(msg){
//     var today = new Date();
//     msg.reply(today.getDay() === 0 || today.getDay() === 6 ? "YES" : "NO");
// })
