//导航栏
module.exports = [
    {"text": "主页", "link": "/", "icon": "reco-home"},
    {"text": "时间轴", "link": "/timeline/", "icon": "reco-date"},
    {
        "text": "系列文章", "icon": "reco-message",
        "items": [
            {"text": "java8", "link": "/docs/系列文章/java8/"},
            {"text": "spring5", "link": "/docs/系列文章/spring5/"},
            {"text": "MySQL", "link": "/docs/系列文章/mysql/"}
        ]
    },
    {
        "text": "外链", "icon": "reco-message",
        "items": [
            {"text": "java8", "link": "https://www.docs4dev.com/docs/zh/java/java8/tutorials/getStarted-index.html"},
            {"text": "Spring Framework", "link": "https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/overview.html"},
            {"text": "Spring Boot", "link": "https://www.docs4dev.com/docs/zh/spring-boot/1.5.9.RELEASE/reference/boot-documentation.html"},
            {"text": "其他相关中文文档", "link": "https://www.docs4dev.com/"},
        ]
    },
    {
        "text": "GitHub", "icon": "reco-message",
        "items": [
            {"text": "GitHub", "link": "https://github.com/buliangrengithub", "icon": "reco-github"}
        ]
    }
]