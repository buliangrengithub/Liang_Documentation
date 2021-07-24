---
title: spring中set的注入（Injection）
categories:
 - 后端
tags:
 - spring
---
## 什么是注入
通过spring中的工厂模式和配置文件为所创建的对象进行赋值
## 什么是set注入
通过spring中的工厂模式和配置文件调用set方法为成员变量进行赋值
## 为什么需要注入
```java
  @Test
    public void test7(){
        ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/xx.xml");
        User user = x.getBean(User.class);
        user.setName("zl");
        user.setPassword("123");
        System.out.println(user);
    }
```
通过编码的方式为user类创建对象的成员变量赋值存在耦合。

## 代码实现spring的注入
提供实体对象
::: details User类
```java
public class User {
    private String name;
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

```
:::
在xml中配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user"  class="com.zl.pojo.User">
        <property name="name"><value>zl</value></property>
        <property name="password"><value>123</value></property>
    </bean>
</beans>
```
测试
```java
 @Test
    public void test8(){
        ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/xx.xml");
        User user = x.getBean(User.class);
        System.out.println(user);
    }
```
打印结果
```
[frame] 2021-04-04 23:35:36,640 - 0    DEBUG [main] org.springframework.context.support.AbstractApplicationContext:629  - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@34340fab
[frame] 2021-04-04 23:35:36,867 - 227  DEBUG [main] org.springframework.beans.factory.xml.XmlBeanDefinitionReader:393  - Loaded 1 bean definitions from class path resource [xx.xml]
[frame] 2021-04-04 23:35:36,915 - 275  DEBUG [main] org.springframework.beans.factory.support.DefaultSingletonBeanRegistry:225  - Creating shared instance of singleton bean 'user'
User{name='zl', password='123'}
```
## 注入的好处
解耦合
## set注入的原理（简易版）
对于注入的最终效果就是为成员变量进行赋值，而spring的做法是配置文件加工厂去完成。因此要想不写一行代码的情况下完成，就需要将xml的配置翻译成代码。
对于上边的例子spring是这样翻译的
```
<bean id="user"  class="com.zl.pojo.User" /> =======> User user= new User();

<property name="name"><value>zl</value></property> =======> user.setName("zl");

<property name="password"><value>123</value></property> =======> user.Password("123");
```
由此可见，只要我们提供bean，并在配置中进行映射，spring就会通过读取配置文件，利用反射创建一个对象。只要我们提供set方法，并在配置文件中提供
property的配置，spring就会读取配置文件将property中的value赋值给对应set方法。

## set注入详解之其他类型的属性注入
在上边我们定义了String类型的成员表变量，因此在property标签中我们使用value表示。那么如果是其他类型的该如何表示呢？
:::tip
jdk内置类型：8中基本数据类型 int ,char,long,short,double,float,boolean,byte

引用数据类型：类，如String，数组，接口
:::
## String+八种基本数据类型的set注入
```xml
    <bean id="user"  class="com.zl.pojo.User">
        <property name="name"><value>String+八种基本数据类型</value></property>
    </bean>
```
## 数组的set注入
定义一个数组属性，并提供set方法
```java
private String[] hobbys;
```
xml的配置：使用list标签嵌套value标签
```xml
    <bean id="user"  class="com.zl.pojo.User">
    <property name="hobbys">
        <list>
            <value>篮球</value>
            <value>游泳</value>
        </list>
    </property>
    </bean>
```
## Set集合的set注入
定义一个Set集合属性，并提供set方法
```java
private Set<String> friends;
```
xml的配置：使用set标签嵌套value标签
```xml
    <bean id="user"  class="com.zl.pojo.User">
    <property name="friends">
        <set>
            <value>小明</value>
            <value>小红</value>
        </set>
    </property>
    </bean>
```
由于在Set集合中的泛型是String，所以嵌套的是value标签，但如果不是String，则不能嵌套value
## list的set注入
定义一个List属性，并提供set方法
```java
private List<String> phone;
```
xml的配置：使用List标签嵌套value标签
```xml
    <bean id="user"  class="com.zl.pojo.User">
    <property name="phone">
        <list>
            <value>151149565852</value>
            <value>151149565852</value>
            <value>151149565852</value>
            <value>151149565852</value>
        </list>
    </property>
    </bean>
