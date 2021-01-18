---
title: 常用工具函数
date: 2020-10-01
tags:
 - js工具集
categories: 
 - js
---

## 78.金钱格式化，三位加逗号
```js
/**
 *  @param { number } num
    */
    export const formatMoney = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
```
## 79.截取字符串并加身略号
```js
export function subText(str, length) {
    if (str.length === 0) {
        return '';
    }
    if (str.length > length) {
        return str.substr(0, length) + "...";
    } else {
        return str;
    }
}
```
## 80.获取文件base64编码
```js
 /**
     * @param file
     * @param format  指定文件格式
     * @param size  指定文件大小(字节)
     * @param formatMsg 格式错误提示
     * @param sizeMsg   大小超出限制提示
     * @returns {Promise<any>}
       */
       export function fileToBase64String(file, format = ['jpg', 'jpeg', 'png', 'gif'], size = 20 * 1024 * 1024, formatMsg = '文件格式不正确', sizeMsg = '文件大小超出限制') {
       return new Promise((resolve, reject) => {
           // 格式过滤
           let suffix = file.type.split('/')[1].toLowerCase();
           let inFormat = false;
           for (let i = 0; i < format.length; i++) {
               if (suffix === format[i]) {
                   inFormat = true;
                   break;
               }
           }
           if (!inFormat) {
               reject(formatMsg);
           }
           // 大小过滤
           if (file.size > size) {
               reject(sizeMsg);
           }
           // 转base64字符串
       let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            let res = fileReader.result;
            resolve({base64String: res, suffix: suffix});
            reject('异常文件，请重新选择');
        }
    })
    }
 ```   
## 81.B转换到KB,MB,GB并保留两位小数
```js
 /**
     * @param { number } fileSize
       */
       export function formatFileSize(fileSize) {
       let temp;
       if (fileSize < 1024) {
           return fileSize + 'B';
       } else if (fileSize < (1024 * 1024)) {
           temp = fileSize / 1024;
           temp = temp.toFixed(2);
           return temp + 'KB';
       } else if (fileSize < (1024 * 1024 * 1024)) {
           temp = fileSize / (1024 * 1024);
           temp = temp.toFixed(2);
           return temp + 'MB';
       } else {
           temp = fileSize / (1024 * 1024 * 1024);
       temp = temp.toFixed(2);
        return temp + 'GB';
    }
    }
```
## 82.base64转file
```js
 /**
     *  @param { base64 } base64
     *  @param { string } filename 转换后的文件名
        */
        export const base64ToFile = (base64, filename )=> {
        let arr = base64.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split('/')[1] ;// 图片后缀
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
    while (n--) {
         u8arr[n] = bstr.charCodeAt(n)
     }
     return new File([u8arr], `${filename}.${suffix}`, { type: mime })
     };
```
## 83.base64转blob
```js
/**
    *  @param { base64 } base64
       */
       export const base64ToBlob = base64 => {
       let arr = base64.split(','),
           mime = arr[0].match(/:(.*?);/)[1],
           bstr = atob(arr[1]),
           n = bstr.length,
           u8arr = new Uint8Array(n);
       while (n--) {
       u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
    };
```
## 84.blob转file
```js
/**
    *  @param { blob } blob
    *  @param { string } fileName
       */
   export const blobToFile = (blob, fileName) => {
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
    };
```
## 85.file转base64
```js
 /**
     * @param { * } file 图片文件
       */
       export const fileToBase64 = file => {
       let reader = new FileReader();
       reader.readAsDataURL(file);
   reader.onload = function (e) {
        return e.target.result
    };
    };
```
## 86.递归生成树形结构
```js
export function getTreeData(data, pid, pidName = 'parentId', idName = 'id', childrenName = 'children', key) {
    let arr = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i][pidName] == pid) {
            data[i].key = data[i][idName];
            data[i][childrenName] = getTreeData(data, data[i][idName], pidName, idName, childrenName);
            arr.push(data[i]);
        }
    }
    
    return arr;

}
```
## 87.遍历树节点
```js
export function foreachTree(data, childrenName = 'children', callback) {
    for (let i = 0; i < data.length; i++) {
        callback(data[i]);
        if (data[i][childrenName] && data[i][childrenName].length > 0) {
            foreachTree(data[i][childrenName], childrenName, callback);
        }
    }
}
```
## 88.追溯父节点
```js
export function traceParentNode(pid, data, rootPid, pidName = 'parentId', idName = 'id', childrenName = 'children') {
    let arr = [];
    foreachTree(data, childrenName, (node) => {
        if (node[idName] == pid) {
            arr.push(node);
            if (node[pidName] != rootPid) {
                arr = arr.concat(traceParentNode(node[pidName], data, rootPid, pidName, idName));
            }
        }
    });
    return arr; 
}
```
## 89.寻找所有子节点
```js
export function traceChildNode(id, data, pidName = 'parentId', idName = 'id', childrenName = 'children') {
    let arr = [];
    foreachTree(data, childrenName, (node) => {
        if (node[pidName] == id) {
            arr.push(node);
            arr = arr.concat(traceChildNode(node[idName], data, pidName, idName, childrenName));
        }
    });
    return arr;
}
```
## 90.根据pid生成树形结构
```js
/**
    *  @param { object } items 后台获取的数据
*  @param { * } id 数据中的id
 *  @param { * } link 生成树形结构的依据
    */
    export const createTree = (items, id = null, link = 'pid') =>{
    items.filter(item => item[link] === id).map(item => ({ ...item, children: createTree(items, item.id) }));
    };
```
## 91.查询数组中是否存在某个元素并返回元素第一次出现的下标
```js
 /** 
     * @param {*} item 
     * @param { array } data
       */
       export function inArray(item, data) {
       for (let i = 0; i < data.length; i++) {
           if (item === data[i]) {
           return i;
        }
    }
    return -1;
    }
```
## 92.Windows根据详细版本号判断当前系统名称
```js
 /**
     * @param { string } osVersion 
       */
       export function OutOsName(osVersion) {
       if(!osVersion){
           return
       }
       let str = osVersion.substr(0, 3);
       if (str === "5.0") {
           return "Win 2000"
       } else if (str === "5.1") {
           return "Win XP"
       } else if (str === "5.2") {
           return "Win XP64"
       } else if (str === "6.0") {
           return "Win Vista"
       } else if (str === "6.1") {
           return "Win 7"
       } else if (str === "6.2") {
           return "Win 8"
       } else if (str === "6.3") {
           return "Win 8.1"
       } else if (str === "10.") {
           return "Win 10"
   } else {
        return "Win"
    }
    }
```
## 93.判断手机是Andoird还是IOS
```js
/**
    *  0: ios
    *  1: android
    *  2: 其它
       */
       export function getOSType() {
       let u = navigator.userAgent, app = navigator.appVersion;
       let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
       let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
       if (isIOS) {
           return 0;
   }
    if (isAndroid) {
        return 1;
    }
    return 2;
    }
```
## 94.函数防抖
```js
 /**
     * @param { function } func
    
     * @param { number } wait 延迟执行毫秒数
    
 * @param { boolean } immediate  true 表立即执行，false 表非立即执行
       */
       export function debounce(func,wait,immediate) {
       let timeout;
       return function () {
           let context = this;
           let args = arguments;
    
           if (timeout) clearTimeout(timeout);
           if (immediate) {
               let callNow = !timeout;
               timeout = setTimeout(() => {
                   timeout = null;
               }, wait);
               if (callNow) func.apply(context, args)
       }
        else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
 
    }
    }
 ```
