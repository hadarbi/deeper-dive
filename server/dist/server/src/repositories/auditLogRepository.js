import { getDb } from '../database/sqlite.js';
const rowToAuditLog = (row) => ({
    id: row.id,
    publisherId: row.publisher_id,
    action: row.action,
    fieldName: row.field_name,
    oldValue: row.old_value,
    newValue: row.new_value,
    changedBy: row.changed_by,
    changedAt: row.changed_at,
});
export const auditLogRepository = {
    /**
     * Create a single audit log entry
     */
    create(input) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO audit_logs (publisher_id, action, field_name, old_value, new_value, changed_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(input.publisherId, input.action, input.fieldName ?? null, input.oldValue ?? null, input.newValue ?? null, input.changedBy);
        const inserted = db.prepare('SELECT * FROM audit_logs WHERE id = ?').get(result.lastInsertRowid);
        return rowToAuditLog(inserted);
    },
    /**
     * Create multiple audit log entries in a transaction
     */
    createBatch(inputs) {
        const db = getDb();
        const results = [];
        const insertBatch = db.transaction(() => {
            const stmt = db.prepare(`
                INSERT INTO audit_logs (publisher_id, action, field_name, old_value, new_value, changed_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            for (const input of inputs) {
                const result = stmt.run(input.publisherId, input.action, input.fieldName ?? null, input.oldValue ?? null, input.newValue ?? null, input.changedBy);
                const inserted = db.prepare('SELECT * FROM audit_logs WHERE id = ?').get(result.lastInsertRowid);
                results.push(rowToAuditLog(inserted));
            }
        });
        insertBatch();
        return results;
    },
    /**
     * Find audit logs for a specific publisher with pagination
     */
    async findByPublisherId(publisherId, page = 1, limit = 20) {
        const db = getDb();
        // Get total count
        const countResult = db.prepare('SELECT COUNT(*) as count FROM audit_logs WHERE publisher_id = ?').get(publisherId);
        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        // Get paginated data (newest first)
        const rows = db.prepare(`
            SELECT * FROM audit_logs 
            WHERE publisher_id = ? 
            ORDER BY changed_at DESC, id DESC
            LIMIT ? OFFSET ?
        `).all(publisherId, limit, offset);
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
    /**
     * Find all audit logs with pagination (for admin purposes)
     */
    async findAll(page = 1, limit = 20) {
        const db = getDb();
        // Get total count
        const countResult = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        // Get paginated data (newest first)
        const rows = db.prepare(`
            SELECT * FROM audit_logs 
            ORDER BY changed_at DESC, id DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset);
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
