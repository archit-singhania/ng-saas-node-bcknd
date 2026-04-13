'use strict';
function fmtDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m 0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}
module.exports = { fmtDuration };