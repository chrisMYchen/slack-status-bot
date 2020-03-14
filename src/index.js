require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import { WebClient } from '@slack/web-api';

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

    const slackbot_id = 'USLACKBOT';
    const statusmonitor_id = 'U0100M7B8FJ';

    const filteredMembers = members.filter(member => (member.id !== slackbot_id && member.id !== statusmonitor_id));


    const membersInfo = filteredMembers.map(member => {
      const id = member.id;
      const status_text = member.profile.status_text;
      const status_emoji = member.profile.status_emoji;
      const status_expiration = member.profile.status_expiration;
      
      return(
        `<@${id}>'s status: ${status_emoji} ${status_text}\n`
      )
    })


    for (const member of members){
      const id = member.id
      const status_text = member.profile.status_text;
  }



    const response={
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
})