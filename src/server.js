import { app, ottoman } from './app.js'

const IS_CAPELLA = process.env.IS_CAPELLA

if (!IS_CAPELLA) {
  throw new Error(
      'Please define the IS_CAPELLA environment variable inside dev.env. \nSet to \`true\` if you are connecting to a Capella cluster, and \`false\` otherwise.\n'
  )
}

const startApiServer = async() => {
  try {
    if (IS_CAPELLA === 'true') {
      await ottoman.connect({
        bucketName: process.env.CB_BUCKET,
        connectionString: 'couchbases://'+ process.env.CB_URL +'ssl=no_verify',
        username: process.env.CB_USER,
        password: process.env.CB_PASS,

      })
    } else {
      await ottoman.connect({
        bucketName: process.env.CB_BUCKET,
        connectionString: 'couchbase://' + process.env.CB_URL,
        username: process.env.CB_USER,
        password: process.env.CB_PASS,
      })
    }

    // By default start function will wait for indexes, but you can disabled it setting ignoreWatchIndexes to true. 
    // It's not required to execute the start method in order for Ottoman work. 
    await ottoman.start()
    
    const port = process.env.APP_PORT
    app.listen(port, () => {
      console.log(`API started at http://localhost:${port}`)
      console.log(`API docs at http://localhost:${port}/api-docs/`)
    })
  } catch (e) {
    console.log(e)
  }
}

startApiServer()
