import API from "@/config/api";

export const getOrganizerRegistrations = async ({ status, email, userId, organizerName, page, size }) => {
    const response = await API.post(`/api/v1/organizer-registration/filter?page=${page}&size=${size}`, {
        status, email, userId, organizerName
    }, {
        requiresAuth: true
    });
    return response.data;
};

export const getOrganizerRegistrationById = async ({ id }) => {
    const response = await API.get('/api/v1/organizer-registration/' + id, {
        requiresAuth: true
    });
    return response.data;
};


export const rejectOrganizerRegistration = async ({ id, reason }) => {
    const response = await API.post('/api/v1/organizer-registration/reject/' + id, { reason }, {
        requiresAuth: true
    });
    return response.data;
};

export const approveOrganizerRegistrationRequest = async ({ id }) => {
    const response = await API.post('/api/v1/organizer-registration/approve/' + id, {
        requiresAuth: true
    });
    return response.data;
};

export const countOrganizerRegistration = async ({ status }) => {
    const response = await API.get(`/api/v1/organizer-registration/count?status=${status}`, {
        requiresAuth: false
    });
    return response.data;
};