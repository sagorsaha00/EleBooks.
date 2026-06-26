import { NextResponse } from "next/server";
import { auth } from "../src/lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    console.log("session proxy", session)
    const { pathname } = request.nextUrl;
    console.log("pathName", pathname)
    if (session && pathname === "/login" || pathname === "/register") {
        console.log("session proxy", session)
        return NextResponse.redirect(new URL("/", request.url));
    } else if (!session) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}


export const config = {
    matcher: ['/dashboard'],
};