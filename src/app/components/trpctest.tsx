/* eslint-disable @next/next/no-img-element */
"use client";

import { User } from "../api/trpc/trpc-router";
import { trpc } from "@/core/utils/trpc";
import React from "react";
import { useSession } from "next-auth/react";

export default function ListUsers() {
    const { data: session } = useSession();

    let { data: users, isLoading, isFetching } = trpc.getUsers.useQuery();

    if (isLoading || isFetching || !users) {
        return <p>Loading...</p>;
    }

    if (!session) {
         return <div>unauthorized</div>
    }
    
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 20,
            }}
        >
            {users.map((user: User) => (
                <div
                    key={user.id}
                    style={{ border: "1px solid #ccc", textAlign: "center" }}
                >
                    <img
                        src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
                        alt={user.name}
                        style={{ height: 180, width: 180 }}
                    />
                    <h3>{user.name}</h3>
                </div>
            ))}
        </div>
    );
}
