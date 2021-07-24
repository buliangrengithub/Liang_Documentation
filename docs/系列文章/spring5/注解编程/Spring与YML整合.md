---
title: Spring与YML整合
categories:
 - 后端
tags:
 - spring
---
## 什么是YML
yml是一种新的配置文件，比xml简单，比properties强大

## properties配置中存在的问题
1.properties表达过于繁琐，无法表达数据的内在联系

2.无法表达对象，集合类型

## yml语法
### yml文件的创建
是以yml结尾或者yaml结尾，例如，a.yml,b.yaml
### 语法1：基本语法
```
name: a    
password: b   
```
冒号后必须跟空格   
### 语法2：对象
```
user：   
 id： 1    
 password： 123   
```
其中user为对象，id和password为属性，属性必须缩进
### 语法三：集合
```
ids：   
 - 111   
 - 222   
 - 333   
 ```
其中集合中每个元素前以-开头，并且必须缩进
## spring与yaml的整合
spring默认是不支持yaml的，需要我们手动开发。
### spring整合properties的过程
```xml
 <bean class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer" id="configurer">
        <property name="properties" value="classpath:/db.properties"/>
 </bean>
```
通过PropertySourcesPlaceholderConfigurer这个类去读取文件。并和@Value注解配合，进行jdk类型的注入，将配置文件中的值注入给相应对象的成员变量。
在PropertySourcesPlaceholderConfigurer读取文件的时候，需要对配置文件中的数据进行封装，而具体的封装是基于properties集合。
### 与yaml的整合思路
借鉴于properties整合过程。我们只需要将yml中数据封装成properties集合就可以完成注入。
### 整合步骤
1.准备yml配置文件

引入jar包
```
<dependency>
   <groupId>org.yaml</groupId>
   <artifactId>snakeyaml</artifactId>
</dependency>
```

```yaml
Updown:
 name: zll
 password: 1233
```
2.读取yml转化成properties
```java
   @Bean
    public Properties properties(){
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
        yaml.setResources(new ClassPathResource("test.yaml"));
        return yaml.getObject();
    }
```
3.应用PropertySourcesPlaceholderConfigurer并转化的properties设置到这个类中即可
```java
   @Bean
    public PropertySourcesPlaceholderConfigurer placeholderConfigurer(Properties properties){
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setProperties(properties);
        return configurer;
    }
```
4.使用@Value进行注入
```java
@Component
public class Updown {
    @Value("${Updown.name}")
    private String name;
    @Value("${Updown.password}")
    private String password;
 }
```
## 与yaml整合存在的问题
1.由于yaml最终是被解析成properties的，properties是不支持集合的，因此不能用yaml的标准集合语法进行赋值。
但是可以通过spring的EL表达式进行处理
```yaml
Updown:
 name: zll
 password: 1233
 list: 111,22222,3333,4444
```
```java
 @Value(" #{'${Updown.list}'.split(',')}")
 private List<String> list;
```
2.在应用的时候，对于获取对象中的属性还是会出现冗余@Value(”${对象.属性}“)，对于这个问题目前是没有办法进行解决的。
但是在spring Boot开发中。可以通过@ConfigurationProperties这个注解很好的解决这个问题，同样也可以解决集合的问题。










