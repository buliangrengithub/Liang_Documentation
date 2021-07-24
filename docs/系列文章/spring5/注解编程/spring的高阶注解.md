---
title: spring的高阶注解
categories:
 - 后端
tags:
 - spring
---
## 什么高阶注解
spring的高阶注解是spring3.x以上开始支持的，目的在于彻底替换xml，使用纯注解编程
## 1.配置Bean
配置Bean，可以替换XML的配置文件的全部工作
```java
@Configuration
public class Config {
}

```
对于@Configuration替换的是xml中的Beans标签

测试:对应工厂的创建也发生了改变
```java
@Test
public void test28(){
//配置类的class文件
// AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
//配置类所在的包
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext("com.zl.config");
}
```
## @Configuration本质
本质：也是Component的衍生注解
## @Bean注解
@Bean注解，等同于xml配置中的bean标签
### 创建对象
其中 方法名就为bean标签的id值
```java
@Configuration
public class Config {

    /**
     * 创建简单对象
     */
    @Bean
    public App a(){
       return new App();
    }

    /**
     * 创建复杂对象
     */
    @Bean
    public Connection conn(){
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
#### 自定义id值
```java
@Bean("a")
public App app(){
return new App();
}
```
#### 控制对象创建次数
```java
     @Bean
    @Scope("singleton/prototype")
    public App a(){
       return new App();
    }

```
### @Bean注解的注入
#### 用户自定义类型注入
在service层中注入成员变量dao

dao层
```java
public interface HouseDao {
    public void save();
}

public class HouseDaoImpl implements HouseDao {
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
public class HouseServiceImpl implements HouseService {

    private HouseDao houseDao;

    public void setHouseDao(HouseDao houseDao) {
        this.houseDao = houseDao;
    }

    @Override
    public void save() {
        houseDao.save();
    }
}
```
配置
```java
@Configuration
public class Config {


    @Bean
    public HouseDao houseDao(){
        return new HouseDaoImpl();
    }
    @Bean("h")
    public HouseService houseService(HouseDao houseDao){
        HouseServiceImpl houseService = new HouseServiceImpl();
        houseService.setHouseDao(houseDao);
        return houseService;
    }

    /**
     * 简化写法，直接调用上边创建对象的方法
     */
    @Bean
    public HouseService houseService(){
        HouseServiceImpl houseService = new HouseServiceImpl();
        houseService.setHouseDao(houseDao());
        return houseService;
    }
}
```
测试
```java
    @Test
    public void test28() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext("com.zl.config");
        HouseService h = (HouseService) context.getBean("h");
        h.save();
    }
```
#### JDK类型的注入
```java
public class House {

    private Integer id;


    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "House{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

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
```java
@Bean
    public House house(){
        House house = new House();
        house.setId(1);
        house.setName("aaa");
        return house;
    }
```
## @ComponentScan
在配置bean中使用，等同于xml中的 constant:component-scan 标签，其目的是用于扫描注解(@service,@Autowired...)
```java
@Configuration
//扫描com.zl.componentScan包下的所有基础注解
@ComponentScan(basePackages = "com.zl.componentScan")
public class MyConfig {

}
```
### 排除
```java
@Configuration
@ComponentScan(basePackages = "com.zl.componentScan",
        excludeFilters = {@ComponentScan.Filter(type=FilterType.ANNOTATION,value = Service.class),
        @ComponentScan.Filter(type = FilterType.ASPECTJ,pattern = "*..Look1")
        })
public class MyConfig {

}
```
其中的用法和xml中的一致，FilterType也有五个值，只要是表达式就用pattern，反之用value
### 包含
```java
@Configuration
@ComponentScan(basePackages = "com.zl.componentScan",
        useDefaultFilters=false,
        includeFilters = {@ComponentScan.Filter(type=FilterType.ANNOTATION,value = Service.class),
        @ComponentScan.Filter(type = FilterType.ASPECTJ,pattern = "*..Look1")
        })
public class MyConfig {

}
```
需要关闭默认的包扫描的规则，在自定义自己的规则










