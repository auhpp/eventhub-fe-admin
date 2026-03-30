import API from "@/config/api";


export const approveResalePost = async ({ id }) => {
    const response = await API.post(`/api/v1/resale-post/${id}/approve`, {
        requiresAuth: true
    });
    return response.data;
}

export const cancelResalePostByAdmin = async ({ id, reason }) => {
    const response = await API.post(`/api/v1/resale-post/${id}/cancel-by-admin`, {
        reason
    }, {
        requiresAuth: true
    });
    return response.data;
}

export const rejectResalePost = async ({ id, reason }) => {
    const response = await API.post(`/api/v1/resale-post/${id}/reject`, {
        reason
    }, {
        requiresAuth: true
    });
    return response.data;
}

export const filterResalePosts = async ({ sortType, quantity, eventSessionId, ticketId, hasRetail,
    userId, email, name, statuses, page = 1, size = 10 }) => {
    const reqStatuses = statuses?.includes("ALL") ? null : statuses;

    const response = await API.post(`/api/v1/resale-post/filter?page=${page}&size=${size}`, {
        sortType,
        quantity,
        eventSessionId,
        ticketId,
        hasRetail,
        userId,
        email,
        name,
        statuses: reqStatuses
    }, {
        requiresAuth: true 
    });
    return response.data;
}

export const getResalePostById = async ({ id }) => {
    const response = await API.get(`/api/v1/resale-post/${id}`, {
        requiresAuth: true
    });
    return response.data;
}

export const countResalePost = async ({ status }) => {
    const response = await API.get(`/api/v1/resale-post/count?status=${status}`, {
        requiresAuth: false
    });
    return response.data;
};