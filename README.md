<div align="center">

# LUP4LDN — Frontend Dashboard

**Land Use Planning for Land Degradation Neutrality**

Winner · GEO-LDN International Technology Innovation Competition (2021)

[![License: GPL v3](https://img.shields.io/github/license/SCiO-systems/landusetool-frontend)](./LICENSE)
[![Node](https://img.shields.io/badge/node-14.17.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-7.13.0-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/get-npm)

[Live app](https://app.landusetool.org) · [Project site](https://www.landusetool.org)

</div>

---

## About

This repository contains the **frontend dashboard** of LUP4LDN — the web interface
through which stakeholders run a participatory land use planning process for Land
Degradation Neutrality (LDN), evaluate land use and land management transition
scenarios, and read the results against SDG indicator 15.3.1.

The dashboard is built with the
[Diamond-React](https://www.primefaces.org/layouts/diamond-react) application
framework and talks to the LUP4LDN backend API.

> **Looking for the user-facing guide?** End users should start with the LUP4LDN
> User Guide rather than this repository, which is aimed at developers.

## Tech stack

- **React** (Diamond-React application framework)
- **Node.js** 14.17.0 LTS / **npm** 7.13.0 LTS
- **Docker** for containerised builds

---

## Requirements

- **Node.js** v14.17.0 LTS — [Download](https://nodejs.org/)
- **npm** v7.13.0 LTS — [Download](https://www.npmjs.com/get-npm)

## Getting started

### 1. Set up the environment

Using [nodeenv](https://github.com/ekalinin/nodeenv), create an isolated
environment with the required Node version:

```bash
nodeenv --prebuilt -n 14.17.0 env
```

Activate it:

```bash
. env/bin/activate
```

And install the matching npm version:

```bash
npm i -g npm@7.13.0
```

### 2. Install dependencies

```bash
npm install
```

> **Note — Font Awesome icons.** To use Fortawesome icons, create an `.npmrc` file
> and add your token. See the
> [Font Awesome setup instructions](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/using-package-managers).

### 3. Configure

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill in the values. The most important one is **`REACT_APP_API_BASE_URL`**,
which points the dashboard at the LUP4LDN backend API.

### 4. Run locally

```bash
npm start
```

Open [`localhost:3000`](http://localhost:3000) in your browser (it should open
automatically).

---

## Testing

Run the test suite locally:

```bash
npm run test
```

## Docker

Build a Docker image for the project:

```bash
docker build . -t scio-lup4ldn-frontend
```

Run the container:

```bash
docker run -d -p 3000:3000 scio-lup4ldn-frontend
```

## Production build

Generate the production-ready app:

```bash
npm run build
```

The `build` folder will contain all the files needed for deployment.

---

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
before opening an issue or a pull request.

## Security

To report a vulnerability, please follow the process in
[`SECURITY.md`](./SECURITY.md) rather than opening a public issue.

## Support

For help using the tool, contact SCiO at **info@scio.systems**.

---

## License

The source code in this repository is licensed under the **GNU General Public
License v3.0 (GPL-3.0)** — see [`LICENSE`](./LICENSE) for the full text.

This licence covers the **software code only**.

## Name and logo

**"LUP4LDN"™ and the LUP4LDN logo are trademarks of SCiO P.C.** and are **not**
licensed under the GPL. If you fork or redistribute a modified version, you must
give it a **different name** and must **not** use the LUP4LDN name or logo, so that
users can always tell the original, SCiO-maintained LUP4LDN apart from independent
derivatives.

See [`TRADEMARK.md`](./TRADEMARK.md) for the full name and logo policy.

---

<div align="center">

Developed and maintained by **[SCiO P.C.](https://scio.systems)**, Athens, Greece

</div>
