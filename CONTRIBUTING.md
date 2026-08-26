# Contributing to LUP4LDN (frontend)

Thank you for your interest in improving LUP4LDN — the Land Use Planning for
Land Degradation Neutrality tool. This repository contains the frontend
dashboard (React / Diamond-React). The companion backend API lives at
[`SCiO-systems/landusetool-backend`](https://github.com/SCiO-systems/landusetool-backend).

## Before you start

- Check open [Issues](../../issues) to see if your bug or idea is already tracked.
- For anything non-trivial, please open an issue first to discuss the change
  before investing time in a pull request.
- LUP4LDN is licensed under the GNU General Public License v3.0 (see
  `LICENSE`). By contributing, you agree that your contribution will be
  distributed under the same license.

## Reporting a bug

Open a new [Issue](../../issues/new) and include:

1. What you expected to happen, and what happened instead.
2. Steps to reproduce, including the page/screen and any console errors.
3. Browser and OS.
4. Screenshots if the issue is visual.

Please do **not** open a public issue for a security vulnerability — see
`SECURITY.md` instead.

## Proposing a change

1. Fork the repository and create a branch from `main`:
   `git checkout -b fix/short-description`
2. Set up your local environment by following the steps in `README.md`
   (Node v14.17.0 / npm v7.13.0, `.env` configured with
   `REACT_APP_API_BASE_URL` pointing at a running backend).
3. Make your change, keeping it focused — separate unrelated fixes into
   separate pull requests.
4. Follow the existing code style — run `npm run lint` (ESLint) and Prettier
   before committing.
5. Confirm the test suite passes:
   `npm run test`
6. Confirm a production build succeeds:
   `npm run build`
7. Commit with a clear message describing the *why*, not just the *what*.
8. Open a pull request against `main`, describing the change and linking any
   related issue. Screenshots are appreciated for UI changes.

## Review process

A maintainer will review your pull request, may request changes, and will
merge once it is ready. LUP4LDN is used in active deployments (Tunisia,
Burkina Faso, Senegal), so changes to shared views and data-entry flows are
reviewed with real users in mind.

## Getting help

For questions about contributing, email **lup4ldn@scio.systems**.
