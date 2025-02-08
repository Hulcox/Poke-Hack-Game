import { cookies } from "next/headers";

export const getToken = async () => (await cookies()).get("auth_token")?.value;

export const isLoggedIn = () => Boolean(getToken());
