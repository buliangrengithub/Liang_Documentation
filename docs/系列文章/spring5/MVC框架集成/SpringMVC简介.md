---
title: SpringMVC简介
categories:
 - 后端
tags:
 - spring
---
## 什么是SpringMVC？
是基于spring衍生的mvc框架，主要解决mvc开发模式中的Controller的问题
## 基于spring所带来的好处
1.可以通过工厂创建对象，有利于程序的解耦合

2.通过AOP技术，实现原始类的增强

3.可以很方便的集成第三方框架
## 控制器作用
1.用于业务层的调用

2.接受用户请求，控制程序的运行流程

## 控制器的核心操作流程
1.接受客户端请求

2.调用service对象

3.跳转处理(流程跳转，页面跳转)
## Spring MVC的工作流程
![](https://eduzl.oss-cn-beijing.aliyuncs.com/blog/sprig/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6.png)
* 1.用户发送请求到前端控制器，也就是中央控制器DispatcherServlet.

* 2.DispatcherServlet将请求交给处理器映射器HandlerMapping，处理器映射器会找寻与之匹配的处理器handler(Controller)。生成执行器链(HandlerExecutionChain)
包括处理器和处理器拦截器并返回给DispatcherServlet.

* 3.DispatcherServlet根据处理器handler获取处理器适配器(HandlerAdapter),对于不同实现方式的处理器(Controller)会有不同的适配器。适配器执行一系列操作，比如参数封装，
类型转换，数据校验等。执行完成后返回ModelAndView给DispatcherServlet.

* 4.DispatcherServlet将ModelAndView传给视图解析器(ViewResolver)进行解析，将数据模型填充到View中，解析完成后返回具体的View给DispatcherServlet.

* 5.DispatcherServlet对View进行响应。

## Spring MVC的核心组件
### 1.DispatcherServlet前端控制器
控制整个web操作流程。负责各个组件的调配，它的存在降低了组件间的耦合度
### 2.HandlerMapping处理器映射器
根据用户的请求找到Handler处理器也就是我们开发的controller。spring mvc提供了多种类型处理器映射器，如实现接口方式，注解方式，配置文件方式。
### 3.Handler处理器
也就是我们开发的controller。
### 4.HandlerAdapter处理器适配器
对不同实现方式的Handler处理器进行进行不同的适配处理。
### 5.ViewResolver视图解析器
ViewResolver 负责将处理结果生成 View 视图，ViewResolver 首先根据逻辑视图名解析成物理视图名即具体的页面地址，再生成 View 视图对象，最后对 View 进行渲染将处理结果通过页面展示给用户





