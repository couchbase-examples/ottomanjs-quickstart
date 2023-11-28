import { app, ottoman } from "./app.js";


const startApiServer = async () => {
  try {
    await ottoman.connect({
      bucketName: process.env.CB_BUCKET,
      connectionString: process.env.CB_URL,
      username: process.env.CB_USER,
      password: process.env.CB_PASS,
    });

    // By default, the start function will wait for indexes, but you can disable it by setting ignoreWatchIndexes to true.
    // It's not required to execute the start method for Ottoman to work.
    await ottoman.start();

    const port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`API started at http://localhost:${port}`);
      console.log(`API docs at http://localhost:${port}/api-docs/`);
    });
  } catch (e) {
    console.error("Error starting API server:", e.message);
    process.exit(1);
  }
};

startApiServer();
