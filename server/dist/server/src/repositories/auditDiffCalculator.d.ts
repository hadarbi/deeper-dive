import { Publisher } from '../../../shared/types/publisher.js';
import { CreateAuditLogInput } from '../../../shared/types/auditLog.js';
/**
 * Generates audit log entries by comparing original and updated publisher data
 */
export declare function generateAuditLogs(publisherId: string, existing: Publisher, data: Partial<Publisher>, changedBy: string): CreateAuditLogInput[];
//# sourceMappingURL=auditDiffCalculator.d.ts.map