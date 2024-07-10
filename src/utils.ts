const downloadHeaders = (filename: string, contentLength: number) => ({
    "content-type": "text/html; charset=utf-8",
    "content-Disposition": `attachment; filename=${filename}`,
    "content-length": contentLength.toString(10),
});

const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (_e) {
        return false;
    }
};

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

export { downloadHeaders, generateFilename, isValidUrl };
