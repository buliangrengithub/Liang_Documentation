---
title: 后置处理bean
categories:
 - 后端
tags:
 - spring
---
## 后置处理bean(beanPostProcessor)
作用：对Spring工厂所创建的对象进行再加工
## 什么时候加工
在对象的生命周期中，也就是调用构造方法之后，在初始化的前后去加工
## 如何加工
spring提供了beanPostProcessor接口，继承这个接口，就相当于接手加工这个活，具体的加工过程就需要实现里面的方法

## 开发步骤
由于初始化操作很少使用因此，只需要实现后置处理的其中一个方法就可以，一般是after方法

实现beanPostProcessor接口方法
```java
public class postProcessor implements BeanPostProcessor {

    //对象创建完成，并注入后，调用这个方法加工
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    //在完成初始化操作后，调用这个方法加工
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        Book book=(Book)bean;
        book.setName("嘻嘻嘻");
        return book;
    }
}
```
定义测试类
```java
public class Book {
    private String id;
    private String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
        return "Book{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}

```

xml 配置
```xml
<beans>
    <bean class="com.zl.factory.postProcessor" id="postProcessor"/>
    <bean class="com.zl.pojo.Book" id="book">
        <property name="name" value="zl"/>
        <property name="id" value="12"/>
    </bean>
</beans>
 
```
测试：
```java
  @Test
    public void test20(){
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("/aa.xml");
        Book g = (Book)context.getBean("book");
        System.out.println(g);
    }
    
    //测试结果 Book{id='12', name='嘻嘻嘻'}
```

由于postProcessor会作用于整个工厂，因此，在xml配置中的所有bean都会走后置处理器的方法。但如果只想作用某个bean，可以这样修改
```java
public class postProcessor implements BeanPostProcessor {

    //对象创建完成，并注入后，调用这个方法加工
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    //在完成初始化操作后，调用这个方法加工
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if(bean instanceof Book){
            Book book=(Book)bean;
            book.setName("嘻嘻嘻");
        }
        return bean;
    }
}
```