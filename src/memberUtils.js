import { SLACK_BOT_ID, STATUS_MONITOR_ID } from "./index";
export const getMembersInfo = (members) => {
    const filteredMembers = members.filter(member => (member.id !== SLACK_BOT_ID && member.id !== STATUS_MONITOR_ID));
    const membersInfo = filteredMembers.map(member => {
        const id = member.id;
        const status_text = member.profile.status_text;
        const status_emoji = member.profile.status_emoji;
        const status_expiration = member.profile.status_expiration;

        return (
            `<@${id}>'s status: ${status_emoji} ${status_text}\n`
        )
    })
    return membersInfo.join("");
};
