import { Curl } from "node-libcurl";

// Common function to make CURL request to any URL
const fetchData = async (url) => {
    const curl = new Curl();
    curl.setOpt(Curl.option.URL, url);
    curl.setOpt(Curl.option.HTTPGET, 1);

    return new Promise((resolve, reject) => {
        curl.on("end", (statusCode, body) => {
            // Parse the response body into a JavaScript object
            const parsedData = JSON.parse(body);

            // Resolve the promise with the parsed data and the status code
            resolve({ statusCode, data: parsedData });
        });

        curl.on("error", (error) => {
            reject(error);
        });

        curl.perform();
    }).finally(() => {
        curl.close();
    });
}

export default {
    fetchData,
};