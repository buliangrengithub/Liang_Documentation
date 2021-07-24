---
title: AOP注解编程
categories:
 - 后端
tags:
 - spring
---
## 注解编程
注解编程简化了动态代理开发，但是思想和功能以及开发步骤是不变的，只不过换了一种新的实现方式
* 提供原始对象
* 提供额外功能
* 定义切点
* 组装切面
### 开发：
定义切面
```java
package com.zl.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

/**
 * 切面类
 */
@Aspect
public class aspect {

    //切入点函数，切入点表达式
    @Around("execution(* *.login(..))")

    /*
      额外功能
      point：原始方法
      返回：代理类
     */
    public Object round(ProceedingJoinPoint point) throws Throwable {

        Object proceed = point.proceed();
        System.out.println("————————————————log————————————————————");
        return proceed;
    }
}

```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

       <!--原始对象-->
       <bean class="com.zl.service.UserService.impl.UserServiceImpl" id="userService"/>
    <!--切面-->
    <bean class="com.zl.aspect.aspect" id="aspect"/>
    <!--开启aop注解编程->
    <aop:aspectj-autoproxy/>
</beans>
```
### 切入点表达式的复用
利用Pointcut注解，将切入点表达式提取出来，有利于切入点的复用
```java
@Aspect
public class aspect {

    @Pointcut("execution(* *.login(..))")
    public void p(){}
    /*
      额外功能
      point：原始方法
      返回：代理类
     */
    @Around(value = "p()")
    public Object round(ProceedingJoinPoint point) throws Throwable {
        Object proceed = point.proceed();
        System.out.println("————————————————log————————————————————");
        return proceed;
    }
    @Around(value = "p()")
    public Object round1(ProceedingJoinPoint point) throws Throwable {
        Object proceed = point.proceed();
        System.out.println("————————————————事务————————————————————");
        return proceed;
    }
}

测试：
  @Test
    public void test24(){
      ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/aspect.xml");
      UserService userService = (UserService) x.getBean("userService");
      userService.login("zl","dgfdf");
  }
```
### spring对于动态代理的底层实现的切换

jdk动态代理：实现原始对象接口，做新的实现类方式，创建代理对象   
Cglib动态代理：通过继承原始对象，做新的子类方式，创建代理对象  

spring默认情况是基于jdk动态代理实现的

而我们可以通过配置的方式更换动态代理
```xml
<!--proxy-target-class为false时是jdk，为true是时CGLIB-->
 <aop:aspectj-autoproxy proxy-target-class="true"/>
```
### AOP开发中遇到的问题，以及解决方案
在同一个业务类中，进行业务方法中相互调用，在方法内调用的另一个方法往往额外功能是不会生效的，解决方法就是实现获取工厂对象的类

例子：

```java
public class UserServiceImpl implements UserService {


    @Override
    public void register(User user) {
        System.out.println("用户"+user+"注册成功");
        this.login("zl","sdfs");

    }
    
    @Override
    public void login(String userName, String password) {
        System.out.println("登录成功，用户名："+userName+"密码："+password);

    }
}
```
对于这样的实现类，调用register方法，会不会给login添加额外功能

答案是login方法没有添加额外功能，因为register之所以会添加额外功能，是因为register的调用者是代理对象，而login的调用者是this,也就是
UserServiceImpl，所以不会添加额外功能。那如果要为其添加额外功能该如何做：应该是代理对象去调用login方法，那如何获取代理对象，不能直接
在代码中创建工厂，然后去获取，因为spring的工厂是一个重量级资源，一个应用只创建一个工厂。在测试类中已经获取过了工厂，只需要在UserServiceImpl
中获取这个工厂即可.
```java
/**
 * 实现ApplicationContextAware这个接口，用于获取工厂
 */
public class UserServiceImpl implements UserService, ApplicationContextAware {
      private UserService ctx;

    @Override
    public void register(User user) {
        System.out.println("用户"+user+"注册成功");
        ctx.login("zl","sdfs");

    }

    @Override
    public void login(String userName, String password) {
        System.out.println("登录成功，用户名："+userName+"密码："+password);

    }

    /**
     * 获取工厂中的代理对象赋值给ctx
     */
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
      this.ctx =(UserService) applicationContext.getBean("userService");
    }
}

```





