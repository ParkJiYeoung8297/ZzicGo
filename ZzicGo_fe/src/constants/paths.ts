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
    // ⭐ 동적 파라미터 정의
  Z1_CHALLENGES_ROOM: "challenge/:challengeId/history",
  // ⭐ navigate 시 실제 값 넣어주는 함수 버전
  GO_CHALLENGES_ROOM: (id: number) => `challenge/${id}/history`,

  // NotFound
  NOT_FOUND: "*",
} as const;