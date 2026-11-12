# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Docker

Build the production frontend from this directory with `docker build -f .\dockerfile -t help-desk-frontend:local .`, then run it with `docker run --detach --name help-desk-frontend -p 8081:8080 help-desk-frontend:local`. Nginx runs unprivileged on port 8080, serves the Vite build, falls back to `index.html` for client routes, and proxies `/api/` and `/socket.io/` to `backend:8080`. To use those proxies, connect the frontend and backend containers to the same user-defined Docker network and give the backend the `backend` network alias. The frontend uses same-origin requests and cookies; no `VITE_` secrets or production API URL are needed.
