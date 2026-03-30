
import API from "@/config/api";

export const getKpiOverview = async ({ startDate, endDate, timeUnit }) => {
    const response = await API.get('/api/v1/admin/reports/kpis', {
        params: { startDate, endDate, timeUnit },
        requiresAuth: true
    });
    return response.data;
};


export const getRevenueCharts = async ({ startDate, endDate, timeUnit, revenueSource }) => {
    const response = await API.get('/api/v1/admin/reports/revenue/chart', {
        params: { startDate, endDate, timeUnit, revenueSource },
        requiresAuth: true
    });
    return response.data;
};

export const getTopEventRevenue = async ({ startDate, endDate, timeUnit, limit }) => {
    const response = await API.get('/api/v1/admin/reports/revenue/top-events', {
        params: { startDate, endDate, timeUnit, limit },
        requiresAuth: true
    });
    return response.data;
};

export const getTopOrganizer = async ({ startDate, endDate, timeUnit, limit }) => {
    const response = await API.get('/api/v1/admin/reports/revenue/top-organizers', {
        params: { startDate, endDate, timeUnit, limit },
        requiresAuth: true
    });
    return response.data;
};


export const getCategoryDistribution = async ({ startDate, endDate, timeUnit, status }) => {
    const response = await API.get('/api/v1/admin/reports/events/category-distribution', {
        params: { startDate, endDate, timeUnit, status },
        requiresAuth: true
    });
    return response.data;
};

export const getEventApprovalStat = async ({ startDate, endDate, timeUnit }) => {
    const response = await API.get('/api/v1/admin/reports/events/approval-stats', {
        params: { startDate, endDate, timeUnit },
        requiresAuth: true
    });
    return response.data;
};


export const getResaleOverview = async ({ startDate, endDate, timeUnit, eventId }) => {
    const response = await API.get('/api/v1/admin/reports/resales/overview', {
        params: { startDate, endDate, timeUnit, eventId },
        requiresAuth: true
    });
    return response.data;
};

export const getTopResaleEvent = async ({ startDate, endDate, timeUnit, limit }) => {
    const response = await API.get('/api/v1/admin/reports/resales/top-events', {
        params: { startDate, endDate, timeUnit, limit },
        requiresAuth: true
    });
    return response.data;
};


export const getUserGrowthChart = async ({ startDate, endDate, timeUnit, roleName }) => {
    const response = await API.get('/api/v1/admin/reports/users/growth-chart', {
        params: { startDate, endDate, timeUnit, roleName },
        requiresAuth: true
    });
    return response.data;
};