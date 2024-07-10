const indexHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>URL to Markdown</h1>

    <form action="" method="post">
        <div>
            <label for="url">URL</label>
            <input type="text" name="url" id="url" />
            <input type="submit" value="Submit" />
        </div>


        <div>
            <label>Download <input type="checkbox" name="download" /></label>
            <label>JSON <input type="checkbox" name="json" /></label>
        </div>
    </form>
</body>

</html>
`;

export { indexHtml };
