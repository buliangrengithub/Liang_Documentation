---
title: spring的基础注解
categories:
 - 后端
tags:
 - spring
---
## 什么是基础注解
是spring在2.x提供的注解，目的在与简化xml的配置，并不能完全替代xml
## 创建对象相关的注解
```xml
<constant:component-scan base-package="com.zl.scan"/>
```
在xml中加入这个配置，用于Spring框架在设置包及其子包中扫描对应的注解，使其生效
### 1.@Component
作用：替换原有Spring配置文件中的bean标签。bean的class属性，是通过反射机制获取注解所在类的权限命名
bean的id属性：默认时类首单词首字母小写
#### 注意细节
1. 显示的指定工厂创建对象的id值
```java
@Component("h")
public class House {
}
```
此时House对象的id值就为h,如果只是@Component，则id为house

2.使用xml配置，覆盖注解
```xml
<bean class="com.zl.scan.House" id="h">
    <property />
</bean>
```
注意，所覆盖的对象必须要注解中的class和id相同,可以属性赋值进行变更
### 2.@Repository，@Service，@Controller
@Component的衍生注解，其本质和@Component一致
#### 为什么要提供这些注解
为了更加准确的表达一个类的作用
#### 注意
在spring整合Mybatis开发中，不使用@Repository，因为不会写Dao的类，Dao的对象由MapperScannerConfig动态创建(动态代理创建出来)
## @Scope
控制简单对象的创建次数

@Scope 只创建一次  
@Scope("singleton") 只创建一次  
@Scope("prototype") 每次调用都会创建  

## @Lazy
用于延迟创建单实例对象，spring在创建工厂的同时会默认创建单实例对象，如果加上@Lazy，会延迟对象的创建，而通过getBean创建

## 生命周期相关注解
```java
@Component
public class House {

    /**
     * 构造方法
     */
    public House() {
        System.out.println("House.House");
    }

    /**
     * 构造方法之后执行
     */
    @PostConstruct
   void init(){
        System.out.println("init");
   }

    /**
     * 销毁之前执行
     */
   @PreDestroy
   void destroy(){
       System.out.println("destroy");
   }
}

```
对于这两个注解，并不是spring提供的，是由JSR(JavaEE规范)520提供的，但是spring很好的兼容了它。

再一次验证了注解实现了接口的契约性
## 属性注入相关的注解 
### 用户自定义类型的注入

dao层
```java
public interface HouseDao {
    public void save();
}

@Repository
public class HouseDaoImpl implements HouseDao{
    @Override
    public void save() {
        System.out.println("save执行");
    }
}
```
service层
```java
public interface HouseService {
    public void save();
}


@Service
public class HouseServiceImpl implements HouseService{
    private HouseDao houseDao;

    //set注入
    @Autowired
    public void setHouseDao(HouseDao houseDao) {
        this.houseDao = houseDao;
    }

    @Override
    public void save() {
        houseDao.save();
    }
}
```
测试
```java
   @Test
    public void test27(){
          ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/scan.xml");
          HouseService houseService = (HouseService) x.getBean("houseServiceImpl");
          houseService.save();
      }
```

#### 基于类型的注入
注入的类型，必须于目标成员变量类型相同或者是其子类(实现类)
#### 基于名字的注入
```java
@Service
public class HouseServiceImpl implements HouseService{
    private HouseDao houseDao;

    @Autowired
    @Qualifier("houseDaoImpl")
    public void setHouseDao(HouseDao houseDao) {
        this.houseDao = houseDao;
    }

    @Override
    public void save() {
        houseDao.save();
    }
}
```
必须@Autowired和@Qualifier搭配使用

其中，注入对象的id，必须和Qualifier注解中设置的名字相同
#### Autowired的放置位置
1.放置在成员变量的set方法上

2.放置在成员变量上：spring通过反射的机制，可以直接为私有变量赋值(注入)

#### javaEE中类似功能的注解
在JRE250中提供了@Resource注解，是基于名字进行注入的
```java
@Resource(name = "houseDaoImpl")
private HouseDao houseDao;
```
如果没有指定名字，Resource会基于类型进行注入
```java
@Resource
private HouseDao houseDao;
```
在JRE230中提供了@Inject注解，是基于类型进行注入的，作用和Autowired一致，但是需要引入额外的jar包
```pom
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```
主要应用于EJB3.0
### jdk类型的属性注入
需要注入的原始对象
```java
@Component
public class House {

    @Value("${id}")
    private Integer id;

    @Value("${name}")
    private String name;
}
```
准备配置文件
```
id=1
name=aa
```
spring工厂进行配置文件读取
```xml
<context:property-placeholder location="classpath:/application.properties"/>
```
测试
```java
    @Test
    public void test27(){
          ClassPathXmlApplicationContext x = new ClassPathXmlApplicationContext("/scan.xml");
          House house = (House) x.getBean("house");
          System.out.println(house);
      }
```
#### 将xml中读取配置文件的方式用注解代替
```java
@Component
@PropertySource("classpath:/application.properties")
public class House {

    @Value("${id}")
    private Integer id;

    @Value("${name}")
    private String name;
    
 }
```
#### 注意细节
1.不能应用于静态成员变量上

2.@value+properties不能注入集合类型，可以通过yaml文件

## 注解扫描
在xml配置中：
```xml
   <constant:component-scan base-package="com.zl.scan"/>
```
base-package指定的包及其子包都会被spring进行注解的扫描。从而完成对象的创建和注入。

但是有时候我们并不需要所有的类都被扫描，因此spring提供了更为细粒度的控制
### 1.排除方式
assignable：
```xml
<constant:component-scan base-package="com.zl.scan">
     <!--assignable:排除特定的类不去扫描-->
     <constant:exclude-filter type="assignable"  expression="com.zl.scan.bean.House"/>
</constant:component-scan>
```
annotation：
```xml
<constant:component-scan base-package="com.zl.scan">
    <!--annotation：排除特定的注解不去扫描-->
    <constant:exclude-filter type="annotation"  expression="org.springframework.stereotype.Service"/>
</constant:component-scan>
```
aspectj：
```xml
<constant:component-scan base-package="com.zl.scan">
    <!--切入点表达式去过滤：只支持包切入点和类切入点-->
    <constant:exclude-filter type="aspectj"  expression="com.zl.scan.bean..*"/>
</constant:component-scan>
```
还有两种不常用的type类型:  
regex:正则表达式  
custom：自定义排除策略，一般应用于底层开发，应用层很少使用。   

叠加使用
```xml
<constant:component-scan base-package="com.zl.scan">
     <!--assignable:排除特定的类不去扫描,并且Service注解不去扫描-->
     <constant:exclude-filter type="assignable"  expression="com.zl.scan.bean.House"/>
    <constant:exclude-filter type="annotation"  expression="org.springframework.stereotype.Service"/>
</constant:component-scan>
```

### 2.包含方式
包含和排除作用范围相反，但用法大致相同
```xml
 <constant:component-scan base-package="com.zl.scan" use-default-filters="false">
       <constant:include-filter type="" expression=""/>
 </constant:component-scan>
```
use-default-filters设置为false，使spring默认扫描的规则失效，采用我们自定义的配置


## 配置互通
可以在加上注解的地方使用xml注入，也可以注入加上注解的对象
##什么情况下使用注解，什么情况下使用配置
在我们日常业务开发中，使用注解创建对象，注入属性

在非程序员开发的类型，我们没法加上注解，就需要进行xml配置






