const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

const SCHEMA = process.env.DB_SCHEMA || 'llm_ai_call_agent';

/**
 * Converts duration_sec (integer seconds) → "Xm Ys" string.
 */
function fmtDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m 0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ─────────────────────────────────────────────
// GET /api/calls/summary
// Returns: { totalCalls, avgDuration }
// ─────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int                        AS total_calls,
        ROUND(AVG(duration_sec))::int        AS avg_duration_sec
      FROM ${SCHEMA}.call_logs
    `);

    const row = result.rows[0];
    const totalCalls     = row.total_calls     || 0;
    const avgSec         = row.avg_duration_sec || 0;

    res.json({
      totalCalls,
      avgDuration: fmtDuration(avgSec),
    });
  } catch (err) {
    console.error('[/api/calls/summary]', err.message);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/calls/recent
// Returns: last 10 rows ordered by created_at DESC
// ─────────────────────────────────────────────
router.get('/recent', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        phone_no,
        caller_name,
        duration_sec,
        call_date,
        created_at
      FROM ${SCHEMA}.call_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const rows = result.rows.map(r => ({
      id:         r.id,
      phone:      r.phone_no     || 'Unknown',
      callerName: r.caller_name  || '—',
      duration:   fmtDuration(r.duration_sec),
      date:       r.created_at
        ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : r.call_date,
    }));

    res.json(rows);
  } catch (err) {
    console.error('[/api/calls/recent]', err.message);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/calls
// Query params: page (default 1), limit (default 15)
// Returns: { data, total, page, limit }
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  || '1',  10));
  const limit = Math.max(1, parseInt(req.query.limit || '15', 10));
  const offset = (page - 1) * limit;

  try {
    const [dataResult, countResult] = await Promise.all([
      pool.query(`
        SELECT
          id,
          phone_no,
          caller_name,
          duration_sec,
          call_date,
          created_at,
          transcript,
          recording_url
        FROM ${SCHEMA}.call_logs
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),

      pool.query(`SELECT COUNT(*)::int AS total FROM ${SCHEMA}.call_logs`)
    ]);

    const data = dataResult.rows.map(r => ({
      id:           r.id,
      phone:        r.phone_no     || 'Unknown',
      callerName:   r.caller_name  || '—',
      duration:     fmtDuration(r.duration_sec),
      date:         r.created_at
        ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : r.call_date,
      transcript:   r.transcript    || null,
      recordingUrl: r.recording_url || null,
    }));

    res.json({
      data,
      total: countResult.rows[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[/api/calls]', err.message);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

module.exports = router;
