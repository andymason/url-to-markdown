import { indexHtml } from "./index-template.ts";
import { transformHtmlToMarkdown } from "./html-to-markdown.ts";
import { downloadHeaders, generateFilename, isValidUrl } from "./utils.ts";

Deno.serve(async (request: Request) => {
    switch (request.method) {
        case "GET":
            return new Response(indexHtml, {
                headers: { "content-type": "text/html" },
            });

        case "POST": {
            const formData = await request.formData();
            const download = !!formData.get("download");
            const jsonFormat = !!formData.get("json");

            const url = formData.get("url") as string;
            if (!url || !isValidUrl(url)) {
                return new Response("Invalid URL provided", {
                    status: 400,
                });
            }

            const urlResponse = await fetch(url);
            const urlTextContent = await urlResponse.text();
            const markdownData = await transformHtmlToMarkdown(
                urlTextContent,
                jsonFormat,
            );

            return new Response(markdownData, {
                headers: {
                    "content-type": jsonFormat
                        ? "application/json"
                        : "text/plain",
                    ...(download
                        ? downloadHeaders(
                            generateFilename(url, jsonFormat),
                            markdownData.length,
                        )
                        : {}),
                },
            });
        }

        default:
            return new Response("Invalid HTTP method", {
                status: 405,
            });
    }
});
