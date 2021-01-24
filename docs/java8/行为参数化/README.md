---
title: 行为参数化
date: 2021-01-23
categories:
- java
tags:
- java8
---
::: tip
在软件工程中，我们都知道，用户的需求是不断变化的，因此如何去适应这不断变化的需求是我们每一个开发者所要思考的问题。在理想状态下，应该使用一种方式将我们的工作量降到最少去完成这种‘变’。并且这种方式用起来也应该很简单，并能进行长期的维护。
:::
引言中提到的这种方式就是我们本文中的主角，行为参数化，它是一种开发模式，一种可以帮助我们处理频繁变更需求的新功能。一言以蔽之，它意味着拿着一个代码块，把它准备好，而不去立即执行它，等到需要的时候再去执行它，也就是推迟这段代码的执行。举个栗子，假设我们每天早上出门，有可能是去工作，有可能是去去玩，也有可能去做其他的事。那么，出门相当于一个方法：go，它可以接受不同的行为作为参数然后去执行。
应对不断变化的需求 编写能够应对变化的需求的代码并不容易，接下来我以一个例子去逐步实现这种开发模式，以展示一些代码更灵活的最佳做法。就从一个列表中筛选出我们想要的苹果为例


## 第一次尝试：筛选绿色的苹果

```java
/**
* 删选出green颜色的苹果
* @param appleList 苹果集合
* @return 绿色苹果的集合
*/
public static List<Apple> filterGreenApples(List<Apple> appleList){
ArrayList<Apple> apples = new ArrayList<>();
for (Apple apple : appleList) {
if("green".equals(apple.getColor())){
apples.add(apple);
}
}
return apples;
}
```

貌似还不错，筛选出了我们想要的苹果。但是现在需求改了，要筛选红色的苹果，这时候，我们应该如何处理，将筛选的方法复制一份，修改筛选的颜色？如果是浅绿色，深红色，黄色，等等其他颜色呢？这种方法就应付不了。一个良好的原则就是在编写完类似的代码后将其抽象化。

## 第二次尝试：把颜色当做参数

```java
/**
* 删选出各种颜色的苹果
* @param appleList 苹果集合
* @return 给定颜色苹果的集合
*/
public static List<Apple> filterAnyCololurApples(List<Apple> appleList,String color){
ArrayList<Apple> apples = new ArrayList<>();
for (Apple apple : appleList) {
if(color.equals(apple.getColor())){
apples.add(apple);
}
}
return apples;
}
```

这种方案就可以筛选出任意颜色的苹果，在需求只是颜色变动的前提下，是一个不错的选择。但是，如果在加上重量呢？筛选出特定重量的苹果如何处理，可能我们会类比之前颜色的做法，将重量也作为参数，就可以解决。但如果既要颜色，也要重量呢？继续添加参数？那如果还需要其他条件，比如产地，大小，品种，等等，又该如何处理，很显然，上边的做法很难做到动态的控制参数进行合理的筛选。
主角登场：行为参数化
对于以上的解决方法，其实是添加更多的参数，然后做各种判断，去过滤掉一部分数据。然而它的弊端也是很明显的，因此我们需要一个更灵活的办法去解决。其实我们可以站在一个更抽象的层面来看待以上的解决方法，无论是颜色，或是重量，亦或是其他条件，其实都是用我们传入的参数和原有集合中遍历对象中对应属性作比较，如果为true，则添加到新的集合中，那么我们何不定义一个模板方法，专门用来返回Boolean值，以应对不同筛选条件：

```java
public interface ApplePredicate {
boolean test(Apple apple);
}
```

这个接口其实就是对选择的标准进行建模，其中的test方法，返回boolean值的函数也称为“谓词”，接下来，我们就需要对这个接口进行多实现，也就是选择标准（不同的筛选条件）：

