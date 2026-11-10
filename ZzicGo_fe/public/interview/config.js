window.INTERVIEW_API_BASE_URL = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  ? "http://localhost:8080"
  : "https://api.zzicgo.com";