## 95.函数节流
```js
 /**
     * @param { function } func 函数
    
     * @param { number } wait 延迟执行毫秒数
    
     * @param { number } type 1 表时间戳版，2 表定时器版
       */
       export function throttle(func, wait ,type) {
       let previous, timeout;
       if(type===1){
           previous = 0;
       }else if(type===2){
       timeout = null;
       }
       return function() {
           let context = this;
           let args = arguments;
           if(type===1){
               let now = Date.now();
    
               if (now - previous > wait) {
                   func.apply(context, args);
                   previous = now;
               }
           }else if(type===2){
           if (!timeout) {
                   timeout = setTimeout(() => {
                   timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }
 
    }
    }
```
## 96.判断数据类型
```js
 /**
     * @param {*} target 
       */
       export function type(target) {
       let ret = typeof(target);
       let template = {
           "[object Array]": "array",
           "[object Object]":"object",
           "[object Number]":"number - object",
       "[object Boolean]":"boolean - object",
           "[object String]":'string-object'
       };
    
       if(target === null) {
           return 'null';
       }else if(ret == "object"){
           let str = Object.prototype.toString.call(target);
           return template[str];
   }else{
        return ret;
    }
    }
```
## 97.生成指定范围随机数
```js
 /**
  * @param { number } min 
  * @param { number } max 
    */
    export const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
```
## 98.数组乱序
```js
 /**
     * @param {array} arr
       */
       export function arrScrambling(arr) {
       let array = arr;
       let index = array.length;
       while (index) {
           index -= 1;
           let randomIndex = Math.floor(Math.random() * index);
           let middleware = array[index];
           array[index] = array[randomIndex];
       array[randomIndex] = middleware
    }
    return array
    }
```
## 99.数组交集
```js
 /**
  * @param { array} arr1
  * @param { array } arr2
    */
    export const similarity = (arr1, arr2) => arr1.filter(v => arr2.includes(v));
```
## 100.数组中某元素出现的次数
```js
 /**

     * @param { array } arr
 * @param {*} value
    */
    export function countOccurrences(arr, value) {
    return arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
    }
```
## 101.加法函数（精度丢失问题）
```js
 /**
     * @param { number } arg1
     * @param { number } arg2
       */
       export function add(arg1, arg2) {
       let r1, r2, m;
   try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m
    }
```
## 102.减法函数（精度丢失问题）
```js
 /**
     * @param { number } arg1
     * @param { number } arg2
       */
       export function sub(arg1, arg2) {
       let r1, r2, m, n;
       try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
   try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
    }
```
## 103.除法函数（精度丢失问题）
```js
 /**
     * @param { number } num1
     * @param { number } num2
       */
       export function division(num1,num2){
       let t1,t2,r1,r2;
       try{
           t1 = num1.toString().split('.')[1].length;
       }catch(e){
           t1 = 0;
       }
       try{
           t2=num2.toString().split(".")[1].length;
       }catch(e){
           t2=0;
   }
    r1=Number(num1.toString().replace(".",""));
    r2=Number(num2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
    }
 ```
## 104.乘法函数（精度丢失问题）
```js
 /**
     * @param { number } num1
     * @param { number } num2
       */
       export function mcl(num1,num2){
   let m=0,s1=num1.toString(),s2=num2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    }
```
## 105.递归优化（尾递归）
```js
 /**
     * @param { function } f
       */
       export function tco(f) {
   let value;
       let active = false;
       let accumulated = [];
    
       return function accumulator() {
           accumulated.push(arguments);
           if (!active) {
               active = true;
               while (accumulated.length) {
                   value = f.apply(this, accumulated.shift());
               }
               active = false;
           return value;
        }
    };
    }
```
## 106.生成随机整数
```js
export function randomNumInteger(min, max) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * min + 1, 10);
        case 2:
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        default:
            return 0
    }
}
```
## 107.去除空格
```js
 /**
     * @param { string } str 待处理字符串
     * @param  { number } type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
       */
       export function trim(str, type = 1) {
       if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return;
       switch (type) {
           case 1:
               return str.replace(/\s/g, "");
           case 2:
               return str.replace(/(^\s)|(\s*$)/g, "");
           case 3:
               return str.replace(/(^\s)/g, "");
           case 4:
           return str.replace(/(\s$)/g, "");
        default:
            return str;
    }
    }
```
## 108.大小写转换
```js
/**
 * @param { string } str 待转换的字符串
 * @param { number } type 1-全大写 2-全小写 3-首字母大写 其他-不转换
   */

export function turnCase(str, type) {
    switch (type) {
        case 1:
            return str.toUpperCase();
        case 2:
            return str.toLowerCase();
        case 3:
            return str[0].toUpperCase() + str.substr(1).toLowerCase();
        default:
            return str;
    }
}
```
## 109.随机16进制颜色 hexColor
```js
 /**
 * 方法一
       */
       export function hexColor() {
    
       let str = '#';
       let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
       for (let i = 0; i < 6; i++) {
           let index = Number.parseInt((Math.random() * 16).toString());
       str += arr[index]
    }
    return str;
    }
```
## 110.随机16进制颜色 randomHexColorCode
```js
 /**
     * 方法二
       */
   export const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
    };
```
## 111.转义html(防XSS攻击)
```js
export const escapeHTML = str =>{
    str.replace(
        /[&<>'"]/g,
        tag =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
    );
};
```
## 112.检测移动/PC设备
```js
export const detectDeviceType = () => { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'; };
```
## 113.隐藏所有指定标签
```js
 /**
  * 例: hide(document.querySelectorAll('img'))
    */
    export const hideTag = (...el) => [...el].forEach(e => (e.style.display = 'none'));
```
## 114.返回指定元素的生效样式
```js
 /**
  * @param { element} el  元素节点
  * @param { string } ruleName  指定元素的名称
    */
    export const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];
```
## 115.检查是否包含子元素
```js
 /**
  * @param { element } parent
  * @param { element } child
  * 例：elementContains(document.querySelector('head'), document.querySelector('title')); // true
    */
    export const elementContains = (parent, child) => parent !== child && parent.contains(child);
```
## 116.数字超过规定大小加上加号“+”，如数字超过99显示99+
```js
 /**
     * @param { number } val 输入的数字
     * @param { number } maxNum 数字规定界限
       */
       export const outOfNum = (val, maxNum) =>{
       val = val ? val-0 :0;
       if (val > maxNum ) {
       return `${maxNum}+`
    }else{
        return val;
    }
    };
```
## 117.如何隐藏所有指定的元素
```js
 const hide = (el) => Array.from(el).forEach(e => (e.style.display = 'none'));

 // 事例:隐藏页面上所有`<img>`元素?
 hide(document.querySelectorAll('img'))
 ```
## 118.如何检查元素是否具有指定的类？
```js
页面DOM里的每个节点上都有一个classList对象，程序员可以使用里面的方法新增、删除、修改节点上的CSS类。使用classList，程序员还可以用它来判断某个节点是否被赋予了某个CSS类。

 const hasClass = (el, className) => el.classList.contains(className)

 // 事例
 hasClass(document.querySelector('p.special'), 'special') // true
 ```
## 119.如何切换一个元素的类?
```js
 const toggleClass = (el, className) => el.classList.toggle(className)

 // 事例 移除 p 具有类`special`的 special 类
 toggleClass(document.querySelector('p.special'), 'special')
 ```
## 120.如何获取当前页面的滚动位置？
```js
 const getScrollPosition = (el = window) => ({
   x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
   y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
 });

 // 事例
 getScrollPosition(); // {x: 0, y: 200}
 ```
