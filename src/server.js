import { app, ottoman } from './app.js'

const startApiServer = async () => {
  try {
    await ottoman.connect({
      bucketName: process.env.DB_BUCKET_NAME,
      connectionString: process.env.DB_CONN_STR,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    })

    // By default, the start function will wait for indexes, but you can disable it by setting ignoreWatchIndexes to true.
    // It's not required to execute the start method for Ottoman to work.
    await ottoman.start()

    const port = process.env.APP_PORT
    app.listen(port, () => {
      console.log(`API started at http://localhost:${port}`)
    })
  } catch (e) {
    console.error('Error starting API server:', e.message)
    process.exit(1)
  }
}

startApiServer()
