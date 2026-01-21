import API from "@/config/api";

export const getOrganizerRegistrations = async ({ page, size }) => {
    const response = await API.get(`/api/v1/organizer-registration?page=${page}&size=${size}`, {
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
