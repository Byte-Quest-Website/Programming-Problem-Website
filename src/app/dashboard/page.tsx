"use client";

import React from "react";
import { useSession } from "next-auth/react";

const Page = () => {
    const { data: session } = useSession();

    if (!session) return <>NOT LOGGED IN</>;
    return (
        <div className="text-white">
            Logged in as: <br />
            {session?.user.id} <br />
            {session?.user.name} <br />
            {session?.user.email} <br />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session?.user.image} alt="ee" className="w-[10rem]" />
        </div>
    );
};

export default Page;
