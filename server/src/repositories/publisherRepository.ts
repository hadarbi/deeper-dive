import { getDb } from "../database/sqlite.js";
import { Publisher, Page, PaginatedResponse } from "../types/publisher.js";
import { auditLogRepository } from "./auditLogRepository.js";
import { generateAuditLogs } from "./auditDiffCalculator.js";

// Hardcoded user for now - in future could come from auth context
const CURRENT_USER = "hadar";

interface PublisherRow {
    id: number;
    publisher_id: string;
    alias_name: string;
    file_name: string;
    is_active: number;
    publisher_dashboard: string;
    monitor_dashboard: string;
    qa_status_dashboard: string;
    custom_css: string | null;
    tags: string | null;
    allowed_domains: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface PageRow {
    id: number;
    publisher_id: string;
    page_type: "article" | "homepage" | "category" | "search" | "product";
    selector: string;
    position: "top" | "middle" | "bottom" | "sidebar";
}

interface CountResult {
    count: number;
}

const rowToPublisher = (row: PublisherRow, pages: Page[]): Publisher => {
    return {
        publisherId: row.publisher_id,
        aliasName: row.alias_name,
        filename: row.file_name,
        isActive: row.is_active === 1,
        pages: pages,
        publisherDashboard: row.publisher_dashboard,
        monitorDashboard: row.monitor_dashboard,
        qaStatusDashboard: row.qa_status_dashboard,
        customCss: row.custom_css || undefined,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        allowedDomains: row.allowed_domains ? JSON.parse(row.allowed_domains) : undefined,
        notes: row.notes || undefined,
    };
};

export const publisherRepository = {
    async findAll(
        search?: string,
        isActive?: boolean,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<Publisher>> {
        const db = getDb();
        let baseSql = "FROM publishers";
        const params: (string | number)[] = [];
        const conditions: string[] = [];

        if (search && search.trim() !== "") {
            conditions.push("alias_name LIKE ?");
            params.push(`%${search.trim()}%`);
        }

        if (isActive !== undefined) {
            conditions.push("is_active = ?");
            params.push(isActive ? 1 : 0);
        }

        if (conditions.length > 0) {
            baseSql += " WHERE " + conditions.join(" AND ");
        }

        // Get total count
        const countSql = `SELECT COUNT(*) as count ${baseSql}`;
        const countResult = db.prepare(countSql).get(...params) as CountResult;
        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);

        // Get paginated data
        const offset = (page - 1) * limit;
        const dataSql = `SELECT * ${baseSql} ORDER BY alias_name LIMIT ? OFFSET ?`;
        const publishers = db.prepare(dataSql).all(...params, limit, offset) as PublisherRow[];

        const data = publishers.map(pub => {
            const pages = this.findPagesByPublisherIdSync(pub.publisher_id);
            return rowToPublisher(pub, pages);
        });

        return {
            data,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems,
                totalPages,
            },
        };
    },

    async findByPublisherId(publisherId: string): Promise<Publisher | null> {
        const db = getDb();
        const sql = "SELECT * FROM publishers WHERE publisher_id = ?";
        const publisher = db.prepare(sql).get(publisherId) as PublisherRow | undefined;

        if (!publisher) {
            return null;
        }

        const pages = this.findPagesByPublisherIdSync(publisherId);
        return rowToPublisher(publisher, pages);
    },

    findPagesByPublisherIdSync(publisherId: string): Page[] {
        const db = getDb();
        const sql = "SELECT * FROM pages WHERE publisher_id = ?";
        const pages = db.prepare(sql).all(publisherId) as PageRow[];

        return pages.map(page => ({
            pageType: page.page_type,
            selector: page.selector,
            position: page.position,
        }));
    },

