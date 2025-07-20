"use strict";

var longStr = "这是一个非常非常非常长的字符串，包含一些有用的数据和一些无用的数据";
var part = ("" + longStr).slice(0, 10); // 截取前10个字符

var sub1 = ("" + longStr).substring(0, 10);
var sub2 = ("" + longStr).substr(0, 10);
