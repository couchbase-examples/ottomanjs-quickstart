import {app, ottoman} from '../src/app'

let instance;
beforeEach(async() => {
  try {
    await ottoman.connect({
      bucketName: process.env.CB_BUCKET,
      connectionString: process.env.CB_URL,
      username: process.env.CB_USER,
      password: process.env.CB_PASS,
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

afterEach(async () => {
  instance && await instance.close()
})
