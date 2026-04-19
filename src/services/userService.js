import API from "@/config/api";

export const sendEmailCreateAdminUser = async ({ email, expireDateTime, resend }) => {
    const response = await API.post(`/api/v1/user/send/create-admin`, { email, expireDateTime, resend }, {
        requiresAuth: true
    });
    return response.data;
};

export const confirmAdminUserAccount = async ({ email, password, fullName, phoneNumber, token }) => {
    const response = await API.post(`/api/v1/user/confirm/create-admin`, { email, password, fullName, phoneNumber }, {
        requiresAuth: false,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getUsers = async ({ email, status, roleName, page, size }) => {
    const response = await API.post(`/api/v1/user/filter?page=${page}&size=${size}`, { email, status, roleName }, {
        requiresAuth: true
    });
    return response.data;
};

export const getUserById = async ({ id }) => {
    const response = await API.get(`/api/v1/user/${id}`, {
        requiresAuth: true
    });
    return response.data;
};

export const changeRole = async ({ id, roleName }) => {
    const response = await API.post(`/api/v1/user/change-role/${id}`, { roleName }, {
        requiresAuth: true
    });
    return response.data;
};


export const changeStatus = async ({ id, status }) => {
    const response = await API.post(`/api/v1/user/change-status/${id}`, { status }, {
        requiresAuth: true
    });
    return response.data;
};


export const updateInfoUser = async ({ id, formData }) => {
    const response = await API.put(`/api/v1/user/${id}`, formData, {
        requiresAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

export const changePassword = async ({ id, oldPassword, newPassword }) => {
    const response = await API.put(`/api/v1/user/change-password/${id}`, { oldPassword, newPassword }, {
        requiresAuth: true,
    });
    return response.data;
};

export const getUserByEmail = async ({ email }) => {
    const response = await API.get(`/api/v1/user?email=${email}`, {
        requiresAuth: true,
    });
    return response.data;
};


export const exportUser = async ({ email, status, roleName }) => {
    const response = await API.post(`/api/v1/user/reports/export`, { email, status, roleName }, {
        responseType: "blob",
        requiresAuth: true
    });
    return response.data;
};