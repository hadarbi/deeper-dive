export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
export interface AuditLog {
    id: number;
    publisherId: string;
    action: AuditAction;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    changedBy: string;
    changedAt: string;
}
export interface CreateAuditLogInput {
    publisherId: string;
    action: AuditAction;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    changedBy: string;
}
//# sourceMappingURL=auditLog.d.ts.map