'use strict';
(() => {
  // Reuse the existing ZzicGo GA4 property. Never send question content or user identifiers.
  const measurementId = 'G-SQ8B5QNVHV';
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;

  let ga;
  let host = window;
  try {
    if (window.parent !== window && window.parent.location.origin === location.origin) {
      host = window.parent;
      if (typeof host.gtag === 'function') ga = host.gtag.bind(host);
    }
  } catch { /* A standalone document can initialize its own tag. */ }
  if (!ga) {
    window.dataLayer = window.dataLayer || [];
    ga = function () { window.dataLayer.push(arguments); };
    window.gtag = ga;
    ga('js', new Date());
    // Only CS-specific events are added; avoid another automatic page_view in the iframe.
    ga('config', measurementId, { send_page_view: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }
  const context = {
    send_to: measurementId,
    page_path: '/cs',
    page_location: `${location.origin}/cs`,
    page_title: 'Daily CS',
    content_group: 'daily_cs'
  };
  function track(name, parameters = {}) {
    ga('event', name, { ...context, ...parameters });
  }
  track('cs_visit');

  // Incremental seconds: sum active_seconds for total focused time, not wall-clock tab age.
  let startedAt = null;
  let pendingMilliseconds = 0;
  let totalSeconds = 0;
  let leaving = false;
  const isActive = () => !leaving && document.visibilityState === 'visible' && host.document.hasFocus();
  function accumulate() {
    const now = performance.now();
    if (startedAt !== null) pendingMilliseconds += Math.max(0, now - startedAt);
    startedAt = isActive() ? now : null;
  }
  function flush() {
    accumulate();
    const seconds = Math.floor(pendingMilliseconds / 1000);
    if (!seconds) return;
    pendingMilliseconds -= seconds * 1000;
    totalSeconds += seconds;
    track('cs_engagement', { active_seconds: seconds, visit_active_seconds: totalSeconds, transport_type: 'beacon' });
  }
  function syncFocus() {
    // Switching focus between the parent and its iframe must not interrupt the timer.
    setTimeout(() => { accumulate(); if (!isActive()) flush(); }, 0);
  }
  accumulate();
  let heartbeat = setInterval(flush, 15000);
  document.addEventListener('visibilitychange', () => {
    accumulate();
    if (document.visibilityState !== 'visible') flush();
  });
  host.addEventListener('focus', syncFocus);
  host.addEventListener('blur', syncFocus);
  window.addEventListener('pagehide', () => {
    leaving = true; flush(); clearInterval(heartbeat);
    host.removeEventListener('focus', syncFocus);
    host.removeEventListener('blur', syncFocus);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      // A restored document starts a new visit segment without reusing its old totals.
      leaving = false; totalSeconds = 0; pendingMilliseconds = 0;
      track('cs_visit'); accumulate();
      host.addEventListener('focus', syncFocus);
      host.addEventListener('blur', syncFocus);
      heartbeat = setInterval(flush, 15000);
    }
  });
})();
