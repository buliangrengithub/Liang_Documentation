---
title: AOP的底层实现
categories:
 - 后端
tags:
 - spring
---
## Spring是如何创建动态代理类的？
### 1.jdk的动态代理
动态代理的创建的要素是和前面静态代理是一样的
* 原始类
* 额外功能
* 代理对象和原始对象实现相同的接口

jdk提供了一个Proxy这个类，调用这个类中的静态方法newProxyInstance就可以创建动态代理 
newProxyInstance中需要传入三个参数

#### 参数一：ClassLoader loader
:::tip ClassLoader 类加载器
作用：1.通过类加载器，将对应类的字节码文件加载到虚拟机中  
     2.通过类加载器，创建类的class对象，进而创建这个类的对象

例子：我们需要创建user类的对象，会先开发user类，也就是user.java文件，然后编译成user.class文件，class中存放的就是user类的字节码文件，
     然后通过类加载器将user的字节码文件加载到虚拟机中，也就是类加载器的作用一，在虚拟机中的的字节码会通过类加载器创建对应的class对象，进而
     我们就可以通过new user去创建user对象，也就是类加载器的作用二。

如何获取类加载器：虚拟机会为每个.class文件分配与之对应的ClassLoader，也就是当.java文件编译成.class时，虚拟机就会为其分配一个ClassLoader
:::

在动态代理中:jvm会创建动态代理类进而创建代理对象。

所用的技术：字节码技术，直接将字节码写在了虚拟机中，省略了字节码加载的过程

对应的代码:
```java
 //动态字节码技术：
 public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
```

但是我们没有编写动态代理的.java文件，那么也就不会有.class文件，同样虚拟机也就不会为其分配ClassLoader。那么后续创建对象的过程也就玩不了了。如何解决？

借用：借用一个类加载器，只要是.java文件，就会有类加载器，借用一个作为动态代理类的类加载器，用于完成.class文件的创建

#### 参数二： Class<?>[] interfaces
用于负责：代理对象和原始对象实现相同的接口

可以获取原始对象的.class,因为class文件记录了类中最完整的信息，进而获取原始对象的接口，也就是：

原始对象.getClass().getInterfaces()
#### 参数三： InvocationHandler h
用于负责额外功能：

这是一个接口，接口中提供了一个方法：
```java
package java.lang.reflect;

public interface InvocationHandler {
    /**
    * 作用：用于书写额外功能，并运行在原始方法之前，之后，前后，抛出异常
    * 返回值Object：原始对象的返回值
    * 参数Object proxy：代理对象
    * 参数Method method：额外功能需要添加在的原始方法
    * 参数Object[] args：原始方法的参数
    */
    public Object invoke(Object proxy, Method method, Object[] args) 
    throws Throwable;
}
```
#### 代码演示
```java
public class JdkProxy {
    public static void main(String[] args) {
        //创建原始对象
        UserService userService = new UserServiceImpl();

        //额外功能添加
        InvocationHandler handler = (proxy, method, args1) -> {
            //原始方法运行之前
            System.out.println("———————————————运行之前log———————————————");

            Object invoke = method.invoke(userService, args1); //原始方法运行

            //原始方法运行之后
            System.out.println("———————————————运行之后log———————————————");

            return invoke;
        };
        //创建jdk的动态代理
        UserService newProxyInstance = (UserService) Proxy.newProxyInstance(JdkProxy.class.getClassLoader(), userService.getClass().getInterfaces(), handler);
        newProxyInstance.register(new User());
        newProxyInstance.login("zl","sdsd");
    }
}
```
### 2.Cglib的动态代理
jdk：采用的实现原始对象的接口，来达到既添加额外功能，又调用原始方法

jdk动态代理存在的问题：
如果一个类没有接口的时候，那么就无法床架代理对象

Cglib：采用父子继承创建代理对象，原始类作为父类，代理类作为子类，既可以添加额外功能，又可以调用父类的方法。

类比于jdk的动态代理的创建思路：Cglib的动态代理如下
```java
package com.zl.cglib;
import com.zl.service.UserService.UserService;
import com.zl.service.UserService.impl.UserServiceImpl;
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
public class CglibProxy {
    public static void main(String[] args) {
        //提供原始类
        UserService userService = new UserServiceImpl();

        /**
         *cglib动态代理对象创建
         * 1.类加载器
         * 2.父类
         * 3.额外方法
         */
        Enhancer enhancer = new Enhancer();
        //1.类加载器
        enhancer.setClassLoader(userService.getClass().getClassLoader());
        //2.父类
        enhancer.setSuperclass(userService.getClass());
        //3.额外方法
        enhancer.setCallback((MethodInterceptor) (o, method, objects, methodProxy) -> {
            System.out.println("--------cglib log------------");
            return method.invoke(userService, objects);
        });
        UserService service = (UserService) enhancer.create();
        service.login("sd","fg");
    }
}

```

## Spring工厂是如何加工创建代理对象的？
前面我们通过jdk,cglib动态代理创建了代理类，我们可以直接获取这个代理对象。
但是在spring中，是如何根据原始类id获取代理类的。

是通过BeanPostProcessor，在bean的生命周期，在后置处理器中去做处理。

下面通过代码实现一个简易的aop底层实现，通过原始对象的id获取代理对象
```java
 package com.zl.springProxy;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import java.lang.reflect.Proxy;

public class proxy implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {

        return Proxy.newProxyInstance(bean.getClass().getClassLoader(), bean.getClass().getInterfaces(), (proxy, method, args) -> {
            Object beanProxy= method.invoke(bean, args);
            System.out.println("------------log-----------------");
            return beanProxy;
        });
    }
}

```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
       <bean class="com.zl.springProxy.proxy" id="proxy"/>
       <bean class="com.zl.service.UserService.impl.UserServiceImpl" id="userService"/>
</beans>
```
```java
  @Test
    public void test23(){
      ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/myProxy.xml");
      UserService userService = (UserService) x.getBean("userService");
      userService.login("zl","dgfdf");
  }
```


