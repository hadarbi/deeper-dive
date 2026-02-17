import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./database/sqlite.js";
import { publisherRepository } from "./repositories/publisherRepository.js";
import { auditLogRepository } from "./repositories/auditLogRepository.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PAGE_SIZE = 9;
const app = express();
const PORT = Number(process.env.PORT ?? 3000);
// Initialize SQLite database
initDatabase();
// Enable CORS for local development (non-production)
if (process.env.NODE_ENV !== "production") {
    app.use(cors());
}
// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../../public")));
// Parse JSON bodies
app.use(express.json());
// API endpoint to get publishers list (supports optional `search`, `isActive`, `page`, and `limit` query params)
app.get("/api/publishers", async (req, res) => {
    try {
        const search = req.query?.search;
        const isActive = req.query?.isActive !== undefined ? req.query.isActive === 'true' : undefined;
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit, 10) : DEFAULT_PAGE_SIZE;
        // Validate pagination params
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
        const result = await publisherRepository.findAll(search, isActive, validPage, validLimit);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching publishers:', error);
        res.status(500).json({ error: "Failed to read publishers data" });
    }
});
// API endpoint to get a specific publisher config
app.get("/api/publishers/:publisherId", async (req, res) => {
    try {
        const { publisherId } = req.params;
        const publisher = await publisherRepository.findByPublisherId(publisherId);
        if (!publisher) {
            res.status(404).json({ error: "Publisher config not found" });
            return;
        }
        res.json(publisher);
    }
    catch (error) {
        console.error('Error fetching publisher:', error);
        res.status(404).json({ error: "Publisher config not found" });
    }
});
// API endpoint to save a publisher config
app.put("/api/publishers/:publisherId", async (req, res) => {
    try {
        const { publisherId } = req.params;
        const bodyContent = req.body;
        // Ensure the publisherId in the URL matches the body
        if (bodyContent.publisherId !== publisherId) {
            res.status(400).json({ error: "Publisher ID mismatch" });
            return;
        }
        // Check if publisher exists
        const existingPublisher = await publisherRepository.findByPublisherId(publisherId);
        if (existingPublisher) {
            // Update existing publisher
            await publisherRepository.update(publisherId, bodyContent);
        }
        else {
            // Create new publisher
            await publisherRepository.create(bodyContent);
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error saving publisher:', error);
        res.status(500).json({ error: "Failed to save publisher config" });
    }
});
// API endpoint to delete a publisher config
app.delete("/api/publishers/:publisherId", async (req, res) => {
    try {
        const { publisherId } = req.params;
        const deleted = await publisherRepository.delete(publisherId);
        if (!deleted) {
            res.status(404).json({ error: "Publisher not found" });
            return;
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting publisher:', error);
        res.status(500).json({ error: "Failed to delete publisher config" });
    }
});
// API endpoint to get audit logs for a publisher
app.get("/api/publishers/:publisherId/audit-logs", async (req, res) => {
    try {
        const { publisherId } = req.params;
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit, 10) : 20;
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100);
        const result = await auditLogRepository.findByPublisherId(publisherId, validPage, validLimit);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
