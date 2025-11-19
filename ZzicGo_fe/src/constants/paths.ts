export const PATH = {
  // Splash & Auth
  SPLASH: "/",

  // Root:LOGIN
  LOGIN: "/login",
  NAVER_CALLBACK: "naver/callback", 

  WELCOME: "/welcome",

  // Root: Z1_ROOT
  Z1_ROOT: "/z1",
  Z1_MAIN: "/z1",   // index : true
  Z1_CHALLENGES: "challenges",
  Z1_UPLOAD: "upload",
  Z1_CHALLENGES_ROOM: "challenges/history",

  // NotFound
  NOT_FOUND: "*",
} as const;