## 121.如何平滑滚动到页面顶部
```js
 const scrollToTop = () => {
   const c = document.documentElement.scrollTop || document.body.scrollTop;
   if (c > 0) {
     window.requestAnimationFrame(scrollToTop);
     window.scrollTo(0, c - c / 8);
   }
 }
 // 事例
 scrollToTop()
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
 requestAnimationFrame：优势：由系统决定回调函数的执行时机。60Hz的刷新频率，那么每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿。

window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
 requestAnimationFrame：优势：由系统决定回调函数的执行时机。60Hz的刷新频率，那么每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿。
```
## 122.如何检查父元素是否包含子元素？
```js
 const elementContains = (parent, child) => parent !== child && parent.contains(child);

 // 事例
 elementContains(document.querySelector('head'), document.querySelector('title')); 
 // true
 elementContains(document.querySelector('body'), document.querySelector('body')); 
 // false
 ```
## 123.如何检查指定的元素在视口中是否可见？
```js
 const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
   const { top, left, bottom, right } = el.getBoundingClientRect();
   const { innerHeight, innerWidth } = window;
   return partiallyVisible
     ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
         ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
     : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
 };

 // 事例
 elementIsVisibleInViewport(el); // 需要左右可见
 elementIsVisibleInViewport(el, true); // 需要全屏(上下左右)可以见
 ```
## 124.如何获取元素中的所有图像？
```js
 const getImages = (el, includeDuplicates = false) => {
   const images = [...el.getElementsByTagName('img')].map(img => img.getAttribute('src'));
   return includeDuplicates ? images : [...new Set(images)];
 };

 // 事例：includeDuplicates 为 true 表示需要排除重复元素
 getImages(document, true); // ['image1.jpg', 'image2.png', 'image1.png', '...']
 getImages(document, false); // ['image1.jpg', 'image2.png', '...']
 ```
## 125.如何确定设备是移动设备还是台式机/笔记本电脑？
```js
 const detectDeviceType = () =>
   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
     ? 'Mobile'
     : 'Desktop';

 // 事例
 detectDeviceType(); // "Mobile" or "Desktop"
## 126.How to get the current URL?
 const currentURL = () => window.location.href

 // 事例
 currentURL() // 'https://google.com'
 ```
## 127.如何创建一个包含当前URL参数的对象？
```js
 const getURLParameters = url =>
   (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
     (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
     {}
   );

 // 事例
 getURLParameters('http://url.com/page?n=Adam&s=Smith'); // {n: 'Adam', s: 'Smith'}
 getURLParameters('google.com'); // {}
 ```
## 128.如何将一组表单元素转化为对象？
```js
 const formToObject = form =>
   Array.from(new FormData(form)).reduce(
     (acc, [key, value]) => ({
       ...acc,

[key]: value

​     }),
​     {}
   );

 // 事例
 formToObject(document.querySelector('#form')); 
 // { email: 'test@email.com', name: 'Test Name' }
 ```
## 129.如何从对象检索给定选择器指示的一组属性？
```js
 const get = (from, ...selectors) =>
   [...selectors].map(s =>
     s
       .replace(/\[([^\[\]]*)\]/g, '.$1.')
       .split('.')
       .filter(t => t !== '')
       .reduce((prev, cur) => prev && prev[cur], from)
   );
 const obj = { selector: { to: { val: 'val to select' } }, target: [1, 2, { a: 'test' }] };

 // Example
 get(obj, 'selector.to.val', 'target[0]', 'target[2].a'); 
 // ['val to select', 1, 'test']
 ```
## 130.如何在等待指定时间后调用提供的函数？
```js
 const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);
 delay(
   function(text) {
     console.log(text);
   },
   1000,
   'later'
 ); 

 // 1秒后打印 'later'
 ```
## 131.如何在给定元素上触发特定事件且能选择地传递自定义数据？
```js
 const triggerEvent = (el, eventType, detail) =>
   el.dispatchEvent(new CustomEvent(eventType, { detail }));

 // 事例
 triggerEvent(document.getElementById('myId'), 'click');
 triggerEvent(document.getElementById('myId'), 'click', { username: 'bob' });
自定义事件的函数有 Event、CustomEvent 和 dispatchEvent
 // 向 window派发一个resize内置事件
 window.dispatchEvent(new Event('resize'))


 // 直接自定义事件，使用 Event 构造函数：
 var event = new Event('build');
 var elem = document.querySelector('#id')
 // 监听事件
 elem.addEventListener('build', function (e) { ... }, false);
 // 触发事件.
 elem.dispatchEvent(event);
CustomEvent 可以创建一个更高度自定义事件，还可以附带一些数据，具体用法如下：
 var myEvent = new CustomEvent(eventname, options);
 其中 options 可以是：
 {
   detail: {
     ...
   },
   bubbles: true,    //是否冒泡
   cancelable: false //是否取消默认事件
 }
其中 detail 可以存放一些初始化的信息，可以在触发的时候调用。其他属性就是定义该事件是否具有冒泡等等功能。
 内置的事件会由浏览器根据某些操作进行触发，自定义的事件就需要人工触发。
 dispatchEvent 函数就是用来触发某个事件：
 element.dispatchEvent(customEvent);

 上面代码表示，在 element 上面触发 customEvent 这个事件。
 // add an appropriate event listener
 obj.addEventListener("cat", function(e) { process(e.detail) });

 // create and dispatch the event
 var event = new CustomEvent("cat", {"detail":{"hazcheeseburger":true}});
 obj.dispatchEvent(event);
 使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：

 // 绑定自定义事件
 $(element).on('myCustomEvent', function(){});

 // 触发事件
 $(element).trigger('myCustomEvent');
 // 此外，你还可以在触发自定义事件时传递更多参数信息：

 $( "p" ).on( "myCustomEvent", function( event, myName ) {
   $( this ).text( myName + ", hi there!" );
 });
 $( "button" ).click(function () {
   $( "p" ).trigger( "myCustomEvent", [ "John" ] );
 });
 ```
## 132.如何从元素中移除事件监听器?
```js
 const off = (el, evt, fn, opts = false) => el.removeEventListener(evt, fn, opts);

 const fn = () => console.log('!');
 document.body.addEventListener('click', fn);
 off(document.body, 'click', fn); 
 ```
## 133.如何获得给定毫秒数的可读格式？
```js
 const formatDuration = ms => {
   if (ms < 0) ms = -ms;
   const time = {
     day: Math.floor(ms / 86400000),
     hour: Math.floor(ms / 3600000) % 24,
     minute: Math.floor(ms / 60000) % 60,
     second: Math.floor(ms / 1000) % 60,
     millisecond: Math.floor(ms) % 1000
   };
   return Object.entries(time)
     .filter(val => val[1] !== 0)
     .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
     .join(', ');
 };

 // 事例
 formatDuration(1001); // '1 second, 1 millisecond'
 formatDuration(34325055574); 
 // '397 days, 6 hours, 44 minutes, 15 seconds, 574 milliseconds'
 ```
## 134.如何获得两个日期之间的差异（以天为单位）？
```js
 const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
   (dateFinal - dateInitial) / (1000 * 3600 * 24);

 // 事例
 getDaysDiffBetweenDates(new Date('2017-12-13'), new Date('2017-12-22')); // 9
 ```
