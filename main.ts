import { indexHtml } from "./src/index-template.ts";
import { transformHtmlToMarkdown } from "./src/html-to-markdown.ts";
import { downloadHeaders, generateFilename, isValidUrl } from "./src/utils.ts";

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
            if (!isValidUrl(url)) {
                return new Response("Invalid URL provided", {
                    status: 400,
                });
            }

            const urlResponse = await fetch(url);
            const urlTextContent = await urlResponse.text();
            const markdownData = await transformHtmlToMarkdown(
                urlTextContent,
                jsonFormat,
                url,
            );

            const fileName = generateFilename(url, jsonFormat);

            return new Response(markdownData, {
                headers: {
                    "content-type": jsonFormat
                        ? "application/json"
                        : "text/plain",
                    ...(download
                        ? downloadHeaders(fileName, markdownData.length)
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
