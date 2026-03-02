const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('CodeArena BAckend Running-----')
})

app.listen(port, () => {
  console.log(`codearea running on  ${port}`)
})
