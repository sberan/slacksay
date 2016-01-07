##A slack bot to audibly speak each message that is typed

This is terrible, don't use it

##Installation
  `npm install -g slacksay`

##Usage
  `slacksay TOKEN`
  TOKEN can be obtained from https://api.slack.com/web

  `slacksay TOKEN -t 4`
  Sets the max time a single message will speak. Default: 6 seconds


##TODO
 * [ ] make electron app
 * [ ] make cross-platform (currently mac only)
 * [ ] don't announce messages which are already read (while actively
       chatting you don't want to hear messages too)
 * [ ] make token configurable via GUI or use some other authentication mechanism
 * [ ] use different voices for different users
