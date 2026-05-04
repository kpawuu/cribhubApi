"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.SmsService = void 0;
class SmsService {
    constructor(options) {
        this.options = options;
    }
    async find(_params) {
        return [];
    }
    async get(id, _params) {
        return { id };
    }
    async create(data, _params) {
        const key = process.env.MNOTIFY_API_KEY;
        if (!key) {
            return { status: 'skipped', reason: 'MNOTIFY_API_KEY not set' };
        }
        const sender = data.sender || process.env.MNOTIFY_SENDER_ID || 'RentFlow';
        const res = await fetch(`https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(key)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient: data.recipient,
                sender,
                message: data.message,
                is_schedule: data.is_schedule ?? false,
                schedule_date: data.schedule_date ?? '',
                ...(data.sms_type ? { sms_type: data.sms_type } : {})
            })
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { status: 'error', httpStatus: res.status, body: json };
        }
        return json;
    }
    async update(_id, data, params) {
        return this.create(data, params);
    }
    async patch(id, data, _params) {
        return { id, ...data };
    }
    async remove(id, _params) {
        return { id, removed: true };
    }
}
exports.SmsService = SmsService;
const getOptions = (app) => ({ app });
exports.getOptions = getOptions;
//# sourceMappingURL=sms.class.js.map