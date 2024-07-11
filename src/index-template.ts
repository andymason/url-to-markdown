const indexHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL to Markdown</title>
    <style>
        :root {
            --font-size: 14px;
        }

        @media screen and (min-width: 600px) {
            :root {
                --font-size: 16px;
            }
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background-colour: #161616;
                --text-colour: #ececec;
                --tint-colour: #1e1e1e;
                --invalid-colour: #e1e1e1;
            }
        }

        @media (prefers-color-scheme: light) {
            :root {
                --background-colour: #fefefe;
                --text-colour: #121212;
                --tint-colour: #f8f8f8;
                --invalid-colour: #e1e1e1;
            }
        }

        html {
            font-size: var(--font-size);
            font-family: system-ui, sans-serif;
            background-color: var(--background-colour);
            color: var(--text-colour);
        }

        body {
            margin: 1rem;
        }

        a {
            color: var(--text-colour);
        }

        #app {
            max-width: 600px;
            margin: 0 auto;

            form {
                padding: 0.2rem 1rem;
                background-color: var(--tint-colour);
                border-radius: 0.4rem;
            }

            #url-input {
                display: flex;
                gap: 1rem;
                align-items: stretch;
                flex-wrap: wrap;
            }

            input[type="url"] {
                border: 1px solid var(--text-colour);
                border-radius: 0.2rem;
                flex: 1;
                font-size: 1.1rem;
                min-width: 6rem;
                padding: 0.3rem 0.5rem;

                &:not(:placeholder-shown):invalid {
                    background: var(--invalid-colour);
                }
            }

            #options {
                display: flex;
                justify-content: flex-start;
                gap: 2rem;
            }

            footer {
                border-top: 1px solid var(--tint-colour);
            }
        }
    </style>
</head>

<body>
    <div id="app">
        <header>
            <h1>URL to Markdown</h1>
        </header>

        <main>
            <form action="" method="post">
                <p id="url-input">
                    <input
                        title="URL of the webpage you want to convert"
                        placeholder="https://..."
                        type="url"
                        name="url"
                        id="url"
                        pattern="http(s)?://.*"
                        required
                    />
                    <input type="submit" value="Convert" />
                </p>


                <p id="options">
                    <span>
                        <label for="download" title="Automatically download the converted MarkDown text as a file">Download as file</label>
                        <input type="checkbox" name="download" id="download" />
                    </span>
                    <span>
                        <label for="json" title="Export the converted URL in JSON format">Export as JSON</label>
                        <input type="checkbox" name="json" id="json" />
                    </span>
                </p>
            </form>

            <article>
                <p>
                    A little online tool that takes a URL and converts it to Markdown.
                    I built it so I can quickly get article content as clean markdown text for use in LLM chats.
                    You might find it useful too :)
                </p>

                <p>
                    It works by doing the following:
                </p>

                <ol>
                    <li>Fetch the URL HTML content</li>
                    <li>Extracts the main article content using <a href="https://github.com/mozilla/readability">@mozilla/readability</a>
                    <li>Converts the HTML to Markdown using <a href="https://github.com/mixmark-io/turndown">turndown</a></li>
                    <li>Returns the Markdown content</li>
                </ol>

                <p>Optionally, you can download the converted Markdown as a file or export the converted URL in JSON format.</p>

                <p>The JSON format is as follows:</p>
                <p>
<pre><code>
interface JSONResponse {
    url: string;
    title: string;
    date: string;
    content: string;
}</code></pre>
                </p>
            </article>
        </main>

        <footer>
            <p>Made by <a href="https://coderonfire.com">Andrew Mason</a>. Source code is on <a href="https://github.com/andymason/url-to-markdown">GitHub</a>. Powered by <a href="https://deno.com/deploy">Deno Deploy</a></p>
        </footer>
    </div>
</body>

</html>
`;

export { indexHtml };
