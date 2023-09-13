"use client";

import Console from "./Console";
import Markdown from "./markdown";
import THEMES from "../helpers/themes";
import ProblemInfo from "./ProblemInfo";
import { Problem, User } from "@prisma/client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "split-pane-react/esm/themes/default.css";
import SplitPane, { Pane } from "split-pane-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

const extensions = [python()];

const ProblemEditor = (props: { problem: Problem; author: User }) => {
    const [code, setCode] = useState("");
    const [autosave, setAutosave] = useState(true);
    const [codingTime, setCodingTime] = useState(false);
    const [theme, setTheme] = useState(THEMES.atomone);

    const [fullScreen, setFullScreen] = useState(false);
    const [sizes, setSizes] = useState([250, "30%", "auto"]);

    const [completion, setCompletion] = useState(true);
    const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);

    const editorDivRef = useRef<HTMLDivElement>(null);

    const defaultBoilerplateCode = `def ${
        props.problem.functionName
    }(${props.problem.parameterNames.join(", ")}):\n  pass`;

    useEffect(() => {
        // if full screen is selected resize breif div to take 0 width
        if (fullScreen) {
            return setSizes((sizes) => [0, sizes[1], sizes[2]]);
        }
        setSizes((sizes) => [250, sizes[1], sizes[2]]);
    }, [fullScreen]);

    useEffect(() => {
        editorDivRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const themeName = Object.keys(THEMES).find((key) => {
            return THEMES[key] === theme;
        });
        // if light mode is selected remove auto complete and syntax highlighting
        if (themeName?.toLowerCase().includes("light")) {
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

    const onChange = useCallback((value: string, viewUpdate) => {
        // update code state when code is changed
        setCode(value);
    }, []);

    useEffect(() => {
        if (codingTime && autosave) {
            localStorage.setItem(`${props.problem.id}-editor-code`, code);
        }

        if (!completion || !syntaxHighlighting) {
            return;
        }

        // if global variable or wildcard import is written remove auto complete and syntax highlighting
        if (code.includes("global")) {
            alert(
                "Bro just typed 'global'\nNo more autocomplete and syntaxhighlighting for you"
            );
            setCompletion(false);
            setSyntaxHighlighting(false);
        } else if (
            code.includes(
                "import *"
            ) /* special case for mr sheppard's tkinter code */
        ) {
            alert(
                "C'mon Mr Sheppard! Wildcard imports are NOT allowed here.\nUh Oh there goes your autocompletion and syntax highlighting"
            );
            setCompletion(false);
            setSyntaxHighlighting(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    useEffect(() => {
        const noAutoSave =
            localStorage.getItem(`${props.problem.id}-editor-autosave`) ===
            "false";
        if (noAutoSave) {
            setCode(defaultBoilerplateCode);
            return setAutosave(false);
        }

        const previousCode = localStorage.getItem(
            `${props.problem.id}-editor-code`
        );
        if (previousCode) {
            setCode(previousCode);
        } else {
            setCode(defaultBoilerplateCode);
        }
        setCodingTime(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={editorDivRef}
            className="h-screen snap snap-y snap-mandatory m-1"
        >
            {/* @ts-ignore */}
            <SplitPane
                className="snap-start"
                split="vertical"
                sizes={sizes}
                onChange={setSizes}
            >
                <Pane className="mr-1" minSize="0%" maxSize="45%">
                    <div
                        className="h-screen grid gap-1 grid-rows-2 grid-flow-col w-full mr-1"
                        style={{ gridTemplateRows: "80% 20%" }}
                    >
                        <div className="bg-one rounded-md shadow-xl p-7 pt-0 prose dark:prose-invert h-full overflow-y-scroll no-scrollbar">
                            <div className="sticky bg-one top-0">
                                <h1 className="text-white font-poppinsbold text-2xl drop-shadow-lg pt-7">
                                    {props.problem.title}
                                </h1>
                            </div>
                            <Markdown markdown={props.problem.description} />
                        </div>
                        <div className="bg-one rounded-md shadow-xl p-7 flex flex-col justify-between">
                            <ProblemInfo
                                author={props.author}
                                problem={props.problem}
                            />
                        </div>
                    </div>
                </Pane>
                <div
                    className="h-screen grid grid-rows-3 gap-1 grid-flow-col w-full ml-1"
                    style={{ gridTemplateRows: "5% 65% 30%" }}
                >
                    <div className="bg-one rounded-md shadow-xl flex gap-2 justify-between items-center px-3">
                        <h1 className="font-poppinsbold text-xl text-white">
                            Code Editor
                        </h1>
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="flex items-center p-2 rounded">
                                    <input
                                        type="checkbox"
                                        checked={autosave}
                                        onChange={(e) => {
                                            const newSaveValue = !autosave;
                                            localStorage.setItem(
                                                `${props.problem.id}-editor-autosave`,
                                                newSaveValue ? "true" : "false"
                                            );
                                            setAutosave(newSaveValue);
                                            if (newSaveValue) {
                                                localStorage.removeItem(
                                                    `${props.problem.id}-editor-code`
                                                );
                                            }
                                        }}
                                        className="w-4 h-4 bg-gray-600 border-gray-500"
                                    />
                                    <label className="ml-2 text-md font-poppins rounded text-white">
                                        Save
                                    </label>
                                </div>
                            </div>
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
                            <button onClick={() => setFullScreen(!fullScreen)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 fill-white pr-2"
                                    viewBox="0 0 1920 1920"
                                >
                                    <path
                                        d="M1158.513-.012v123.68h550.5L123.68 1708.878V1158.5H0V1920h761.5v-123.68H211.121l1585.21-1585.21v550.5h123.68V-.011z"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        style={{ background: theme[1].background }}
                        className="overflow-y-scroll no-scrollbar rounded-md shadow-xl h-full"
                    >
                        <CodeMirror
                            className="rounded-md p-2 h-full"
                            theme={theme[0]}
                            value={code}
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
                        <Console problem={props.problem} code={code} />
                    </div>
                </div>
            </SplitPane>
        </div>
    );
};

export default ProblemEditor;
