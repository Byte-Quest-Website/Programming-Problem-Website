"use client";

import "./navicon.css";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [showMobileNav, setShowMobileNav] = useState(
        window.innerWidth <= 885
    );
    const [showNavLogoText, setShowNavLogoText] = useState(
        window.innerWidth >= 390
    );
    const [navbarOpen, setNavbarOpen] = useState(false);

    useEffect(() => {
        const windowWidthListener = (event: Event) => {
            setNavbarOpen(false);
            setShowMobileNav(window.innerWidth <= 885);
            setShowNavLogoText(window.innerWidth >= 390);
        };
        window.addEventListener("resize", windowWidthListener);
        return () => {
            window.removeEventListener("resize", windowWidthListener);
        };
    });

    useEffect(() => {
        const keyHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                if (showMobileNav && navbarOpen) {
                    setNavbarOpen(!navbarOpen);
                }
            }
        };
        document.addEventListener("keydown", keyHandler);
        return () => {
            document.removeEventListener("keydown", keyHandler);
        };
    });

    const links: { text: string; link: string }[] = session
        ? [
              { text: "Run Code", link: "/runcode" },
              { text: "Problems", link: "/problems" },
              { text: "Github", link: "https://github.com/Byte-Quest-Website" },
              { text: "Dashboard", link: "/dashboard" },
          ]
        : [
              { text: "Run Code", link: "/runcode" },
              { text: "Github", link: "https://github.com/Byte-Quest-Website" },
          ];

    return (
        <nav className="w-full border-[#8D99AE] border-b-2 border-opacity-25">
            <div className="flex items-center justify-between mx-12 my-7">
                <h1
                    onClick={() => router.push("/")}
                    className="font-hacked text-white text-[3rem] md:text-[2.5rem] lg:text-[3rem] hover:cursor-pointer"
                >
                    {showNavLogoText ? "ByteQuest" : "B"}
                </h1>
                {!showMobileNav ? (
                    <>
                        <ul className="flex flex-row justify-center">
                            {links.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => router.push(item.link)}
                                        className="hover:text-[#0080DC] duration-100 hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black dark:before:bg-white before:absolute before:left-0 before:bottom-0 md:text-md lg:text-xl inline mx-5 font-poppins text-white hover:cursor-pointer"
                                    >
                                        {item.text}
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            onClick={() => (session ? signOut() : signIn())}
                            className="bg-four text-white md:px-8 lg:px-12 py-3 rounded-xl md:text-md lg:text-xl"
                        >
                            {session ? "Sign Out" : "Log In"}
                        </button>{" "}
                    </>
                ) : (
                    <>
                        {navbarOpen ? (
                            <div
                                id="nav-icon"
                                className="open"
                                onClick={() => {
                                    let element =
                                        document.getElementById("nav-icon");
                                    if (element)
                                        element.classList.toggle("open");
                                    setNavbarOpen(!navbarOpen);
                                }}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        ) : (
                            <div
                                id="nav-icon"
                                onClick={() => {
                                    let element =
                                        document.getElementById("nav-icon");
                                    if (element)
                                        element.classList.toggle("open");
                                    setNavbarOpen(!navbarOpen);
                                }}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}

                        <div
                            className={`fixed right-0 top-0 z-40 h-full w-full bg-one p-5 text-white duration-500 ease-in-out dark:bg-pgrey ${
                                navbarOpen
                                    ? "translate-x-0 "
                                    : "translate-x-full"
                            }`}
                        >
                            <ul className="m-28 flex flex-col items-center">
                                {links.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={() =>
                                                router.push(item.link)
                                            }
                                            className="hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black dark:before:bg-white before:absolute before:left-0 before:bottom-0 md:text-md lg:text-xl inline md:text-[2rem] my-3 font-poppins text-white hover:cursor-pointer"
                                        >
                                            {item.text}
                                        </li>
                                    );
                                })}
                                <button
                                    onClick={() =>
                                        session ? signOut() : signIn()
                                    }
                                    className="bg-four text-white md:px-12 md:py-4 my-3 rounded-xl md:text-md md:text-2xl"
                                >
                                    {session ? "Sign Out" : "Log In"}
                                </button>{" "}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
