require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import { WebClient } from '@slack/web-api';
import { getMemberInfo } from "./memberUtils";

const PORT = process.env.PORT || 3000;
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);


const botName = 'vantalunch';
const botId = 'UK9BK01V1';

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
    // console.log(slackReqObj);
    if ('challenge' in slackReqObj) {
      const challengeData = {
        challenge: slackReqObj.challenge
      }
      res.json(challengeData);
    }
    console.log(slackReqObj);
    const { event: { user: { profile: updatedProfile } } } = slackReqObj;
    console.log(updatedProfile);
    const { members } = await web.users.list({
      token
    });
    const { channels } = await web.conversations.list({
      token
    });
    // todo: improve this to allow for better channel selection or something
    const mainChannel = channels[0];

    const memberInfo = getMemberInfo(members);
    console.log(memberInfo);
    // send new message and save id
    if (statusMessageId === "") {

    }
    const response = {};
    res.json(response);
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

    const { members: memberIdsInChannel } = channelInfo.channel;
    const response = {};
    res.json(response);
  }
  catch (err) {
    console.log(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});