## 135.如何向传递的URL发出GET请求？
```js
 const httpGet = (url, callback, err = console.error) => {
   const request = new XMLHttpRequest();
   request.open('GET', url, true);
   request.onload = () => callback(request.responseText);
   request.onerror = () => err(request);
   request.send();
 };

 httpGet(
   'https://jsonplaceholder.typicode.com/posts/1',
   console.log
 ); 

 // {"userId": 1, "id": 1, "title": "sample title", "body": "my text"}
 ```
## 136.如何对传递的URL发出POST请求？
```js
 const httpPost = (url, data, callback, err = console.error) => {
   const request = new XMLHttpRequest();
   request.open('POST', url, true);
   request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
   request.onload = () => callback(request.responseText);
   request.onerror = () => err(request);
   request.send(data);
 };

 const newPost = {
   userId: 1,
   id: 1337,
   title: 'Foo',
   body: 'bar bar bar'
 };
 const data = JSON.stringify(newPost);
 httpPost(
   'https://jsonplaceholder.typicode.com/posts',
   data,
   console.log
 ); 

 // {"userId": 1, "id": 1337, "title": "Foo", "body": "bar bar bar"}
 ```
## 137.如何为指定选择器创建具有指定范围，步长和持续时间的计数器？
```js
 const counter = (selector, start, end, step = 1, duration = 2000) => {
   let current = start,
     _step = (end - start) * step < 0 ? -step : step,
     timer = setInterval(() => {
       current += _step;
       document.querySelector(selector).innerHTML = current;
       if (current >= end) document.querySelector(selector).innerHTML = end;
       if (current >= end) clearInterval(timer);
     }, Math.abs(Math.floor(duration / (end - start))));
   return timer;
 };

 // 事例
 counter('#my-id', 1, 1000, 5, 2000); 
 // 让 `id=“my-id”`的元素创建一个2秒计时器
 ```
## 138.如何将字符串复制到剪贴板？
```js
   const el = document.createElement('textarea');
   el.value = str;
   el.setAttribute('readonly', '');
   el.style.position = 'absolute';
   el.style.left = '-9999px';
   document.body.appendChild(el);
   const selected =
     document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
   el.select();
   document.execCommand('copy');
   document.body.removeChild(el);
   if (selected) {
     document.getSelection().removeAllRanges();
     document.getSelection().addRange(selected);
   }
 };

 // 事例
 copyToClipboard('Lorem ipsum'); 
 // 'Lorem ipsum' copied to clipboard
 ```
## 139.如何确定页面的浏览器选项卡是否聚焦？
```js
 const isBrowserTabFocused = () => !document.hidden;

 // 事例
 isBrowserTabFocused(); // true
 ```
