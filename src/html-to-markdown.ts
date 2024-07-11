import {
    DOMParser,
    HTMLDocument,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Readability } from "npm:@mozilla/readability";
import TurndownService from "npm:turndown";
import turndownPluginGfm from "npm:joplin-turndown-plugin-gfm";

interface JSONResponse {
    url: string;
    title: string;
    date: string;
    content: string;
}

type MainArticleContent = NonNullable<ReturnType<Readability["parse"]>>;

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

const parseHtml = (htmlText: string): HTMLDocument => {
    const document = new DOMParser().parseFromString(htmlText, "text/html");
    if (!document) {
        throw new Error("Could not parse HTML");
    }

    return document;
};

const extractArticleContent = (
    document: HTMLDocument,
): MainArticleContent => {
    const mainArticle = new Readability(document).parse();

    if (!mainArticle) {
        throw new Error("Could not find main article");
    }

    return mainArticle;
};

const htmlTextToMarkdown = (html: string): string => {
    return turndownService.turndown(html);
};

const generateMarkdownText = (htmlText: string): string => {
    const document = parseHtml(htmlText);
    const { content, title } = extractArticleContent(document);
    const markdownText = htmlTextToMarkdown(content);

    return `# ${title}\n\n${markdownText}`;
};

const generateJsonData = (htmlText: string, url: string): string => {
    const document = parseHtml(htmlText);
    const { content, title } = extractArticleContent(document);
    const markdownText = htmlTextToMarkdown(content);

    const jsonResponse: JSONResponse = {
        url,
        title,
        date: new Date().toISOString(),
        content: `# ${title}\n\n${markdownText}`,
    };

    return JSON.stringify(jsonResponse, null, " ");
};

export { generateJsonData, generateMarkdownText };
