// Public Spring origin only. Never put DB credentials or tokens here.
// Local previews connect to local Spring; deployed pages connect to production.
window.DAILY_CS_CONFIG = {
  apiBaseUrl: ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    ? 'http://localhost:8080'
    : 'https://api.zzicgo.com'
};
