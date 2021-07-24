---
title: SpringMVC的父子容器
categories:
 - 后端
tags:
 - spring
---
## SpringMVC的父子容器
在spring整合spring mvc中会产生两个工厂实例，其中一个是另一个的父容器，子容器可以调用父容器中的bean。
### web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--监听器，监听tomcat启动，并在启动的时候创建spring工厂-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <!--创建前端控制器-->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--创建spring mvc工厂-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <!--tomcat启动时加载-->
        <load-on-startup>1</load-on-startup>
    </servlet>


    <!--接受前端所有的请求交给DispatcherServlet去处理-->
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```
当执行完web.xml后，两个工厂就创建成功了。
### 父容器的创建时机：
监听器监听tomcat启动，并在启动的时候创建spring工厂，创建过程是在ContextLoaderListener(上下文监听器)的父类ContextLoader(上下文加载器)中。

ContextLoader类中部分源代码如下
```java
   ....省略
   //初始化Web应用程序上下文,也就是在这里创建spring的父容器
  public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
        //判断父容器是否存在
        if (servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE) != null) {
            throw new IllegalStateException("Cannot initialize context because there is already a root application context present - check whether you have multiple ContextLoader* definitions in your web.xml!");
        } else {
         ...省略
            try {
                //父容器为空
                if (this.context == null) {
                     //创建父容器
                    this.context = this.createWebApplicationContext(servletContext);
                }
              ...省略
              //将父容器放置在servlet域对象中，进行数据共享
              servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
```
从源码中就可以得知，在ContextLoaderListener初始化的时候，会初始化Web应用程序上下文，并在这里创建父容器，进而将父容器放置在servlet域对象中，进行进行数据共享
:::tip ServletContext
servlet上下文。服务器会为每一个工程创建一个对象，这个对象就是ServletContext对象。这个对象全局唯一，而且工程内部的所有servlet都共享这个对象。所以叫全局应用程序共享对象。
:::
### 子容器的创建时机
DispatcherServlet的顶级父类是HttpServlet，是Servlet接口的一个实现类。因此它具有Servlet的生命周期,那么必然会执行生命周期中的init方法
:::tip Servlet中的init
init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用，在后续每次用户请求时不再调用。因此，它是用于一次性初始化.
:::
在init方法的执行链中，有这么一部分源码是用来创建子容器的
```java
  //初始化Web应用程序上下文
 protected WebApplicationContext initWebApplicationContext() {
        //获取父容器
        WebApplicationContext rootContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
        //定义springmvc容器
        WebApplicationContext wac = null;
            //springmvc容器存在
            if (this.webApplicationContext != null) {
             wac = this.webApplicationContext;
             省略...
                ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext)wac;
                if (!cwac.isActive()) {
                    if (cwac.getParent() == null) {
                        //父子容器关系的建立
                        cwac.setParent(rootContext);
                    }

                    this.configureAndRefreshWebApplicationContext(cwac);
                }
            }
        }
        ...省略
        
        //spring mvc容器不存在
        if (wac == null) {
            //创建spring mvc容器，并和spring容器建立父子关系
            wac = this.createWebApplicationContext(rootContext);
        }

         ...省略
             //将子容器放置在servlet域对象中，进行数据共享
            this.getServletContext().setAttribute(attrName, wac);
        }

        return wac;
    }
```
总结：在tomcat启动的时候，会调用DispatcherServlet，它的本质就是Servlet，因此在初始化操作的时候会创建springmvc的工厂，并建立父子容器关系。
## 父子容器相关问题
### 1.为什么需要两个容器？
解耦合。因为springmvc解决的是三层架构中的controller控制层问题，而对于控制层的框架还有struts，因而如果我们想要替换的话，只需要替换springmvc以及相应的xml配置即可。对于spring的容器是不会有影响的。
### 2.bean注入问题
对于父子容器，目的都是对象的创建和属性的注入。所以需要分类注入，也就是web相关的交给springmvc容器。剩下的交给spring容器。便于职责的划分。如果都注入的话，会产生资源的浪费。在父子容器中子容器对父容器是不可见的。因此
从父容器中是无法获取子容器创建的对象。但是在子容器中会先寻找自己容器中是否有这个bean的创建，如果没有会在父容器中去找。
## 参考
这里只是简单分析下spring 和springmvc工厂创建以及父子容器的建立过程，网上有很多比较详细的分析可作为参考
* [spring和springmvc父子容器概念介绍](https://www.cnblogs.com/grasp/p/11042580.html)

* [Spring MVC 原理探秘 - 容器的创建过程](https://blog.csdn.net/dishitu6229/article/details/101857706)
  
* [Spring与SpringMVC父子容器的关系与初始化](https://blog.csdn.net/dhaiuda/article/details/80026354)
  
* [Spring MVC的父子容器](https://blog.csdn.net/rubbertree/article/details/103662797)



