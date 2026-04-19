import API from "@/config/api";
export const getEvents = async ({ request, page = 1, size = 10 }) => {
    const response = await API.post(`/api/v1/event/filter?page=${page}&size=${size}`, request, {
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


export const countEvent = async ({ statuses }) => {
    const response = await API.post(`/api/v1/event/count`, { statuses }, {
        requiresAuth: true
    });
    return response.data;
};

export const exportEvent = async ({ request }) => {
    const response = await API.post(`/api/v1/event/reports/export`, request, {
        responseType: "blob",
        requiresAuth: true
    });
    return response.data;
};