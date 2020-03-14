export const getMemberInfo = (members) =>
    members.map(member => ({
        userId: member.id,
        status_text: member.profile.status_text,
        status_emoji: member.profile.status_emoji,
    }));