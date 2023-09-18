import React from "react";

const page = async ({ searchParams }: { searchParams: { data: string } }) => {
    const parsedData = JSON.parse(searchParams.data);

    let response;
    try {
        response = await fetch("https://rce.fusionsid.com/runcode", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: searchParams.data,
            cache: parsedData["use_cache"] ? undefined : "no-store",
        });
    } catch {
        return <h1 className="text-white">FAILED TO GET RESPONSE FROM API</h1>;
    }

    let jsonData: { [key: string]: any };
    try {
        jsonData = await response.json();
    } catch {
        return <h1 className="text-white">FAILED TO GET RESPONSE FROM API</h1>;
    }
    if (jsonData["success"] === false) {
        return <pre className="text-white">{jsonData["detail"]}</pre>;
    }

    return (
        <>
            {Object.keys(jsonData["data"]).map((key) => {
                return (
                    <pre key={key} className="text-white">
                        {key}: {JSON.stringify(jsonData["data"][key], null, 4)}
                    </pre>
                );
            })}
        </>
    );
};

export default page;
