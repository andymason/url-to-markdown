import { indexHtml } from "./src/index-template.ts";
import { transformHtmlToMarkdown } from "./src/html-to-markdown.ts";
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
                const markdownData = await transformHtmlToMarkdown(
                    urlTextContent,
                    jsonFormat,
                    url,
                );

                const fileName = generateFilename(url, jsonFormat);

                return new Response(markdownData, {
                    headers: addCorsHeaders(
                        new Headers({
                            "content-type": jsonFormat
                                ? "application/json"
                                : "text/plain; charset=utf-8",
                            ...(download
                                ? downloadHeaders(fileName, markdownData.length)
                                : {}),
                        }),
                    ),
                });
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