```java
public class AppleColorPredicate implements ApplePredicate{
/**
* 筛选出绿色苹果
* @param apple 苹果
* @return boolean
*/
@Override
public boolean test(Apple apple) {
return "green".equals(apple.getColor());
}

public class AppleWeightPredicate implements ApplePredicate {

    /**
     * 筛选出重苹果
     * @param apple 苹果
     * @return boolean
     */
    @Override
    public boolean test(Apple apple) {
        return apple.getWeight()>100;
    }
```

当然，这个标准的建立是可定制的，重量，颜色，产地，组合条件，等等都可以通过不同的实现来完成，其实到这里，我们就可以发现一些端倪，这貌似和策略模式有点类似，定义一组筛选的算法，将他们封装起来，等到需求需要时，选择其中一个运行。但是接下来该如何处理？这时我们就需要一个方法，将数据源,也就是苹果集合和这些筛选条件的实现结合在一起。

## 第三次尝试：根据抽象进行筛选

```java
/**
* 根据抽象条件进行筛选
* @param appleList 苹果集合
* @param predicate 抽象条件
* @return 筛选结果
*/
public List<Apple> filterApples(List<Apple> appleList, ApplePredicate predicate) {
ArrayList<Apple> result = new ArrayList<>();
for (Apple apple : appleList) {
if (predicate.test(apple)) {
result.add(apple);
}
}
return result;
}
```

filterApples方法接受一个ApplePredicate对象，使用里面的test方法，我们就可以实现行为参数化：让方法接受多种行为（筛选出绿色苹果，筛选出重苹果，等等）作为参数，并在内部使用，来完成不同的行为。这样做的好处是,将集合迭代的逻辑与要应用到这个集合中的每个元素的行为（一个谓词）区分开来，这也是ocp的一个很好的应用。
很棒，是不是，无论有多少个条件，我们都可以用这个方法进行筛选，filterApples方法的行为取决于我们通过ApplePredicate传递的代码，换句话说，我们把filterApples方法的的行为参数化了。

```java
//调用
List<Apple> apples = filterApples(appleList, new AppleColorPredicate());
```

正如之前解释的一样，行为参数化好处是,将集合迭代的逻辑与要应用到这个集合中的每个元素的行为区分开来，这样就可以重复使用一个方法，给它不同的行为来达到不同的目的。
虽然，我们将行为抽象化，使得更容易应对不断变化的需求，但是这个过程是很麻烦的，我们需要创建很多的实现类因此我们需要一种方法去简化我们的方法。

## 第四次尝试：匿名内部类优化

```java
List<Apple> appleList = filterApples(appleList, new AppleColorPredicate(){
public boolean test(Apple apple) {
return "green".equals(apple.getColor());
}
});
```

匿名类个java块中定义类差不多，这也类似于js中的匿名方法，它允许你同时声明或实例化一个类，换句话说，就是随用随建。
但是匿名类还是不够友好，第一，它往往很重，因为它占用了很多空间，存在很多的模板代码，第二他的可读性也很差，因为存在于块中。那么有没有什么好的机制可以优化这种代码呢？答案是有的，Java8的设计者引入了lambda表达式，一种更简洁的传递代码的方式，接下来我们看看用lambda重构后的代码吧！

## 第五次尝试：lambda表达式优化

```java
List<Apple> appleList = filterApples(apples(),(Apple a)->"green".equals(a.getColor()));
```

## 第六次尝试：将list类型抽象

```java
目前，对于filterApples方法只使用与Apple.我们还可以对List的类型，也就是泛型进行抽象，从而适应更多的对象。
public interface Predicate<T> {
boolean test(T t);
}

public static <T> List<T> filter(List<T> list, Predicate<T> p) {
List<T> result = new ArrayList<>();
for (T e : list) {
if (p.test(e)) {
result.add(e);
}
}
return result;
}
}

List<Apple> appleList = filter(apples(),(Apple a)->"green".equals(a.getColor()));
}
```

## 第七次尝试：使用stream流处理

```java
List<Apple> appleListEnd = appleList.stream().filter((Apple a) -> "green".equals(a.getColor())).collect(Collectors.toList());
}
```