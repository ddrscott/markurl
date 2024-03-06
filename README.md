# Markurl

> Mar-curl :: sounds like marker + mar-girl. Good luck pronouncing it.

Get contents of a URL as Markdown or HTML.


## Example

```sh
# Get contents of https://playwright.dev/python/docs/pages in Markdown format using 'main' query parameter.
curl https://localhost:8080/markdown/main/playwright.dev/python/docs/pages

# Get contents of https://playwright.dev/python/docs/pages in html format using 'main' query parameter.
curl https://localhost:8080/html/main/playwright.dev/python/docs/pages
```

## API Options

Path convention:
- **first segment**: output format, markdown or html
- **second segment**: CSS selector to find the main content

## Building the Docker Image

To build the Docker image for the "Markurl" service, navigate to the root directory of the project where the `Dockerfile` is located and run the following command:



## Running in Docker
```sh
docker build -t markurl:latest .
```

This command builds a Docker image named `markurl` with the tag `latest` based on the instructions in the `Dockerfile`.

## Running the Docker Container

After the image has been successfully built, you can run a container from the image using the following command:

```sh
docker run -d --name markurl_service -p 8080:8080 markurl:latest
```

This command runs the Docker container in detached mode (`-d`), names the container `markurl_service`, maps port 8080 of the container to port 8080 on the host, and uses the `markurl:latest` image.

You can now access the "Markurl" service by navigating to `http://localhost:8080` in your web browser or using a tool like `curl` to interact with the API.
