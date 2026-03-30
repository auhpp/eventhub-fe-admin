export const RegistrationStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
};

export const EventType = {
    ONLINE: {
        key: "ONLINE",
        name: "Online"
    },
    OFFLINE: {
        key: "OFFLINE",
        name: "Offline"
    }
}

export const MeetingPlatform = {
    ZOOM: 'ZOOM',
    GOOGLE_MEET: 'GOOGLE_MEET',
};

export const EventStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
};

export const SystemConfigurationKey = {
    COMMISSION_RATE: 'COMMISSION_RATE',
    COMMISSION_FIXED_PER_TICKET: 'COMMISSION_FIXED_PER_TICKET'
}

export const RoleName = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    ORGANIZER: 'ORGANIZER'
}

export const AttendeeStatus = {
    INACTIVE: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700", key: 'INACTIVE' },
    VALID: { label: "Chưa check-in", color: "bg-gray-100 text-gray-700", key: 'VALID' },
    CHECKED_IN: { label: "Đã check-in", color: "bg-blue-100 text-blue-700", key: 'CHECKED_IN' },
    CANCELLED_BY_EVENT: { label: "Đã hủy bởi sự kiện", color: "bg-red-100 text-red-700", key: 'CANCELLED_BY_EVENT' },
    CANCELLED_BY_USER: { label: "Đã hủy bởi bạn", color: "bg-red-100 text-red-700", key: 'CANCELLED_BY_USER' },
    COMING: { label: "Sắp đến", key: 'COMING' },
    PAST: { label: "Đã qua", key: 'PAST' },
    ON_RESALE: { label: "Đang bán", color: "bg-orange-100 text-orange-700", key: 'ON_RESALE' },
    RESOLD: { label: "Đã check-in", color: "bg-green-100 text-green-700", key: 'RESOLD' },

};


export const SortType = {
    NEWEST: 'NEWEST',
    OLDEST: 'OLDEST',
}


export const SortOrder = {
    ASCENDING: 'ASCENDING',
    DESCENDING: 'DESCENDING',
}

export const SortBy = {
    EVENT: 'EVENT',
    FOLLOWER: 'FOLLOWER',
}

export const ResalePostStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    SOLD: 'SOLD',
    REJECTED: 'REJECTED',
    CANCELLED_BY_ADMIN: 'CANCELLED_BY_ADMIN',
    CANCELLED_BY_USER: 'CANCELLED_BY_USER',
}