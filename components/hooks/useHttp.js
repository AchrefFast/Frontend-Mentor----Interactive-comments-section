import React, { useState, useCallback } from "react";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (requestData, analyseData) => {
        setIsLoading(true);
        try {
            const response = await fetch(requestData.url, {
                method: requestData.method ? requestData.method : "GET",
                body: requestData.body ? JSON.stringify(requestData.body) : null,
                headers: requestData.headers ? requestData.headers : {},
            });

            if (!response.ok) {
                throw new Error("Could not load comments!!");
            }

            const data = await response.json();
            analyseData(data);
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
    };
};

export default useHttp;
