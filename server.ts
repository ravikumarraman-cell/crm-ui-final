import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory contacts store for full-stack persistence
let serverContacts = [
  {
    id: "cnt-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@nithyananda.org",
    phoneNumber: "+1 (555) 234-5678",
    owner: "No owner",
    lifecycleStage: "Lead",
    leadStatus: "New",
    priority: "high",
    lastActivityDate: "2026-08-29 5:58 AM EDT",
    createDate: "2026-08-15",
    company: "Nithyananda University",
    gender: "Male",
    avatarBg: "#00a4bd",
    statusBanner: "Contact has bounced.",
    bounced: true,
    activities: [
      {
        id: "act-1",
        type: "email",
        title: "Email bounced",
        content: "System notification: Message to rahul.sharma@nithyananda.org returned status 550 (User mailbox unavailable).",
        createdAt: "2026-08-29 05:58 AM EDT",
        author: "System"
      },
      {
        id: "act-2",
        type: "note",
        title: "Initial Inquiry Note",
        content: "Requested info regarding Nithyananda University online programs and course enrollment details.",
        createdAt: "2026-08-28 02:15 PM EDT",
        author: "Support Agent"
      }
    ],
    notes: "Contact expressed interest in executive programs."
  },
  {
    id: "cnt-2",
    name: "Grace Hopper",
    email: "grace.hopper@navy.gov",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Marketing Qualified Lead",
    leadStatus: "Open",
    priority: "medium",
    lastActivityDate: "2026-08-28 11:30 AM EDT",
    createDate: "2026-08-14",
    company: "Computing Institute",
    gender: "Female",
    avatarBg: "#10b981",
    bounced: false,
    activities: []
  },
  {
    id: "cnt-3",
    name: "John Doe",
    email: "john.doe@techcorp.io",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Sales Qualified Lead",
    leadStatus: "In Progress",
    priority: "medium",
    lastActivityDate: "2026-08-27 04:20 PM EDT",
    createDate: "2026-08-10",
    company: "TechCorp Global",
    gender: "Male",
    avatarBg: "#6366f1"
  },
  {
    id: "cnt-4",
    name: "Neha Patel",
    email: "neha.patel@globaledu.org",
    phoneNumber: "+1 (555) 876-5432",
    owner: "No owner",
    lifecycleStage: "Opportunity",
    leadStatus: "Open Deal",
    priority: "high",
    lastActivityDate: "2026-08-26 09:15 AM EDT",
    createDate: "2026-08-08",
    company: "Global Education Alliance",
    gender: "Female",
    avatarBg: "#f59e0b"
  },
  {
    id: "cnt-5",
    name: "Sam Wilson",
    email: "sam.wilson@brightmind.com",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Lead",
    leadStatus: "New",
    priority: "low",
    lastActivityDate: "2026-08-25 01:45 PM EDT",
    createDate: "2026-08-05",
    company: "BrightMind Labs",
    avatarBg: "#ec4899"
  },
  {
    id: "cnt-6",
    name: "Anita Roy",
    email: "anita.roy@enterprise.com",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Customer",
    leadStatus: "Connected",
    priority: "high",
    lastActivityDate: "2026-08-24 03:00 PM EDT",
    createDate: "2026-08-01",
    company: "Enterprise Corp",
    avatarBg: "#8b5cf6"
  },
  {
    id: "cnt-7",
    name: "Suresh Kumar",
    email: "suresh.kumar@apex.in",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Lead",
    leadStatus: "Attempted to Contact",
    priority: "medium",
    lastActivityDate: "2026-08-22 10:00 AM EDT",
    createDate: "2026-07-28",
    company: "Apex Solutions",
    avatarBg: "#14b8a6"
  },
  {
    id: "cnt-8",
    name: "Robert Vance",
    email: "robert.vance@vanceref.com",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Subscriber",
    leadStatus: "New",
    priority: "low",
    lastActivityDate: "2026-08-20 02:22 PM EDT",
    createDate: "2026-07-25",
    company: "Vance Refrigeration",
    avatarBg: "#0284c7"
  },
  {
    id: "cnt-9",
    name: "Bina Shah",
    email: "bina.shah@innovate.co",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Marketing Qualified Lead",
    leadStatus: "Open",
    priority: "medium",
    lastActivityDate: "2026-08-18 05:10 PM EDT",
    createDate: "2026-07-20",
    company: "Innovate Co",
    avatarBg: "#d97706"
  },
  {
    id: "cnt-10",
    name: "Rajesh Ram",
    email: "rajesh.ram@spiritualfoundation.org",
    phoneNumber: "--",
    owner: "No owner",
    lifecycleStage: "Evangelist",
    leadStatus: "Connected",
    priority: "high",
    lastActivityDate: "2026-08-15 11:11 AM EDT",
    createDate: "2026-07-15",
    company: "Nithyananda University",
    avatarBg: "#059669"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // REST API: Get Contacts list (with search, filtering, pagination)
  app.get("/api/contacts", (req, res) => {
    const search = ((req.query.search as string) || "").toLowerCase();
    const owner = (req.query.owner as string) || "";
    const leadStatus = (req.query.leadStatus as string) || "";
    const page = parseInt((req.query.page as string) || "1", 10);
    const pageSize = parseInt((req.query.pageSize as string) || "25", 10);

    let filtered = serverContacts;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          (c.company && c.company.toLowerCase().includes(search))
      );
    }
    if (owner && owner !== "All") {
      filtered = filtered.filter((c) => (c.owner || "No owner") === owner);
    }
    if (leadStatus && leadStatus !== "All") {
      filtered = filtered.filter((c) => c.leadStatus === leadStatus);
    }

    const totalCount = 526895 + filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    res.json({ contacts: paginated, totalCount });
  });

  // REST API: Get single contact by ID
  app.get("/api/contacts/:id", (req, res) => {
    const contact = serverContacts.find((c) => c.id === req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  });

  // REST API: Create contact
  app.post("/api/contacts", (req, res) => {
    const newContact = {
      ...req.body,
      id: req.body.id || `cnt-${Date.now()}`,
      createDate: req.body.createDate || new Date().toISOString().split("T")[0],
    };
    serverContacts.unshift(newContact);
    res.status(201).json(newContact);
  });

  // REST API: Update contact
  app.put("/api/contacts/:id", (req, res) => {
    const index = serverContacts.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Contact not found" });
    }
    serverContacts[index] = { ...serverContacts[index], ...req.body };
    res.json(serverContacts[index]);
  });

  // REST API: Delete contact
  app.delete("/api/contacts/:id", (req, res) => {
    serverContacts = serverContacts.filter((c) => c.id !== req.params.id);
    res.json({ success: true });
  });

  // Gemini AI Contact Summarizer API Proxy
  app.post("/api/contacts/:id/summarize", async (req, res) => {
    try {
      const contact = req.body.contact || serverContacts.find((c) => c.id === req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          summary: `• ${contact.name} (${contact.email}) is categorized under ${contact.lifecycleStage || "Lead"} lifecycle stage.\n• Owner status: ${contact.owner || "No owner"}.\n• Reachability check: ${contact.bounced ? "Contact bounced — requires address update" : "Reachable & verified"}.`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a concise, executive 3-bullet CRM summary for sales decision makers regarding this contact:\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phoneNumber || 'N/A'}\nLifecycle Stage: ${contact.lifecycleStage || 'Lead'}\nLead Status: ${contact.leadStatus || 'New'}\nCompany: ${contact.company || 'N/A'}\nBounced Status: ${contact.bounced ? 'Yes' : 'No'}\nNotes: ${contact.notes || 'None'}`
      });

      res.json({ summary: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate AI summary" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.resolve(__dirname, "apps/web"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
