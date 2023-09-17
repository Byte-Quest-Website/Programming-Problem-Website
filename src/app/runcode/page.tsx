"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE_MB = 1;

const Page = () => {
    const supportedLanguages = ["python", "node", "ricklang", "c"];

    const [chosenLanguage, setChosenLanguage] = useState("");
    const [inputText, setInputText] = useState("");
    const [useCache, setUseCache] = useState(true);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContents, setFileContents] = useState<
        string | ArrayBuffer | null
    >(null);

    const router = useRouter();

    const runcodeFormHandler = async () => {
        if (
            fileContents === null ||
            chosenLanguage === null ||
            fileContents === "" ||
            chosenLanguage === ""
        ) {
            return alert("Please provide code and choose the language!");
        }

        const requestBody = JSON.stringify({
            code: fileContents,
            language: chosenLanguage,
            input: inputText,
            use_cache: useCache,
        });

        const link = `/runcode/result?data=${encodeURIComponent(requestBody)}`;
        router.push(link);
    };

    const isLikelyText = (contents: string) => {
        const nonPrintableCount = contents.split("").reduce((count, char) => {
            const charCode = char.charCodeAt(0);
            return (
                count +
                (charCode < 32 && charCode !== 10 && charCode !== 13 ? 1 : 0)
            );
        }, 0);
        return nonPrintableCount / contents.length < 0.1;
    };

    const handleFile = (e: any) => {
        const content = e.target.result;
        if (!isLikelyText(content)) {
            return alert("Not valid code file");
        }
        setFileContents(content);
    };

    const handleFileSelect = async (event: React.ChangeEvent) => {
        event.preventDefault();

        // @ts-ignore
        const file = event.target.files[0];

        if (!file) {
            return alert("fail");
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = handleFile;

        setSelectedFile(file);
    };

    const handleDrop = async (event: React.DragEvent) => {
        event.preventDefault();

        const file = event.dataTransfer.files[0];

        if (!file) {
            return alert("fail");
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = handleFile;

        setSelectedFile(file);
    };

    const capitalize = (text: string) => {
        return text[0].toUpperCase() + text.slice(1);
    };

    return (
        <main className="h-screen">
            <div className="flex flex-col items-center justify-center mt-10">
                <motion.header
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0,
                        duration: 0.75,
                        ease: "easeOut",
                    }}
                    className="text-center text-eight"
                >
                    <h1 className="font-poppinsbold text-[3.5rem]">Run Code</h1>
                    <p className="font-poppins text-[1rem]">
                        Code will get 25mb of memory and 5 seconds to run <br />
                        Languages That Are Supported:{" "}
                        {supportedLanguages
                            .map((s) => {
                                return capitalize(s);
                            })
                            .join(", ")}
                    </p>
                </motion.header>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        runcodeFormHandler();
                    }}
                >
                    <div className="flex flex-col lg:flex-row items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.5,
                                duration: 1,
                                ease: "easeInOut",
                            }}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center justify-center w-[45rem]"
                        >
                            {selectedFile ? (
                                <div>
                                    <p>Selected file: {selectedFile.name}</p>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-[20rem] border-2 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-[#162131] border-six hover:bg-[#1f2e44]">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-[10rem] h-8 mb-4 text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Even if its &quot;bad code ngl&quot;
                                            it ok :)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        disabled={selectedFile !== null}
                                        multiple={false}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.5,
                                duration: 1,
                                ease: "easeInOut",
                            }}
                            className="p-10"
                        >
                            <h1 className="text-[2rem] text-center text-white font-poppinsbold">
                                Choose Language:
                            </h1>
                            <ul className="p-3 space-y-1 text-sm text-gray-200">
                                {supportedLanguages.map((language, index) => {
                                    return (
                                        <li key={index}>
                                            <div
                                                onClick={() =>
                                                    setChosenLanguage(language)
                                                }
                                                className="flex items-center p-2 rounded hover:bg-gray-600"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={
                                                        chosenLanguage ===
                                                        language
                                                    }
                                                    onChange={(e) => {
                                                        setChosenLanguage(
                                                            language
                                                        );
                                                    }}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                                                />
                                                <label className="w-full ml-2 text-sm font-medium rounded text-gray-300">
                                                    {capitalize(language)}
                                                </label>
                                            </div>
                                        </li>
                                    );
                                })}
                                {/* If true next will use its own cache or the api cache to speed  up response */}
                                <li>
                                    <div className="flex items-center p-2 rounded">
                                        <input
                                            type="checkbox"
                                            checked={useCache}
                                            onChange={(e) => {
                                                setUseCache(!useCache);
                                            }}
                                            className="w-4 h-4 bg-gray-600 border-gray-500"
                                        />
                                        <label className="w-full font-poppinsbold ml-2 text-sm font-medium rounded text-gray-300">
                                            Use Cache
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            <button
                                type="submit"
                                className="bg-five text-white md:px-8  w-full py-2 md:text-md lg:text-xl group hover:bg-four duration-300 relative overflow-hidden my-3 rounded-xl text-xl"
                            >
                                Run Code
                            </button>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 1.5,
                            duration: 0.5,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Input field for standard input that will be fed to the code */}
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                                Input
                            </label>
                            <input
                                className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none bg-[#232530] text-white"
                                type="text"
                                value={inputText}
                                placeholder="Never Gonna Give You Up!"
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <p className="text-white text-opacity-50 text-xs italic">
                                (Will be passed as STDIN to the code)
                            </p>
                        </div>
                    </motion.div>
                </form>
            </div>
        </main>
    );
};

export default Page;
