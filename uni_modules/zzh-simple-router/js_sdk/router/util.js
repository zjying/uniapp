const toString = Object.prototype.toString

export class Check {
	/**
	 * @description 判断是否是Object类型
	 */
	static isObject(value) {
		return toString.call(value) === '[object Object]'
	}

	static isPlainObject(value) {
		return (
			value &&
			toString.call(value) === '[object Object]' &&
			JSON.stringify(value) == '{}'
		)
	}

	/**
	 * @description 判断是否是String类型
	 */
	static isString(value) {
		return toString.call(value) === '[object String]'
	}

	/**
	 * @description 判断是否是Boolean类型
	 */
	static isNumber(value) {
		return toString.call(value) === '[object Number]'
	}
}

const utf8to16 = (str) => {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while (i < len) {
		c = str.charCodeAt(i++);
		// console.log(c, c >> 4)
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += str.charAt(i - 1);
				break;
			case 12:
			case 13:
				// 110x xxxx   10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) |
					((char2 & 0x3F) << 6) |
					((char3 & 0x3F) << 0));
				break;
		}
	}
	return out;
}

const utf16to8 = (str) => {
	var out, i = 0,
		len, c;
	out = "";
	len = str.length;
	while (i < len) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
		i++
	}
	return out;
}

/**
 * @description 去除+/=网络不安全字符 
 */
const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

const b64chs = Array.prototype.slice.call(digits);
const b64tab = ((a) => { // 转换成查表避免每次执行以获取更快的性能
	let tab = {};
	a.forEach((c, i) => tab[c] = i);
	return tab;
})(b64chs);

function base64Encode(text) {
	if (/([^\u0000-\u00ff])/.test(text)) {
		throw new Error("Can't base64 encode non-ASCII characters.");
	}

	var i = 0,
		cur, prev, byteNum,
		result = [];

	while (i < text.length) {

		cur = text.charCodeAt(i);
		byteNum = i % 3;

		switch (byteNum) {
			case 0: //first byte

				result.push(b64chs[cur >> 2]);
				// result.push(digits.charAt(cur >> 2));
				break;

			case 1: //second byte
				result.push(b64chs[(prev & 3) << 4 | (cur >> 4)]);

				// result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
				break;

			case 2: //third byte
				result.push(b64chs[(prev & 0x0f) << 2 | (cur >> 6)]);
				result.push(b64chs[cur & 0x3f]);

				// result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
				// result.push(digits.charAt(cur & 0x3f));
				break;
		}

		prev = cur;
		i++;
	}

	if (byteNum == 0) {
		result.push(b64chs[(prev & 3) << 4]);
		// result.push("==");
	} else if (byteNum == 1) {
		result.push(b64chs[(prev & 0x0f) << 2]);
		// result.push("=");
	}

	return result.join("");
}


function base64Decode(text) {

	text = text.replace(/\s/g, "");

	//local variables
	var cur, prev, digitNum,
		i = 0,
		result = [];

	while (i < text.length) {
		// cur = digits.indexOf(text.charAt(i));
		cur = b64tab[text.charAt(i)]
		digitNum = i % 4;

		switch (digitNum) {

			//case 0: first digit - do nothing, not enough info to work with

			case 1: //second digit
				result.push(String.fromCharCode(prev << 2 | cur >> 4));
				break;

			case 2: //third digit
				result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
				break;

			case 3: //fourth digit
				result.push(String.fromCharCode((prev & 3) << 6 | cur));
				break;
		}

		prev = cur;
		i++;
	}

	return result.join("");
}

function adapterBase64Decode(str) {
	return utf8to16(base64Decode(str));
}

function adapterBase64Encode(str) {
	return base64Encode(utf16to8(str));
}

export const Base64 = {
	decode: adapterBase64Decode,
	encode: adapterBase64Encode
}
/**
 *@desc 将json参数转换为url字符串，如果json只有一层，则直接拼接，超过一层则直接JSON.stringify转为字符串处理
 * 
 */
const encodeUrl = (str, encode) => (encode === undefined || encode) ? encodeURIComponent(str) : str

export function jsonToUrlStr(param, encode) {

	if (param == null) return '';

	let paramStr = '';

	const keys = Object.keys(param)
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const val = param[key]

		let valStr = ''
		if (typeof s === 'object') {
			valStr = JON.stringify(val)
		} else valStr = val

		paramStr += `${i === 0 ?'' : '&'}${encodeUrl(key, encode)}=${encodeUrl(valStr, encode)}`
	}

	return paramStr;
};


export function paramsToUrl(obj) {
	return Object.entries(obj)
		.map((item) => {
			let key = item[0]
			let val = item[1]

			switch (typeof val) {
				case 'number':
					return `${key}=${val}_nn`
				case 'string':
					return `${key}=${val}_ss`
				case 'boolean':
					return `${key}=${val}_bb`
				case 'undefined':
					return `${key}=undefined_uu`
				default:
					if (val === null) {
						return `${key}=null_ll`
					} else {
						try {
							return `${key}=${JSON.stringify(val)}_oo`
						} catch (error) {
							return `${key}=${val}_ss`
						}
					}
			}
		})
		.join('&')
}

export function paramsToObj(obj) {
	return Object.entries(obj).reduce((prev, cur) => {
		let key = cur[0]
		let val = cur[1]
		let type = val.slice(-3)
		if (!['_nn', '_ss', '_bb', '_uu', '_ll', '_oo'].includes(type)) {
			prev[key] = val
			return prev
		} 
		val = val.slice(0, -3)

		let res
		switch (type) {
			case '_nn':
				res = Number(val)
				break
			case '_ss':
				res = val
				break
			case '_bb':
				res = val === 'false' ? false : true
				break
			case '_uu':
				res = undefined
				break
			case '_ll':
				res = null
				break
			case '_oo':
				try {
					res = JSON.parse(val)
				} catch (error) {
					res = {}
				}
				break
			default:
				res = val
		}
		prev[key] = res
		return prev
	}, {})
}
