"use client";

import React from "react";
import { Problem, User } from "@prisma/client";

const ProblemInfo = (props: { author: User; problem: Problem }) => {
    const difficultyColors = {
        EASY: "#A5D76E",
        MEDIUM: "#F6C36F",
        HARD: "#D15559",
    };

    return (
        <>
            <div className="flex text-white items-center justify-between">
                <h1 className="font-poppins">
                    <span className="font-poppinsbold">{"Author: "}</span>
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
                            strokeWidth="2"
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
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h1>{props.problem.timeLimit} seconds</h1>
                <h1>{props.problem.memoryLimit} MB</h1>
            </div>
            <div className="flex items-center justify-between">
                <h1
                    className="font-poppinsbold drop-shadow-glow"
                    style={{
                        color: difficultyColors[props.problem.difficulty],
                    }}
                >
                    DIFFICULTY {props.problem.difficulty}
                </h1>
                <button>Solutions</button>
            </div>
        </>
    );
};

export default ProblemInfo;
