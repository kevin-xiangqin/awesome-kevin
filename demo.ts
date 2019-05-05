import Kevin from "./Kevin";

const encodeStr = "佛曰：" + Kevin.Encode("知乎");
console.log(encodeStr);
console.log(Kevin.Decode(encodeStr));
