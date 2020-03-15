import { SLACK_BOT_ID, STATUS_MONITOR_ID } from "./index";
export const getMembersInfo = (members) => {
    const filteredMembers = members.filter(member => (member.id !== SLACK_BOT_ID && member.id !== STATUS_MONITOR_ID));

    // Create a list of sections (one for each user)
    const membersInfo = filteredMembers.map(member => {
        const id = member.id;
        const status_text = member.profile.status_text;
        const status_emoji = member.profile.status_emoji;
        const status_expiration = member.profile.status_expiration;

        // Construct return string
        let return_string = `<@${id}>\n>`;
        
        // Check if a user has a status
        if (status_emoji || status_text)
            return_string = return_string + `${status_emoji} *${status_text}*`
        
        // Check if a user intentionally set a status expiration (not the default)
        if (status_expiration) {
            const exp_time = new Date(status_expiration * 1000);
            const hours = exp_time.getHours();
            const minutes = exp_time.getMinutes();
            if (hours != '23' && minutes != '59') {
                return_string = return_string + `\n><!date^${status_expiration}^Until {time}|until 11:59 PM>`
            }
        }
        return_string = return_string + `\n`

        // Format the return section object
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
    // Return the list of section objects
    return membersInfo;
};
