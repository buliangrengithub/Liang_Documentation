//侧边栏
module.exports = {

    "/docs/微信公众号开发/": [
        "",
        "测试号申请",
        "接入微信给公众号平台",
        "微信网页开发",
    ],
    "/docs/系列文章/java8/": [
        "",
        {
            title: '行为参数化',
            collapsable: true,
            children: [
                "行为参数化/",
            ]
        },
        {
            title: 'lambda',
            collapsable: true,
            children: [
                "lambda/lambda",
                "lambda/function_interface",
            ]
        }

    ],
    "/docs/系列文章/spring5/": [
        "",
        {
            title: 'IOC工厂',
            collapsable: true,
            children: [
                "IOC工厂/前言",
                "IOC工厂/工厂设计模式",
                "IOC工厂/核心api",
                "IOC工厂/Spring中的工厂",
                "IOC工厂/日志的整合",
                "IOC工厂/set注入",
                "IOC工厂/构造注入",
                "IOC工厂/控制反转和依赖注入",
                "IOC工厂/spring工厂创建复杂对象",
                "IOC工厂/对象的创建次数",
                "IOC工厂/对象的生命周期",
                "IOC工厂/配置文件参数化",
                "IOC工厂/类型转换器",
                "IOC工厂/后置处理bean",

            ]
        },
        {
            title: 'AOP编程',
            collapsable: true,
            children: [
                "AOP编程/静态代理设计模式",
                "AOP编程/动态代理开发",
                "AOP编程/动态代理详解",
                "AOP编程/AOP编程",
                "AOP编程/AOP的底层实现",
                "AOP编程/AOP注解编程"
            ]
        },
        {
            title: '持久层集成',
            collapsable: true,
            children: [
                "持久层集成/spring于持久层框架整合",
                "持久层集成/spring整合mybatis",
            ]
        },
        {
            title: 'MVC框架集成',
            collapsable: true,
            children: [
                "MVC框架集成/SpringMVC简介",
                "MVC框架集成/SpringMVC开发",
                "MVC框架集成/SpringMVC的父子容器",
                "MVC框架集成/控制器实现细节",
                "MVC框架集成/springMVC拦截器"
            ]
        },
        {
            title: '事务处理',
            collapsable: true,
            children: [
                "事务处理/spring的事务开发",
                "事务处理/spring的事务属性",
            ]
        },
        {
            title: '注解编程',
            collapsable: true,
            children: [
                "注解编程/注解编程",
                "注解编程/Spring的基础注解",
                "注解编程/spring的高阶注解",
                "注解编程/注解配置详解",
                "注解编程/纯注解编程",
                "注解编程/Spring与YML整合"
            ]
        },

    ],
    "/docs/系列文章/mysql/": [
        "",
        {
            title: '基础篇',
            collapsable: true,
            children: [
                "基础篇/命令",
            ]
        }
    ]


}
