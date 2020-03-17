import { SLACK_BOT_ID, STATUS_MONITOR_ID } from "./index";

export const getMembersIds = (members) => {
    // Filter out Slackbot, other bots, and deleted/deactivated members
    const filteredMembers = members.filter(member => (!member.is_bot && member.id !== SLACK_BOT_ID && !member.deleted));

    const membersIds = filteredMembers.map(member => member.id);
    return membersIds
}

const createSection = (members, areOnline) => {
    let current_section = -1;
    const num_sections = Math.floor(members.length / 10) + 1;
    const return_section = {
        "type": "section",
        "fields": []
    }

    const return_sections = new Array();
    for (let i = 0; i < num_sections; i++) {
        return_sections.push({
            "type": "section",
            "fields": []
        })
    }

    let indicator = ':empty-dot:';
    if (areOnline)
        indicator = ':green-dot:'
    // Create a list of sections (one for each user)
    members.map((member, index) => {
        if (index % 9 == 0) {
            current_section++;
            // console.log(`total members: ${members.length} \n`) 
            // console.log(`total sections: ${num_sections} \n`) 
            // console.log(`incrementing to current section: ${current_section} \n`) 
        }
        // console.log('current_section: ', current_section)

        const id = member.id;
        const status_text = member.profile.status_text;
        const status_emoji = member.profile.status_emoji;
        const status_expiration = member.profile.status_expiration;

        // Construct return string
        let return_string = indicator + ` <@${id}>  `;

        // Check if a user has a status
        if (status_emoji && status_emoji != ':speech_balloon:')
            return_string = return_string + `${status_emoji} `

        if (status_text) {
            return_string = return_string + `*${status_text}*`
        }

        // Check if a user intentionally set a status expiration (not the default)
        if (status_expiration) {
            const exp_time = new Date(status_expiration * 1000);
            const hours = exp_time.getHours();
            const minutes = exp_time.getMinutes();
            if (hours != '23' && minutes != '59') {
                return_string = return_string + ` <!date^${status_expiration}^Until {time}|until 11:59 PM>`
            }
        }
        return_string = return_string + `\n`

        // Format the return section object
        const field =
        {
            "type": "mrkdwn",
            "text": `${return_string}`
        }
        if (return_sections[current_section])
            return_sections[current_section].fields.push(field);
    })
    return return_sections;
}


export const getMembersInfo = async (members, membersPresence) => {
    // Filter out Slackbot and this app's bot
    const filteredMembers = members.filter((member, index) => (!member.is_bot && member.id !== SLACK_BOT_ID && !member.deleted));
    const onlineMembersNoStatus = filteredMembers.filter((member, index) => (membersPresence[index] == 'active' && !member.profile.status_text));
    const onlineMembersWithStatus = filteredMembers.filter((member, index) => (membersPresence[index] == 'active' && member.profile.status_text));
    const offlineMembersNoStatus = filteredMembers.filter((member, index) => (membersPresence[index] !== 'active' && !member.profile.status_text));
    const offlineMembersWithStatus = filteredMembers.filter((member, index) => (membersPresence[index] !== 'active' && member.profile.status_text));

    let allSections = [];
    allSections.push(
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Online:*"
			}
        }
        )
    if (onlineMembersWithStatus.length)
        allSections.push(...createSection(onlineMembersWithStatus, true))
    if (onlineMembersNoStatus.length)
        allSections.push(...createSection(onlineMembersNoStatus, true))
    if (offlineMembersNoStatus.length || offlineMembersNoStatus.length) {
        allSections.push(
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Offline:*"
                }
            }
            )
    }
    if (offlineMembersWithStatus.length)
        allSections.push(...createSection(offlineMembersWithStatus, false))
    if (offlineMembersNoStatus.length)
        allSections.push(...createSection(offlineMembersNoStatus, false))




    // const onlineSection = [...createSection(onlineMembersWithStatus, true), ...createSection(onlineMembersNoStatus, true)];
    // const offlineSection = [...createSection(offlineMembersWithStatus, false), ...createSection(offlineMembersNoStatus, false)];
    // const allSections = [...onlineSection, ...offlineSection];

    return allSections;
}
