---
title: 表单校验
date: 2020-10-01
tags:
 - js工具集
categories: 
 - js
---
## 校验不能包含字母
```js
/**
@param { string } value
*/
export const isNoWord = value => /^[^A-Za-z]*$/g.test(value);
```
## 校验银行卡号
```js
/**
@param { string } value
*/
export const isAccountNumber = value => /^[1-9]\d{9,29}$/g.test(value);
```
## 验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段
```js
/**
@param { string } value
*/
export const isMPStrict = value => /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(value);
```
## 验证手机号中国(宽松), 只要是13,14,15,16,17,18,19开头即可
```js
/**
@param { string } value
*/
export const isMPRelaxed = value => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(value);
```
## 判断是否是手机号
```js
/**

  * @description 判断是否是手机号
  * @param str
* @returns {boolean}
   */
   export function isPhone(str) {
     const reg = /^1\d{10}$/;
     return reg.test(str);
   }
```
## 判断是否为固话
```js
/**

  * @description 判断是否为固话
  * @param str
* @returns {boolean}
   */
   export function isTel(str) {
     const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
     return reg.test(str);
   }
## 验证email(邮箱)
```js
/**
@param { string } value
*/
export const isEmail = value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g.test(value);
```
## 判断是否是邮箱
```js
/**

  * @description 判断是否是邮箱
  * @param str
* @returns {boolean}
   */
   export function isEmail(str) {
     const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
     return reg.test(str);
   }
```
## 验证座机电话(国内),如: 0341-86091234
```js
/**
@param { string } value
*/
export const isLandlineTelephone = value => /\d{3}-\d{8}|\d{4}-\d{7}/g.test(value);
```
## 验证身份证号(1代,15位数字)
```js
/**
@param { string } value
*/
export const isIDCardOld = value => /^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$/g.test(value);
```
## 验证身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X
```js
/**
@param { string } value
*/
export const isIDCardNew = value => /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dXx]$/g.test(value);
```
## 验证身份证号, 支持1/2代(15位/18位数字)
```js
/**
@param { string } value
*/
export const isIDCard = value => /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/g.test(value);
```
## 判断是否是身份证号(第二代)
```js
/**

  * @description 判断是否是身份证号(第二代)
  * @param str
* @returns {boolean}
   */
   export function isIdCard(str) {
     const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
     return reg.test(str);
   }
```
## 验证中文/汉字
```js
/**
@param { string } value
*/
export const isChineseCharacter = value => /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/g.test(value);
```
## 判断是否中文
```js
/**

  * @description 判断是否中文
  * @param str
* @returns {boolean}
   */
   export function isChina(str) {
     const reg = /^[\u4E00-\u9FA5]{2,4}$/;
     return reg.test(str);
   }
```
## 验证小数
```js
/**
@param { string } value
*/
export const isDecimal = value => /^\d+\.\d+$/g.test(value);
```
## 验证数字
```js
/**
@param { string } value
*/
export const isNumber = value => /^\d{1,}$/g.test(value);
```
## 验证qq号格式
```js
/**
@param { string } value
*/
export const isQQNum = value => /^[1-9][0-9]{4,10}$/g.test(value);
```
## 验证数字和字母组成
```js
/**
@param { string } value
*/
export const isNumAndStr = value => /^[A-Za-z0-9]+$/g.test(value);
```
## 验证英文字母
```js
/**
@param { string } value
*/
export const isEnglish = value => /^[a-zA-Z]+$/g.test(value);
```
## 验证大写英文字母
```js
/**
@param { string } value
*/
export const isCapital = value => /^[A-Z]+$/g.test(value);
```
## 验证小写英文字母
```js
/**
@param { string } value
*/
export const isLowercase = value => /^[a-z]+$/g.test(value);
```
## 判读是否为外链
```js
/**

 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
   */
   export function isExternal(path) {
     return /^(https?:|mailto:|tel:)/.test(path);
   }
