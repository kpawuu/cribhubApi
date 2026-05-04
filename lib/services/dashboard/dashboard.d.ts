import type { Application } from '../../declarations';
export declare const dashboardPath = "dashboard";
export declare class DashboardService {
    app: Application;
    constructor(app: Application);
    find(_params: Record<string, any>): Promise<{
        role: "admin";
        properties: number;
        units: number;
        inquiries: number;
        rentalApplications: number;
        maintenanceRequests: number;
        payments: number;
        rentalContracts: number;
        users: number;
        assignedProperties?: undefined;
        openInquiries?: undefined;
    } | {
        role: "property_manager";
        assignedProperties: number;
        units: number;
        inquiries: number;
        rentalApplications: number;
        maintenanceRequests: number;
        payments: number;
        rentalContracts: number;
        properties?: undefined;
        users?: undefined;
        openInquiries?: undefined;
    } | {
        role: "landlord";
        properties: number;
        units: number;
        inquiries: number;
        rentalApplications: number;
        maintenanceRequests: number;
        payments: number;
        rentalContracts: number;
        users?: undefined;
        assignedProperties?: undefined;
        openInquiries?: undefined;
    } | {
        role: "agent";
        assignedProperties: number;
        units: number;
        inquiries: number;
        rentalApplications: number;
        maintenanceRequests: number;
        openInquiries: number;
        properties?: undefined;
        payments?: undefined;
        rentalContracts?: undefined;
        users?: undefined;
    } | {
        role: "tenant";
        rentalApplications: number;
        maintenanceRequests: number;
        payments: number;
        rentalContracts: number;
        inquiries: number;
        properties?: undefined;
        units?: undefined;
        users?: undefined;
        assignedProperties?: undefined;
        openInquiries?: undefined;
    }>;
}
export declare const dashboard: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [dashboardPath]: DashboardService;
    }
}
