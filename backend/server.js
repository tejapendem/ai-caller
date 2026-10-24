import 'dotenv/config';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

import { register, login, me, updateMe, authMiddleware } from './api/auth.js';
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from './api/employees.js';
import { listCampaigns, getCampaign, createCampaign, startCampaign, pauseCampaign, listWebhooks, createWebhook, handleWebhook } from './api/campaigns.js';
import { listLeads, getLead, getLeadStats } from './api/leads.js';
import { listCalls, getCall, getCallStats, getDailyPerf } from './api/calls.js';
import { getPlans, getBalance, getTransactions, topup, listNumbers, assignNumber, getSettings, updateSettings, listApiKeys, createApiKey } from './api/billing.js';
import { getVoicesRoute } from './voice/tts.js';
import { setupCallWebSocket } from './telephony/callhandler.js';

const app = express();
expressWs(app);

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// ── Auth ──────────────────────────────────────────────────────────────────
app.post('/auth/register', register);
app.post('/auth/login',    login);
app.get('/auth/me',        authMiddleware, me);
app.patch('/auth/me',      authMiddleware, updateMe);

// ── Employees ─────────────────────────────────────────────────────────────
app.get('/employees',         authMiddleware, listEmployees);
app.get('/employees/:id',     authMiddleware, getEmployee);
app.post('/employees',        authMiddleware, createEmployee);
app.patch('/employees/:id',   authMiddleware, updateEmployee);
app.delete('/employees/:id',  authMiddleware, deleteEmployee);

// ── Campaigns ─────────────────────────────────────────────────────────────
app.get('/campaigns',             authMiddleware, listCampaigns);
app.get('/campaigns/:id',         authMiddleware, getCampaign);
app.post('/campaigns',            authMiddleware, createCampaign);
app.post('/campaigns/:id/start',  authMiddleware, startCampaign);
app.post('/campaigns/:id/pause',  authMiddleware, pauseCampaign);

// CSV upload → create campaign
app.post('/campaigns/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { employee_id, name } = req.body;
    const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true });
    req.body.leads = records;
    req.body.employee_id = employee_id;
    req.body.name = name || `Campaign ${Date.now()}`;
    await createCampaign(req, res);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Webhooks (instant leads) ───────────────────────────────────────────────
app.get('/webhooks',        authMiddleware, listWebhooks);
app.post('/webhooks',       authMiddleware, createWebhook);
app.post('/webhook/:secret', handleWebhook);  // public — triggered by external systems

// ── Leads ─────────────────────────────────────────────────────────────────
app.get('/leads',        authMiddleware, listLeads);
app.get('/leads/stats',  authMiddleware, getLeadStats);
app.get('/leads/:id',    authMiddleware, getLead);

// ── Calls / Conversations ─────────────────────────────────────────────────
app.get('/calls',           authMiddleware, listCalls);
app.get('/calls/stats',     authMiddleware, getCallStats);
app.get('/calls/daily',     authMiddleware, getDailyPerf);
app.get('/calls/:id',       authMiddleware, getCall);

// ── Billing / Numbers / Settings ──────────────────────────────────────────
app.get('/billing/plans',       authMiddleware, getPlans);
app.get('/billing/balance',     authMiddleware, getBalance);
app.get('/billing/transactions',authMiddleware, getTransactions);
app.post('/billing/topup',      authMiddleware, topup);

app.get('/numbers',           authMiddleware, listNumbers);
app.patch('/numbers/:id',     authMiddleware, assignNumber);

app.get('/settings',           authMiddleware, getSettings);
app.patch('/settings',         authMiddleware, updateSettings);

app.get('/keys',              authMiddleware, listApiKeys);
app.post('/keys',             authMiddleware, createApiKey);

// ── Voices ────────────────────────────────────────────────────────────────
app.get('/voices', getVoicesRoute);

// ── Telephony (Twilio/Plivo callbacks + WS) ────────────────────────────────
setupCallWebSocket(app);

// ── Health ────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AI Caller backend running on :${PORT}`));
