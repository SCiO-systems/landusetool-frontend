# SCiO - LUP4LDN Frontend

This dashboard has been developed using [Diamond-React](https://www.primefaces.org/layouts/diamond-react) application framework.

## Requirements

- NodeJS v14.17.0 LTS: [Download](https://nodejs.org/)
- NPM v7.13.0 LTS: [Download](https://www.npmjs.com/get-npm)

### Setup the environment

Using nodeenv:

    nodeenv --prebuilt -n 14.17.0 env

Then activate the environment:

    . env/bin/activate

And install the proper npm version:

    npm i -g npm@7.13.0

### Dependencies

To install the dependencies:

    npm install

**NOTE:** In order to use Fortawesome icons please create an `.npmrc` file and add your TOKEN. See [the instructions](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/using-package-managers).

### Configuration

Copy the `.env.example`:

    cp .env.example .env

and fill all the values (`REACT_APP_API_BASE_URL` is the most important one).

### Development locally

To run the application locally:

    npm start

Open `localhost:3000` in your browser (should open automatically).

### Testing

To test the project locally:

    npm run test

### Build and run using Docker

Build a new Docker image for the project:

    docker build . -t scio-lup4ldn-frontend

Run the project using Docker:

    docker run -d -p 3000:3000 scio-lup4ldn-frontend

### Production

Use `npm run build` to generate the production-ready app. The `build` folder will contain all needed files.
