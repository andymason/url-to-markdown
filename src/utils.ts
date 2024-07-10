const downloadHeaders = (filename: string, contentLength: number) => ({
    "content-type": "text/html; charset=utf-8",
    "content-Disposition": `attachment; filename=${filename}`,
    "content-length": contentLength.toString(10),
});

const MAX_HOSTNAME_LENGTH = 20;
const MAX_PATHNAME_LENGTH = 30;

const generateFilename = (url: string, jsonFormat = false) => {
    const { host, pathname } = new URL(url);

    let cleanedHost = host.replace(/www\.?/gi, "");
    cleanedHost = cleanedHost.replace(/[^a-z0-9]+/gi, "");
    cleanedHost = cleanedHost.slice(0, MAX_HOSTNAME_LENGTH);

    let cleanedPathname = pathname.replace(/^\//gi, "");
    cleanedPathname = cleanedPathname.replace(/[^a-z0-9]+/gi, "-");
    cleanedPathname = cleanedPathname.slice(0, MAX_PATHNAME_LENGTH);

    return `${cleanedHost}_${cleanedPathname}.${jsonFormat ? "json" : "md"}`;
};

const fetchHtmlText = async (url: string): Promise<string> => {
    const MAX_SIZE = 3 * 1024 * 1024; // 30 MB limit

    try {
        const validUrl = new URL(url);
        const response = await fetch(validUrl);

        const headResponse = await fetch(url, { method: "HEAD" });
        const contentLength = headResponse.headers.get("content-length");

        if (contentLength && parseInt(contentLength) > MAX_SIZE) {
            throw new Error("Content too large");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("text/html")) {
            throw new Error("Invalid content type! Must be text/html");
        }

        // We've checked the content HEAD size but it could be lying
        const blob = await response.blob();
        if (blob.size > MAX_SIZE) {
            throw new Error(`Page too large. Maximum size is ${MAX_SIZE} MB.`);
        }

        return blob.text();
    } catch (error) {
        console.error("Error fetching HTML text:", error);
        throw error;
    }
};

const addCorsHeaders = (headers: Headers, domain = "*"): Headers => {
    headers.set("Access-Control-Allow-Origin", domain);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    return headers;
};

export { addCorsHeaders, downloadHeaders, fetchHtmlText, generateFilename };
