import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Readability } from "npm:@mozilla/readability";
import TurndownService from "npm:turndown";
import turndownPluginGfm from "npm:joplin-turndown-plugin-gfm";

const turndownOptions: TurndownService.Options = {
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    preformattedCode: true,
    linkStyle: "referenced",
};

const turndownService = new TurndownService(turndownOptions);
turndownService.use(turndownPluginGfm.gfm);
turndownService.remove(["figure", "img", "iframe"]);

const transformHtmlToMarkdown = (
    htmlText: string,
    jsonFormat = false,
): string => {
    const document = new DOMParser().parseFromString(htmlText, "text/html");
    const mainArticle = new Readability(document).parse();

    if (!mainArticle) {
        throw new Error("Could not parse HTML");
    }

    const { content, title, siteName, publishedTime } = mainArticle;
    const markdownContent = turndownService.turndown(content);

    if (jsonFormat) {
        return JSON.stringify({
            title,
            siteName,
            publishedTime,
            content: `# ${title}\n\n${markdownContent}`,
        });
    }

    return `# ${mainArticle.title}\n\n${markdownContent}`;
};

export { transformHtmlToMarkdown };
