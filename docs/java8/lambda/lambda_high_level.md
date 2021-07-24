---
title: lambda的高阶用法
date: 2021-01-23
categories:
- java 
tags:
- java8
---
## 类型检查 
lambda可以为函数式接口创建一个实例，但是lambda本身并不包含它在那个函数式接口的任何信息。所以有时会困惑lambda表达式的实例类型是什么，其实lambda
的类型是从lambda的上下文(接受的参数，或接受的局部变量)推断出来的。在java7







