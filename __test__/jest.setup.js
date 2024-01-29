import { app, ottoman } from '../src/app'

let instance
beforeAll(async () => {
  try {
    await ottoman.connect({
      bucketName: process.env.DB_BUCKET_NAME,
      connectionString: process.env.DB_CONN_STR,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    })
    // By default start function will wait for indexes, but you can disabled it setting ignoreWatchIndexes to true.
    // It's not required to execute the start method in order for Ottoman work.
    await ottoman.start()

    const port = process.env.APP_PORT
    instance = await app.listen(port)
    console.log('app started')
  } catch (e) {
    console.log(e)
  }
})

afterAll(async () => {
  instance && (await instance.close())
})
