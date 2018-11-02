
const express = require('express')
const path = require('path')
const port = 3000

const users = [{
  name: 'zs',
  password: '123456',
  id: 1
},{
  name: 'ls',
  password: '123456',
  id: 2
},{
  name: 'ww',
  password: '123456',
  id: 3
}]
const posts = [{
  id: 1,
  title: 'hello',
  content: 'hello hello',
  timestamp: Date.now(),
  userid: 1
},{
  id: 2,
  title: 'hello',
  content: 'hello hello',
  timestamp: Date.now() - 100000,
  userid: 1
},{
  id: 3,
  title: 'hello',
  content: 'hello hello',
  timestamp: Date.now() - 200000,
  userid: 1
}]




const app = express()
app.locals.pretty = true
app.set('views', './templates')

app.use((req, res, next) => {
  next()
})



app.use('/static', express.static('./static'))

app.get('/', (req, res, next) => {
  res.render('index.pug', {posts})
})
app.get('/post/:postId', (req, res, next) => {
  var post = posts.filter(it => it.id === req.params.postId)
  if(post){

  }else{

  }
})

app.listen(port, (req, res, next) => {
  console.log('server listen on port' + port)
})

