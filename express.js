// 在本地部署 express 服务器，启动该项目

// const express = require('express');
import express from 'express' // 用 import 语法导入
const app = express()

app.use(express.static('dist'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

app.listen(8080, () => {
  console.log('App running at http://localhost:8080')
})
