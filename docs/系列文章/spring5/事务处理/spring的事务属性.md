---
title: spring的事务属性
categories:
 - 后端
tags:
 - spring
---
## 什么是事务属性
属性：描述物体特征的一系列值  
人：性别，身高，体重...

事务属性：描述事务特征的一系列值。  
隔离属性 ,传播属性 只读属性, 超时属性, 异常属性

## 如何设置事务属性
在@Transactional(属性="对应属性的值")

## 事务属性详解
### 隔离属性
#### 1.概念
他描述的是事务解决并发问题的特征
:::tip 什么是并发
多个事务（用户），同一时间，访问操作了相同的数据

同一时间：会有0.000几秒的差异。但都属于同一时间
:::
#### 2.并发会产生什么问题以及如何解决？

##### **脏读**
一个事务，读取了另一个事务中没有提交的数据。会在本事务中产生数据不一致的问题。

解决方案：设置隔离属性 @Transactional(isolation = Isolation.READ_COMMITTED)
#####  **不可重复读**
一个事务中，多次读取相同的数据，但是读取的结果不一致，会在事务中产生数据不一致的问题

注意：不是脏读，是在一个事务中读取了多次已经提交的数据。

解决方案：设置隔离属性  @Transactional(isolation = Isolation.REPEATABLE_READ)

底层.REPEATABLE_READ：就是在数据库中添加了一把行锁。

##### **幻影读**
在一个事务中，多次对整表进行查询统计，但是结果不一样，会在本事务中产生数据不一致的问题。

解决方案：设置隔离属性  @Transactional(isolation = Isolation.SERIALIZABLE)

底层.SERIALIZABLE：就是在数据库中添加一个表锁

##### **总结**
通过隔离属性解决。在隔离属性中设置不同的值，解决并发处理中的问题。

并发的安全级别为：SERIALIZABLE>REPEATABLE_READ>READ_COMMITTED

运行效率：READ_COMMITTED>REPEATABLE_READ>SERIALIZABLE

::: tip 注意
不是所有的数据库都支持这些隔离属性的值

MySQL中是全部支持，但是Oracle不支持REPEATABLE_READ,也就是重复读，但它有自己的解决方案,采用的是多版本比对的方式
:::
#### 3.默认隔离属性
在我们没有手动设置隔离属性时，spring为我们自动加上了一个默认值

DEFAULT: 会调用不同数据库所设置的默认隔离属性

MySQL：REPEATABLE_READ 
:::tip 查看数据库默认隔离属性 MySQL8版本
select @@transaction_isolation;
:::

Oracle： READ_COMMITTED 
#### 4.在实战中的选择
选择spring默认的隔离属性即可

在没有海量用户的前提下，并发的可能性很低，但并不代表不会发生，对于一个可能性很低的并发而选择加锁，必然会影响系统运行的效率。

如果遇见了并发情况，也不是采用加锁，加物理锁解决，而是采用乐观锁（应用所）进行解决，乐观锁不会过多的影响数据库的效率

:::tip 乐观锁应用
JPA(Hibernate): 通过Version 版本比对进行解决

Mybatis:自定义拦截器进行版本比对
:::
### 传播属性
#### 1.概念
描述了事务解决嵌套问题的特征
:::tip 嵌套问题是什么?
嵌套：在一个事务中存在多个事务

什么时候会有嵌套：service调用service的情况下。

嵌套产生的问题：大事务中融入了若干个小事务，他们彼此影响，最终导致外部大的事务，丧失了事务的原子性

嵌套的解决方案：通过传播属性解决

:::
#### 2.传播属性(propagation)的值的含义
用法@Transactional(propagation = Propagation.传播属性的值)

| 传播属性的值      | 外部不存在事务 |外部存在事务 |应用|
| ----------- | ----------- | ----------- | -----------|
| REQUIRED | 开启新的事务 |  融合到外部事务中 |增删改方法中|
| SUPPORTS | 不开启新的事务 | 融合到外部事务中 |查询方法中|
| REQUIRES_NEW | 开启新的事务 |挂起(暂停)外部事务，创建新的事务 | 日志记录，外部事务异常不会影响日志的插入|
| NOT_SUPPORTED | 不开启新的事务 |  挂起外部事务 | 不常用|
| NEVER  | 不开启新的事务 | 抛出异常 |不常用|
| NESTED | 抛出异常 | 融合到外部事务中 |不常用|

#### 3.传播属性的默认值
REQUIRED为传播属性的默认值

在增删改方法中推荐使用默认值

在查询方法中使用SUPPORTS

### 只读属性
对于查询方法操作，加上只读属性，会提高系统的运行效率

推荐使用： @Transactional(propagation = Propagation.SUPPORTS,readOnly = true)

### 超时属性
解释：指定了事务等待的最长时间

产生原因：当前事务访问数据时，有可能访问的数据被别的事务进行了加锁的处理，因此，本事务就需要等待

等待时间：以秒为单位，如果超时就会抛出异常

应用：@Transactional(timeout = 2) ，超时时间为2秒

默认：-1，也就是最终由数据库决定

推荐：默认值
### 异常属性
解释：对产生的异常进行回滚还是提交

应用：@Transactional(rollbackFor = {对应异常的.class}) 回滚  
应用：@Transactional(noRollbackFor = {对应异常的.class}) 不回滚

默认 ：spring对于RuntimeException(运行时异常)以及子类采用的是回滚的策略

默认 ：spring对于Exception(运行时异常)以及子类采用的是提交事务的策略

推荐：使用默认值，也就是RuntimeException(运行时异常)以及子类

## 事务属性常见配置总结
1.隔离属性 默认值

2.传播属性 Required(默认值) 增删改   Supports 查询

3.只读属性 readOnly false(默认) 增删改   true 查询

4.超时属性 默认值 -1

5.异常属性 默认值 RuntimeException回滚，Exception提交

对于增删改  @Transactional

对于查询  @Transactional(propagation = Propagation.SUPPORTS,readOnly = true)

## 注意
对于事务属性的配置，spring提供了多种配置方式，除了注解外，还有一种比较常用的方式是基于xml配置的方式。