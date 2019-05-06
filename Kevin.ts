import * as iconvlite from "iconv-lite";
import * as crypto from "crypto";

// 看到char自觉。。。byte实在编不出来
type char = string;

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItemFromArray = <T>(arr: Array<T>): T => arr[randomNumber(0, arr.length - 1)];

export default class Kevin {
    private static key: string = "XDXDtudou@KeyFansClub^_^Encode!!";
    private static vector: string = "Potato@Key@_@=_=";

    private static TudouKeyWord: char[] = ['冥', '奢', '梵', '呐', '俱', '哆', '怯', '諳', '罰', '侄', '缽', '皤'];
    private static TudouChar: char[] = [
        '滅', '苦', '婆', '娑', '耶', '陀', '跋', '多', '漫', '都', '殿', '悉', '夜', '爍', '帝', '吉',
        '利', '阿', '無', '南', '那', '怛', '喝', '羯', '勝', '摩', '伽', '謹', '波', '者', '穆', '僧',
        '室', '藝', '尼', '瑟', '地', '彌', '菩', '提', '蘇', '醯', '盧', '呼', '舍', '佛', '參', '沙',
        '伊', '隸', '麼', '遮', '闍', '度', '蒙', '孕', '薩', '夷', '迦', '他', '姪', '豆', '特', '逝',
        '朋', '輸', '楞', '栗', '寫', '數', '曳', '諦', '羅', '曰', '咒', '即', '密', '若', '般', '故',
        '不', '實', '真', '訶', '切', '一', '除', '能', '等', '是', '上', '明', '大', '神', '知', '三',
        '藐', '耨', '得', '依', '諸', '世', '槃', '涅', '竟', '究', '想', '夢', '倒', '顛', '離', '遠',
        '怖', '恐', '有', '礙', '心', '所', '以', '亦', '智', '道', '。', '集', '盡', '死', '老', '至'
    ];

    public static ToBytes(TudouString: string): number[] {
        const TudouKeyWordList: char[] = Kevin.TudouKeyWord;
        const TudouCharList: char[] = Kevin.TudouChar;
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
        const unicodeBuf = iconvlite.encode(OriginalString, "UTF-16LE");
        const originalBuffer = new Uint8Array(unicodeBuf);
        // use aes-256-cbc
        const cipher = crypto.createCipheriv("aes-256-cbc", Kevin.key, Kevin.vector);
        const encodeBuffer = Buffer.concat([
            cipher.update(originalBuffer),
            cipher.final()
        ])
        let TudouString: string = "";
        for (let i = 0; i < encodeBuffer.length; i++) {
            const byte: number = encodeBuffer[i];
            if (byte >= 0x80) {
                TudouString += randomItemFromArray(Kevin.TudouKeyWord);
                TudouString += Kevin.TudouChar[byte ^ 0x80];
            } else {
                TudouString += Kevin.TudouChar[byte];
            }
        }

        return TudouString;
    }

    public static Decode(EncodeText: string) {
        EncodeText = EncodeText.replace(/^佛曰：/, "");
        const EncodeArray: number[] = Kevin.ToBytes(EncodeText);
        const decipher = crypto.createDecipheriv("aes-256-cbc", Kevin.key, Kevin.vector);
        const EncodeBuffer = new Uint8Array(Buffer.from(EncodeArray));
        const DecodeBuff = Buffer.concat([
            decipher.update(EncodeBuffer),
            decipher.final()
        ]);
        return iconvlite.decode(DecodeBuff, "UTF-16LE");
    }
}
