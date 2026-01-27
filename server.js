import { createApp } from "./app.js";

const app = createApp();

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
})