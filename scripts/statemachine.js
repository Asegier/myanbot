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
    },
    onenterstandby: (event, from, to) => {
    },
    onkeywordsearch: (event, from, to) => {
    }
  }
});

module.exports = fsm;

// robot.respond(/is it (weekend|holiday)\s?\?/i, function(msg){
//     var today = new Date();
//     msg.reply(today.getDay() === 0 || today.getDay() === 6 ? "YES" : "NO");
// })
