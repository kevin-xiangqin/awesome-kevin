import Kevin from "./Kevin";

const encodeStr = "佛曰：" + Kevin.Encode("这是一段测试文字");
console.log(encodeStr);
console.log(Kevin.Decode(encodeStr));
