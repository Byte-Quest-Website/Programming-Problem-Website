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
import ProblemMenu from "./ProblemMenu";

const extensions = [python()];

const ProblemEditor = (props: {
    problem: Problem;
    author: User;
    user: User;
}) => {
    const [code, setCode] = useState("");
    const [autosave, setAutosave] = useState(true);
    const [codingTime, setCodingTime] = useState(false);
    const [theme, setTheme] = useState(THEMES.atomone);
    const [tabSize, setTabSize] = useState(4);

    const [fullScreen, setFullScreen] = useState(false);
    const [sizes, setSizes] = useState([250, "30%", "auto"]);

    const [completion, setCompletion] = useState(true);
    const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);

    const editorDivRef = useRef<HTMLDivElement>(null);

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
        const lightModeThemesExtra = [
            "eclipse",
            "bbedit",
            "noctislilac",
            "tokyonightday",
        ];
        if (
            themeName?.toLowerCase().includes("light") ||
            lightModeThemesExtra.includes(themeName?.toLowerCase() ?? "")
        ) {
            alert(
                "You sir have commited a war crime by using light mode\nThere goes your autocomplete"
            );
            setCompletion(false);
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
        const savedTabSize = localStorage.getItem(
            `${props.problem.id}-editor-tabsize`
        );
        if (savedTabSize) {
            setTabSize(Number(savedTabSize));
        }
        const defaultBoilerplateCode = `def ${
            props.problem.functionName
        }(${props.problem.parameterNames.join(", ")}):\n${" ".repeat(
            Number(savedTabSize)
        )}pass`;

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
                        <section className="bg-one rounded-md shadow-xl p-7 pt-0 prose dark:prose-invert h-full overflow-y-scroll no-scrollbar">
                            <div className="sticky bg-one top-0">
                                <h1 className="text-white font-poppinsbold text-2xl drop-shadow-lg pt-7">
                                    {props.problem.title}
                                </h1>
                            </div>
                            <Markdown markdown={props.problem.description} />
                        </section>
                        <section className="bg-one rounded-md shadow-xl p-7 flex flex-col justify-between">
                            <ProblemInfo
                                user={props.user}
                                author={props.author}
                                problem={props.problem}
                            />
                        </section>
                    </div>
                </Pane>
                <div
                    className="h-screen grid grid-rows-3 gap-1 grid-flow-col w-full ml-1"
                    style={{ gridTemplateRows: "5% 65% 30%" }}
                >
                    <section className="bg-one rounded-md shadow-xl flex gap-2 justify-between items-center px-3">
                        <h1 className="font-poppinsbold text-xl text-white">
                            Code Editor
                        </h1>
                        <ProblemMenu
                            autosave={autosave}
                            setAutosave={setAutosave}
                            setTheme={setTheme}
                            setTabSize={setTabSize}
                            fullScreen={fullScreen}
                            setFullScreen={setFullScreen}
                            problemID={props.problem.id}
                            tabSize={tabSize}
                        />
                    </section>

                    <section
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
                                tabSize: tabSize,
                            }}
                        />
                    </section>
                    <section className="bg-one h-full rounded-md shadow-xl p-7 overflow-scroll no-scrollbar">
                        <Console problem={props.problem} code={code} />
                    </section>
                </div>
            </SplitPane>
        </div>
    );
};

export default ProblemEditor;
