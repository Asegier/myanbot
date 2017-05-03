const axios = require ('axios')

let Bot = function(){
  let self = this
  self.brain = null
  self.script = null
  // state
  self.id = '1'
  self.msg = `Error: State not loaded yet`
  self.listenfor = [ {
        "toState": "bye",
        "usrResponse": [
          "bye"
        ]
      },
      {
            "toState": "menu123",
            "usrResponse": [
              "hi", "hola"
            ]
          }]
  self.options = null

  self.loadBot = (botid, cb) => {
    if (botid){
      // V2 Feature: load any bot from the db
      axios({
        method:'get',
        url:'http://192.168.100.105:3003/api/script.get'
      })
      .then(function(response) {
        self.brain = response.data[0] // need to change this in V2
        self.script = JSON.parse(self.brain.script)
        // self.loadState('1')
        cb()
      });

    } else {
      // Current feature: load only the first bot from the db
      axios({
        method:'get',
        url:'http://192.168.100.105:3003/api/script.get'
      })
      .then(function(response) {
        self.brain = response.data[0]
        self.script = JSON.parse(self.brain.script)
        cb()
      });
    }
  }

  self.loadState = (stateid) => {
    console.log('...loadState id: ', stateid)
    self.script.forEach((e)=>{
      if(e.id == stateid){
        console.log('loadState: changing state')
        self.id = e.id
        self.msg = e.botMsg
        self.listenfor = e.listener
        if (e.options) {
          self.options = e.options
        } else {
          self.options = null
        }
      } else {
        console.log('LoadState ERR: no such state/id found')
      }
    })
  }

  self.readState = () => {
    console.log('!!!!!!!!!!!Read State!!!!!!!!!!!!!')
    console.log('bot.name:', self.name)
    console.log('bot.msg:', self.msg)
    console.log('bot.listenfor:', self.listenfor)
    console.log('bot.options:', self.options)
    console.log('!!!!!!!!!!! End !!!!!!!!!!!!!')
  }

  self.getListenForWhichResponses = () => {
    // returns an array of possible user responses
    let arr = []
    self.listenfor.forEach((e)=>{
      if (typeof e.usrResponse == "object"){
        // if the script responses are in Array format
        e.usrResponse.forEach((el)=>{
          arr.push(el)
        })
      } else if (typeof e.usrResponse == "string"){
        // if the script response is in string format
        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEE', e)
        arr.push(e.usrResponse)
      }
    })
    return arr
  }

  self.readUserInput = (input) => {
    let result = null
    // checks the user input against possible allowed responses
    // if found, return the toState/stateid, else null
    self.listenfor.forEach((e)=>{
      if (typeof e.usrResponse == "object"){
        e.usrResponse.forEach((el)=>{
          if (input == el){
            result = e.toState
          }
        })
      } else if (typeof e.usrResponse == "string"){
        if (input == e.usrResponse){
          result = e.toState
        }
      }
    })
    console.log('readUserInput- result: ', result)
    return result
  }
}

module.exports = Bot

/*
//  Sample data
[
  {
    "id": "1",
    "parentID": "mn21b3mnv41m2v3",
    "botMsg": "Hello, welcome to Rachel! I'm your search assistant!",
    "listener": [
      {
        "toState": "menu123",
        "usrResponse": "hi"
      }
    ]
  },
  {
    "id": "menu123",
    "parentID": "mn21b3mnv41m2v3",
    "botMsg": "what can I get for you today?",
    "listener": [
      {
        "toState": "wikisearch123",
        "usrResponse": [
          "searchwiki",
          "1"
        ]
      },
      {
        "toState": "filesearch123",
        "usrResponse": [
          "searchfiles",
          "2"
        ]
      },
      {
        "toState": "justchat123",
        "usrResponse": [
          "chat"
        ]
      }
    ]
  },
  {
    "id": "wikisearch123",
    "parentID": "xc9897xc9v7x",
    "botMsg": "what would you like to know about from wikipedia?",
    "listener": [
      {
        "toState": "feedback123",
        "usrResponse": [
          "/finish"
        ]
      }
    ],
    "options": "wiki"
  },
  {
    "id": "videosearch123",
    "parentID": "xc9897xc9v7x",
    "botMsg": "what are you looking for in our database?",
    "listener": [
      {
        "toState": "feedback123",
        "usrResponse": [
          "/finish"
        ]
      }
    ],
    "options": "solr"
  },
  {
    "id": "justchat123",
    "parentID": "xc9897xc9v7x",
    "botMsg": "what would you like to talk about?",
    "listener": [
      {
        "toState": "feedback123",
        "usrResponse": [
          ""
        ]
      }
    ]
  },
  {
    "id": "feedback123",
    "parentID": "xc9897xc9v7x",
    "botMsg": "Did you find that helpful?",
    "listener": [
      {
        "toState": "menu123",
        "usrResponse": [
          "yes"
        ]
      },
      {
        "toState": "menu123",
        "usrResponse": [
          "no"
        ]
      }
    ]
  }
]
 */
