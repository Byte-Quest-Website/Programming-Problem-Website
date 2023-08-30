"use client";

import { User, Solution, Problem } from "@prisma/client";
import { PieChart } from "react-minimal-pie-chart";

const Dashboard = (props: {
    user: User;
    solutions: Solution[];
    solvedProblems: (Problem | null)[];
    problems: Problem[];
    problemCount: { EASY: number; MEDIUM: number; HARD: number };
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
}) => {
    // test data
    props.totalEasy = 100;
    props.totalMedium = 100;
    props.totalHard = 100;
    props.problemCount.EASY += 42;
    props.problemCount.MEDIUM += 23;
    props.problemCount.HARD += 13;

    const easyPercentage = props.problemCount.EASY / (props.totalEasy / 100);
    const mediumPercentage =
        props.problemCount.MEDIUM / (props.totalMedium / 100);
    const hardPercentage = props.problemCount.HARD / (props.totalHard / 100);

    const pieChartData = [
        { title: "Easy", value: props.problemCount.EASY, color: "#A5D76E" },
        {
            title: "Medium",
            value: props.problemCount.MEDIUM,
            color: "#F6C36F",
        },
        { title: "Hard", value: props.problemCount.HARD, color: "#D15559" },
    ];

    return (
        <div className="h-screen">
            <div
                className="min-h-screen grid grid-rows-2 grid-flow-col w-full"
                style={{ gridTemplateRows: "30% 70%" }}
            >
                <div
                    style={{ gridTemplateColumns: "30% 70%" }}
                    className="grid grid-cols-2 w-full"
                >
                    <div className="bg-one m-2 mb-1 mr-1 rounded-xl shadow-xl flex items-center">
                        <div className="flex items-center p-7">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={props.user.image!}
                                alt={`profile picture for ${props.user.name}`}
                                className="rounded-full w-36 mr-3"
                            />
                            <div className="ml-2">
                                <h1 className="font-poppinsbold text-xl text-white">
                                    {props.user.name}
                                </h1>
                                <p className="font-poppins text-white">
                                    Joined:{" "}
                                    {props.user.createdAt.toLocaleDateString()}
                                </p>
                                <p className="font-poppins text-white">
                                    Rank: #{4}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-one m-2 mb-1 ml-1 rounded-xl shadow-xl">
                        <div
                            style={{ gridTemplateColumns: "65% 35%" }}
                            className="grid grid-cols-2 w-full gap-5 p-6"
                        >
                            <div>
                                <h1 className="font-poppinsbold text-white text-xl">
                                    Solved Problems
                                </h1>
                                <div className="my-2 w-full">
                                    <h2 className="flex justify-between">
                                        <h2 className="text-white font-poppinsbold">
                                            Easy
                                        </h2>
                                        <h2 className="text-white">
                                            {props.problemCount.EASY}/
                                            {props.totalEasy}
                                        </h2>
                                    </h2>

                                    <div className="w-full bg-two h-3 rounded-xl">
                                        <div
                                            className={`w-[${easyPercentage}%] rounded-xl bg-[#A5D76E] h-3`}
                                        ></div>
                                    </div>
                                </div>
                                <div className="my-2">
                                    <h2 className="flex justify-between">
                                        <h2 className="text-white font-poppinsbold">
                                            Medium
                                        </h2>
                                        <h2 className="text-white">
                                            {props.problemCount.MEDIUM}/
                                            {props.totalMedium}
                                        </h2>
                                    </h2>

                                    <div className="w-full bg-two h-3 rounded-xl">
                                        <div
                                            className={`w-[${mediumPercentage}%] rounded-xl bg-[#F6C36F] h-3`}
                                        ></div>
                                    </div>
                                </div>
                                <div className="my-2">
                                    <h2 className="flex justify-between">
                                        <h2 className="text-white font-poppinsbold">
                                            Hard
                                        </h2>
                                        <h2 className="text-white">
                                            {props.problemCount.HARD}/
                                            {props.totalHard}
                                        </h2>
                                    </h2>

                                    <div className="w-full bg-two h-3 rounded-xl">
                                        <div
                                            className={`w-[${hardPercentage}%] rounded-xl bg-[#D15559] h-3`}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <PieChart
                                    className="w-44"
                                    data={pieChartData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{ gridTemplateColumns: "70% 30%" }}
                    className="grid grid-cols-2 w-full "
                >
                    <div className="bg-one m-2 mt-1 mr-1 rounded-xl shadow-xl">
                        e
                    </div>
                    <div className="bg-one m-2 mt-1 ml-1 rounded-xl shadow-xl">
                        e
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
