"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

import ListUsers from "./components/trpctest";

export default function Home() {
    const { data: session } = useSession();

    if (session?.user) {
        return (
            <div>
                Signed in as {session.user.email} <br />
                <Image
                    src={session.user.image ?? ""}
                    alt="profile picture"
                />{" "}
                <br />
                {session.user.name} <br />
                <button onClick={() => signOut()}>Sign out</button>
                <ListUsers />
            </div>
        );
    }
    return (
        <div>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    );
}
