const http = require('http')
const fs = require('fs')
const path = require('path')
const ws = require('ws')
const express = require('express')
const Jimp = require('jimp')

const port = 9095

const app = express()
const server = http.createServer(app)
const wss = new ws.Server({server})

const width = 500
const height = 300

main()

async function main() {

  //若存在缓存图片则读取，若不存在则新建
  let img
  try {
    img = await Jimp.read(path.join(__dirname, './pixel.png'))
  } catch (e){
    img = new Jimp(width, height, 0xffffffff)
  }

  //每隔五秒检查，当图像有更新时才保存，若五秒内图像未更新则不保存
  var lastUpdate = 0
  setInterval(() => {
    var now = Date.now()
    if(now - lastUpdate < 5000){
      img.write(path.join(__dirname, './pixel.png'), () => {
        console.log('data saved!', now)
      })
    }
  }, 5000)

  // 当服务端和客户端连接成功
  wss.on('connection', (ws, req) => {
    img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
      if(err){
        console.log('get buffer err', err)
      }else{
        ws.send(buf)
      }
    })

    // 当收到客户端消息时
    var lastDraw = 0
    ws.on('message', msg => {
      msg = JSON.parse(msg)
      var {x, y, color} = msg
      var now = Date.now()

      if(msg.type == 'drawDot'){
        // 限制点击频率
        if(now - lastDraw < 200){
          return
        }
        if( x >= 0 && y >= 0 && x < width && y < height ){
          lastDraw = now
          lastUpdate = now
          // 在图片上画上用户传来的像素点
          img.setPixelColor(Jimp.cssColorToHex(color), x, y)
          // 将改动广播给所有用户
          wss.clients.forEach(client => {
            client.send(
              JSON.stringify({
                type:'updateDot',
                x, y, color,
              })
            )
          })
        }
      }
    })
  })

  app.use(express.static(path.join(__dirname, './static')))

  server.listen(port, () => {
    console.log('server listening on port', port)
  })
}
