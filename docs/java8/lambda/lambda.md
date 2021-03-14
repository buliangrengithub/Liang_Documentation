---
title: lambda
date: 2021-01-23
categories:
- java 
tags:
- java8
---
## 什么是lambda
可以理解为以一种简洁的能够传递匿名函数的方式，没有名称，但是有参数，函数体，和返回类型。
## 语法
 参数列表 -> 函数体
## lambda案例
```java
 // boolean表达式
 (List<String> list) -> list.size() > 0 
 
  //创建对象
  ()->new User("zhang","20")
  
  //消费对象
  (User user)->{
     System.out.println(user.getAge());
  }
  
  //从对象中抽取
  (User user)->user.getName().length()
  
  //组合两个值
  (int a ,int b)-> a+b
  
  //比较两个值
  (int a,int b)->a.compareTo(b)
  
```
## 在哪里使用，怎么用
在函数接口上使用，将lambda表达式作为参数传入函数式接口中


