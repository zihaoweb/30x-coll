# 编译代码
```sh
# 开发环境
yarn dev

# 生产环境
yarn build
```

# 打开微信开发者工具
```sh
# 开发环境
node deploy.js

#生产环境
node deploy.js --mode build
```

# 设备二维码的格式
```json
[
  {
    "deviceId": "A2E122EC-8D8C-0E7D-2B38-C745EFFEF98B", // 设备id
    "localName": "H0101202303041101", 
    "name": "H0101202303041101", // 设备的SN码
    "connectable": true, 
    "RSSI": -72, 
    "connect": false,  // 是否已连接设备, 默认false
    "type": "301B(WiFi版)"
  }, 
  {
    "deviceId": "3D4935D4-61DD-BBDD-C83F-15C899F86E67", 
    "connectable": true, 
    "name": "H0201240408002003", 
    "RSSI": -85, 
    "connect": false, 
    "type": "302"
  }
]
```