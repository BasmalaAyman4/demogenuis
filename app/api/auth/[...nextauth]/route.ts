/* // app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers; */

// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Add runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';