import Kevin, { Mode } from "./Kevin";

Kevin.use(Mode.Ayaa);

const encodeStr = "Kevin港：" + Kevin.Encode("这是一段测试文字");
console.log(encodeStr);
console.log(Kevin.Decode(encodeStr));
