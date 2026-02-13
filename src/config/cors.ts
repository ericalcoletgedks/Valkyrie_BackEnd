import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {

    const whitelist = [
      process.env.FRONTEND_URL,
      'http://localhost:5173'
    ];

    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);

    return callback(null, false); // ❗ NO lanzar error
  },
  credentials: true
};