## 140.如何创建目录（如果不存在）？
```js
 const fs = require('fs');
 const createDirIfNotExists = dir => (!fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined);

 // 事例
 createDirIfNotExists('test'); 
这里面的方法大都挺实用，可以解决很多开发过程问题，大家就好好利用起来吧。
```
## 141.日期型函数封装
```js
function formatTime(date) {
  if(!!date){
    if(!(date instanceof Date))
    date = new Date(date);
    var month = date.getMonth() + 1
    var day = date.getDate()
    return `${month}月${day}日`;
  }
}

function formatDay(date) {
  if(!!date){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('-');
  }
}

function formatDay2(date) {
  if(!!date){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('/');
  }
}

function formatWeek(date){
  if(!!date){
    var day = date.getDay();
    switch (day) {
      case 0:
        return '周日'
        break;
      case 1:
        return '周一'
        break;
      case 2:
        return '周二'
        break;
      case 3:
        return '周三'
        break;
      case 4:
        return '周四'
        break;
      case 5:
        return '周五'
        break;
      case 6:
        return '周六'
        break;
    }
  }
}

function formatHour(date){
  if(!!date){
    var hour = new Date(date).getHours();
    var minute = new Date(date).getMinutes();
    return [hour, minute].map(formatNumber).join(':');
  }
}

function timestamp(date, divisor=1000){
  if(date == undefined){
    return;
  }else if(typeof date == 'number'){
    return Math.floor(date/divisor);
  }else if(typeof date == 'string'){
    var strs = date.split(/[^0-9]/);
    return Math.floor(+new Date(strs[0] || 0,(strs[1] || 0)-1,strs[2] || 0,strs[3] || 0,strs[4] || 0,strs[5] || 0)/divisor);
  }else if(Date.prototype.isPrototypeOf(date)){
    return Math.floor(+date/divisor);
  }
}

function detimestamp(date){
  if(!!date){
    return new Date(date*1000);
  }
}

function formatNumber(n) {//给在0-9的日期加上0
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  formatDay2: formatDay2,
  formatHour: formatHour,
  formatWeek: formatWeek,
  timestamp: timestamp,
  detimestamp: detimestamp
}
```
## 142.时间戳转时间
```js
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/  
function formatTime(number,format) {  
  
  var formateArr  = ['Y','M','D','h','m','s'];  
  var returnArr   = [];  
  
  var date = new Date(number * 1000);  
  returnArr.push(date.getFullYear());  
  returnArr.push(formatNumber(date.getMonth() + 1));  
  returnArr.push(formatNumber(date.getDate()));  
  
  returnArr.push(formatNumber(date.getHours()));  
  returnArr.push(formatNumber(date.getMinutes()));  
  returnArr.push(formatNumber(date.getSeconds()));  
  
  for (var i in returnArr)  
  {  
    format = format.replace(formateArr[i], returnArr[i]);  
  }  
  return format;  
} 

//数据转化  
function formatNumber(n) {  
  n = n.toString()  
  return n[1] ? n : '0' + n  
}  

调用示例：

var sjc = 1488481383;//时间戳
console.log(time.formatTime(sjc,'Y/M/D h:m:s'));//转换为日期：2017/03/03 03:03:03
console.log(time.formatTime(sjc, 'h:m'));//转换为日期：03:03
## 143.js中获取上下文路径
js中获取上下文路径
    //js获取项目根路径，如： http://localhost:8083/uimcardprj
    function getRootPath(){
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath=window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName=window.document.location.pathname;
        var pos=curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht=curWwwPath.substring(0,pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhostPaht+projectName);
    }
```
## 144.JS大小转化B KB MB GB的转化方法
```js
function conver(limit){  
            var size = "";  
            if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
                size = limit.toFixed(2) + "B";    
            }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
                size = (limit / 1024).toFixed(2) + "KB";              
            }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
                size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
            }else{ //其他转化成GB  
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
            }  
              
            var sizestr = size + "";   
            var len = sizestr.indexOf("\.");  
            var dec = sizestr.substr(len + 1, 2);  
            if(dec == "00"){//当小数点后为00时 去掉小数部分  
                return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
            }  
            return sizestr;  
} 
``` 
## 145.js全屏和退出全屏
```js
function fullScreen() {
      var el = document.documentElement;
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

​      //typeof rfs != "undefined" && rfs
​      if (rfs) {
​        rfs.call(el);
​      } else if (typeof window.ActiveXObject !== "undefined") {
​        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
​        var wscript = new ActiveXObject("WScript.Shell");
​        if (wscript != null) {
​          wscript.SendKeys("{F11}");
​        }
​      }
​    }

​    //退出全屏
​    function exitScreen() {
​      var el = document;
​      var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;

​      //typeof cfs != "undefined" && cfs
​      if (cfs) {
​        cfs.call(el);
​      } else if (typeof window.ActiveXObject !== "undefined") {
​        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
​        var wscript = new ActiveXObject("WScript.Shell");
​        if (wscript != null) {
​          wscript.SendKeys("{F11}");
​        }
​      }
​    }
```
## 146.格式化时间，转化为几分钟前，几秒钟前
```js
 /**
     * 格式化时间，转化为几分钟前，几秒钟前
     * @param timestamp 时间戳，单位是毫秒
     */
    function timeFormat(timestamp) {
        var mistiming = Math.round((Date.now() - timestamp) / 1000);
        var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
        var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
        for (var i = 0; i < arrn.length; i++) {
            var inm = Math.floor(mistiming / arrn[i]);
            if (inm != 0) {
                return inm + arrr[i] + '前';
            }
        }
    }
```
## 147.获取n天之前的日期 getDaysBeforeDate(10) 10天前
```js
/**
     * 获取n天之前的日期 getDaysBeforeDate(10) 10天前
     * @param day 天数
     */
    function getDaysBeforeDate(day) {
        var date = new Date(),
            timestamp, newDate;
        timestamp = date.getTime();
        // 获取三天前的日期
        newDate = new Date(timestamp - day * 24 * 3600 * 1000);
        var year = newDate.getFullYear();
        // 月+1是因为js中月份是按0开始的
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        if (day < 10) { // 如果日小于10，前面拼接0
            day = '0' + day;
        }
        if (month < 10) { // 如果月小于10，前面拼接0
            month = '0' + month;
        }
        return [year, month, day].join('/');
    }
```
## 148.获取跳转的classId,通过hash方式获取
```js
 /**
     * 获取跳转的classId,通过hash方式获取
     * @return 返回值
     */

    $scope.getQueryString = function() {
        var url= {},
            a = '';
        (a = window.location.search.substr(1)) || (a = window.location.hash.split('?')[1])
        a.split(/&/g).forEach(function(item) {
            url[(item = item.split('='))[0]] = item[1];
        })
        return url
    }
```
## 149.过滤器指定字段
```js
function filterArrBySex(data, name) {
        if (!name) {
            console.log(name)
            return data;
        } else {
            return data.filter(function(ele, index, self) {
                if (ele.name.includes(name)) {
                    return ele
                }
            })
        }
    }
```
## 150.根据身份证获取出生年月
```js
 /**
     * 根据身份证获取出生年月
     * @param idCard
     */
    function getBirthdayFromIdCard(idCard) {
        var birthday = "";
        if (idCard != null && idCard != "") {
            if (idCard.length == 15) {
                birthday = "19" + idCard.substr(6, 6);
            } else if (idCard.length == 18) {
                birthday = idCard.substr(6, 8);
            }

            birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
        }

        return birthday;
    }
```
## 151.根据身份证获取年龄
```js
/**
     * 根据身份证获取年龄
     * @param UUserCard
     */
    function IdCard(UUserCard) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age
    }
//vue购物车金额结算
window.onload = function() {
    var vm = new Vue({
        el: '#app',
        data: {
            items: [{
                    id: 1,
                    name: "苹果",
                    price: 10,
                    count: 1,
                    url: "http://www.jq22.com/img/cs/500x500-1.png"
                },
                {
                    id: 2,
                    name: "蝴蝶",
                    price: 8,
                    count: 5,
                    url: "http://www.jq22.com/img/cs/500x500-2.png"
                },
                {
                    id: 3,
                    name: "小狗",
                    price: 100,
                    count: 1,
                    url: "http://www.jq22.com/img/cs/500x500-3.png"
                },
                {
                    id: 4,
                    name: "鲜花",
                    price: 10,
                    count: 1,
                    url: "http://www.jq22.com/img/cs/500x500-4.png"
                }
            ],
            search: ""
        },
        methods: {

        },
        filters: { //过滤器
            numFilter: function(data, n) { //data==item.price 当前过滤的数据 n==2
                return "￥" + data.toFixed(n)
            }
        },
        computed: { //计算属性
            totalCount: function() {
                var n = 0;
                this.items.forEach((v, i) => {
                    n += v.count
                });
                return n;
            },
            totalPrice: function() {
                var money = 0;
                this.items.forEach((v, i) => {
                    money += v.count * v.price
                });
                return money;
            },
            searchFor: function() {
                if (!this.search) {
                    return this.items
                }
                return this.items.filter((v, i) => {
                    if (v.name.indexOf(this.search) !== -1) { //匹配成功
                        return v
                    }
                })
            }

        }
    })
}

//设置iframe高度
function setIframeHeight(sonH) { //debugger;            
    var height = 0;
    //比较父子页面高度，以高度更大的为准
    var parentH = $(window).height(); //iframe最小高度应为浏览器视口高度，否则门户管理页面弹窗大小会受限制
    height = parentH > sonH ? parentH : sonH;
    $('#mainIframe').height(height);

    //子页面有传值过来，覆盖iframe的最小高度-2000px
    $("#mainIframe").css("min-height", 'auto');
    $(".body-bg").css("height", height + 200);
    try {
        var childBody = $("#mainIframe")[0].contentWindow.document.getElementsByTagName("body")[0];
        //childBody.style.minHeight = height + "px";
    } catch (error) {
        if (error.message.indexOf("Blocked from frame") > -1) console.warn("当前页面存在跨域！");
    }
}


(function($) {
    $("#username").keyup(function(event) {
        if (event.keyCode == 13) $("#password").focus().select();
    });
    $("#password").keyup(function(event) {
        if (event.keyCode == 13) $("#login-button").click();
    });
})(jQuery);


//回到顶部
function goTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

window.onscroll = function() {
    var t = document.documentElement.scrollTop;
    if (t > 50) {
        $(".toTop").fadeIn();
    } else {
        $(".toTop").fadeOut();
    }
}


function urlAnalysis() {
    var url = window.location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length);
    var indexFirst = paraString.indexOf("&");
    var paraStringTitle = paraString.slice(0, indexFirst);
    paraStringElse = paraString.slice(indexFirst + 1, paraString.length);
    var paraStringUrl = paraStringElse;

    //区分是否传参：functionId
    if (paraString.indexOf("functionId") > -1) {
        var indexSecond = paraStringElse.indexOf("&");
        var paraStringFId = paraStringElse.slice(0, indexSecond);

        var functionId = paraStringFId.split("=")[1];
        var $body = angular.element(document.body);
        var $rootScope = $body.scope().$root;
        $rootScope.navFunctionId = functionId;

        paraStringUrl = paraStringElse.slice(indexSecond + 1, paraStringElse.length);
    }

    var title = paraStringTitle.split("=")[1] === "undefined" ? "" : decodeURI(paraStringTitle.split("=")[1]);
    var indexUrl = paraStringUrl.indexOf("=");
    var iframeUrl = paraStringUrl.slice(indexUrl + 1, paraStringUrl.length);

    document.title = title;
    $("#mainIframe").attr("src", iframeUrl);
}



// 监听enter按下事件，页面跳转
$scope.enterEvent = function(e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
        console.log($scope.searchVal)
        console.log('监听成功')
        var baseUrl = '#/pages/knowlege/knowlegeSeach.html'
        window.open(baseUrl)
    }
};


function showDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var date = myDate.getDate();
    date = date < 10 ? '0' + date : date;
    var weekDay = myDate.getDay();

    switch (weekDay) {
        case 0:
            weekDay = "天";
            break;
        case 1:
            weekDay = "一";
            break;
        case 2:
            weekDay = "二";
            break;
        case 3:
            weekDay = "三";
            break;
        case 4:
            weekDay = "四";
            break;
        case 5:
            weekDay = "五";
            break;
        case 6:
            weekDay = "六";
            break;
            "name"
    }

    $scope.year = year;
    $scope.month = month;
    $scope.date = date;
    $scope.weekDay = weekDay;
}


//获取跳转的classId,通过hash方式获取
$scope.getQueryString = function() {
    var obg = {},
        a = '';
    (a = window.location.search.substr(1)) || (a = window.location.hash.split('?')[1])
    a.split(/&/g).forEach(function(item) {
        obg[(item = item.split('='))[0]] = item[1];
    })
    return obg
}
var classId = $scope.getQueryString();
## 152.原生js滑块验证
//event.clientX:鼠标点下的点到左侧x轴的距离
window.onload = function() {
    //事件处理  onmousedown  onmousemove  onmouseup
    var box = document.querySelector(".box")
    var btn = document.querySelector(".btn")
    var bg = document.querySelector(".bg")
    var text1 = document.querySelector(".text")
    //封装的选择器 声明式函数可以提升
    //			function fun(){
    //				
    //			}
    var flag = false; //标记
    btn.onmousedown = function(event) {
        var downx = event.clientX; //按下后获取的与x轴的距离
        btn.onmousemove = function(e) {
            var movex = e.clientX - downx; //滑块滑动的距离
            //移动的范围
            if (movex > 0) {
                this.style.left = movex + "px";
                bg.style.width = movex + "px";
                if (movex >= box.offsetWidth - 40) {
                    //验证成功
                    flag = true
                    text1.innerHTML = "验证成功"
                    text1.style.color = "#fff"
                    //清除事件
                    btn.onmousedown = null;
                    btn.onmousemove = null;
                }
            }
        }
    }
    //松开事件
    btn.onmouseup = function() {
        //清除事件
        btn.onmousemove = null;
        if (flag) return;
        this.style.left = 0;
        bg.style.width = 0 + "px";
    }
}
## 153.纯 js无限加载瀑布（原创）
//随机[m,n]之间的整数 封装
function randomNumber(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}
//随机颜色 封装
function randomColor() {
    return "rgb(" + randomNumber(0, 255) + "," + randomNumber(0, 255) + "," + randomNumber(0, 255) + ")";
}

//获取当前的scrollTop 
var scrollTopDistance;
//获取所有的ul 
var uls = document.querySelectorAll("ul");
var i = 0;
var k = i;

function waterFall() {
    for (i = k; i < k + 4; i++) {
        //创建li 
        var li = document.createElement("li");
        //随机颜色 
        li.style.backgroundColor = randomColor();
        //随机高度 
        li.style.height = randomNumber(120, 400) + "px";
        //手动转换为字符串 
        li.innerHTML = i + 1 + "";
        //插入到对应的ul中 
        //判断哪个ul的高度低，该次创建的li就插入到此ul中 
        var index = 0; //记录下标 
        for (var j = 0; j < uls.length; j++) {
            if (uls[j].offsetHeight < uls[index].offsetHeight) {
                index = j;
            }
        }
        //将元素节点插入文档中 
        uls[index].appendChild(li);
    }
    k = i;
    return uls[index].offsetHeight;
}
waterFall();
//鼠标滚轮事件,由于右侧没有滚轮，所以使用onmousewheel事件
window.onmousewheel = function() {
    //获取窗口的高度，要兼容浏览器
    var windowH = document.documentElement.clientHeight;
    //滚轮于top的距离，要兼容浏览器
    var scrollH = document.documentElement.scrollTop ||
        document.body.scrollTop;
    //获取窗口的可见高度
    var documentH = document.documentElement.scrollHeight ||
        document.body.scrollHeight;
    //窗口的高度 + 滚轮与顶部的距离 > 窗口的可见高度-200
    if (windowH + scrollH > documentH - 200) {
        //执行此函数 
        waterFall()
    }
}
```
## 154.jQuery两个元素比较高度
```js
$(*function* () {
  *var* w_max = 0;
  *//求最大高度*
  $("#MenuNavigation li").each(*function* () {
​    *var* w = $(*this*).innerWidth();
​    w_max = w > w_max ? w : w_max;
  })
  $("#MenuNavigation li").width(w_max)
  *//将最大高度赋值给所有元素，*
})
```
## 155.js定时清除缓存，存储缓存，获取缓存
```js
// 封装本地存储的方法
export const storage = {
  set: function(variable, value, ttl_ms) {
    var data = { value: value, expires_at: new Date(ttl_ms).getTime() };
    localStorage.setItem(variable.toString(), JSON.stringify(data));
  },
  get: function(variable) {
    var data = JSON.parse(localStorage.getItem(variable.toString()));
    if (data !== null) {
      debugger
      if (data.expires_at !== null && data.expires_at < new Date().getTime()) {
        localStorage.removeItem(variable.toString());
      } else {
        return data.value;
      }
    }
    return null;
  },
  remove(key) {
    localStorage.removeItem(key);
  }
}
```
## 156.数组降维
```js
//数组降维
reduceDimension(arr) {
      var reduced = [];
      for (var i = 0; i < arr.length; i++) {
        reduced = reduced.concat(arr[i]);
      }
      return reduced;
}
```
## 157.设置cookie,获取cookie,删除cookie
```js
 var cookieUtil = {
  getCookie: function (name) {
    var arrCookie = document.cookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
      var cookieItem = arrCookie[i].split('=');
      if (cookieItem[0] == name) {
        return cookieItem[1];
      }
    }
    return undefined;
  },
  setCookie: function (name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" +
      encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += "; expires=" + expires.toGMTString();
    }
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure";
    }
    document.cookie = cookieText;
  },
  removeCookie: function (name, path, domain, secure) {
    this.set(name, "", new Date(0), path, domain, secure);
  }
} 
```
## 181.数组去重
### 方案一：Set + ...
```js
function noRepeat(arr) {
  return [...new Set(arr)];
}
noRepeat([1,2,3,1,2,3])
```
### 方案二：Set + Array.from
```js
function noRepeat(arr) {
  return Array.from(new Set(arr));
}
noRepeat([1,2,3,1,2,3])
```
### 方案三：双重遍历比对下标
```js
function noRepeat(arr) {
  return arr.filter((v, idx)=>idx == arr.lastIndexOf(v))
}
noRepeat([1,2,3,1,2,3])
```
### 方案四：单遍历 + Object 特性
```js
Object 的特性是 Key 不会重复。 这里使用 values 是因为可以保留类型，keys 会变成字符串。

function noRepeat(arr) {
  return Object.values(arr.reduce((s,n)=>{
    s[n] = n;
    return s
  },{}))
}
noRepeat([1,2,3,1,2,3])
```
### 后记
针对于上述的方案，还有其他变种实现。

