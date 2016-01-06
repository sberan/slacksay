var token = process.argv[2];
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({ token })
var q = require('q');
var exec = require('executive');
var quote = require('shell-quote').quote;

if (!token) {
  console.log(`
    error: invalid TOKEN specified. Obtain a test API token from https://api.slack.com/web
    usage: npm start -- TOKEN
  `)
  return 1;
}

bot.startRTM(function(err) {
  if (err) {
    console.log(err)
    throw new Error("unable to connect to slack");
  }
})

var lastUserAnnounced,
    lastChannelAnnounced

var execQueue = q()

controller.hears(".*", ["direct_message","direct_mention","mention","ambient"], function(bot, message) {
  const fetchUserInfo = q.ninvoke(bot.api.users, 'info', {token, user: message.user})
  const fetchChannelInfo = q.ninvoke(bot.api.channels, 'info', {token, channel: message.channel})
                                  .catch(err=> null /* no channel, probably a DM*/)

  execQueue = execQueue.then(() => {
    return q.spread([fetchUserInfo, fetchChannelInfo], (userResponse, channelResponse) => {
      const channelGreeting =
        (lastChannelAnnounced === message.channel)
          ? ""
          : (channelResponse)
            ? `in ${channelResponse.channel.name}, `
            : "message from "

      const userGreeting =
        (lastUserAnnounced === message.user)
          ? ""
          : `${userResponse.user.profile.first_name} says: `

      const firstLineText = message.text.split(/^/)[0];

      const text = `${channelGreeting} ${userGreeting} ${firstLineText}`

      const commands = [
        quote(['say', '--output-file', 'out.aiff', '--voice', 'Daniel', text]),
        'afplay --volume .7 --rate 1.2 --time 6 out.aiff',
        'rm out.aiff'
      ]

      lastChannelAnnounced = message.channel;
      lastUserAnnounced = message.user;

      console.log(commands)
      return exec(commands)
    })
    .catch(err => {
      console.log("error: " + err)
    })
  })
})
