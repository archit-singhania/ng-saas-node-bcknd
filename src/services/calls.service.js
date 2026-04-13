'use strict';
const pool = require('../loaders/db');
const { TABLE } = require('../models/callLog.model');
const { fmtDuration } = require('../utils/formatDuration');

async function getSummary() {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total_calls,
      COALESCE(ROUND(SUM(duration_seconds)::numeric / NULLIF(COUNT(*), 0)), 0)::int AS avg_duration_sec
    FROM ${TABLE}
  `);
  const row = result.rows[0];
  return {
    totalCalls:  row.total_calls || 0,
    avgDuration: fmtDuration(row.avg_duration_sec || 0),
  };
}

async function getRecentCalls() {
  const result = await pool.query(`
    SELECT id, phone_number, caller_name, duration_seconds, call_date, created_at
    FROM ${TABLE}
    ORDER BY created_at DESC
    LIMIT 10
  `);
  return result.rows.map(r => ({
    id:         r.id,
    phone:      r.phone_number || 'Unknown',
    callerName: r.caller_name  || '—',
    duration:   fmtDuration(r.duration_seconds),
    date:       r.call_date
      ? new Date(r.call_date).toLocaleDateString('en-IN')
      : r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—',
  }));
}

async function getAllCalls(page, limit) {
  const offset = (page - 1) * limit;
  const [data, count] = await Promise.all([
    pool.query(`
      SELECT id, phone_number, caller_name, duration_seconds,
             call_date, created_at, transcript, recording_url
      FROM ${TABLE}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]),
    pool.query(`SELECT COUNT(*)::int AS total FROM ${TABLE}`),
  ]);
  return {
    data: data.rows.map(r => ({
      id:           r.id,
      phone:        r.phone_number || 'Unknown',
      callerName:   r.caller_name  || '—',
      duration:     fmtDuration(r.duration_seconds),
      date:         r.call_date
        ? new Date(r.call_date).toLocaleDateString('en-IN')
        : r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—',
      transcript:   r.transcript    || null,
      recordingUrl: r.recording_url || null,
    })),
    total: count.rows[0].total,
    page,
    limit,
  };
}

module.exports = { getSummary, getRecentCalls, getAllCalls };