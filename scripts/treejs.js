modile.exports = robot => {
  robot.hear /hello/i, (res) => {
    res.send("hello there");
  }

}
