"use client";

import { z } from "zod";
import React from "react";
import { useState } from "react";
import "@radix-ui/themes/styles.css";
import { createNewProblem, NewProblem } from "@/core/helpers/requests";

const CreateProblem = () => {
    const [formData, setFormData] = useState<z.infer<typeof NewProblem>>({
        title: "",
        description: "",
        memoryLimit: 25,
        timeLimit: 1,
        difficulty: "EASY",
        solutionLink: "",
        functionName: "",
        parameterNames: [],
        testsJsonFile: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSliderChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleParameterNamesChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            parameterNames: value.split(",").map((name) => name.trim()),
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setFormData({
            ...formData,
            testsJsonFile: await file.text(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problemId = await createNewProblem(formData);
        console.log(problemId);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create a Problem</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-bold">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-bold">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Memory Limit:</label>
                    <input
                        type="range"
                        name="memoryLimit"
                        min="1"
                        max="50"
                        step="1"
                        value={formData.memoryLimit}
                        onChange={(e) =>
                            handleSliderChange(
                                "memoryLimit",
                                parseInt(e.target.value)
                            )
                        }
                    />
                    <span>{formData.memoryLimit} MB</span>
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Time Limit:</label>
                    <input
                        type="range"
                        name="timeLimit"
                        min="1"
                        max="10"
                        step="1"
                        value={formData.timeLimit}
                        onChange={(e) =>
                            handleSliderChange(
                                "timeLimit",
                                parseInt(e.target.value)
                            )
                        }
                    />
                    <span>{formData.timeLimit} seconds</span>
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Difficulty:</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                    >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="solutionLink" className="block font-bold">
                        Solution Link (Optional):
                    </label>
                    <input
                        type="url"
                        id="solutionLink"
                        name="solutionLink"
                        value={formData.solutionLink}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="functionName" className="block font-bold">
                        Function Name:
                    </label>
                    <input
                        type="text"
                        id="functionName"
                        name="functionName"
                        value={formData.functionName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="parameterNames" className="block font-bold">
                        Parameter Names (comma-separated):
                    </label>
                    <input
                        type="text"
                        id="parameterNames"
                        name="parameterNames"
                        value={formData.parameterNames.join(", ")}
                        onChange={handleParameterNamesChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="testsJsonFile" className="block font-bold">
                        Tests JSON File:
                    </label>
                    <input
                        type="file"
                        id="testsJsonFile"
                        name="testsJsonFile"
                        onChange={handleFileUpload}
                        accept=".json"
                        className="w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateProblem;
