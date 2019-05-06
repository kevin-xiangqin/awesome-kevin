import * as iconvlite from "iconv-lite";
import * as crypto from "crypto";

// 看到char自觉。。。byte实在编不出来
type char = string;

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItemFromArray = <T>(arr: Array<T>): T => arr[randomNumber(0, arr.length - 1)];
const DefalutTudouChar: char[] = [
    '滅', '苦', '婆', '娑', '耶', '陀', '跋', '多', '漫', '都', '殿', '悉', '夜', '爍', '帝', '吉',
    '利', '阿', '無', '南', '那', '怛', '喝', '羯', '勝', '摩', '伽', '謹', '波', '者', '穆', '僧',
    '室', '藝', '尼', '瑟', '地', '彌', '菩', '提', '蘇', '醯', '盧', '呼', '舍', '佛', '參', '沙',
    '伊', '隸', '麼', '遮', '闍', '度', '蒙', '孕', '薩', '夷', '迦', '他', '姪', '豆', '特', '逝',
    '朋', '輸', '楞', '栗', '寫', '數', '曳', '諦', '羅', '曰', '咒', '即', '密', '若', '般', '故',
    '不', '實', '真', '訶', '切', '一', '除', '能', '等', '是', '上', '明', '大', '神', '知', '三',
    '藐', '耨', '得', '依', '諸', '世', '槃', '涅', '竟', '究', '想', '夢', '倒', '顛', '離', '遠',
    '怖', '恐', '有', '礙', '心', '所', '以', '亦', '智', '道', '。', '集', '盡', '死', '老', '至'
];

const sweetCharList: char[] = [
    '大', '家', '盛', '情', '难', '却', '，', '怎', '么', '办', '@', 'a', 'y', '我', '们', '去',
    '淘', '宝', '领', '个', '证', '0', '后', '程', '序', '员', '不', '会', '写', '代', '码', 'C',
    'T', 'O', '1', '次', '相', '亲', '就', '成', '功', '的', '话', '有', 'B', 'U', 'G', '沙',
    '伊', '隸', '麼', '遮', '闍', '度', '蒙', '孕', '薩', '夷', '迦', '他', '姪', '豆', '特', '逝',
    '朋', '輸', '楞', '栗', '寫', '數', '曳', '諦', '羅', '曰', '咒', '即', '密', '若', '般', '故',
    '门', '實', '真', '訶', '切', '一', '除', '能', '等', '是', '上', '明', '厦', '神', '知', '三',
    '藐', '耨', '得', '依', '諸', '世', '槃', '涅', '竟', '究', '想', '夢', '倒', '顛', '離', '遠',
    '怖', '恐', '癔', '礙', '心', '所', '以', '亦', '智', '道', '。', '集', '盡', '死', '老', '至'
];

// 类身上的use方法来修改TudouChar
let TudouChar: char[] = DefalutTudouChar;

export enum Mode {
    Ayaa = "Ayaa",
};

export default class Kevin {
    private static key: string = "XDXDtudou@KeyFansClub^_^Encode!!";
    private static vector: string = "Potato@Key@_@=_=";

    private static TudouKeyWord: char[] = ['冥', '奢', '梵', '呐', '俱', '哆', '怯', '諳', '罰', '侄', '缽', '皤'];

    public static ToBytes(TudouString: string): number[] {
        const TudouKeyWordList: char[] = Kevin.TudouKeyWord;
        const TudouCharList: char[] = TudouChar;
        const encodeBuffer: number[] = Array(TudouString.length).fill(0);

        let j: number = 0;
        for (let i = 0; i < TudouString.length; i++ , j++) {
            if (TudouKeyWordList.includes(TudouString[i])) {
                encodeBuffer[j] = TudouCharList.indexOf(TudouString[i + 1]) ^ 0x80;
                i++;
            } else {
                encodeBuffer[j] = TudouCharList.indexOf(TudouString[i]);
            }
        }

        const trimedBuffer: number[] = encodeBuffer.slice(0, j);
        return trimedBuffer;
    }

    public static Encode(OriginalString: string): string {
        // 按小端解
        const originalBuffer = iconvlite.encode(OriginalString, "UTF-16LE");
        // use aes-256-cbc
        const cipher = crypto.createCipheriv("aes-256-cbc", Kevin.key, Kevin.vector);
        const encodeBuffer = Buffer.concat([
            cipher.update(originalBuffer),
            cipher.final()
        ]);
        let TudouString: string = "";
        for (let i = 0; i < encodeBuffer.length; i++) {
            const byte: number = encodeBuffer[i];
            if (byte >= 0x80) {
                TudouString += randomItemFromArray(Kevin.TudouKeyWord);
                TudouString += TudouChar[byte ^ 0x80];
            } else {
                TudouString += TudouChar[byte];
            }
        }

        return TudouString;
    }

    public static Decode(EncodeText: string) {
        EncodeText = EncodeText.replace(/^Kevin港：/, "");
        const EncodeArray: number[] = Kevin.ToBytes(EncodeText);
        const decipher = crypto.createDecipheriv("aes-256-cbc", Kevin.key, Kevin.vector);
        const EncodeBuffer = Buffer.from(EncodeArray);
        try {
            const DecodeBuff = Buffer.concat([
                decipher.update(EncodeBuffer),
                decipher.final()
            ]);
            return iconvlite.decode(DecodeBuff, "UTF-16LE");
        } catch (error) {
            console.log(`TudouChar数组长度`, TudouChar.length);
            const set = new Set(TudouChar);
            console.log(`set长度:`, set.size);

            if (TudouChar.length > set.size) {
                console.log(`哪个天才提交的TudouChar有重复了`);
                for (let i in TudouChar) {
                    if (TudouChar.indexOf(TudouChar[i]) != TudouChar.lastIndexOf(TudouChar[i])) {
                        console.log("下标为：" + i);
                        console.log("数组中有重复元素：" + TudouChar[i]);
                    }
                }
            }
            throw error;
        }
    }

    public static use(mode: Mode): void;
    public static use(mode: char[]): void;
    public static use(mode): void {
        // 动态替换所以要动态校验
        if(mode === Mode.Ayaa){
            // 不要直接写TudouChar = sweetCharList 还是按程序走执行下校验
            return Kevin.use(sweetCharList);
        }else if(Array.isArray(mode) && mode.every(s=>typeof s === "string" && s.length === 1)){
            // 验证数组里有没有重复字
            const set = new Set(TudouChar);
            if (TudouChar.length > set.size) {
                console.log(`TudouChar数组长度`, TudouChar.length);
                console.log(`set长度:`, set.size);
                for (let i in TudouChar) {
                    if (TudouChar.indexOf(TudouChar[i]) != TudouChar.lastIndexOf(TudouChar[i])) {
                        console.log("下标为：" + i);
                        console.log("数组中有重复元素：" + TudouChar[i]);
                    }
                }
                throw new Error(`哪个天才提交的TudouChar有重复了`);
            }
            TudouChar = mode;
        }else{
            throw new Error(`醒醒，参数必须是枚举值或者Array<Char>`);
        }
    }
}
