import { indexHtml } from "./src/index-template.ts";
import {
    generateJsonData,
    generateMarkdownText,
} from "./src/html-to-markdown.ts";
import {
    addCorsHeaders,
    downloadHeaders,
    fetchHtmlText,
    generateFilename,
} from "./src/utils.ts";

Deno.serve(async (request: Request) => {
    switch (request.method) {
        case "GET":
            return new Response(indexHtml, {
                headers: addCorsHeaders(
                    new Headers({ "content-type": "text/html" }),
                ),
            });

        case "POST": {
            try {
                const formData = await request.formData();
                const download = !!formData.get("download");
                const jsonFormat = !!formData.get("json");
                const url = formData.get("url") as string;

                const urlTextContent = await fetchHtmlText(url);

                const headers = new Headers();
                addCorsHeaders(headers);

                let responseText = "";

                if (jsonFormat) {
                    headers.set("content-type", "application/json");
                    responseText = generateJsonData(urlTextContent, url);
                } else {
                    headers.set("content-type", "text/plain; charset=utf-8");
                    responseText = generateMarkdownText(urlTextContent);
                }

                if (download) {
                    const fileName = generateFilename(url, jsonFormat);
                    downloadHeaders(headers, fileName, responseText.length);
                }

                return new Response(responseText, { headers });
            } catch (error) {
                console.error("Error processing request:", error);
                return new Response(
                    `Error processing request: ${error.message}`,
                    {
                        status: 500,
                    },
                );
            }
        }

        case "OPTIONS":
            return new Response(null, {
                headers: addCorsHeaders(new Headers()),
            });

        default:
            return new Response("Invalid HTTP method", {
                status: 405,
            });
    }
});
