import { SLACK_BOT_ID, STATUS_MONITOR_ID } from "./index";
export const getMembersInfo = (members) => {
    const filteredMembers = members.filter(member => (member.id !== SLACK_BOT_ID && member.id !== STATUS_MONITOR_ID));
    const membersInfo = filteredMembers.map(member => {
        const id = member.id;
        const status_text = member.profile.status_text;
        const status_emoji = member.profile.status_emoji;
        const status_expiration = member.profile.status_expiration;

        let return_string = `<@${id}>`;
        if (status_emoji || status_text)
            return_string = return_string + `: ${status_emoji} ${status_text}`
        if (status_expiration)
            return_string = return_string + ` <!date^${status_expiration}^until {time}|until 11:59 PM>`
        return_string = return_string + `\n`

        
        const return_section =
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${return_string}`
                }
            }

        return return_section
    })
    return membersInfo;
};
