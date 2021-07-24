---
title: Spring Framework
date: 2021-01-23
categories:
- 后端
tags:
- Spring
---
# 分层架构图
![](https://eduzl.oss-cn-beijing.aliyuncs.com/blog/sprig/5-1Z606104H1294.gif)

# 架构图解析
## 1. Data Access/Integration（持久层）
数据访问/集成层
* JDBC 模块：提供了一个 JDBC 的抽象层，消除了烦琐的JDBC编码和数据库厂商特有的错误代码解析，大幅度减少了在开发过程中对数据库操作的编码。
* ORM 模块：对流行的对象关系映射 API，包括 JPA(Hibernate) 和 MyBatis 提供了的集成层。
* OXM 模块：提供了一个支持对象/XML 映射的抽象层实现， 将 java 对象映射成 XML 数据， 或者将 XML 数据映射成 java 对象。
* JMS 模块：指 Java 消息服务，指Java消息传递服务，包含用于生产和使用消息的功能。
* Transactions 事务模块：支持编程和声明式事务管理。
## 2.web（表现层）
* websocket 模块：Spring4.0以后新增的模块，实现双工异步通讯协议，实现了WebSocket和SocketJS，提供Socket通信和web端的推送功能。

* Servlet 模块：也称为spring-webmvc 模块，包含用于web应用程序的Spring MVC和REST Web Services实现。Spring MVC框架提供了领域模型代码和Web表单之间的清晰分离，并与Spring Framework的所有其他功能集成。

* web 模块：提供了基本的Web开发集成功能，包括使用Servlet监听器初始化一个IOC容器以及Web应用上下文，自动载入WebApplicationContext特性的类，Struts集成类、文件上传的支持类、Filter类和大量辅助工具类。

* portlet 模块：实现web模块功能的聚合，类似于Servlet模块的功能，提供了Portlet环境下的MVC实现。

* webflux 模块：是一个新的非堵塞函数式 Reactive Web 框架， 可以用来建立异步的， 非阻塞，事件驱动的服务， 并且扩展性非常好。

## 3.AOP（面向切面编程）
aop 模块：是 Spring 的另一个核心模块，提供了一个符合 AOP 要求的面向切面的编程实现。 是OOP（面向对象编程）的有益的补充。 在 Spring 中， 以动态代理技术为基础，允许定义方法拦截器和切入点，将代码按照功能进行分离，以便干净地解耦。
## 4.spects
aAspectJ是一个面向切面的框架，它扩展了Java语言。AspectJ定义了AOP语法，它有一个专门的编译器用来生成遵守Java字节编码规范的Class文件。
## 5.instrument
是 AOP 的一个增强模块， 提供了类植入（Instrumentation）支持和类加载器的实现，可以在特定的应用服务器中使用。主要作用是在 JVM 启用时， 生成一个代理类， 程序员通过代理类在运行时修改类的字节， 从而改变一个类的功能， 实现 AOP 的功能。
## 6.Messaging
消息模块：该模块提供了对消息传递体系结构和协议的支持。
## 7.Core Container(核心容器)
它是其他模块建立的基础 
* core 模块：提供了框架的基本组成部分，包括控制反转（Inversion of Control，IOC）和依赖注入（Dependency Injection，DI）功能。

* beans 模块：提供了BeanFactory，是工厂模式的一个经典实现，Spring将管理对象称为Bean。

* context 模块：建立在Core和Beans模块的基础之上，提供一个框架式的对象访问方式，是访问定义和配置的任何对象的媒介。ApplicationContext接口是Context模块的焦点。并支持整合第三方库到Spring应用程序上下文，特别是用于高速缓存（EhCache、JCache）和任务调度（CommonJ、Quartz）的支持。

* SpEL 模块：提供了强大的表达式语言去支持运行时查询和操作对象图。这是对JSP2.1规范中规定的统一表达式语言（Unified EL）的扩展。该语言支持设置和获取属性值、属性分配、方法调用、访问数组、集合和索引器的内容、逻辑和算术运算、变量命名以及从Spring的IOC容器中以名称检索对象。它还支持列表投影、选择以及常用的列表聚合。
## 8：Test（测试模块）
test模块主要为测试提供支持的，支持使用JUnit或TestNG对Spring组件进行单元测试和集成测试。

# 本系类包含的内容
![](https://eduzl.oss-cn-beijing.aliyuncs.com/blog/sprig/spring.png)

# 参考学习教程
以下是我搜集的一些关于spring入门级的系列教程，可参考学习

* [《慕课教程》](http://www.imooc.com/wiki/springlesson/)

* [《spring官网中文版》](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/overview.html)

* [《w3c school教程》](https://www.w3cschool.cn/wkspring/pesy1icl.html)

* [《C语言中文网教程》](http://c.biancheng.net/view/4241.html)

* [《廖雪峰官网教程》](https://www.liaoxuefeng.com/wiki/1252599548343744/1266263217140032)

* [《江南一点雨教程》](http://spring.javaboy.org/2019/1010/spring-info)