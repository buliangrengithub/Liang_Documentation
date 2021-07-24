---
title: SpringMVC开发
categories:
 - 后端
tags:
 - spring
---
## SpringMVC整合thymeleaf模板引擎
网上不管是教学视频，还是博客文档，对于springmvc的教程，大多是整合jsp的。而对于thymeleaf的整合基本都是基于SpringBoot的。
因而此篇我就基于springmcv去整合thymeleaf
## 项目目录
![](https://eduzl.oss-cn-beijing.aliyuncs.com/blog/sprig/%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.png)
## 第一版
### 1.配置环境
将工程定义为war包
```xml
 <packaging>war</packaging>
```
引入依赖
```xml
 <dependencies>
        <!--mvc-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.4</version>
        </dependency>
        
        <!--模板引擎-->
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf</artifactId>
            <version>3.0.11.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf-spring5</artifactId>
            <version>3.0.11.RELEASE</version>
        </dependency>

        <!--日志-->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.25</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>

        <!--单元测试-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    
    </dependencies>
```
### 2.配置web.xml
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
### 3.配置springmvc.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:constant="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/util https://www.springframework.org/schema/util/spring-util.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!--包扫描-->
    <constant:component-scan base-package="controller" use-default-filters="false">
        <constant:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </constant:component-scan>

    <!--处理器映射器-->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"
          id="handlerMapping"/>
    <!--处理器适配器-->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"
          id="handlerAdapter"/>
    
    <!--定义模板解析规则-->
    <bean id="templateResolver"
          class="org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver">
        <property name="prefix" value="classpath:/templates/"/>
        <property name="suffix" value=".html"/>
    </bean>

    <!--创建模板引擎实例，并将模板解析规则注入进去-->
    <bean id="templateEngine"
          class="org.thymeleaf.spring5.SpringTemplateEngine">
        <property name="templateResolver" ref="templateResolver"/>
        <property name="enableSpringELCompiler" value="true"/>
    </bean>

    <!--spring视图解析器解析上边定义的模板引擎实例-->
    <bean class="org.thymeleaf.spring5.view.ThymeleafViewResolver">
        <property name="templateEngine" ref="templateEngine"/>
    </bean>
</beans>
```
对于基于RequestMapping的处理器映射器和适配器，spring提供了schema方式以简化配置,可替代这两个bean配置
```xml
<mvc:annotation-driven/>
```
### 4.配置spring.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">


    <!--用于service和持久层bean配置-->

</beans>
```
### 5.控制器
```java
@Controller
public class UserController  {
    @RequestMapping("/hello")
    public String he(Model model){
        model.addAttribute("name","zl");
        return "user";
    }
}

```
#### 6.引擎模板
```html
<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
[[${name}]]
</body>
</html>
```
### 7.浏览器访问

http://localhost:8080/hello

### 注意问题
在spring5中thymeleaf的视图解析器类引入了slf4j。所以如果我们的项目没有引入依赖的化，会报错。部分源码如下
```java
package org.thymeleaf.spring5.view;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ThymeleafViewResolver extends AbstractCachingViewResolver implements Ordered {
    private static final Logger vrlogger = LoggerFactory.getLogger(ThymeleafViewResolver.class);
    public static final String REDIRECT_URL_PREFIX = "redirect:";
    public static final String FORWARD_URL_PREFIX = "forward:";
```
因此需要引入slf4j依赖
```xml
        <!--日志-->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.25</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
```



