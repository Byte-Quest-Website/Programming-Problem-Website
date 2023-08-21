"use client";

import React from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session } = useSession();
    return (
        <div>
            <ul>
                <li>
                    {session ? (
                        <>
                            <button
                                onClick={() => {
                                    signOut();
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    signIn();
                                }}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </li>
                <li></li>
            </ul>
        </div>
    );
};

export default Navbar;