    async create(publisher: Publisher): Promise<Publisher> {
        const db = getDb();

        const insertPublisher = db.transaction(() => {
            // Insert publisher
            const stmt = db.prepare(`
        INSERT INTO publishers (
          publisher_id, file_name, alias_name, is_active, publisher_dashboard,
          monitor_dashboard, qa_status_dashboard, custom_css, tags,
          allowed_domains, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            stmt.run(
                publisher.publisherId,
                publisher.filename,
                publisher.aliasName,
                publisher.isActive ? 1 : 0,
                publisher.publisherDashboard || null,
                publisher.monitorDashboard || null,
                publisher.qaStatusDashboard || null,
                publisher.customCss || null,
                publisher.tags ? JSON.stringify(publisher.tags) : null,
                publisher.allowedDomains ? JSON.stringify(publisher.allowedDomains) : null,
                publisher.notes || null
            );

            // Insert pages
            if (publisher.pages && publisher.pages.length > 0) {
                const pageStmt = db.prepare(`
          INSERT INTO pages (publisher_id, page_type, selector, position)
          VALUES (?, ?, ?, ?)
        `);

                for (const page of publisher.pages) {
                    pageStmt.run(
                        publisher.publisherId,
                        page.pageType,
                        page.selector,
                        page.position
                    );
                }
            }
        });

        insertPublisher();

        // Log the creation in audit log
        auditLogRepository.create({
            publisherId: publisher.publisherId,
            action: "CREATE",
            fieldName: null,
            oldValue: null,
            newValue: JSON.stringify(publisher),
            changedBy: CURRENT_USER,
        });

        return publisher;
    },

    async update(publisherId: string, data: Partial<Publisher>): Promise<Publisher | null> {
        const db = getDb();

        // Check if exists
        const existing = await this.findByPublisherId(publisherId);
        if (!existing) {
            return null;
        }

        const updatePublisher = db.transaction(() => {
            // Update publisher
            const stmt = db.prepare(`
        UPDATE publishers SET
          alias_name = COALESCE(?, alias_name),
          file_name = COALESCE(?, file_name),
          is_active = COALESCE(?, is_active),
          publisher_dashboard = ?,
          monitor_dashboard = ?,
          qa_status_dashboard = ?,
          custom_css = ?,
          tags = ?,
          allowed_domains = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE publisher_id = ?
      `);

            stmt.run(
                data.aliasName !== undefined ? data.aliasName : null,
                data.filename !== undefined ? data.filename : null,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : null,
                data.publisherDashboard !== undefined ? data.publisherDashboard : existing.publisherDashboard,
                data.monitorDashboard !== undefined ? data.monitorDashboard : existing.monitorDashboard,
                data.qaStatusDashboard !== undefined ? data.qaStatusDashboard : existing.qaStatusDashboard,
                data.customCss !== undefined ? data.customCss : existing.customCss,
                data.tags !== undefined ? JSON.stringify(data.tags) : (existing.tags ? JSON.stringify(existing.tags) : null),
                data.allowedDomains !== undefined ? JSON.stringify(data.allowedDomains) : (existing.allowedDomains ? JSON.stringify(existing.allowedDomains) : null),
                data.notes !== undefined ? data.notes : existing.notes,
                publisherId
            );

            // Update pages if provided
            if (data.pages !== undefined) {
                // Delete existing pages
                db.prepare("DELETE FROM pages WHERE publisher_id = ?").run(publisherId);

                // Insert new pages
                if (data.pages.length > 0) {
                    const pageStmt = db.prepare(`
            INSERT INTO pages (publisher_id, page_type, selector, position)
            VALUES (?, ?, ?, ?)
          `);

                    for (const page of data.pages) {
                        pageStmt.run(
                            publisherId,
                            page.pageType,
                            page.selector,
                            page.position
                        );
                    }
                }
            }
        });

        updatePublisher();

        // Generate and batch insert audit logs
        const auditLogs = generateAuditLogs(publisherId, existing, data, CURRENT_USER);
        if (auditLogs.length > 0) {
            auditLogRepository.createBatch(auditLogs);
        }

        return this.findByPublisherId(publisherId);
    },

    async delete(publisherId: string): Promise<boolean> {
        const db = getDb();

        // Get existing data before deletion for audit log
        await this.findByPublisherId(publisherId);

        const stmt = db.prepare("DELETE FROM publishers WHERE publisher_id = ?");
        const result = stmt.run(publisherId);

        return result.changes > 0;
    },
};
