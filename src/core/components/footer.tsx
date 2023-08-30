"use client";

import React from "react";
import { useSession } from "next-auth/react";

const Footer = () => {
    const { data: session } = useSession();

    const links: { text: string; link: string }[] = session
        ? [
              { text: "Run Code", link: "/runcode" },
              { text: "Problems", link: "/problems" },
              { text: "Dashboard", link: "/dashboard" },
              { text: "Github", link: "https://github.com/Byte-Quest-Website" },
          ]
        : [
              { text: "Run Code", link: "/runcode" },
              { text: "Github", link: "https://github.com/Byte-Quest-Website" },
          ];

    return (
        <footer className="mt-12 p-4 w-full border-[#8D99AE] border-t-2 border-opacity-25">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm  sm:text-center text-gray-400">
                    © 2023{" "}
                    <a
                        href="https://github.com/FusionSid"
                        className="hover:underline"
                    >
                        ByteQuest™ (By Siddhesh Zantye)
                    </a>
                    . All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
                    {links.map((link, index) => {
                        return (
                            <li key={index}>
                                <a
                                    href={link.link}
                                    className="mr-4 hover:underline md:mr-6 "
                                >
                                    {link.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
