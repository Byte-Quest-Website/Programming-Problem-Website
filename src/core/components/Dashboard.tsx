"use client";

import { useState, useRef, useEffect } from "react";
import "@radix-ui/themes/styles.css";
import { PieChart } from "react-minimal-pie-chart";
import { User, Solution, Problem } from "@prisma/client";
import Image from "next/image";
import { Avatar } from "@radix-ui/themes";

const Dashboard = (props: {
    user: User;
    solutions: Solution[];
    solvedProblems: Problem[];
    problems: Problem[];
    likedProblems: Problem[];
    dislikedProblems: Problem[];
    problemCount: { EASY: number; MEDIUM: number; HARD: number };
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
    rank: number;
}) => {
    const [showLiked, setShowLiked] = useState(true);
    const dashboardDivRef = useRef<HTMLDivElement>(null);

    const easyPercentage = props.problemCount.EASY / (props.totalEasy / 100);
    const mediumPercentage =
        props.problemCount.MEDIUM / (props.totalMedium / 100);
    const hardPercentage = props.problemCount.HARD / (props.totalHard / 100);

    const pieChartData = [
        {
            title: "Easy",
            value: props.problemCount.EASY,
            color: "#A5D76E",
        },
        {
            title: "Medium",
            value: props.problemCount.MEDIUM,
            color: "#F6C36F",
        },
        {
            title: "Hard",
            value: props.problemCount.HARD,
            color: "#D15559",
        },
    ];

    useEffect(() => {
        dashboardDivRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div className="h-screen">
            <div
                ref={dashboardDivRef}
                className="h-screen grid grid-rows-2 grid-flow-col w-full"
                style={{ gridTemplateRows: "30% 70%" }}
            >
                <div
                    style={{ gridTemplateColumns: "30% 70%" }}
                    className="grid grid-cols-2 w-full"
                >
                    <div className="bg-one m-2 mb-1 mr-1 rounded-xl shadow-xl flex items-center">
                        <div className="flex items-center p-7">
                            {props.user.image !== null ? (
                                <Image
                                    src={props.user.image}
                                    alt={`profile picture for ${props.user.name}`}
                                    width={100}
                                    height={100}
                                    className="rounded-full w-36 mr-3"
                                />
                            ) : (
                                <Avatar
                                    fallback="S"
                                    className="rounded-full w-96 mr-3"
                                />
                            )}
                            <div className="ml-2">
                                <h1 className="font-poppinsbold text-xl text-white">
                                    {props.user.name}
                                </h1>
                                <p className="font-poppins text-white">
                                    Joined:{" "}
                                    {props.user.createdAt.toDateString()}
                                </p>
                                <p className="font-poppins text-white">
                                    Rank: #{props.rank}
                                </p>
                                <p className="font-poppins text-white">
                                    Score: {props.user.score}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-one m-2 mb-1 ml-1 rounded-xl shadow-xl">
                        <div className="flex items-center h-full">
                            <div
                                style={{ gridTemplateColumns: "65% 35%" }}
                                className="grid grid-cols-2 w-full gap-5 p-6 items-center"
                            >
                                <div>
                                    <h1 className="font-poppinsbold text-white text-xl">
                                        Solved Problems
                                    </h1>
                                    <div className="my-2 w-full">
                                        <div className="flex justify-between">
                                            <h2 className="text-white font-poppinsbold">
                                                Easy
                                            </h2>
                                            <h2 className="text-white">
                                                {props.problemCount.EASY}/
                                                {props.totalEasy}
                                            </h2>
                                        </div>

                                        <div className="w-full bg-two h-3 rounded-xl">
                                            <div
                                                style={{
                                                    width: `${
                                                        isNaN(easyPercentage)
                                                            ? "100%"
                                                            : easyPercentage
                                                    }%`,
                                                }}
                                                className={
                                                    "rounded-xl bg-[#A5D76E] h-3"
                                                }
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="flex justify-between">
                                            <h2 className="text-white font-poppinsbold">
                                                Medium
                                            </h2>
                                            <h2 className="text-white">
                                                {props.problemCount.MEDIUM}/
                                                {props.totalMedium}
                                            </h2>
                                        </div>

                                        <div className="w-full bg-two h-3 rounded-xl">
                                            <div
                                                style={{
                                                    width: `${
                                                        isNaN(mediumPercentage)
                                                            ? "100%"
                                                            : mediumPercentage
                                                    }%`,
                                                }}
                                                className={`w-[${mediumPercentage.toString()}%] rounded-xl bg-[#F6C36F] h-3`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="flex justify-between">
                                            <h2 className="text-white font-poppinsbold">
                                                Hard
                                            </h2>
                                            <h2 className="text-white">
                                                {props.problemCount.HARD}/
                                                {props.totalHard}
                                            </h2>
                                        </div>

                                        <div className="w-full bg-two h-3 rounded-xl">
                                            <div
                                                style={{
                                                    width: `${
                                                        isNaN(hardPercentage)
                                                            ? "100%"
                                                            : hardPercentage
                                                    }%`,
                                                }}
                                                className={
                                                    "rounded-xl bg-[#D15559] h-3"
                                                }
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    {props.solvedProblems.length ? (
                                        <PieChart
                                            className="w-44"
                                            data={pieChartData}
                                        />
                                    ) : (
                                        <p className="text-white">
                                            Solve some problems for graph
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{ gridTemplateColumns: "60% 40%" }}
                    className="grid grid-cols-2 w-full h-full"
                >
                    <div className="bg-one m-2 mt-1 mr-1 rounded-xl shadow-xl overflow-y-scroll no-scrollbar">
                        <div className="text-center justify-center sticky top-0 bg-one rounded-2xl">
                            <h1 className="text-white p-5 font-poppinsbold text-2xl">
                                My Problems
                            </h1>
                        </div>
                        <div className="px-5">
                            {props.problems.map((problem) => {
                                return (
                                    <div
                                        key={problem.id}
                                        className="my-3 w-full bg-two h-16 rounded-xl shadow-2xl"
                                    >
                                        {problem.title} {problem.id}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-one m-2 mt-1 ml-1 rounded-xl shadow-xl overflow-y-scroll no-scrollbar">
                        <div className="flex items-center justify-center sticky top-0 bg-one rounded-2xl">
                            <button
                                className={`text-white p-5 font-poppinsbold text-2xl${
                                    !showLiked ? " text-opacity-25" : ""
                                }`}
                                onClick={() => setShowLiked(true)}
                            >
                                Liked Problems
                            </button>
                            <button
                                className={`text-white p-5 font-poppinsbold text-2xl${
                                    showLiked ? " text-opacity-25" : ""
                                }`}
                                onClick={() => setShowLiked(false)}
                            >
                                Disliked Problems
                            </button>
                        </div>
                        <div className="px-5">
                            {showLiked
                                ? props.likedProblems.map((problem) => {
                                      return (
                                          <div
                                              key={problem.id}
                                              className="my-3 w-full bg-two h-16 rounded-xl shadow-2xl"
                                          >
                                              {problem.title}
                                          </div>
                                      );
                                  })
                                : props.dislikedProblems.map((problem) => {
                                      return (
                                          <div
                                              key={problem.id}
                                              className="my-3 w-full bg-two h-16 rounded-xl shadow-2xl"
                                          >
                                              {problem.title}
                                          </div>
                                      );
                                  })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
