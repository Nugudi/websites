import { base64url } from "jose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const state = {
  encode: (value: Record<string, string>) => {
    const jsonString = JSON.stringify(value);
    const encoded = new TextEncoder().encode(jsonString);
    return base64url.encode(encoded);
  },
  decode: <T = Record<string, string>>(value: string): T => {
    const decoded = base64url.decode(value);
    return JSON.parse(new TextDecoder().decode(decoded)) as T;
  },
};

export const redirectToLogin = async () => {
  const to = await getToUrl();
  redirect(`/api/auth/login?to=${encodeURIComponent(to)}`);
};

const getToUrl = async () => {
  const readonly = await headers();
  const nextUrl = readonly.get("x-next-url");
  if (!nextUrl) {
    return "/";
  }
  const url = new URL(nextUrl);
  return url.pathname + url.search;
};
