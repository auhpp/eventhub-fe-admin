import API from "@/config/api";

export const getEvents = async ({ page = 1, size = 10 }) => {
    const response = await API.get(`/api/v1/event?page=${page}&size=${size}`, {
        requiresAuth: true
    });
    return response.data;
};

export const getEventById = async ({ id }) => {
    const response = await API.get(`/api/v1/event/${id}`, {
        requiresAuth: true
    });
    return response.data;
};

export const rejectEvent = async ({ id, reason }) => {
    const response = await API.post('/api/v1/event/reject/' + id, { reason }, {
        requiresAuth: true
    });
    return response.data;
};

export const approveEvent = async ({ id, commissionRate, commissionFixedPerTicket }) => {
    const response = await API.post('/api/v1/event/approve/' + id, {
        commissionRate, commissionFixedPerTicket
    }, {
        requiresAuth: true
    });
    return response.data;
};
