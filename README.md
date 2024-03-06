# Markurl

> Mar-curl :: sounds like marker + mar-girl. Good luck pronouncing it.
> -- Scott

Markurl is a service designed to fetch the contents of a URL in either Markdown or HTML format. It utilizes Playwright to render and extract content from web pages, and offers a simple API for users to specify the output format and CSS selector for content extraction.

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- Docker (for Docker-based installation)

### Cloning the Repository
```sh
git clone https://github.com/ddrscott/markurl.git
cd markurl
```

## Installation
After cloning the repository, install the necessary dependencies by running:
```sh
npm install
```
This will install Express, Playwright, and Turndown among other dependencies as specified in `package.json`.

## Usage
To start the Markurl service, run:
```sh
npm start
```

### API Reference

#### Fetching Content in Markdown
```sh
curl http://localhost:8080/markdown/main/playwright.dev/python/docs/pages
```

#### Fetching Content in HTML
```sh
curl http://localhost:8080/html/main/playwright.dev/python/docs/pages
```

**Parameters:**
- `format`: Either `markdown` or `html`.
- `selector`: CSS selector to find the main content.

## Docker

### Building the Docker Image
```sh
docker build -t markurl:latest .
```

### Running the Docker Container
```sh
docker run -d --name markurl_service -p 8080:8080 markurl:latest
```
Access the service at `http://localhost:8080`.

## License
This project is licensed under the MIT License.
