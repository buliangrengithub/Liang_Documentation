---
title: Java API内置的函数式接口
date: 2021-01-23
categories:
- java 
tags:
- java8
---
## 什么是函数式接口
只定义了一个抽象方法的接口成为函数式接口
## api查阅
请移步至[JAVA API](https://www.matools.com/api/java8)进行查阅 _**java.util.function**_包下的接口，可在idea工具中查看接口的源码
# 常用的函数式接口
## Predicate 
Predicate接口定义了一个test的抽象方法，它接受泛型T对象，并返回一个boolean。所以可以在涉及类型T并返回Boolean表达式时使用这个接口
```java
 Predicate<String> filter =(String s)->s.isEmpty();
 boolean test = filter.test(str);
```
其中含有几个默认方法and(&&) ,or(||) ,negate(!) ，这些可以让你重用已有的Predicate来创建更为复杂的谓词。
```java
a.or(b).and(c)

(a||b)&&c
```
总结： T->Boolean
## Consumer 
Consumer 定义了一个accept的抽象方法，它接受一个泛型T，但没有返回值，所以可以在涉及类型T，并对其执行某些操作，就可以使用这个接口
例如for循环
```java
Consumer<Integer> consumer = (Integer i) -> System.out.println(i);
consumer.accept(5);
```
其中含有一个默认方法andThen，返回一个Consumer实例，它意味着将两个Consumer复合起来。
```java
Consumer<Integer> consumer = (Integer i) -> System.out.println(i-1);
Consumer<Integer> then = consumer.andThen((Integer i) -> System.out.println(i+1));
then.accept(5);
```
总结：T->void
## Function
Function接口定义了一个apply方法，它接受一个泛型T并返回一个泛型R的对象，所以可以在涉及类型T，并将T对象的信息映射到输入，就可以使用这个接口，
例如将原始对象转化为VO对象
```java
User user = new User();
user.setAge("21");
user.setName("zhang");
user.setPhone("151");
Function<User, UserVo> userUserVoFunction=(User users)->{
    UserVo userVo = new UserVo();
    userVo.setUserName(users.getName());
    userVo.setUserAge(users.getAge());
    return userVo;
};
UserVo apply = userUserVoFunction.apply(user);
System.out.println(apply.toString());
```
总结：T->R 
## Supplier
Supplier接口定义了一个get方法，它不接受任何参数，但返回一个T类型对象，可以理解为工厂，用来创建对象。

总结：()->T
## UnaryOperator
UnaryOperator接口继承了Function，因此它的抽象方法就是apply,与Function不同的是，它接受一个泛型T并返回一个泛型T的对象

总结：T->T
## BiPredicate
BiPredicate和Predicate有两个相同的参数，不同的是他接受两个泛型对象

总结：(L,R)->boolean
## BiConsumer
BiConsumer和Consumer有相同的功能，不同的是接受两个入参

总结：(T,U)->void
## BiFunction
BiFunction接口和Function有相同的功能，但BiFunction更强大，它的抽象方法接受两个入参对象，T和U，返回一个泛型R对象

总结：(T,U,R)->R






