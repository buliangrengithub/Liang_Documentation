---
title: spring和mybatis整合
categories:
 - 后端
tags:
 - spring
---
## mybatis编码开发步骤
* 1.实体
  
```java
  public class User implements Serializable {

    private Long id;
    private String name;
    private String password;

    public User() {
    }

    public User(Long id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPaassword(String paassword) {
        this.password = paassword;
    }
}
```
  
* mybatis-config中的配置
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--设置实体别名-->
    <typeAliases>
        <typeAlias type="com.zl.mybatis.pojo.User" alias="user"/>
    </typeAliases>

    <environments default="mysql">
        <environment id="mysql">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>


    <!-- 将我们写好的sql映射文件,一定要注册到全局配置文件（mybatis-config.xml）中 -->
    <mappers>
       <mapper resource="user.xml"/>
    </mappers>
</configuration>
```

* 2.实体别名
  在mybatis-config中配置
```xml
 <!--设置实体别名-->
<typeAliases>
        <typeAlias type="com.zl.mybatis.pojo.User" alias="user"/>
</typeAliases>
```

* 3.表  

创建 user表  

* 4.创建DAO接口
  
```java
public interface UserDAO {
    public void save(User user);
}

```

* 5.实现Mapper文件
  
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.zl.mybatis.dao.UserDAO">
   
    <insert id="save" parameterType="user" >
        insert into user (name,password) values (#{name},#{password})
    </insert>
</mapper>

```

* 6.注册Mapper文件

在mybatis-config中配置
```xml
 <mappers>
       <mapper resource="user.xml"/>
 </mappers>
```
* 7.MybatisAPI调用
```java
public class test {
    public static void main(String[] args) throws IOException {
        InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session = sessionFactory.openSession();
        UserDAO userDao= session.getMapper(UserDAO.class);

        User user = new User();
        user.setName("zl");
        user.setPaassword("123");
        userDao.save(user);
        session.commit();
    }
}

```
## mybatis在开发中存在的问题
1.配置繁琐

主要体现就是别名和注册mapper文件
2.代码冗余
主要体现在MybatisAPI调用中，对于SqlSession的获取，配置是固定不变的

## spring和mybatis整和思路分析
主要是对这些代码做的封装
```java
 InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
 SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
 SqlSession session = sessionFactory.openSession();
 UserDAO userDao= session.getMapper(UserDAO.class);
```
一个是对SqlSessionFactory的封装，一个是SqlSession的封装
## spring于mybatis整合步骤
依赖的引入
```
          <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.3</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.14</version>
        </dependency>
```
applicationContext.xml配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">


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
    <bean id="scanner" class="org.mybatis.spring.mapper.MapperScannerConfigurer" >
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactoryBean"/>
        <!--dao接口所在的包 创建的dao对象是首字母小写的dao接口-->
        <property name="basePackage" value="com.zl.mybatis.dao"/>
    </bean>

</beans>
```
测试：
```java
  @Test
    public void test25(){
      ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/applicationContext.xml");
      UserDAO userDao = (  UserDAO) c.getBean("userDAO");
      com.zl.mybatis.pojo.User user = new com.zl.mybatis.pojo.User();
      user.setPaassword("aaa");
      user.setName("xxx");
      userDao.save(user);
  }
```
## 细节分析
### 在mybatis和spring整合过程中，我们调用新增的方法，但是没有提交事务，为什么能够添加成功呢？

Connection 连接控制着事务，也就是说，谁控制着连接，谁就控制着事务

本质上连接对象是由连接池控制的（dataSource）

#### 1.在mybatis开发中：mybatis提供的连接池对象，创建Connection

在创建连接对象的时候，会将autoCommit设置为false，Connection.setAutoCommit(false),手工控制事务，所以在操作完成后，必须手动提交事务。


#### 2.在整合了spring后：是由Druid提供连接池对象，创建Connection

在创建连接对象的时候，会将autoCommit设置为true，默认也就是true，是自动控制事务，就是在一条sql执行完成后，会自动提交


#### 答案：
在spring整合mybatis开发中，引入了外部的连接池对象，其保持着自动提交事务的机制，也就是Connection.setAutoCommit(true)，
因此，不需要手动提交事务，也能进行事务的提交
#### 注意：
在实际项目开发中，我们依旧会用手动提交，因为会有多条sql一起成功，一起失败的需求。这个事务的问题spring提供了一种很好的实现方案。








