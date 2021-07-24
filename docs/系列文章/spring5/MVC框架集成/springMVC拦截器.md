---
title: SpringMVC拦截器
categories:
 - 后端
tags:
 - spring
---
## 拦截器？
Spring MVC中的拦截器（Interceptor）类似于Servlet中的过滤器（Filter），它主要用于拦截用户请求并作相应的处理。例如通过拦截器可以进行权限验证、记录请求信息的日志、判断用户是否登录等。
## 拦截器实现
### 1.实现HandlerInterceptor接口
```java
public class myInterceptor implements HandlerInterceptor {
    /**
     * 用户控制器之前拦截，实现用户控制器数据的预处理工作，第三个参数为响应的用户控制器
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return false;
    }
    /**
     *对用户控制器处理后的数据再进一步处理
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    /**
     * 视图解析器对 View 渲染完成后对最后结果进行处理
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}

```
### 2.容器注册
```xml
<!--拦截器-->
    <mvc:interceptors>
        <mvc:interceptor>
            <!--拦截哪些请求-->
            <mvc:mapping path="/**"/>
            <!--除去哪些请求不拦截-->
            <mvc:exclude-mapping path="/login/**"/>
            <!--注入自定义拦截器-->
           <ref bean="myInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>
```
## 注意细节
拦截器可以配置多个，多个拦截器的执行顺序为：

preHandle：先注册先执行   
postHandle：先注册后执行，所有的拦截器返回成功后才调用   
afterCompletion：先注册后执行，自己的preHandle返回true后才调用   



