import { Payload } from "src/auth/auth.interface";

declare module 'express-serve-static-core' {
    interface Request {
        user: Payload
    }
}