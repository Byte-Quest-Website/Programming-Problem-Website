/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

import ListUsers from "@/core/components/trpctest";

export default function Home() {
    const { data: session } = useSession();

    return (
        <>
            {!session || !session.user ? (
                <div>
                    Not signed in <br />
                    <button onClick={() => signIn()}>Sign in</button>
                </div>
            ) : (
                <div>
                    Signed in as {session.user.email} <br />
                    <img
                        src={session.user.image ?? ""}
                        alt="profile picture"
                    />{" "}
                    <br />
                    {session.user.name} <br />
                    <button onClick={() => signOut()}>Sign out</button>
                    <ListUsers />
                </div>
            )}
        </>
    );
}
