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
  res.status(200).send("Slack status bot");
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
    const channelInfo = await web.channels.info({
      token,
      channel: channelId
    });

    const { members: memberIdsInChannel } = channelInfo.channel;
    res.json(response);
  }
  catch (err) {
    console.log(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
})