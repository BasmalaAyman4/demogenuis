/* // auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User, LoginResponse } from "@/types/auth";
import { fetchWithTimeout, buildBaseHeaders } from "./lib/shared/fetch-utils";
import { handleResponse } from "./lib/shared/response-handler";
import { handleError, logError } from "./lib/shared/error-handler";
import { API_CONFIG } from "@/utils/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Password Login Provider
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                mobile: { label: "Mobile", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.mobile || !credentials?.password) {
                    logError("Missing credentials", new Error("Mobile or password not provided"));
                    return null;
                }

                try {
                    // Use POST with query parameters (based on your API)
                    const url = `${API_CONFIG.BASE_URL}/api/Auth/LogInBack?mobile=${credentials.mobile}&password=${credentials.password}`;

                    // Build headers
                    const headers = buildBaseHeaders('ar');

                    const fetchOptions: RequestInit = {
                        method: "POST",
                        headers,
                        cache: 'no-store',
                    };

                    // Use your fetchWithTimeout utility
                    const response = await fetchWithTimeout(url, fetchOptions, API_CONFIG.TIMEOUT);

                    // Use your handleResponse utility
                    const apiResponse = await handleResponse(response);

                    // Parse the result
                    const result: LoginResponse = apiResponse.data;

                    // Validate response structure
                    if (!result || typeof result !== 'object') {
                        logError("Invalid API response format", new Error("Response is not an object"), {
                            response: result
                        });
                        return null;
                    }

                    if (result.success && result.data?.token) {
                        return {
                            id: result.data.id.toString(),
                            name: `${result.data.firstName || ''} ${result.data.lastName || ''}`.trim(),
                            email: result.data.email || '',
                            mobile: result.data.mobile,
                            accessToken: result.data.token,
                            user: result.data,
                        };
                    }

                    // Login unsuccessful
                    logError("Login unsuccessful", new Error("Invalid credentials or missing token"), {
                        success: result.success,
                        hasData: !!result.data,
                        hasToken: !!result.data?.token
                    });
                    return null;

                } catch (error: any) {
                    // Use your error handler
                    const errorResponse = handleError(error, process.env.NODE_ENV === 'development');

                    logError("Login authorization failed", error, {
                        mobile: credentials.mobile,
                        errorCode: errorResponse.errorCode,
                        status: errorResponse.status,
                        detail: errorResponse.detail
                    });

                    return null;
                }
            },
        }),

        // OTP Credentials Provider - for OTP login and profile completion
        CredentialsProvider({
            id: "otp-credentials",
            name: "OTP Credentials",
            credentials: {
                userId: { label: "User ID", type: "text" },
                mobile: { label: "Mobile", type: "text" },
                email: { label: "Email", type: "text" },
                firstName: { label: "First Name", type: "text" },
                lastName: { label: "Last Name", type: "text" },
                token: { label: "Token", type: "text" },
                verify: { label: "Verify", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.userId || !credentials?.token) {
                    logError("Missing OTP credentials", new Error("UserId or token not provided"));
                    return null;
                }

                try {
                    // Create user object directly from provided credentials
                    return {
                        id: credentials.userId as string,
                        name: `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim(),
                        email: credentials.email as string || '',
                        mobile: credentials.mobile as string,
                        accessToken: credentials.token as string,
                        user: {
                            id: parseInt(credentials.userId as string),
                            firstName: credentials.firstName as string,
                            lastName: credentials.lastName as string,
                            mobile: credentials.mobile as string,
                            email: credentials.email as string,
                            verify: credentials.verify === 'true',
                            token: credentials.token as string,
                        },
                    };
                } catch (error: any) {
                    logError("OTP authorization failed", error, {
                        userId: credentials.userId,
                    });
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
        maxAge: 15 * 60, // 15 minutes
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.user = user.user;
                token.mobile = user.mobile;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken as string;
                session.user = {
                    ...session.user,
                    ...(token.user as any),
                    mobile: token.mobile as string,
                };
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}); */

// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User, LoginResponse } from "@/types/auth";
import { fetchWithTimeout, buildBaseHeaders } from "./lib/shared/fetch-utils";
import { handleResponse } from "./lib/shared/response-handler";
import { handleError, logError } from "./lib/shared/error-handler";
import { API_CONFIG } from "@/utils/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Password Login Provider
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                mobile: { label: "Mobile", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.mobile || !credentials?.password) {
                    logError("Missing credentials", new Error("Mobile or password not provided"));
                    return null;
                }

                try {
                    // Use POST with query parameters (based on your API)
                    const url = `${API_CONFIG.BASE_URL}/api/Auth/LogInBack?mobile=${credentials.mobile}&password=${credentials.password}`;

                    // Build headers
                    const headers = buildBaseHeaders('ar');

                    const fetchOptions: RequestInit = {
                        method: "POST",
                        headers,
                        cache: 'no-store',
                    };

                    // Use your fetchWithTimeout utility
                    const response = await fetchWithTimeout(url, fetchOptions, API_CONFIG.TIMEOUT);

                    // Use your handleResponse utility
                    const apiResponse = await handleResponse(response);

                    // Parse the result
                    const result: LoginResponse = apiResponse.data;

                    // Validate response structure
                    if (!result || typeof result !== 'object') {
                        logError("Invalid API response format", new Error("Response is not an object"), {
                            response: result
                        });
                        return null;
                    }

                    if (result.success && result.data?.token) {
                        return {
                            id: result.data.id.toString(),
                            name: `${result.data.firstName || ''} ${result.data.lastName || ''}`.trim(),
                            email: result.data.email || '',
                            mobile: result.data.mobile,
                            accessToken: result.data.token,
                            user: result.data,
                        };
                    }

                    // Login unsuccessful
                    logError("Login unsuccessful", new Error("Invalid credentials or missing token"), {
                        success: result.success,
                        hasData: !!result.data,
                        hasToken: !!result.data?.token
                    });
                    return null;

                } catch (error: any) {
                    // Use your error handler
                    const errorResponse = handleError(error, process.env.NODE_ENV === 'development');

                    logError("Login authorization failed", error, {
                        mobile: credentials.mobile,
                        errorCode: errorResponse.errorCode,
                        status: errorResponse.status,
                        detail: errorResponse.detail
                    });

                    return null;
                }
            },
        }),

        // OTP Credentials Provider - for OTP login and profile completion
        CredentialsProvider({
            id: "otp-credentials",
            name: "OTP Credentials",
            credentials: {
                userId: { label: "User ID", type: "text" },
                mobile: { label: "Mobile", type: "text" },
                email: { label: "Email", type: "text" },
                firstName: { label: "First Name", type: "text" },
                lastName: { label: "Last Name", type: "text" },
                token: { label: "Token", type: "text" },
                verify: { label: "Verify", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.userId || !credentials?.token) {
                    logError("Missing OTP credentials", new Error("UserId or token not provided"));
                    return null;
                }

                try {
                    // Create user object directly from provided credentials
                    return {
                        id: credentials.userId as string,
                        name: `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim(),
                        email: credentials.email as string || '',
                        mobile: credentials.mobile as string,
                        accessToken: credentials.token as string,
                        user: {
                            id: parseInt(credentials.userId as string),
                            firstName: credentials.firstName as string,
                            lastName: credentials.lastName as string,
                            mobile: credentials.mobile as string,
                            email: credentials.email as string,
                            verify: credentials.verify === 'true',
                            token: credentials.token as string,
                        },
                    };
                } catch (error: any) {
                    logError("OTP authorization failed", error, {
                        userId: credentials.userId,
                    });
                    return null;
                }
            },
        }),
    ],
    
    pages: {
        signIn: "/signin",
        error: "/signin", // Redirect errors to signin page
    },
    
    session: {
        strategy: "jwt",
        maxAge: 15 * 60, // 15 minutes
    },
    
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.accessToken = user.accessToken;
                token.user = user.user;
                token.mobile = user.mobile;
            }

            // Handle session updates
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }

            return token;
        },
        
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken as string;
                session.user = {
                    ...session.user,
                    ...(token.user as any),
                    mobile: token.mobile as string,
                };
            }
            return session;
        },

        // Add redirect callback to handle post-login redirects
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },

    // Events for logging
    events: {
        async signIn({ user, account, profile, isNewUser }) {
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Sign in successful:', {
                    userId: user?.id,
                    provider: account?.provider,
                    isNewUser
                });
            }
        },
        async signOut({ token, session }) {
            if (process.env.NODE_ENV === 'development') {
                console.log('👋 User signed out');
            }
        },
        async session({ session, token }) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Session accessed:', {
                    userId: session?.user?.id,
                    hasToken: !!token?.accessToken
                });
            }
        },
    },

    // Custom logger
    logger: {
        error(code, metadata) {
            console.error('❌ NextAuth Error:', code, metadata);
        },
        warn(code) {
            console.warn('⚠️ NextAuth Warning:', code);
        },
        debug(code, metadata) {
            if (process.env.NODE_ENV === 'development') {
                console.debug('🔍 NextAuth Debug:', code, metadata);
            }
        },
    },

    // CRITICAL: Must have AUTH_SECRET set
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Trust host in production
    trustHost: true,

    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === 'production',

    // Cookie configuration
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' 
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
});