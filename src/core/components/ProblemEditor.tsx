"use client";

import Markdown from "./markdown";
import React, { useState, useEffect, useRef } from "react";
import { Problem, User } from "@prisma/client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "split-pane-react/esm/themes/default.css";
import { Extension } from "@uiw/react-codemirror";
import { Settings } from "@uiw/codemirror-themes";
import SplitPane, { Pane } from "split-pane-react";
import * as allThemes from "@uiw/codemirror-themes-all";

const extensions = [python()];

const ProblemEditor = (props: { problem: Problem; author: User }) => {
    const [currentOutput, setCurrentOutput] = useState("");
    const [code, setCode] = useState("");
    const [completion, setCompletion] = useState(true);
    const [theme, setTheme] = useState(THEMES.atomone);
    const [sizes, setSizes] = useState([250, "30%", "auto"]);
    const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);

    const ref = useRef<HTMLDivElement>(null);

    const scrollToElement = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToElement();
    }, []);

    async function makeRequest() {
        const response = await fetch("http://localhost:8443/testcode", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                problem_id: props.problem.id,
            }),
            cache: "no-store",
        });

        let json;
        try {
            json = await response.json();
        } catch {
            json = null;
        }
        if (json.success === true) {
            const { jobID } = json;
            setCurrentOutput(json.detail);
            const loop = setInterval(async () => {
                const response = await fetch(`/api/job_status?id=${jobID}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });
                let json;
                try {
                    json = await response.json();
                } catch {
                    json = null;
                }
                if (json.success && json.completed) {
                    setCurrentOutput("Done");
                    const response = await fetch(`/api/jobs?id=${jobID}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        cache: "no-store",
                    });
                    let json;
                    try {
                        json = await response.json();
                    } catch {
                        json = null;
                    }
                    setCurrentOutput(JSON.stringify(json, null, 4));
                    clearInterval(loop);
                }
            }, 1000);
        }
    }

    const difficultyColors = {
        EASY: "#A5D76E",
        MEDIUM: "#F6C36F",
        HARD: "#D15559",
    };

    useEffect(() => {
        const name = Object.keys(THEMES).find((key) => {
            return THEMES[key] === theme;
        });
        if (name?.toLowerCase().includes("light")) {
            alert(
                "You sir have commited a war crime by using light mode\nThere goes your syntax highlighting and autocomplete"
            );
            setCompletion(false);
            setSyntaxHighlighting(false);
            return;
        }
        setCompletion(true);
        setSyntaxHighlighting(true);
    }, [theme]);

    const onChange = React.useCallback(
        (value: string, viewUpdate) => {
            setCode(value);

            if (!completion || !syntaxHighlighting) {
                return;
            }
            if (value.includes("global")) {
                alert(
                    "Bro just typed 'global'\nNo more autocomplete and syntaxhighlighting for you"
                );
                setCompletion(false);
                setSyntaxHighlighting(false);
            } else if (
                value.includes(
                    "import *"
                ) /* special case for mr sheppard's code */
            ) {
                alert(
                    "C'mon Mr Sheppard! Wildcard imports are NOT allowed here.\nUh Oh there goes your autocompletion and syntax highlighting"
                );
                setCompletion(false);
                setSyntaxHighlighting(false);
            }
        },
        [completion, syntaxHighlighting]
    );

    const defaultCode = `def ${
        props.problem.functionName
    }(${props.problem.parameterNames.join(", ")}):\n  pass`;

    return (
        <div ref={ref} className="h-screen snap snap-y snap-mandatory m-1">
            {/* @ts-ignore */}
            <SplitPane
                className="snap-start"
                split="vertical"
                sizes={sizes}
                onChange={setSizes}
            >
                <Pane className="mr-1" minSize="20%" maxSize="45%">
                    <div
                        className="min-h-screen grid gap-1 grid-rows-2 grid-flow-col w-full mr-1"
                        style={{ gridTemplateRows: "80% 20%" }}
                    >
                        <div className="bg-one rounded-md shadow-xl p-7 prose dark:prose-invert overflow-y-scroll no-scrollbar">
                            <h1 className="text-white font-poppinsbold text-2xl drop-shadow-lg">
                                {props.problem.title}
                            </h1>
                            <Markdown markdown={props.problem.description} />
                        </div>
                        <div className="bg-one rounded-md shadow-xl p-7 flex flex-col justify-between">
                            <div className="flex text-white items-center justify-between">
                                <h1 className="font-poppins">
                                    <span className="font-poppinsbold">
                                        {"Author: "}
                                    </span>
                                    {props.author.name}
                                </h1>
                                <h1 className="font-poppins">
                                    {props.problem.updatedAt.toLocaleString()}
                                </h1>
                            </div>
                            <div className="flex justify-between items-center text-white">
                                <div className="flex gap-2 fill-white">
                                    <h1>{props.problem.likes}</h1>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-7"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M7.99997 20H17.1919C17.9865 20 18.7058 19.5296 19.0243 18.8016L21.8323 12.3833C21.9429 12.1305 22 11.8576 22 11.5816V11C22 9.89543 21.1045 9 20 9H13.5L14.7066 4.5757C14.8772 3.95023 14.5826 3.2913 14.0027 3.00136V3.00136C13.4204 2.7102 12.7134 2.87256 12.3164 3.3886L8.41472 8.46082C8.14579 8.81044 7.99997 9.23915 7.99997 9.68024V20ZM7.99997 20H2V10H7.99997V20Z"
                                            stroke="#000000"
                                            stroke-width="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="flex gap-2 fill-white">
                                    <h1>{props.problem.dislikes}</h1>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-7"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M7.99997 4H17.1919C17.9865 4 18.7058 4.47039 19.0243 5.19836L21.8323 11.6167C21.9429 11.8695 22 12.1424 22 12.4184V13C22 14.1046 21.1045 15 20 15H13.5L14.7066 19.4243C14.8772 20.0498 14.5826 20.7087 14.0027 20.9986V20.9986C13.4204 21.2898 12.7134 21.1274 12.3164 20.6114L8.41472 15.5392C8.14579 15.1896 7.99997 14.7608 7.99997 14.3198V14M7.99997 4H2V14H7.99997M7.99997 4V14"
                                            stroke="#000000"
                                            stroke-width="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h1>{props.problem.timeLimit} seconds</h1>
                                <h1>{props.problem.memoryLimit} MB</h1>
                            </div>
                            <h1
                                className="font-poppinsbold drop-shadow-glow"
                                style={{
                                    color: difficultyColors[
                                        props.problem.difficulty
                                    ],
                                }}
                            >
                                DIFFICULTY {props.problem.difficulty}
                            </h1>
                        </div>
                    </div>
                </Pane>
                <div
                    className="min-h-screen grid grid-rows-3 gap-1 grid-flow-col w-full ml-1"
                    style={{ gridTemplateRows: "5% 65% 30%" }}
                >
                    <div className="bg-one rounded-md shadow-xl flex gap-2 justify-between items-center px-3">
                        <h1 className="font-poppinsbold text-xl text-white">
                            Code Editor
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2 items-center">
                                <h1 className="text-white font-poppins">
                                    Theme:
                                </h1>
                                <select
                                    defaultValue={"atomone"}
                                    className="text-sm font-poppins rounded-lg block h-8 w-52 pl-2 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 "
                                    onChange={(e) => {
                                        setTheme(THEMES[e.target.value]);
                                    }}
                                >
                                    {Object.keys(THEMES).map((key) => {
                                        return (
                                            <option value={key} key={key}>
                                                {key}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{ background: theme[1].background }}
                        className="overflow-y-scroll no-scrollbar rounded-md shadow-xl h-full"
                    >
                        <CodeMirror
                            className="rounded-md p-2 h-full"
                            theme={theme[0]}
                            value={defaultCode}
                            autoFocus={true}
                            extensions={extensions}
                            indentWithTab={true}
                            onChange={onChange}
                            basicSetup={{
                                autocompletion: completion,
                                syntaxHighlighting: syntaxHighlighting,
                            }}
                        />
                    </div>
                    <div className="bg-one h-full rounded-md shadow-xl p-7 overflow-scroll no-scrollbar">
                        <button
                            onClick={async () => {
                                await makeRequest();
                            }}
                        >
                            Run
                        </button>
                        <pre className="text-white">{currentOutput}</pre>
                    </div>
                </div>
            </SplitPane>
        </div>
    );
};

export default ProblemEditor;

const THEMES: {
    [key: string]: [Extension, Settings];
} = {
    dark: [allThemes.basicDark, allThemes.defaultSettingsBasicDark],
    light: [allThemes.basicLight, allThemes.defaultSettingsBasicLight],
    abcdef: [allThemes.abcdef, allThemes.defaultSettingsAbcdef],
    abyss: [allThemes.abyss, allThemes.defaultSettingsAbyss],
    androidstudio: [
        allThemes.androidstudio,
        allThemes.defaultSettingsAndroidstudio,
    ],
    atomone: [allThemes.atomone, allThemes.defaultSettingsAtomone],
    aura: [allThemes.aura, allThemes.defaultSettingsAura],
    bbedit: [allThemes.bbedit, allThemes.defaultSettingsBbedit],
    bespin: [allThemes.bespin, allThemes.defaultSettingsBespin],
    dracula: [allThemes.dracula, allThemes.defaultSettingsDracula],
    duotoneDark: [allThemes.duotoneDark, allThemes.defaultSettingsDuotoneDark],
    duotoneLight: [
        allThemes.duotoneLight,
        allThemes.defaultSettingsDuotoneLight,
    ],
    eclipse: [allThemes.eclipse, allThemes.defaultSettingsEclipse],
    githubDark: [allThemes.githubDark, allThemes.defaultSettingsGithubDark],
    githubLight: [allThemes.githubLight, allThemes.defaultSettingsGithubLight],
    gruvboxDark: [allThemes.gruvboxDark, allThemes.defaultSettingsGruvboxDark],
    gruvboxLight: [
        allThemes.gruvboxLight,
        allThemes.defaultSettingsGruvboxLight,
    ],
    kimbie: [allThemes.kimbie, allThemes.defaultSettingsKimbie],
    material: [allThemes.material, allThemes.defaultSettingsMaterial],
    materialDark: [
        allThemes.materialDark,
        allThemes.defaultSettingsMaterialDark,
    ],
    materialLight: [
        allThemes.materialLight,
        allThemes.defaultSettingsMaterialLight,
    ],
    monokai: [allThemes.monokai, allThemes.defaultSettingsMonokai],
    monokaiDimmed: [
        allThemes.monokaiDimmed,
        allThemes.defaultSettingsMonokaiDimmed,
    ],
    noctisLilac: [allThemes.noctisLilac, allThemes.defaultSettingsNoctisLilac],
    nord: [allThemes.nord, allThemes.defaultSettingsNord],
    okaidia: [allThemes.okaidia, allThemes.defaultSettingsOkaidia],
    quietlight: [allThemes.quietlight, allThemes.defaultSettingsQuietlight],
    red: [allThemes.red, allThemes.defaultSettingsRed],
    solarizedDark: [
        allThemes.solarizedDark,
        allThemes.defaultSettingsSolarizedDark,
    ],
    solarizedLight: [
        allThemes.solarizedLight,
        allThemes.defaultSettingsSolarizedLight,
    ],
    sublime: [allThemes.sublime, allThemes.defaultSettingsSublime],
    tokyoNight: [allThemes.tokyoNight, allThemes.defaultSettingsTokyoNight],
    tokyoNightDay: [
        allThemes.tokyoNightDay,
        allThemes.defaultSettingsTokyoNightDay,
    ],
    tokyoNightStorm: [
        allThemes.tokyoNightStorm,
        allThemes.defaultSettingsTokyoNightStorm,
    ],
    tomorrowNightBlue: [
        allThemes.tomorrowNightBlue,
        allThemes.defaultSettingsTomorrowNightBlue,
    ],
    vscodeDark: [allThemes.vscodeDark, allThemes.defaultSettingsVscodeDark],
    xcodeDark: [allThemes.xcodeDark, allThemes.defaultSettingsXcodeDark],
    xcodeLight: [allThemes.xcodeLight, allThemes.defaultSettingsXcodeLight],
};
