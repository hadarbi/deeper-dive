import { getDb } from "../database/sqlite.js";
import { AuditLog, CreateAuditLogInput } from "../types/auditLog.js";
import { PaginatedResponse } from "../types/publisher.js";

interface AuditLogRow {
    id: number;
    publisher_id: string;
    action: string;
    field_name: string | null;
    old_value: string | null;
    new_value: string | null;
    changed_by: string;
    changed_at: string;
}

interface CountResult {
    count: number;
}

const rowToAuditLog = (row: AuditLogRow): AuditLog => ({
    id: row.id,
    publisherId: row.publisher_id,
    action: row.action as AuditLog["action"],
    fieldName: row.field_name,
    oldValue: row.old_value,
    newValue: row.new_value,
    changedBy: row.changed_by,
    changedAt: row.changed_at,
});

export const auditLogRepository = {
    create(input: CreateAuditLogInput): AuditLog {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO audit_logs (publisher_id, action, field_name, old_value, new_value, changed_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            input.publisherId,
            input.action,
            input.fieldName ?? null,
            input.oldValue ?? null,
            input.newValue ?? null,
            input.changedBy
        );

        const inserted = db.prepare("SELECT * FROM audit_logs WHERE id = ?").get(result.lastInsertRowid) as AuditLogRow;
        return rowToAuditLog(inserted);
    },

    createBatch(inputs: CreateAuditLogInput[]): AuditLog[] {
        const db = getDb();
        const results: AuditLog[] = [];

        const insertBatch = db.transaction(() => {
            const stmt = db.prepare(`
                INSERT INTO audit_logs (publisher_id, action, field_name, old_value, new_value, changed_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            for (const input of inputs) {
                const result = stmt.run(
                    input.publisherId,
                    input.action,
                    input.fieldName ?? null,
                    input.oldValue ?? null,
                    input.newValue ?? null,
                    input.changedBy
                );

                const inserted = db.prepare("SELECT * FROM audit_logs WHERE id = ?").get(result.lastInsertRowid) as AuditLogRow;
                results.push(rowToAuditLog(inserted));
            }
        });

        insertBatch();
        return results;
    },

    async findByPublisherId(
        publisherId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResponse<AuditLog>> {
        const db = getDb();

        // Get total count
        const countResult = db.prepare(
            "SELECT COUNT(*) as count FROM audit_logs WHERE publisher_id = ?"
        ).get(publisherId) as CountResult;

        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;

        // Get paginated data (newest first)
        const rows = db.prepare(`
            SELECT * FROM audit_logs 
            WHERE publisher_id = ? 
            ORDER BY changed_at DESC, id DESC
            LIMIT ? OFFSET ?
        `).all(publisherId, limit, offset) as AuditLogRow[];

        return {
            data: rows.map(rowToAuditLog),
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems,
                totalPages,
            },
        };
    },

    async findAll(page: number = 1, limit: number = 20): Promise<PaginatedResponse<AuditLog>> {
        const db = getDb();

        // Get total count
        const countResult = db.prepare("SELECT COUNT(*) as count FROM audit_logs").get() as CountResult;

        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;

        // Get paginated data (newest first)
        const rows = db.prepare(`
            SELECT * FROM audit_logs 
            ORDER BY changed_at DESC, id DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset) as AuditLogRow[];

        return {
            data: rows.map(rowToAuditLog),
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems,
                totalPages,
            },
        };
    },
};
