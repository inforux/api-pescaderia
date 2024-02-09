import { CorsOptions } from "cors";
import { config } from "dotenv";

config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const origin = process.env.ORIGIN || 'http://localhost:3000';
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;

export const corsOptions: CorsOptions = {
  origin: [origin],
  credentials: false,
};