export declare const uploadToCloudinary: (filePath: string, options?: {
    folder?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    tags?: string[];
    public_id?: string;
    transformation?: any[];
}) => Promise<{
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    resource_type: "raw" | "auto" | "image" | "video";
    created_at: string;
    bytes: number;
    etag: any;
}>;
export declare const createUploadOptions: (metadata: {
    entityName?: string;
    entityId?: string;
    tags?: string[];
}) => {
    folder: string;
    tags: string[];
};
