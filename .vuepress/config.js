const nav = require('./config/nav/')
const sidebar = require('./config/sidebar/')
module.exports = {
  "title": "林子大了",
  "description": "越能体现人性尊严的快乐，越是一种最高级的快乐，我们之所以读书，行路，就是为了我们能够享受高级快乐",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    nav,
    sidebar,
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "subSidebar": 'auto',
    "logo": "/b0dc09c26a6d56bc4cdabdfdd4d22246.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "林子大了",
    "authorAvatar": "/b0dc09c26a6d56bc4cdabdfdd4d22246.jpg",
    // 备案
    "record": '陕ICP备2021001972号-1',
    "recordLink": 'ICP 备案指向链接',
    "cyberSecurityRecord": '公安部备案',
    "cyberSecurityLink": '公安部备案指向链接',
    // 项目开始时间，只填写年份
    "startYear": '2020'
  },
  "markdown": {
    "lineNumbers": true
  },
}