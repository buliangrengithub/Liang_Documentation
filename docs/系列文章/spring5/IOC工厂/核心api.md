---
title: 核心api
categories:
 - 后端
tags:
 - spring
---
## ApplicationContext
spring提供的这个工厂，主要是用于对象的创建，进而对程序进行解耦。

ApplicationContext是一个接口类型。
::: tip
设计接口类型目的是为了屏蔽实现的差异。
:::
ApplicationContext提供了两种环境下的工厂实现

1.web环境下：XmlWebApplicationContext

2.非web环境下：ClassPathXmlApplicationContext （main,单元测试中为非web环境）

### 重量级资源
因为ApplicationContext工厂的对象占用大量的内存。因此我们不会频繁的创建它，一个应用只会创建一个工厂对象。
一个工厂对象会被多次使用，所以就会存在并发（多线程）访问。被并发访问而不想出现问题，一定是存在锁的机制，所以ApplicationContext工厂一定是线程安全的。
