import { AuditLog, CreateAuditLogInput } from '../../../shared/types/auditLog.js';
import { PaginatedResponse } from '../../../shared/types/publisher.js';
export declare const auditLogRepository: {
    /**
     * Create a single audit log entry
     */
    create(input: CreateAuditLogInput): AuditLog;
    /**
     * Create multiple audit log entries in a transaction
     */
    createBatch(inputs: CreateAuditLogInput[]): AuditLog[];
    /**
     * Find audit logs for a specific publisher with pagination
     */
    findByPublisherId(publisherId: string, page?: number, limit?: number): Promise<PaginatedResponse<AuditLog>>;
    /**
     * Find all audit logs with pagination (for admin purposes)
     */
    findAll(page?: number, limit?: number): Promise<PaginatedResponse<AuditLog>>;
};
//# sourceMappingURL=auditLogRepository.d.ts.map