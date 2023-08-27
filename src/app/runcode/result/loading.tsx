"use client";

import React from "react";
import { CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

function Loading() {
    return (
        <div className="h-screen">
            <BeatLoader
                className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                color={"#ffffff"}
                loading={true}
                cssOverride={override}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

const loading = () => {
    return <Loading />;
};

export default loading;
