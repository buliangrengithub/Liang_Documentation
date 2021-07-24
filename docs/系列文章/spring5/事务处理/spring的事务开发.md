---
title: spring的事务开发
categories:
 - 后端
tags:
 - spring
---
## 什么是事务?
保证业务完整性的一种数据库机制

事务有四个特点：隔离性，原子性，持久性，一致性

## 如何控制事务：
### 对于JDBC：

开启事务(Connection.setAutoCommit(false))

提交事务(Connection.commit())

回滚事务(Connection.rollBack())

其核心就是依赖于Connection连接对象
### 对于Mybatis
mybatis的事务是自动开启的

提交事务(sqlSession.commit())

回滚事务(sqlSession.rollback())

对于Mybatis，其底层也是对Connection进行了封装。
### 总结
事务控制事事务的底层都是基于Connection对象来完成的

事务的控制都需要散步，开启事务，提交事务，回滚事务。

## spring控制事务的开发
spring对于事务的控制是基于aop技术

### 原始对象
```java
public class UserServiceImpl implements UserService{
    private UserDAO userDAO;

    public void setUserDAO(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void register(User user) {
        userDAO.save(user);
    }
}
```
### 额外功能
```xml
<!--额外功能-->
<bean class="org.springframework.jdbc.datasource.DataSourceTransactionManager" id="dataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>
```
### 切入点
```java
@Transactional
public class UserServiceImpl implements UserService{
```
### 组装切面
```xml
<!--组装切面-->
<tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>
```
完整的xml配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!--连接池的配置-->
    <bean class="com.alibaba.druid.pool.DruidDataSource" id="dataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

    <!--创建sqlSessionFactory-->
    <bean class="org.mybatis.spring.SqlSessionFactoryBean" id="sqlSessionFactoryBean">
        <!--连接池-->
        <property name="dataSource" ref="dataSource"/>
        <!--实体别名配置：配置包所在的位置，则别名就是类名-->
        <property name="typeAliasesPackage" value="com.zl.mybatis.pojo"/>
        <!--mapper文件的注册-->
        <property name="mapperLocations">
            <list>
                <!--classpath:就是src路径下的-->
                <value>classpath:com.zl.mybatis/*Mapper.xml</value>
            </list>
        </property>
    </bean>

    <!--创建DAO对象-->
    <bean id="scanner" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactoryBean"/>
        <!--dao接口所在的包 创建的dao对象是首字母小写的dao接口-->
        <property name="basePackage" value="com.zl.mybatis.dao"/>
    </bean>

    <!--原始对象-->
    <bean id="userService" class="com.zl.mybatis.service.UserServiceImpl">
        <property name="userDAO" ref="userDAO"/>
    </bean>

    <!--额外功能-->
    <bean class="org.springframework.jdbc.datasource.DataSourceTransactionManager" id="dataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--组装切面-->
    <tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>

</beans>
```
### 测试
```java
@Test
    public void test26(){
          ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/tx.xml");
          com.zl.mybatis.service.UserService userService = (com.zl.mybatis.service.UserService) x.getBean("userService");

          com.zl.mybatis.pojo.User user = new com.zl.mybatis.pojo.User();
          user.setPaassword("aaaa000");
          user.setName("aaaaaa");
          userService.register(user);
      }
     
```
测试结果：数据库加上了这条数据

验证事务是否加上:通过异常看是否回滚
```java
@Override
    public void register(User user) {
        userDAO.save(user);
        throw new RuntimeException("测试事务异常");
    }
```
```
Creating new transaction with name [com.zl.mybatis.service.UserServiceImpl.register]: 

Rolling back JDBC transaction on Connection [com.mysql.cj.jdbc.ConnectionImpl@1df8da7a]
```