```
## 判断是否为数字
```js
/**

  * @description 判断是否为数字
  * @param value
* @returns {boolean}
   */
   export function isNumber(value) {
     const reg = /^[0-9]*$/;
     return reg.test(value);
   }
```
## 判断是否是名称
```js
 /**

   * @description 判断是否是名称
   * @param value
 * @returns {boolean}
    */
    export function isName(value) {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
      return reg.test(value);
    }
```
## 判断是否为IP
```js
/**

  * @description 判断是否为IP
  * @param ip
* @returns {boolean}
   */
   export function isIP(ip) {
     const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
     return reg.test(ip);
   }
```
## 判断是否是传统网站
```js
/**

  * @description 判断是否是传统网站
  * @param url
* @returns {boolean}
   */
   export function isUrl(url) {
     const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
     return reg.test(url);
   }
```
## 判断是否是小写字母
```js
/**

  * @description 判断是否是小写字母
  * @param str
* @returns {boolean}
   */
   export function isLowerCase(str) {
     const reg = /^[a-z]+$/;
     return reg.test(str);
   }
```
## 判断是否是大写字母
```js
/**

  * @description 判断是否是大写字母
  * @param str
* @returns {boolean}
   */
   export function isUpperCase(str) {
     const reg = /^[A-Z]+$/;
     return reg.test(str);
   }
```
## 判断是否是大写字母开头
```js
/**

  * @description 判断是否是大写字母开头
  * @param str
* @returns {boolean}
   */
   export function isAlphabets(str) {
     const reg = /^[A-Za-z]+$/;
     return reg.test(str);
   }
```
## 判断是否是字符串
```js
/**

  * @description 判断是否是字符串
* @param str
 * @returns {boolean}
   */
   export function isString(str) {
     return typeof str === "string" || str instanceof String;
   }
```
## 判断是否是数组
```js
/**

  * @description 判断是否是数组
    * @param arg
  * @returns {arg is any[]|boolean}
    */
  export function isArray(arg) {
     if (typeof Array.isArray === "undefined") {
   return Object.prototype.toString.call(arg) === "[object Array]";
     }
     return Array.isArray(arg);
   }
```
## 判断是否是端口号
```js
/**

  * @description 判断是否是端口号
  * @param str
* @returns {boolean}
   */
   export function isPort(str) {
     const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
     return reg.test(str);
   }
```





```
## 判断是否为数字且最多两位小数
```js
/**

  * @description 判断是否为数字且最多两位小数
  * @param str
* @returns {boolean}
   */
   export function isNum(str) {
     const reg = /^\d+(\.\d{1,2})?$/;
     return reg.test(str);
   }
```
## 判断经度 -180.0～+180.0（整数部分为0～180，必须输入1到5位小数）
```js
/**

  * @description 判断经度 -180.0～+180.0（整数部分为0～180，必须输入1到5位小数）
  * @param str
* @returns {boolean}
   */
   export function isLongitude(str) {
     const reg = /^[-|+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/;
     return reg.test(str);
   }
```
## 判断纬度 -90.0～+90.0（整数部分为0～90，必须输入1到5位小数）
```js
/**

  * @description 判断纬度 -90.0～+90.0（整数部分为0～90，必须输入1到5位小数）
  * @param str
* @returns {boolean}
   */
   export function isLatitude(str) {
     const reg = /^[-|+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/;
     return reg.test(str);
   }
```
## 判断IE浏览器版本和检测是否为非IE浏览器
```js
function IEVersion() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (fIEVersion == 7) {
			return 7;
		} else if (fIEVersion == 8) {
			return 8;
		} else if (fIEVersion == 9) {
			return 9;
		} else if (fIEVersion == 10) {
			return 10;
		} else {
			return 6; //IE版本<=7
		}
	} else if (isEdge) {
		return 'edge'; //edge
	} else if (isIE11) {
		return 11; //IE11  
	} else {
		return -1; //不是ie浏览器
	}
}
```
## Windows根据详细版本号判断当前系统名称
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
## 判断手机是Andoird还是IOS
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
