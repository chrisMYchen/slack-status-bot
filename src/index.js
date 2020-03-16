require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import { ENGINE_METHOD_ALL } from 'constants';
import { WebClient } from '@slack/web-api';
import { getMembersIds, getMembersInfo } from "./memberUtils";

const PORT = process.env.PORT || 3000;
const token = process.env.SLACK_TOKEN;
const secret = process.env.SLACK_SIGNING_SECRET;
import request from 'request';


const { App } = require('@slack/bolt');

// Initializes the app with your bot token and signing secret
const app = new App({
  token: token,
  signingSecret: secret
});

<<<<<<< HEAD
=======
// TODO: create authorizeFn that returns botToken, botId, botUserId
// const authorizeFn = async ({ teamId, enterpriseId }) => {
//   // Fetch team info from database
//   for (const team of installations) {
//     // Check for matching teamId and enterpriseId in the installations array
//     if ((team.teamId === teamId) && (team.enterpriseId === enterpriseId)) {
//       // This is a match. Use these installation credentials.
//       return {
//         // You could also set userToken instead
//         botToken: team.botToken,
//         botId: team.botId,
//         botUserId: team.botUserId
//       };
//     }
//   }

//   throw new Error('No matching authorizations');
// }

>>>>>>> 483ec676fd5b5bb58adfab01ffd550bc3ca8b8a9
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

<<<<<<< HEAD
=======
// TODO: persist data that authorizeFn will use :) 
>>>>>>> 483ec676fd5b5bb58adfab01ffd550bc3ca8b8a9
router.get("/auth", async (req, res) => {
  if (!req.query.code) { // access denied
    return;
  }
  var data = {
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code
    }
  };
  request.post('https://slack.com/api/oauth.v2.access', data, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // OAuth done- redirect the user to wherever
      res.status(200).send("Success!");
    }
  })
});

<<<<<<< HEAD
// '&redirect_uri=' + process.env.REDIRECT_URI,
/*
 var options = {
        uri: 'https://slack.com/api/oauth.access?code='
            +req.query.code+
            '&client_id='+process.env.CLIENT_ID+
            '&client_secret='+process.env.CLIENT_SECRET+
            '&redirect_uri='+process.env.REDIRECT_URI,
        method: 'GET'
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log(JSONresponse)
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
        }else{
            console.log(JSONresponse)
            res.send("Success!")
        }
    })
    */
=======
>>>>>>> 483ec676fd5b5bb58adfab01ffd550bc3ca8b8a9
export const SLACK_BOT_ID = 'USLACKBOT';

app.event('user_change', async ({ event, context }) => {
  try {
    // Get all members
    const { members } = await app.client.users.list({
      token: token
    });
    const filteredMembersIds = getMembersIds(members);
    const membersPresence = filteredMembersIds.map(async function (user) {
      const { presence } = await app.client.users.getPresence({
        token: token,
        user: user
      });
      return presence
    })
    const statusBlocks = await Promise.all(membersPresence).then(async function (values) {
      const membersInfo = await getMembersInfo(members, values);
      return membersInfo;
    })

    /* view.publish is the method that your app uses to push a view to the Home tab */

    await Promise.all(filteredMembersIds.map(id => {
      return (
        app.client.views.publish({

          /* retrieves your xoxb token from context */
          token: context.botToken,

          /* the user that opened your app's app home */
          user_id: id,

          /* the view payload that appears in the app home*/
          view: {
            type: 'home',
            callback_id: 'home_view',

            /* body of the view */
            blocks: [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": `Hi there! Below you'll find the status of all the members in our workspace.`
                }
              },
              {
                "type": "divider"
              },
              ...statusBlocks
            ]
          }
        })
      )
    }))
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  const expressApp = app.receiver.app;
  await app.start(PORT || 3000);
  expressApp.use(router);

})();
console.log('⚡️ Bolt app is running!');