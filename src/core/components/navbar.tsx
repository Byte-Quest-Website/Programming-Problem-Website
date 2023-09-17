"use client";

import "@/assets/other/navicon.css";

import React from "react";
import { GlitchText } from "glitch-text";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [navbarOpen, setNavbarOpen] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showNavLogoText, setShowNavLogoText] = useState(false);

    // Run on page load to check weather to load mobile nav or not
    useEffect(() => {
        setShowMobileNav(globalThis.window.innerWidth <= 885);
        setShowNavLogoText(globalThis.window.innerWidth >= 390);
    }, []);

    // Add event handler for when the window is resized
    useEffect(() => {
        const windowWidthListener = (event: Event) => {
            setNavbarOpen(false);
            setShowMobileNav(globalThis.window.innerWidth <= 885);
            setShowNavLogoText(globalThis.window.innerWidth >= 390);
        };

        globalThis.window.addEventListener("resize", windowWidthListener);

        return () => {
            globalThis.window.removeEventListener(
                "resize",
                windowWidthListener
            );
        };
    }, []);

    // Add event listner to listen for when ESC key is pressed and close nav bar if open
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
                    <GlitchText
                        theme="red"
                        text={showNavLogoText ? "ByteQuest" : "B"}
                    />
                </h1>
                {!showMobileNav ? (
                    <>
                        <ul className="flex flex-row justify-center">
                            {links.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => router.push(item.link)}
                                        className="hover:text-white duration-300 hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-white before:absolute before:left-0 before:bottom-0 md:text-md lg:text-xl inline mx-5 font-poppins text-white hover:cursor-pointer"
                                    >
                                        {item.text}
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            onClick={() => (session ? signOut() : signIn())}
                            className="bg-four text-white md:px-8 lg:px-12 py-3 rounded-xl md:text-md lg:text-xl group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 w-0 bg-six transition-all duration-500 ease-in-out group-hover:w-full"></div>
                            <span className="relative text-white">
                                {session ? "Sign Out" : "Log In"}
                            </span>
                        </button>
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
                            className={`fixed right-0 top-0 z-40 h-full bg-one w-full p-5 text-white duration-500 ease-in-out bg-pgrey ${
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
                                            onClick={() => {
                                                router.push(item.link);
                                                setNavbarOpen(false);
                                            }}
                                            className="text-center inline text-[2rem] my-3 font-poppins text-white hover:cursor-pointer   hover:text-six duration-300 hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-white before:absolute before:left-0 before:bottom-0"
                                        >
                                            {item.text}
                                        </li>
                                    );
                                })}
                                <button
                                    onClick={() =>
                                        session ? signOut() : signIn()
                                    }
                                    className="bg-four text-white md:px-8 lg:px-12 md:text-md lg:text-xl group relative overflow-hidden px-12 py-4 my-3 rounded-xl text-xl"
                                >
                                    <div className="absolute inset-0 w-0 bg-six transition-all duration-500 ease-in-out group-hover:w-full"></div>
                                    <span className="relative text-white">
                                        {session ? "Logout" : "Login"}
                                    </span>
                                </button>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
