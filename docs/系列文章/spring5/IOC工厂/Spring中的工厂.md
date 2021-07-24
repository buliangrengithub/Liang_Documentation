---
title: Spring中的工厂
categories:
 - 后端
tags:
 - spring
---
## spring中的工厂
在前面的工厂设计模式中，自己实现了一个简单的工厂。接下来，就看看在Spring中，他的核心api的工厂是如何使用的

## spring工厂的简单应用
1.xml的配置，用于告诉spring，我有那些bean需要创建

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="book" class="com.zl.pojo.Book"/>
    <bean id="user" class="com.zl.pojo.User"/>
    <bean id="anthor" class="com.zl.pojo.Anthor"/>
</beans>
```
2.因为是在单元测试中使用工厂，所以是在非web环境下，因此需要使用**ApplicationContext**下的**ClassPathXmlApplicationContext**

```java
    @Test
    public void test4(){
        //获取指定的xml配置文件
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        //获取指定id的bean
        Book book = (Book)c.getBean("book");
        //获取指定类的bean
        Book book1 = c.getBean(Book.class);
        //获取所有的bean的id值
        String[] names = c.getBeanDefinitionNames();
        //获取对应类的id
        String[] beanNamesForType = c.getBeanNamesForType(book.getClass());
        //判断是否存在id的bean,或者name的bean
        boolean res = c.containsBean("book");
        //判断是否存在指定id的bean,不能判断name的bean
        boolean b = c.containsBeanDefinition("book");
        System.out.println(Arrays.toString(names));
    }

```
## 配置文件中需要注意的细节一
不设置id属性
```xml
<bean class="com.zl.pojo.Book"/>
```
```java
 @Test
    public void test5(){
        ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/xx.xml");
        Book bean = x.getBean(Book.class);
        String[] names = x.getBeanDefinitionNames();
        System.out.println(Arrays.toString(names));
        //打印结果
        [com.zl.pojo.Book#0]
    }
```
通过测试，是可以获取到bean的，bean的id也是可以获取到，只不过id是由spring自动帮我们生成。

应用场景：这个bean只需要使用一次的时候是可以省略的，如果这个bean会使用多次，或者被其他bean引用则需要设置id属性
## 配置文件中需要注意的细节二
name属性
```xml
 <bean id="book" name="b1" class="com.zl.pojo.Book"/>
```
在上边的xml中，设置了name属性，代码测试一下
```java
    @Test
    public void test6(){
        ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/xx.xml");
        Book bean =(Book) x.getBean("b1");
        System.out.println(bean);
    }
```
通过测试，是可以获取到bean的，用法和id类似。那么我们就会有疑问，既然有了id为什么还需要name。不言而喻他们肯定有相同点，也有不同点。

name和id的相同点：都可以通过定义的属性名获取对应的bean

name和id的不同点：id是唯一的，只能定义一个，而name值是可以定义多个的。
```xml
 <bean id="book" name="b1,b2,b3" class="com.zl.pojo.Book"/>
```
```java
//判断是否存在bean,可以是name，也可以是id
boolean res = c.containsBean("b1");
//判断是否存在指定id的bean,不能判断name的bean
boolean b = c.containsBeanDefinition("book");
```
## spring工厂的简单原理
在spring中使用工厂创建对象的步骤

1. 首先定义一个bean

2. 创建xml，用于映射bean

3. 创建工厂读取配置文件，获取配置中bean的class路径

4. 根据class路径，通过反射机制创建对象

5. 将创建的对象返回给调用者

**通过反射创建对象就等效与new对象，那么spring是可以调用对象中构造方法的。**
:::tip
反射是可以调用一个类中的public方法，也可以调用private方法
:::

## 误区
在spring中，它提供了工厂可以很便捷的创建对象，那么是不是所有的类都需要spring来进行管理呢？答案是否定的，实体类我们是不会交给spring
管理的，原因是实体类中的属性都是和数据库有关，而spring是不操作数据库的。因而不应该将实体类交给spring，而应该由持久层矿建进行管理。

