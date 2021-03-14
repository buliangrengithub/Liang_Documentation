const nav = require('./config/nav/')
const sidebar = require('./config/sidebar/')
module.exports = {
  "title": "知识库",
  "description": "记录学习，工作，生活中的知识",
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
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "zl",
    "authorAvatar": "/avatar.png",
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