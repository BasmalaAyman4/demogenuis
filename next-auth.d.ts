// next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            mobile?: string;
            firstName?: string;
            lastName?: string;
            address?: string;
            verify?: boolean;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        accessToken?: string;
        mobile?: string;
        user?: any;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        accessToken?: string;
        mobile?: string;
        user?: any;
    }
}