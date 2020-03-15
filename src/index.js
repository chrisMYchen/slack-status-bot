require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import { WebClient } from '@slack/web-api';
import { getMembersInfo } from "./memberUtils";

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
    // todo: improve this to allow for better channel selection or something
    const mainChannel = channels.find(channel => channel.name === "statusmonitor");

    // send new message and save id
    if (statusMessageId === "") {
      // makes a new message if not found in last 200 messages, not a problem if have a single channel with this in it
      const mainChannelId = mainChannel.id;
      const { messages } = await web.conversations.history({ channel: mainChannelId, token, limit: 200 });
      const statusMonitorMessage = messages.find(message => message.user === STATUS_MONITOR_ID && !("subtype" in message));
      const membersInfo = getMembersInfo(members);
      if (statusMonitorMessage) {
        // update existing message
        const { ts } = statusMonitorMessage;
        const resp = await web.chat.update({
          ts, channel: mainChannelId, token, as_user: true, parse: "full", blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `${membersInfo}`
              }
            }
          ]
        });
      }
      else {
        await web.chat.postMessage({
          channel: mainChannelId, token, blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `${membersInfo}`
              }
            }
          ]
        });
      }
    }
    res.status(200);
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

    const membersInfo = getMembersInfo(members);


    for (const member of members) {
      const id = member.id
      const status_text = member.profile.status_text;
    }



    const response = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${membersInfo}`
          }
        }
      ]
    }
    res.json(response);
  }
  catch (err) {
    console.log(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});