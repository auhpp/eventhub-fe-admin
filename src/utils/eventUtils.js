
export const isExpiredEventSession = ({ endDateTime }) => {
    return (new Date(endDateTime) < (new Date()))
}