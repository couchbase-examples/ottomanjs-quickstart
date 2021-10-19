import { app, ottoman } from './app.js'

const startApiServer = async() => {
  try {
    await ottoman.connect({
      bucketName: process.env.CB_BUCKET,
      connectionString: process.env.CB_URL,
      username: process.env.CB_USER,
      password: process.env.CB_PASS,
    });
    await ottoman.start();
    const port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`API started at http://localhost:${port}`);
      console.log(`API docs at http://localhost:${port}/api-docs/`);
    });
  } catch (e) {
    console.log(e)
  }
}

startApiServer()
