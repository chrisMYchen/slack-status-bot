require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import { ENGINE_METHOD_ALL } from 'constants';
import { WebClient } from '@slack/web-api';
import { getMembersIds, getMembersInfo } from "./memberUtils";

const PORT = process.env.PORT || 3000;
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);


export const SLACK_BOT_ID = 'USLACKBOT';
export const STATUS_MONITOR_ID = 'U0100M7B8FJ';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, function () {
  console.log('Example app listening on port: ' + PORT + '!');
});

app.get('/', async (req, res) => {
  res.status(200).send("Slack status bot status");
})

let statusMessageId = "";
let mainChannelId = "";
app.post('/statuschange', async (req, res) => {
  try {
    const slackReqObj = req.body;
    if ('challenge' in slackReqObj) {
      const challengeData = {
        challenge: slackReqObj.challenge
      }
      res.json(challengeData);
    }
    const { event: { user: { profile: updatedProfile } } } = slackReqObj;
    const { members } = await web.users.list({
      token
    });
    const { channels } = await web.conversations.list({
      token
    });
    const filteredMembersIds = getMembersIds(members);
    const membersPresence = filteredMembersIds.map(async function (user) {
      const { presence } = await web.users.getPresence({
        token, user
      });
      return presence
    })
    Promise.all(membersPresence).then(async function (values) {
      // todo: improve this to allow for better channel selection or something
      const mainChannel = channels.find(channel => channel.name === "statusmonitor");

      // send new message and save id
      if (statusMessageId === "") {
        // makes a new message if not found in last 200 messages, not a problem if have a single channel with this in it
        const mainChannelId = mainChannel.id;
        const { messages } = await web.conversations.history({ channel: mainChannelId, token, limit: 200 });
        const statusMonitorMessage = messages.find(message => message.user === STATUS_MONITOR_ID && !("subtype" in message));

        const membersInfo = await getMembersInfo(members, values);

        if (statusMonitorMessage) {
          // update existing message
          const { ts } = statusMonitorMessage;
          const resp = await web.chat.update({
            ts, channel: mainChannelId, token, as_user: true, parse: "full", blocks: [
              ...membersInfo
            ]
          });
        }
        else {
          await web.chat.postMessage({
            channel: mainChannelId, token, blocks: [
              ...membersInfo
            ]
          });
        }
      }
      res.status(200);
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
}); 
  
  app.post('/statusbot', async (req, res) => {
  try {
    
      const slackReqObj = req.body;
        console.log(slackReqObj);
    if ('challenge' in slackReqObj) {
      const challengeData = {
        challenge: slackReqObj.challenge
      }
      res.json(data);
    }
    const { channel_id: channelId } = slackReqObj;
    const { members } = await web.users.list({
    token
  });
  const filteredMembersIds = getMembersIds(members);
  const membersPresence = filteredMembersIds.map(async function (user) {
    const { presence } = await web.users.getPresence({
      token, user
    });
    return presence
  })
  Promise.all(membersPresence).then(async function (values) { 
    const membersInfo = await getMembersInfo(members, values);
    const response = {
      "blocks": [
        ...membersInfo
  ]
    }
    res.json(response);
  })
}
  catch (err) {
    console.log(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});