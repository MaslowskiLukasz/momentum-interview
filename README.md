# Momentum - Vue  recruitment task

## Description

This is a simple Vue.js application that displays a list of teams and their standings.

## Technologies used

- Vue.js
- Tailwind CSS
- Nuxt.js


# Your task
Currently all the code is stored in the app.vue file.
Your task is to refactor the code and distribute the data across multiple files:
- Create separate pages for teams **list** and **details** views
- Implement a [Pinia store](https://pinia.vuejs.org/core-concepts/) for teams and migrate the data to it
- Add [Nuxt middleware](https://nuxt.com/docs/guide/directory-structure/middleware) to the details page that verifies a team is selected and redirects to the list page if not*
- Create a [Nuxt layout](https://nuxt.com/docs/guide/directory-structure/layouts) containing a top navigation bar and footer*
- Decompose the code into reusable components

*If you're not familiar with Nuxt, you may use navigation guards and component wrappers instead of middleware and layouts.

## Additional tasks
- Implement TypeScript instead of JavaScript
- Add functionality to record new match results (teams may have an unequal number of matches played)


Upload your solution to GitHub and share the link with the recruiter. Remember to keep the repository public. 

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```