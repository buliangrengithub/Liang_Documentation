---
title: spring于持久层框架整合
categories:
 - 后端
tags:
 - spring
---
## spring为什么要整合持久层框架
1.在JavaEE开发中，需要持久层访问数据库操作

2.JDBC,Hibernate,mybatis框架在持久层开发中存在代码冗余

3.spring基于模板设计模式对主流的持久层框架进行封装，简化代码的开发

## spring可以整合的主流框架

1.JDBC:spring提供了JDBCTemplate

2.Hibernate(JPA):spring提供了HibernateTemplate

3.Mybatis:spring提供了sqlSessionFactoryBean,MapperScannerConfigure




