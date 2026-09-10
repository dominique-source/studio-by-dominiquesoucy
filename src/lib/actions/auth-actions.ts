"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