## 182.查找数组最大
### 方案一：Math.max + ...
```js
function arrayMax(arr) {
  return Math.max(...arr);
}
arrayMax([-1,-4,5,2,0])
```
### 方案二：Math.max + apply
```js
function arrayMax(arr) {
  return Math.max.apply(Math, arr)
}
arrayMax([-1,-4,5,2,0])
```
### 方案三：Math.max + 遍历
```js
function arrayMax(arr) {
  return arr.reduce((s,n)=>Math.max(s, n))
}
arrayMax([-1,-4,5,2,0])
```
### 方案四：比较、条件运算法 + 遍历
```js
function arrayMax(arr) {
  return arr.reduce((s,n)=>s>n?s:n)
}
arrayMax([-1,-4,5,2,0])
```
### 方案五：排序
```js
function arrayMax(arr) {
  return arr.sort((n,m)=>m-n)[0]
}
arrayMax([-1,-4,5,2,0])
```
## 184.返回已 size 为长度的数组分割的原数组
```js
#方案一：Array.from + slice
function chunk(arr, size = 1) {
  return Array.from(
    {
      length: Math.ceil(arr.length / size),
    },
    (v, i) => arr.slice(i * size, i * size + size)
  );
}
chunk([1,2,3,4,5,6,7,8],3)
#方案二：Array.from + splice
function chunk(arr, size = 1) {
  return Array.from(
    {
      length: Math.ceil(arr.length / size),
    },
    (v, i) => arr.splice(0, size)
  );
}
chunk([1,2,3,4,5,6,7,8],3)
#方案三：遍历 + splice
function chunk(arr, size = 1) {
    var _returnArr = [];
    while(arr.length){
        _returnArr.push(arr.splice(0, size))
    }
    return _returnArr
}
chunk([1,2,3,4,5,6,7,8],3)
#检查数组中某元素出现的次数
#方案一：reduce
function countOccurrences(arr, value) {
  return arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0);
}
countOccurrences([1,2,3,4,5,1,2,1,2,3], 1)
#方案二：filter
function countOccurrences(arr, value) {
  return arr.filter(v=>v===value).length
}
countOccurrences([1,2,3,4,5,1,2,1,2,3], 1)
```
## 185.扁平化数组
```js
#方案一：递归 + ...
function flatten(arr, depth = -1) {
  if (depth === -1) {
    return [].concat(
      ...arr.map((v) => (Array.isArray(v) ? this.flatten(v) : v))
    );
  }
  if (depth === 1) {
    return arr.reduce((a, v) => a.concat(v), []);
  }
  return arr.reduce(
    (a, v) => a.concat(Array.isArray(v) ? this.flatten(v, depth - 1) : v),
    []
  );
}
flatten([1,[2,[3]]])
#方案二：es6 原生 flat
function flatten(arr, depth = Infinity) {
  return arr.flat(depth)
}
flatten([1,[2,[3]]])
#对比两个数组并且返回其中不同的元素
#方案一：filter + includes
他原文有问题，以下方法的 4,5 没有返回

function diffrence(arrA, arrB) {
  return arrA.filter((v) => !arrB.includes(v));
}
diffrence([1,2,3], [3,4,5,2])
需要再操作一遍

function diffrence(arrA, arrB) {
  return arrA.filter((v) => !arrB.includes(v))
    .concat(arrB.filter((v) => !arrA.includes(v)));
}
diffrence([1,2,3], [3,4,5,2])
#方案二：hash + 遍历
算是方案1的变种吧，优化了 includes 的性能。
```
## 186.返回两个数组中相同的元素
```js
#方案一：filter + includes
function intersection(arr1, arr2) {
  return arr2.filter((v) => arr1.includes(v));
}
intersection([1,2,3], [3,4,5,2])
#方案二：同理变种用 hash
function intersection(arr1, arr2) {
    var set = new Set(arr2)
  return arr1.filter((v) => set.has(v));
}
intersection([1,2,3], [3,4,5,2])
```
## 187.从右删除 n 个元素
```js
#方案一：slice
function dropRight(arr, n = 0) {
  return n < arr.length ? arr.slice(0, arr.length - n) : [];
}
dropRight([1,2,3,4,5], 2)
#方案二: splice
function dropRight(arr, n = 0) {
  return arr.splice(0, arr.length - n)
}
dropRight([1,2,3,4,5], 2)
#方案三: slice 另一种
function dropRight(arr, n = 0) {
  return arr.slice(0, -n)
}
dropRight([1,2,3,4,5], 2)
#方案四: 修改 length
function dropRight(arr, n = 0) {
    arr.length = Math.max(arr.length - n, 0)
    return arr
}
dropRight([1,2,3,4,5], 2)
```
## 188.截取第一个符合条件的元素及其以后的元素
```js
#方案一：slice + 循环
function dropElements(arr, fn) {
  while (arr.length && !fn(arr[0])) arr = arr.slice(1);
  return arr;
}
dropElements([1,2,3,4,5,1,2,3], (v) => v == 2)
#方案二：findIndex + slice
function dropElements(arr, fn) {
  return arr.slice(Math.max(arr.findIndex(fn), 0));
}
dropElements([1,2,3,4,5,1,2,3], (v) => v === 3)
#方案三：splice + 循环
function dropElements(arr, fn) {
  while (arr.length && !fn(arr[0])) arr.splice(0,1);
  return arr;
}
dropElements([1,2,3,4,5,1,2,3], (v) => v == 2)
```
## 189.返回数组中下标间隔 nth 的元素
```js
#方案一：filter
function everyNth(arr, nth) {
  return arr.filter((v, i) => i % nth === nth - 1);
}
everyNth([1,2,3,4,5,6,7,8], 2)
#方案二：方案一修改判断条件
function everyNth(arr, nth) {
  return arr.filter((v, i) => (i+1) % nth === 0);
}
everyNth([1,2,3,4,5,6,7,8], 2)
## 190.返回数组中第 n 个元素（支持负数）
#方案一：slice
function nthElement(arr, n = 0) {
  return (n >= 0 ? arr.slice(n, n + 1) : arr.slice(n))[0];
}
nthElement([1,2,3,4,5], 0)
nthElement([1,2,3,4,5], -1)
#方案二：三目运算符
function nthElement(arr, n = 0) {
  return (n >= 0 ? arr[0] : arr[arr.length + n])
}
nthElement([1,2,3,4,5], 0)
nthElement([1,2,3,4,5], -1)
```
## 191.返回数组头元素
```js
#方案一：
function head(arr) {
  return arr[0];
}
head([1,2,3,4])
#方案二：
function head(arr) {
  return arr.slice(0,1)[0];
}
head([1,2,3,4])
```
## 192.返回数组末尾元素
```js
#方案一：
function last(arr) {
  return arr[arr.length - 1];
}
#方案二：
function last(arr) {
  return arr.slice(-1)[0];
}
last([1,2,3,4,5])
```
## 193.数组乱排
```js
#方案一：洗牌算法
function shuffle(arr) {
  let array = arr;
  let index = array.length;

  while (index) {
    index -= 1;
    let randomInedx = Math.floor(Math.random() * index);
    let middleware = array[index];
    array[index] = array[randomInedx];
    array[randomInedx] = middleware;
  }

  return array;
}
shuffle([1,2,3,4,5])
#方案二：sort + random
function shuffle(arr) {
  return arr.sort((n,m)=>Math.random() - .5)
}
shuffle([1,2,3,4,5])
```
## 194.伪数组转换为数组
```js
#方案一：Array.from
Array.from({length: 2})
#方案二：prototype.slice
Array.prototype.slice.call({length: 2,1:1})
#方案三：prototype.splice
Array.prototype.splice.call({length: 2,1:1},0)
```
# 浏览器对象 BOM
## 195.判读浏览器是否支持 CSS 属性
```js
/**
 * 告知浏览器支持的指定css属性情况
 * @param {String} key - css属性，是属性的名字，不需要加前缀
 * @returns {String} - 支持的属性情况
 */
function validateCssKey(key) {
  const jsKey = toCamelCase(key); // 有些css属性是连字符号形成
  if (jsKey in document.documentElement.style) {
    return key;
  }
  let validKey = "";
  // 属性名为前缀在js中的形式，属性值是前缀在css中的形式
  // 经尝试，Webkit 也可是首字母小写 webkit
  const prefixMap = {
    Webkit: "-webkit-",
    Moz: "-moz-",
    ms: "-ms-",
    O: "-o-",
  };
  for (const jsPrefix in prefixMap) {
    const styleKey = toCamelCase(`${jsPrefix}-${jsKey}`);
    if (styleKey in document.documentElement.style) {
      validKey = prefixMap[jsPrefix] + key;
      break;
    }
  }
  return validKey;
}

/**
 * 把有连字符号的字符串转化为驼峰命名法的字符串
 */
function toCamelCase(value) {
  return value.replace(/-(\w)/g, (matched, letter) => {
    return letter.toUpperCase();
  });
}

/**
 * 检查浏览器是否支持某个css属性值（es6版）
 * @param {String} key - 检查的属性值所属的css属性名
 * @param {String} value - 要检查的css属性值（不要带前缀）
 * @returns {String} - 返回浏览器支持的属性值
 */
function valiateCssValue(key, value) {
  const prefix = ["-o-", "-ms-", "-moz-", "-webkit-", ""];
  const prefixValue = prefix.map((item) => {
    return item + value;
  });
  const element = document.createElement("div");
  const eleStyle = element.style;
  // 应用每个前缀的情况，且最后也要应用上没有前缀的情况，看最后浏览器起效的何种情况
  // 这就是最好在prefix里的最后一个元素是''
  prefixValue.forEach((item) => {
    eleStyle[key] = item;
  });
  return eleStyle[key];
}

/**
 * 检查浏览器是否支持某个css属性值
 * @param {String} key - 检查的属性值所属的css属性名
 * @param {String} value - 要检查的css属性值（不要带前缀）
 * @returns {String} - 返回浏览器支持的属性值
 */
function valiateCssValue(key, value) {
  var prefix = ["-o-", "-ms-", "-moz-", "-webkit-", ""];
  var prefixValue = [];
  for (var i = 0; i < prefix.length; i++) {
    prefixValue.push(prefix[i] + value);
  }
  var element = document.createElement("div");
  var eleStyle = element.style;
  for (var j = 0; j < prefixValue.length; j++) {
    eleStyle[key] = prefixValue[j];
  }
  return eleStyle[key];
}

function validCss(key, value) {
  const validCss = validateCssKey(key);
  if (validCss) {
    return validCss;
  }
  return valiateCssValue(key, value);
}
https://segmentfault.com/a/11... 它里面有 forEach。
```
## 196.返回当前网页地址
```js
#方案一：location
function currentURL() {
  return window.location.href;
}
currentURL()
#方案二：a 标签
function currentURL() {
  var el = document.createElement('a')
  el.href = ''
  return el.href
}
currentURL()
#获取滚动条位置
function getScrollPosition(el = window) {
  return {
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
  };
}
```
## 197.获取 url 中的参数
```js
#方案一：正则 + reduce
function getURLParameters(url) {
  return url
    .match(/([^?=&]+)(=([^&]*))/g)
    .reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
      ),
      {}
    );
}
getURLParameters(location.href)
#方案二：split + reduce
function getURLParameters(url) {
  return url
    .split('?') //取？分割
    .slice(1) //不要第一部分
    .join() //拼接
    .split('&')//&分割
    .map(v=>v.split('=')) //=分割
    .reduce((s,n)=>{s[n[0]] = n[1];return s},{})
}
getURLParameters(location.href)
// getURLParameters('')
#方案三: URLSearchParams
```
## 198.页面跳转，是否记录在 history 中
```js
#方案一：
function redirect(url, asLink = true) {
  asLink ? (window.location.href = url) : window.location.replace(url);
}
#方案二：
function redirect(url, asLink = true) {
  asLink ? window.location.assign(url) : window.location.replace(url);
}
```
## 199.滚动条回到顶部动画
```js
#方案一： c - c / 8
c 没有定义

function scrollToTop() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  } else {
    window.cancelAnimationFrame(scrollToTop);
  }
}
scrollToTop()
修正之后

function scrollToTop() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, scrollTop - scrollTop / 8);
  } else {
    window.cancelAnimationFrame(scrollToTop);
  }
}
scrollToTop()
```
## 200.复制文本
```js
#方案一：
function copy(str) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}
```
## 201.检测设备类型
```js
#方案一： ua
function detectDeviceType() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? "Mobile"
    : "Desktop";
}
detectDeviceType()
#方案二：事件属性
function detectDeviceType() {
  return ("ontouchstart" in window || navigator.msMaxTouchPoints)
    ? "Mobile"
    : "Desktop";
}
detectDeviceType()
```
## 202.Cookie
```js
#增
function setCookie(key, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    key +
    "=" +
    escape(value) +
    (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
}
#删
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
#查
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return arr[2];
  } else {
    return null;
  }
}
#清空
有时候我们想清空，但是又无法获取到所有的cookie。 这个时候我们可以了利用写满，然后再清空的办法。
```
#日期 Date
## 203.时间戳转换为时间
```js
默认为当前时间转换结果
isMs 为时间戳是否为毫秒
function timestampToTime(timestamp = Date.parse(new Date()), isMs = true) {
  const date = new Date(timestamp * (isMs ? 1 : 1000));
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
补位可以改成 padStart
补位还可以改成 slice image.png
如果做海外的话，还会有时区问题，一般我用moment解决。如果想看原生的

#获取当前时间戳
基于上一个想到的问题

#方案一：Date.parse(new Date())
#方案二：Date.now()
#方案三：+new Date()
#文档对象 DOM
#固定滚动条
/**
 * 功能描述：一些业务场景，如弹框出现时，需要禁止页面滚动，这是兼容安卓和 iOS 禁止页面滚动的解决方案
 */

let scrollTop = 0;

function preventScroll() {
  // 存储当前滚动位置
  scrollTop = window.scrollY;

  // 将可滚动区域固定定位，可滚动区域高度为 0 后就不能滚动了
  document.body.style["overflow-y"] = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.top = -scrollTop + "px";
  // document.body.style['overscroll-behavior'] = 'none'
}

function recoverScroll() {
  document.body.style["overflow-y"] = "auto";
  document.body.style.position = "static";
  // document.querySelector('body').style['overscroll-behavior'] = 'none'

  window.scrollTo(0, scrollTop);
}
#判断当前位置是否为页面底部
返回值为 true/false
function bottomVisible() {
  return (
    document.documentElement.clientHeight + window.scrollY >=
    (document.documentElement.scrollHeight ||
      document.documentElement.clientHeight)
  );
}
#判断元素是否在可视范围内
partiallyVisible 为是否为完全可见
function elementIsVisibleInViewport(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();

  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}
```
## 204.获取元素 css 样式
```js
function getStyle(el, ruleName) {
  return getComputedStyle(el, null).getPropertyValue(ruleName);
}
```
## 205.进入全屏
```js
function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

launchFullscreen(document.documentElement);
launchFullscreen(document.getElementById("id")); //某个元素进入全屏
```
## 退出全屏
```js
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

exitFullscreen();
```
## 全屏事件
```js
document.addEventListener("fullscreenchange", function (e) {
  if (document.fullscreenElement) {
    console.log("进入全屏");
  } else {
    console.log("退出全屏");
  }
});
```
### 数字 Number
## 206.数字千分位分割
```js
function commafy(num) {
  return num.toString().indexOf(".") !== -1
    ? num.toLocaleString()
    : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}
commafy(1000)
```
## 207.生成随机数
```js
function randomNum(min, max) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * min + 1, 10);
    case 2:
      return parseInt(Math.random() * (max - min + 1) + min, 10);
    default:
      return 0;
  }
}
randomNum(1,10)
```