```
由于在List集合中的泛型是String，所以嵌套的是value标签，但如果不是String+8中基本类型，则不能嵌套value
## Map的set注入
定义一个Map属性，并提供set方法
```java
private Map<String,String> score;
```
xml的配置
```xml
 <property name="score">
    <map>
        <entry>
            <key>
                <value>英语</value>
            </key>
            <value>98</value>
        </entry>
        <entry>
            <key>
                <value>数学</value>
            </key>
            <value>100</value>
        </entry>
        <entry>
            <key>
                <value>语文</value>
            </key>
            <value>88</value>
        </entry>
    </map>
</property>
```
entry代表的是一个键值对，key标签代表的是键，value标签代表的是值
## Properties的set注入
定义一个Properties属性，并提供set方法
```java
private Properties properties;
```
xml的配置：Properties是一个特殊的list，它的key和value都是String类型，因此他的xml如下
```xml
    <bean id="user"  class="com.zl.pojo.User">
    <property name="properties">
        <props>
            <prop key="a">1</prop>
            <prop key="b">2</prop>
            <prop key="c">3</prop>
        </props>
    </property>
    </bean>
```
## 自定义类型的注入一
借用工厂设计模式中的用户注册登录的案例，在UserServiceImpl中对UserDao 进行属性注入

第一步：为userDao添加set方法
```java
public class UserServiceImpl implements UserService {
     
     
   // private UserDao userDao=new UserDaoImpl();
   
   //为成员变量添加set方法
    private UserDao userDao;

    public UserDao getUserDao() {
        return userDao;
    }

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
   
    @Override
    public void register(User user) {
        userDao.save(user);

    }

    @Override
    public void login(String userName, String password) {
        userDao.selectUser(userName,password);
    }
    
}

```
第二步：在xml中进行配置:为UserServiceImpl类中userDao成员变量进行set属性赋值将UserDaoImpl赋值给userDao
```xml
<bean class="com.zl.service.UserService.impl.UserServiceImpl">
        <property name="userDao">
            <bean class="com.zl.dao.impl.UserDaoImpl"></bean>
        </property >
</bean>
```
测试
```java
  @Test
    public void test9(){
        ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/xx.xml");
        UserService userService = x.getBean(UserService.class);
        //登录
        userService.login("zl","123");
        //注册
        User user = new User();
        user.setName("zl");
        user.setPassword("123");
        userService.register(user);
    }
```
等效关系：

`private UserDao userDao;` +`set,get方法`+`xml`+`spring工厂` =`private UserDao userDao=new UserDaoImpl();`
## 自定义类型的注入二
在上边的自定义属性中存在两个问题：

1.如果其他的类也使用了UserDao这个成员变量，在xml中会配置多次UserDao，那么就会出现配置冗余

2.多次配置UserDao，在读取xml中也就会多次创建UserDao，对象的多次创建会浪费（JVM）内存资源

因此我们需要对第一种自定义属性的注入进行改进

改进的地方当然就是xml配置中：
```xml
<beans>
    <bean id="user" class="com.zl.dao.impl.UserDaoImpl"/>
    <bean class="com.zl.service.UserService.impl.UserServiceImpl">
        <property name="userDao">
            <ref bean="user"></ref>
        </property>
    </bean> 
</beans>
```
先定义UserDaoImpl，指定id，然后在需要引用它的时候，通过ref进行引用。这样的好处就是

一：将来如果需要修改UserDaoImpl，只需要修改一处就可以。

二：在读取配置文件的时候UserDaoImpl只创建一次，节省内存资源

## set注入的简化写法
1：基于属性的简化

将value内联到property属性中，适用于8种基本数据类型+String
```xml
 <bean id="user" class="com.zl.pojo.User">
        <property name="name" value="zl"/>
        <property name="password" value="123"/>
</bean>
```
2：基于自定义属性的简化

将ref内联到property属性中
```xml
<beans>
    <bean id="userDao" class="com.zl.dao.impl.UserDaoImpl" />
    <bean class="com.zl.service.UserService.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>
</beans>
```
3：基于命名空间p的简化

在beans中引入 xmlns:p,在bean中应用p:属性进行内联赋值。可以大大简化我们的配置，其中的p就是property的简写。
```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd"
>
    <bean class="com.zl.pojo.Book" p:id="1" p:name="mmd" />


    <bean id="userDao" class="com.zl.dao.impl.UserDaoImpl" />
    <bean class="com.zl.service.UserService.impl.UserServiceImpl" p:userDao-ref="userDao" />
</beans>
```





