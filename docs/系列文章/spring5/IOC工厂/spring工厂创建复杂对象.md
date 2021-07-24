---
title: spring工厂创建复杂对象
categories:
 - 后端
tags:
 - spring
---
## 简单对象
在前面的章节中，应用的都是spring创建的简单对象，所谓的简单对象就是可以通过new的构造方法创建
## 复杂对象
对比简单对象，复杂对象就是不能用new构造方法进行创建

例如： 数据库连接对象 Connection和 MyBatis中的SqlSessionFactory

## Spring工厂创建复杂对象之FactoryBean接口
1.实现FactoryBean接口
```java
public class ConnectionFactoryBean implements FactoryBean<Connection> {

    /**
     * 用于书写复杂对象，并将复杂对象返回
     */
    @Override
    public Connection getObject() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC","root","123456");
    }

    /**
     * 返回所创建复杂对象的class对象
     */
    @Override
    public Class<?> getObjectType() {
        return Connection.class;
    }

    /**
     * 只需要创建一次：返回true
     * 每一次调用都需要创建 返回false
     */
    @Override
    public boolean isSingleton() {
        return false;
    }
}
```
2.Spring配置文件的配置
```xml
<bean class="com.zl.factory.ConnectionFactoryBean" id="conn"></bean>
```
3.测试
```java
  @Test
    public void test112(){
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        Connection bean = (Connection) c.getBean("conn");
        System.out.println(bean);
    }
    
    //打印结果：com.mysql.cj.jdbc.ConnectionImpl@4738a206
```
**详解：**

1.如果要获取ConnectionFactoryBean这个接口，只需要这样做
```java
 @Test
    public void test11(){
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        ConnectionFactoryBean bean = (ConnectionFactoryBean) c.getBean("&conn");
        System.out.println(bean);
    }
     //打印结果：com.zl.factory.ConnectionFactoryBean@c8e4bb0
```
2.isSingleton

设置为false时，在每次调用的时候都需要创建
```java
   @Test
    public void test112(){
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        Connection bean = (Connection) c.getBean("conn");
        Connection bean1 = (Connection) c.getBean("conn");
        System.out.println(bean);
        System.out.println(bean1);
    }
    打印结果：  com.mysql.cj.jdbc.ConnectionImpl@18d87d80
                com.mysql.cj.jdbc.ConnectionImpl@618425b5
```
设置为true时，只创建一次
```
打印结果：com.mysql.cj.jdbc.ConnectionImpl@1af2d44a
          com.mysql.cj.jdbc.ConnectionImpl@1af2d44a

```
**如何选择呢？**

如果创建的对象可以被公用，就只创建一次。isSingleton设置为true，如SqlSessionFactory，它是一个重量级资源，占用大量的内存资源。在高并发状态下是线程安全的

如果创建的对象不能被公用，就需要每次使用的时候重新创建。isSingleton设置为false，如Connection连接，因为牵涉事务的提交，为了保证一次提交不被另一次提交影响，因此需要每次使用都创建

3.通过依赖注入 set注入将Connection这个复杂对象进行改造，将代码中硬编码的部分替换掉

提供成员变量，并添加set方法
```java
public class ConnectionFactoryBean implements FactoryBean<Connection> {

    private String className;
    private String url;
    private String userName;
    private String passWord;

    public void setClassName(String className) {
        this.className = className;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    /**
     * 用于书写复杂对象，并将复杂对象返回
     */
    @Override
    public Connection getObject() throws Exception {
        Class.forName(className);
        return DriverManager.getConnection(url,userName,passWord);
    }

    /**
     * 返回所创建复杂对象的class对象
     */
    @Override
    public Class<?> getObjectType() {
        return Connection.class;
    }

    /**
     * 只需要创建一次：返回true
     * 每一次调用都需要创建 返回false
     */
    @Override
    public boolean isSingleton() {
        return true;
    }
}

```
xml中进行属性赋值
```xml
<bean class="com.zl.factory.ConnectionFactoryBean" id="conn">
    <property name="className" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC"/>
    <property name="userName" value="root"/>
    <property name="passWord" value="123456"/>
</bean>
```
在日后的开发中如果需要修改配置，只需要修改配置文件即可。
:::tip
FactoryBean的实现原理【思想层面】

1.为什么Spring要提供一个FactoryBean要我们实现，并且要实现里面的getObject方法

2.为什么通过配置后，通过spring的工厂获得的是复杂对象而没有获取我们的实现类的对象

解释:  创建工厂对象，getBean获取对应的类，Spring会通过instanceof判断是否实现了FactoryBean，如果为false，就表明这是一个简单对象的创建，
如果为true，就表明是一个复杂对象，spring就会调用其实现类中getObject吧，最终获得这个对象返回给我们。

总结：FactoryBean是Spring中提供创建复杂对象的一种方式，也是Spring原生提供的，在Spring整个各大框架的时候会频繁的使用
:::

## Spring工厂创建复杂对象之实例工厂
1.在前面的FactoryBean创建复杂对象的过程中，是存在Spring的侵入的，因为要实现FactoryBean接口，如果将来用其他框架替换Spring时，那么就无法实现这个接口。

2.解决遗留系统问题。就是在一些就旧项目中提供了生成复杂对象的方法。但是我们又想通过spring获取这个复杂对象，那么该如何做呢？

解决思路

假设，这个数据库连接就是已经提供的类
```java
public class ConnectionFactory {


    public Connection getConnection() {
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC", "root", "123456");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

}
```
接下来，就通过配置获取这个复杂对象
```xml
<beans>
    <!--映射到ConnectionFactory这个类-->
    <bean class="com.zl.factory.ConnectionFactory" id="connectionFactory"/>
    <!--通过factory-bean绑定connectionFactory，然后通过factory-method调用这个类的getConnection方法-->
    <bean id="connection" factory-bean="connectionFactory" factory-method="getConnection"/>
</beans>

```
测试
```java
  @Test
    public void test13(){
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        Connection connection = (Connection) c.getBean("connection");
        System.out.println(connection);
    }
```



## Spring工厂创建复杂对象之静态工厂
静态工厂和实例工厂的区别在于方法是否是静态的，相应的配置文件会发生变化

类比于实例工厂：
```java
public class StaticConnectionFactory {
    public static Connection getStaticConnection() {
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lin-cms?serverTimezone=UTC", "root", "123456");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

}
```

xml配置
```xml
<bean class="com.zl.factory.StaticConnectionFactory" id="staticConnectionFactory" factory-method="getStaticConnection"/>

```


测试
```java
 @Test
    public void test14(){
        ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext("/xx.xml");
        Connection connection = (Connection) c.getBean("staticConnectionFactory");
        System.out.println(connection);
    }
```
