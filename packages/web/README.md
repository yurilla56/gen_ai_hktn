# Google AI Hackathon: Child Weather Assistant Frontend

## Getting Started

- Create the `.env` file with the necessary environment variables (see `.env.example` for reference)
- Install the dependencies: `npm i`
- Run the project: `npm run dev`

## Architecture

```text
├─ public           // static assets.
├─ service          // commands and webpack configurations.
├─ src
│  ├─ assets        // assets such as images or font files.
│  ├─ components    // universal Vue components.
│  ├─ router        // view's routers config.
│  ├─ stores        // Pinia stores.
│  ├─ typings       // typescript .d.ts files.
│  └─ views         // pages.
```

## Technologies

Vue 3, 
Pinia, 
Typescript, 
Webpack, 
Web APIs (MediaDevices, Web Speech API),
Google Maps JavaScript API.