var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// cognatio/web/client/navigator/src/lib/regional.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function blob_md5(blob) {
  return new Promise((res, rej) => {
    blob.arrayBuffer().then((bbytes) => {
      res(
        hex_md5(
          binl2rstr(
            binl_md5(bbytes)
          )
        )
      );
    });
  });
}
__name(blob_md5, "blob_md5");
__name2(blob_md5, "blob_md5");
var hexcase = 0;
var b64pad = "";
function hex_md5(s) {
  return rstr2hex(rstr_md5(str2rstr_utf8(s)));
}
__name(hex_md5, "hex_md5");
__name2(hex_md5, "hex_md5");
function b64_md5(s) {
  return rstr2b64(rstr_md5(str2rstr_utf8(s)));
}
__name(b64_md5, "b64_md5");
__name2(b64_md5, "b64_md5");
function rstr_md5(s) {
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}
__name(rstr_md5, "rstr_md5");
__name2(rstr_md5, "rstr_md5");
function rstr2hex(input) {
  try {
    hexcase;
  } catch (e) {
    hexcase = 0;
  }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for (var i = 0; i < input.length; i++) {
    x = input.charCodeAt(i);
    output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15);
  }
  return output;
}
__name(rstr2hex, "rstr2hex");
__name2(rstr2hex, "rstr2hex");
function rstr2b64(input) {
  try {
    b64pad;
  } catch (e) {
    b64pad = "";
  }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for (var i = 0; i < len; i += 3) {
    var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt(triplet >>> 6 * (3 - j) & 63);
    }
  }
  return output;
}
__name(rstr2b64, "rstr2b64");
__name2(rstr2b64, "rstr2b64");
function str2rstr_utf8(input) {
  var output = "";
  var i = -1;
  var x, y;
  while (++i < input.length) {
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if (55296 <= x && x <= 56319 && 56320 <= y && y <= 57343) {
      x = 65536 + ((x & 1023) << 10) + (y & 1023);
      i++;
    }
    if (x <= 127)
      output += String.fromCharCode(x);
    else if (x <= 2047)
      output += String.fromCharCode(
        192 | x >>> 6 & 31,
        128 | x & 63
      );
    else if (x <= 65535)
      output += String.fromCharCode(
        224 | x >>> 12 & 15,
        128 | x >>> 6 & 63,
        128 | x & 63
      );
    else if (x <= 2097151)
      output += String.fromCharCode(
        240 | x >>> 18 & 7,
        128 | x >>> 12 & 63,
        128 | x >>> 6 & 63,
        128 | x & 63
      );
  }
  return output;
}
__name(str2rstr_utf8, "str2rstr_utf8");
__name2(str2rstr_utf8, "str2rstr_utf8");
function rstr2binl(input) {
  var output = Array(input.length >> 2);
  for (var i = 0; i < output.length; i++)
    output[i] = 0;
  for (var i = 0; i < input.length * 8; i += 8)
    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
  return output;
}
__name(rstr2binl, "rstr2binl");
__name2(rstr2binl, "rstr2binl");
function binl2rstr(input) {
  var output = "";
  for (var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
  return output;
}
__name(binl2rstr, "binl2rstr");
__name2(binl2rstr, "binl2rstr");
function binl_md5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}
__name(binl_md5, "binl_md5");
__name2(binl_md5, "binl_md5");
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
__name(md5_cmn, "md5_cmn");
__name2(md5_cmn, "md5_cmn");
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn(b & c | ~b & d, a, b, x, s, t);
}
__name(md5_ff, "md5_ff");
__name2(md5_ff, "md5_ff");
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn(b & d | c & ~d, a, b, x, s, t);
}
__name(md5_gg, "md5_gg");
__name2(md5_gg, "md5_gg");
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
__name(md5_hh, "md5_hh");
__name2(md5_hh, "md5_hh");
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}
__name(md5_ii, "md5_ii");
__name2(md5_ii, "md5_ii");
function safe_add(x, y) {
  var lsw = (x & 65535) + (y & 65535);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
__name(safe_add, "safe_add");
__name2(safe_add, "safe_add");
function bit_rol(num2, cnt) {
  return num2 << cnt | num2 >>> 32 - cnt;
}
__name(bit_rol, "bit_rol");
__name2(bit_rol, "bit_rol");
function sentry_setup(dev_mode, sentry_url) {
  if (!dev_mode) {
    console.log("Starting browser in non-development mode. Launching SentryIO");
    Sentry.init({ dsn: sentry_url });
  } else {
    console.log("Starting browser in development mode");
  }
}
__name(sentry_setup, "sentry_setup");
__name2(sentry_setup, "sentry_setup");
function bindify_console() {
  console.todo = function(msg) {
    console.log("%c//TODO: " + msg, "color: #6a9955");
  };
}
__name(bindify_console, "bindify_console");
__name2(bindify_console, "bindify_console");
function bindify_number() {
  Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };
}
__name(bindify_number, "bindify_number");
__name2(bindify_number, "bindify_number");
function generate_hash() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 25; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
__name(generate_hash, "generate_hash");
__name2(generate_hash, "generate_hash");
function checksum_json(data2) {
  return b64_md5(JSON.stringify(data2));
}
__name(checksum_json, "checksum_json");
__name2(checksum_json, "checksum_json");
function validate_email(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
__name(validate_email, "validate_email");
__name2(validate_email, "validate_email");
function download_file(src_url, file_name) {
  var $dl = $("<a></a>").attr("href", src_url).attr("download", file_name == void 0 ? "download_file" : file_name).css("display", "none");
  $("body").append($dl);
  $dl.get(0).click();
}
__name(download_file, "download_file");
__name2(download_file, "download_file");
function str_locations(substring, string) {
  var a = [], i = -1;
  while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
}
__name(str_locations, "str_locations");
__name2(str_locations, "str_locations");
function serial_promises(promise_fns) {
  if (promise_fns[0] instanceof Promise) throw new Error(
    "serial_promises() takes a list of functions that return promises, not a list of actual promises."
  );
  let out_list = [];
  return new Promise((res, rej) => {
    let fn = /* @__PURE__ */ __name2((index) => {
      promise_fns[index]().then((out) => {
        out_list.push(out);
        if (index + 1 < promise_fns.length) {
          fn(index + 1);
        } else {
          res(out_list);
        }
      });
    }, "fn");
    fn(0);
  });
}
__name(serial_promises, "serial_promises");
__name2(serial_promises, "serial_promises");
function path_ext(fpath) {
  let name = fpath.split("/").pop();
  if (name.indexOf(".") == -1) return void 0;
  let ext = name.split(".").pop();
  return ext;
}
__name(path_ext, "path_ext");
__name2(path_ext, "path_ext");
var _throttle_memspace = {};
function throttle_leading(min_delay_ms, fn) {
  const fnid = generate_hash();
  return (...args) => {
    if (!_throttle_memspace.hasOwnProperty(fnid)) _throttle_memspace[fnid] = 0;
    let elapsed_ms = Date.now() - _throttle_memspace[fnid];
    if (elapsed_ms > min_delay_ms) {
      fn(...args);
      _throttle_memspace[fnid] = Date.now();
    }
  };
}
__name(throttle_leading, "throttle_leading");
__name2(throttle_leading, "throttle_leading");
function linterp(x1, x2, y1, y2, x) {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
}
__name(linterp, "linterp");
__name2(linterp, "linterp");
var ColorUtil = class _ColorUtil {
  static {
    __name(this, "_ColorUtil");
  }
  static {
    __name2(this, "ColorUtil");
  }
  /**
   * Tries to convert a color name to rgb/a hex representation
   * @param name
   * @returns {string | CanvasGradient | CanvasPattern}
   */
  static standardizeColor(name) {
    if (name.toLowerCase() === "black") {
      return "#000";
    }
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = name;
    return ctx.fillStyle === "#000" ? null : ctx.fillStyle;
  }
  /**
   * Convert HSV spectrum to RGB.
   * @param h Hue
   * @param s Saturation
   * @param v Value
   * @returns {number[]} Array with rgb values.
   */
  static hsvToRgb(h, s, v) {
    h = h / 360 * 6;
    s /= 100;
    v /= 100;
    const i = floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return [
      r * 255,
      g * 255,
      b * 255
    ];
  }
  /**
   * Convert HSV spectrum to Hex.
   * @param h Hue
   * @param s Saturation
   * @param v Value
   * @returns {string[]} Hex values
   */
  static hsvToHex(h, s, v) {
    return _ColorUtil.hsvToRgb(h, s, v).map(
      (v2) => round(v2).toString(16).padStart(2, "0")
    );
  }
  /**
   * Convert HSV spectrum to CMYK.
   * @param h Hue
   * @param s Saturation
   * @param v Value
   * @returns {number[]} CMYK values
   */
  static hsvToCmyk(h, s, v) {
    const rgb = _ColorUtil.hsvToRgb(h, s, v);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    return [
      c * 100,
      m * 100,
      y * 100,
      k * 100
    ];
  }
  /**
   * Convert HSV spectrum to HSL.
   * @param h Hue
   * @param s Saturation
   * @param v Value
   * @returns {number[]} HSL values
   */
  static hsvToHsl(h, s, v) {
    s /= 100;
    v /= 100;
    const l = (2 - s) * v / 2;
    if (l !== 0) {
      if (l === 1) {
        s = 0;
      } else if (l < 0.5) {
        s = s * v / (l * 2);
      } else {
        s = s * v / (2 - l * 2);
      }
    }
    return [
      h,
      s * 100,
      l * 100
    ];
  }
  /**
   * Convert RGB to HSV.
   * @param r Red
   * @param g Green
   * @param b Blue
   * @return {number[]} HSV values.
   */
  static rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const delta = maxVal - minVal;
    let h, s;
    const v = maxVal;
    if (delta === 0) {
      h = s = 0;
    } else {
      s = delta / maxVal;
      const dr = ((maxVal - r) / 6 + delta / 2) / delta;
      const dg = ((maxVal - g) / 6 + delta / 2) / delta;
      const db = ((maxVal - b) / 6 + delta / 2) / delta;
      if (r === maxVal) {
        h = db - dg;
      } else if (g === maxVal) {
        h = 1 / 3 + dr - db;
      } else if (b === maxVal) {
        h = 2 / 3 + dg - dr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [
      h * 360,
      s * 100,
      v * 100
    ];
  }
  /**
   * Convert CMYK to HSV.
   * @param c Cyan
   * @param m Magenta
   * @param y Yellow
   * @param k Key (Black)
   * @return {number[]} HSV values.
   */
  static cmykToHsv(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    const r = (1 - Math.min(1, c * (1 - k) + k)) * 255;
    const g = (1 - Math.min(1, m * (1 - k) + k)) * 255;
    const b = (1 - Math.min(1, y * (1 - k) + k)) * 255;
    return [..._ColorUtil.rgbToHsv(r, g, b)];
  }
  /**
   * Convert HSL to HSV.
   * @param h Hue
   * @param s Saturation
   * @param l Lightness
   * @return {number[]} HSV values.
   */
  static hslToHsv(h, s, l) {
    s /= 100;
    l /= 100;
    s *= l < 0.5 ? l : 1 - l;
    const ns = 2 * s / (l + s) * 100;
    const v = (l + s) * 100;
    return [h, isNaN(ns) ? 0 : ns, v];
  }
  /**
   * Convert HEX to HSV.
   * @param hex Hexadecimal string of rgb colors, can have length 3 or 6.
   * @return {number[]} HSV values.
   */
  static hexToHsv(hex) {
    return _ColorUtil.rgbToHsv(...hex.match(/.{2}/g).map((v) => parseInt(v, 16)));
  }
  /**
   * Try's to parse a string which represents a color to a HSV array.
   * Current supported types are cmyk, rgba, hsla and hexadecimal.
   * @param str
   * @return {*}
   */
  static parseToHSVA(str) {
    str = str.match(/^[a-zA-Z]+$/) ? _ColorUtil.standardizeColor(str) : str;
    const regex = {
      cmyk: /^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,
      rgba: /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
      hsla: /^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
      hsva: /^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
      hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i
    };
    const numarize = /* @__PURE__ */ __name2((array) => array.map((v) => /^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : void 0), "numarize");
    let match;
    invalid: for (const type in regex) {
      if (!(match = regex[type].exec(str))) {
        continue;
      }
      const alphaValid = /* @__PURE__ */ __name2((a) => !!match[2] === (typeof a === "number"), "alphaValid");
      switch (type) {
        case "cmyk": {
          const [, c, m, y, k] = numarize(match);
          if (c > 100 || m > 100 || y > 100 || k > 100) {
            break invalid;
          }
          return { values: _ColorUtil.cmykToHsv(c, m, y, k), type };
        }
        case "rgba": {
          const [, , , r, g, b, a] = numarize(match);
          if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1 || !alphaValid(a)) {
            break invalid;
          }
          return { values: [..._ColorUtil.rgbToHsv(r, g, b), a], a, type };
        }
        case "hexa": {
          let [, hex] = match;
          if (hex.length === 4 || hex.length === 3) {
            hex = hex.split("").map((v) => v + v).join("");
          }
          const raw = hex.substring(0, 6);
          let a = hex.substring(6);
          a = a ? parseInt(a, 16) / 255 : void 0;
          return { values: [..._ColorUtil.hexToHsv(raw), a], a, type };
        }
        case "hsla": {
          const [, , , h, s, l, a] = numarize(match);
          if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1 || !alphaValid(a)) {
            break invalid;
          }
          return { values: [..._ColorUtil.hslToHsv(h, s, l), a], a, type };
        }
        case "hsva": {
          const [, , , h, s, v, a] = numarize(match);
          if (h > 360 || s > 100 || v > 100 || a < 0 || a > 1 || !alphaValid(a)) {
            break invalid;
          }
          return { values: [h, s, v, a], a, type };
        }
      }
    }
    return { values: null, type: null };
  }
};
function css_selector_exists(rule_or_selector) {
  let selector = rule_or_selector;
  if (rule_or_selector.indexOf("{") != -1) {
    selector = rule_or_selector.substring(0, rule_or_selector.indexOf("{")).trim();
    selector.trim();
  }
  let pool = [
    document.styleSheets,
    document.adoptedStyleSheets
  ];
  for (let i_pool = 0; i_pool < pool.length; i_pool++) {
    let stylesheets = pool[i_pool];
    for (let i_sheet = 0; i_sheet < stylesheets.length; i_sheet++) {
      let stylesheet = stylesheets[i_sheet];
      for (let i_rule = 0; i_rule < stylesheet.cssRules.length; i_rule++) {
        let rule = stylesheet.cssRules[i_rule];
        if (rule.selectorText == selector) {
          return true;
        }
      }
    }
  }
  return false;
}
__name(css_selector_exists, "css_selector_exists");
__name2(css_selector_exists, "css_selector_exists");
function css_inject(rule) {
  let regss;
  document.adoptedStyleSheets.forEach((ss) => {
    if (ss._regcss_name == "regcss") regss = ss;
  });
  if (!regss) {
    regss = new CSSStyleSheet();
    regss._regcss_name = "regcss";
    document.adoptedStyleSheets.push(regss);
  }
  regss.insertRule(rule, regss.cssRules.length);
}
__name(css_inject, "css_inject");
__name2(css_inject, "css_inject");
function css_format_as_rule(selector, style_data, nested) {
  let style_line = selector + " {";
  for (const [propname, propval] of Object.entries(style_data)) {
    style_line += propname + ": " + propval + ";";
  }
  if (nested) {
    for (const [nested_selector, nested_style_obj] of Object.entries(nested)) {
      style_line += "& " + nested_selector + " {";
      for (const [nested_propname, nested_propval] of Object.entries(nested_style_obj)) {
        style_line += nested_propname + ": " + nested_propval + ";";
      }
      style_line += "}";
    }
  }
  style_line += "}";
  return style_line;
}
__name(css_format_as_rule, "css_format_as_rule");
__name2(css_format_as_rule, "css_format_as_rule");
var Clipboard = class {
  static {
    __name(this, "Clipboard");
  }
  static {
    __name2(this, "Clipboard");
  }
  /**
   * Setup the app-wide clipboard and selection. Only components can be copied to the clipboard.
   */
  constructor(app) {
    this.control_types = {
      "keystroke": { id: "keystroke" },
      "rightclick": { id: "rightclick" },
      "button": { id: "button" }
    };
    this.copydata = {
      control_type: void 0,
      // The specific control method used to copy the attached object
      components: []
      // This is where the component copy list will actually reside.
    };
    this.selection = {
      components: [],
      // The components currently selected (not copies, instances)
      callback: /* @__PURE__ */ __name2(() => {
      }, "callback")
      // Called when a selection is performed
    };
    this.selection_locked = 0;
    this.app = app;
  }
  /**
   * Copy the current selection to the clipboard.
   * @param {Event} e The event from click or keypress
   * @param {Object} control_type The app.clipboard.control_type for this copy operation.
   */
  copy(e, control_type) {
    console.log("Copying " + this.selection.components + " to clipboard.");
    this.clear();
    for (var x = 0; x < this.selection.components.length; x++) {
      this.copydata.components.push(this.selection.components[x].get_copy());
    }
    this.copydata.control_type = control_type;
  }
  /**
   * Paste whatever is on the clipboard as best possible. This is handled centrally (in the app.clipboard) to account
   * for all the different originations of this event.
   * @param {Event} e The event from click or keypress
   * @param {Object} control_type The app.clipboard.control_type for this copy operation.
   */
  paste(e, control_type) {
    var target_region = this.app.focus_region_get();
    if (control_type.id == this.control_types.keystroke.id) {
    } else if (control_type.id == this.control_types.rightclick.id) {
    } else {
      return;
    }
    console.log("Pasting " + this.copydata.components.length + " objects into region " + target_region.id);
    for (var x = 0; x < this.copydata.components.length; x++) {
      target_region.paste_component(e, this.copydata.components[x]);
    }
  }
  /**
   * Clear the clipboard of any attached data.
   */
  clear() {
    this.copydata.control_type = void 0;
    this.copydata.components = [];
  }
  /**
   * Select a component or list of components, app wide. This is the primary function for this action.
   * @param {*} components Component or list of components
   */
  select(components) {
    if (!(components instanceof Array)) components = [components];
    if (this.selection_locked) {
      console.log("Cannot select right now -- selection is locked.");
      return;
    }
    console.log("Selecting: ");
    console.log(components);
    this.selection.components = components;
    for (var x = 0; x < this.selection.components.length; x++) {
      this.selection.components[x].on_select();
    }
    this.selection.callback(this.selection.components);
    this.app.render();
  }
  deselect() {
    if (this.selection_locked) {
      console.log("Cannot deselect right now -- selection is locked.");
      return;
    }
    if (this.has_selected()) {
      for (var x = 0; x < this.selection.components.length; x++) {
        this.selection.components[x].on_deselect();
      }
      this.selection.components = [];
      this.app.render();
    }
  }
  /**
   * Return true if anything is currently selected.
   */
  has_selected() {
    return this.selection.components.length > 0;
  }
  /**
   * Return true if the first AND only selected object is instanceof one of the provided component
   * class defs.
   * @param {Array} ClassDefs A list of ClassDefs
   */
  has_selected_of_type(ClassDefs) {
    if (this.selection.components.length == 1) {
      return ClassDefs.some((CD) => {
        return this.selection.components[0] instanceof CD;
      });
    }
    return 0;
  }
  /**
   * Return true if anything is currently copied on clipboard.
   */
  has_copied() {
    return this.copydata.components.length > 0;
  }
  /**
   * Return True if all comps on the clipboard are of the ClassDef's provided in defs
   * @param {Array} defs A list of ClassDef's
   */
  has_copied_of_type(defs) {
    if (this.copydata.components.length == 0) return 0;
    var components = this.copydata.components;
    for (var x = 0; x < components.length; x++) {
      var flag = 0;
      for (var y = 0; y < defs.length; y++) {
        if (components[x] instanceof defs[y]) {
          flag = 1;
        }
      }
      if (flag == 0) {
        return 0;
      }
    }
    return 1;
  }
  /**
   * Return 1 if the provided component is selected, 0 otherwise.
   * @param {Component} component 
   */
  is_selected(component) {
    for (var x = 0; x < this.selection.components.length; x++) {
      if (this.selection.components[x].type == component.type && this.selection.components[x].data.id == component.data.id) {
        return 1;
      }
    }
    return 0;
  }
  /**
   * Return a list of current selected components.
   */
  get_selected() {
    return this.selection.components;
  }
  /**
   * Lock the selection such that it cannot be unselected and no other selections can be made
   */
  selection_lock() {
    this.selection_locked = 1;
  }
  /**
   * Unlock the selection such that it operates like normal.
   */
  selection_unlock() {
    this.selection_locked = 0;
  }
  /**
   * Register a callback to be called on selection. There can only be one of these at a time, so binding a selection function
   * will automatically clear the last selection function.
   * @param {Function} fn The function to be called on select. Args: (components)
   */
  selection_bind(fn) {
    this.selection.callback = fn;
  }
  /**
   * Clear whatever selection callback was bound.
   */
  selection_bind_clear() {
    this.selection.callback = () => {
    };
  }
  /**
   * Call the delete() function on every selected component
   */
  selection_delete() {
    for (var x = 0; x < this.selection.components.length; x++) {
      this.selection.components[x].delete();
    }
  }
};
var RHElement = class _RHElement extends HTMLElement {
  static {
    __name(this, "_RHElement");
  }
  static {
    __name2(this, "RHElement");
  }
  // Typehint declarations.
  /** @description Add a custom place to put data, tied to only one key to prevent collisions. */
  _reg_ds = {
    /** @description This remembers what display was set to before hide() was called */
    sh_display,
    /** @description Whether or not the 'hide()' behavior is currently active */
    sh_is_hidden
  };
  /**
   * Wrap the provided element, returning a new instance of RHElement. This is the only way, currently,
   * to instantiate a new RHElement.
   * 
   * @param {HTMLElement} el Element to wrap
   * 
   * @returns {RHElement} The same element, but wrapped to have RHElement functionality.
   */
  static wrap(el) {
    if (el._reg_ds) return el;
    el._reg_ds = {
      sh_is_hidden: false,
      sh_display: void 0
    };
    el.hide = _RHElement.prototype.hide.bind(el);
    el.show = _RHElement.prototype.show.bind(el);
    el.empty = _RHElement.prototype.empty.bind(el);
    el.text = _RHElement.prototype.text.bind(el);
    el.dims_outer = _RHElement.prototype.dims_outer.bind(el);
    el.class_set = _RHElement.prototype.class_set.bind(el);
    return el;
  }
  /**
   * Hide this element by applying 'display: none' to the style. The original style display, if it existed,
   * will be remembered unless it was already 'none'. If it was already 'none', that is ignored and it will
   * be assumed that control of display is handled entirely by js logic.
   */
  hide() {
    if (this._reg_ds.sh_is_hidden) return;
    this._reg_ds.sh_is_hidden = true;
    this._reg_ds.sh_display = this.style.display;
    this.style.display = "none";
    if (this._reg_ds.sh_display == "none") this._reg_ds.sh_display = "";
  }
  /**
   * Show an element that was previously hidden. This achieves this by removing display: none from
   * the style and replacing it with whatever display was set to before (including nothing)
   */
  show() {
    if (!this._reg_ds.sh_is_hidden) return;
    if (this._reg_ds.sh_display == "none") {
      this._reg_ds.sh_display = "";
    }
    this._reg_ds.sh_is_hidden = false;
    this.style.display = this._reg_ds.sh_display;
    this._reg_ds.sh_display = void 0;
  }
  /**
   * Remove all child elements of this element.
   */
  empty() {
    while (this.firstChild) {
      this.removeChild(this.lastChild);
    }
  }
  /**
   * A quick method to add or remove a class on the basis of a boolean value.
   * 
   * This is merely shorthand for this.classList.toggle(class_name, true)
   * 
   * @param {String} class_name The name of a class
   * @param {Boolean} do_set True to set this class, False to remove
   */
  class_set(class_name, do_set) {
    this.classList.toggle(class_name, do_set);
  }
  /**
   * Shorthand to set the text of this element. Achieved by setting this.textContent to provided string
   * 
   * @param {String} str text to set.
   */
  text(str) {
    this.textContent = str;
  }
  /**
   * Get the dimensions of this element in pixels, including margin, borders, padding, and inner content.
   * 
   * This will NOT work if strange things have been applied to the element, such as `transform: scale()`
   * 
   * @returns {Object.<String, int>} {x: x_px, y: y_px}
   */
  dims_outer() {
    let computed_style = window.getComputedStyle(this);
    let mt = parseInt(computed_style.marginTop, 10), mb = parseInt(computed_style.marginBottom, 10), ml = parseInt(computed_style.marginLeft, 10), mr = parseInt(computed_style.marginRight, 10);
    return {
      x: this.offsetWidth + ml + mr,
      y: this.offsetHeight + mt + mb
    };
  }
};
var Fabricator = class {
  static {
    __name(this, "Fabricator");
  }
  static {
    __name2(this, "Fabricator");
  }
  /**
   * Instantiate a new Fabricator instance with the provided HTML.
   * 
   * ### Lifecycle ###
   * 1. A fabricator is first instantiated with one and only one HTML string.
   * 2. A fabricator can then have various sets of CSS associated with it.
   * 3. Then fabricator.fabricate() is called, which actually dumps the css to the document and fabricates
   *    the DOM. After this, the fabricator is immutable.
   * 4. Helper functions like get_members or get_root_element can be called. They'll all reference the
   *    immutable document object, as well as some internal class variables.
   * 
   * ### Expressions ###
   * An expression is simply a way to indicate to the Fabricator an intended substitution. HTML resembling
   * `<div id="main_text_col"> {{ main_text }} </div>` will have {{ main_text }} replaced with the value
   * of `expressions["main_text"]` before parsing. If `expressions["main_text"] = "A spectre is haunting Europe"`
   * then the resulting HTML will be `<div id="main_text_col"> A spectre is haunting Europe </div>`
   * 
   * If no matching entry exists in expressions, then the expression will simply be removed from the result.
   * 
   * ### Members ###
   * In adherence with the 'rfm_member' attribute being used to signify a member element in DOM-html, the
   * Fabricator will intelligently check for this tag and assign 
   * 
   * @param {str} html_str The HTML which shall be dynamically parsed.
   * @param {Object.<str, *>} [expressions] An optional object that maps string keys to expression values.
   */
  constructor(html_str, expressions) {
    if (!expressions) expressions = {};
    this.html_str = this._preprocess_expressions(html_str, expressions);
    this._members = {};
    this._immutable = false;
    this._css_rules = [];
  }
  /**
   * Add a CSS rule to this fabricator. When fabricate() fires, all css rules will be added
   * to the document and made available. Collision checks are performed, so if this is called
   * multiple times for the same (or an existing) selector, no action will be taken.
   * 
   * This function can NOT be used to change an existing CSS rule.
   * 
   * @param {string} rule A css rule. Must contain only one selector and style block.
   * 
   * @returns {Fabricator} self for chaining
   */
  add_css_rule(rule) {
    if (this._immutable) throw "Fabricator is immutable and can no longer be modified.";
    this._css_rules.push(rule);
    return this;
  }
  /**
   * Get a mapping of member names to member elements.
   * 
   * @returns {Object.<str, RHElement>} The member mapping.
   */
  get_members() {
    if (!this._immutable) throw "Cannot call until after fabricate()";
    return this._members;
  }
  /**
   * Get a member by name. This is a convenience function that just does a key lookup in the member dict.
   * 
   * @param {String} member_name The member name to get
   * 
   * @returns {RHElement} The chosen member or undefined if none
   */
  get_member(member_name) {
    if (!this._immutable) throw "Cannot call until after fabricate()";
    return this._members[member_name];
  }
  /**
   * Append all fabricated elements to the provided one.
   * 
   * @param {HTMLElement} el The element (presumably from the real document) to append our fabrication to
   */
  append_to(el) {
    for (let i = this._dom.body.children.length - 1; i >= 0; i--) {
      el.prepend(this._dom.body.children[i]);
    }
  }
  /**
   * This takes the HTML and CSS instructions provided so far to this instance and:
   * 1. Generates the DOM
   * 2. Appends CSS to the document
   * 
   * After this function is called, the Fabricator should be considered immutable and further calls to
   * non-get_ functions will raise an error.
   * 
   * @returns {Fabricator} self for chaining
   */
  fabricate() {
    if (this._immutable) throw "Fabricator is immutable and can no longer be modified.";
    this._immutable = true;
    this._dom = this._parse_html(this.html_str);
    this._css_inject();
    this._members_discover();
    return this;
  }
  /**
   * @private
   * Perform the expression sub-in behavior. 
   * 
   * An expression is simply a way to indicate to the Fabricator an intended substitution. HTML resembling
   * `<div id="main_text_col"> {{ main_text }} </div>` will have {{ main_text }} replaced with the value
   * of `expressions["main_text"]` before parsing. If `expressions["main_text"] = "A spectre is haunting Europe"`
   * then the resulting HTML will be `<div id="main_text_col"> A spectre is haunting Europe </div>`
   * 
   * ERRORS:
   * 1. Brackets are not nested.
   * 2. All brackets close properly.
   * 
   * @param {string} html_str The HTML which shall be dynamically parsed.
   * @param {Object.<string, *>} expressions An object that maps string keys to expression values.
   * 
   * @returns {string} the resulting string with all expressions subbed-in or removed.
   */
  _preprocess_expressions(html_str, expressions) {
    let open_locs = str_locations("{{", html_str);
    let close_locs = str_locations("}}", html_str);
    let html_str_out = "";
    if (open_locs.length != close_locs.length) throw new FabricatorError(
      "Open expression count does not match close expression count. Can not parse expressions.",
      this
    );
    if (open_locs.length == 0 && close_locs.length == 0) return html_str;
    let html_i_last_end = 0;
    open_locs.forEach((html_i_open, loc_i) => {
      let html_i_close = close_locs[loc_i];
      if (html_i_close <= html_i_open) throw new FabricatorError(
        "Expression close and open mismatch! Can not parse expressions.",
        this
      );
      if (loc_i + 1 < open_locs.length) {
        if (open_locs[loc_i + 1] <= html_i_close) throw new FabricatorError(
          "Nested expressions are not allowed. Can not parse expressions.",
          this
        );
      }
      let expression_str = html_str.substring(html_i_open + 2, html_i_close).trim();
      let exp_value = expression_str in expressions ? expressions[expression_str] : "";
      html_str_out += html_str.substring(html_i_last_end, html_i_open);
      html_str_out += exp_value;
      if (loc_i + 1 == open_locs.length) {
        html_str_out += html_str.substring(html_i_close + 2);
      }
      html_i_last_end = html_i_close + 2;
    });
    return html_str_out;
  }
  /**
   * @protected
   * Inject all stored instructional information about CSS into the document.
   */
  _css_inject() {
    this._css_rules.forEach((css_rule) => {
      if (!css_selector_exists(css_rule)) {
        css_inject(css_rule);
      }
    });
  }
  /**
   * @private
   * Parse a plain HTML string into proper DOM elements. This function leverages the built-in DOMParser
   * to create a full document.
   * 
   * @param {string} html_str A pure html string. Expressions should have been removed.
   * 
   * @returns {Document}
   */
  _parse_html(html_str) {
    return new DOMParser().parseFromString(html_str, "text/html");
  }
  /**
   * @private
   * Investigate this.dom to discover all 'rfm_members' within. This will populate this._members.
   */
  _members_discover() {
    let traverse = /* @__PURE__ */ __name2((el) => {
      for (const child of el.children) {
        if (child.hasAttribute("rfm_member")) {
          this._members[child.getAttribute("rfm_member")] = RHElement.wrap(child);
        }
        traverse(child);
      }
    }, "traverse");
    traverse(this._dom.body);
  }
};
var RegionalStructureError = class extends Error {
  static {
    __name(this, "RegionalStructureError");
  }
  static {
    __name2(this, "RegionalStructureError");
  }
  constructor(message, options) {
    super(message, options);
  }
};
var FabricatorError = class extends Error {
  static {
    __name(this, "FabricatorError");
  }
  static {
    __name2(this, "FabricatorError");
  }
  /**
   * Create a new fabricator error.
   * @param {string} message Message to print
   * @param {Fabricator} fab The fabricator that tripped this issue.
   */
  constructor(message, fab) {
    super(message, {});
    this.fab = fab;
  }
};
var TODOError2 = class extends Error {
  static {
    __name(this, "TODOError2");
  }
  static {
    __name2(this, "TODOError");
  }
  constructor(message, options) {
    super(message, options);
  }
};
var Component = class {
  static {
    __name(this, "Component");
  }
  static {
    __name2(this, "Component");
  }
  /** @type {*} The ID for the record this component models. */
  id;
  /** @type {DHTabular} The datahandler from which this component originated */
  datahandler;
  /**
   * Create a new component. This should generally only be called from within a datahandler class.
   * 
   * @param {*} id The unique ID by which we can reference the record in the datahandler
   * @param {DHTabular} dh The Tabular DataHandler that originated this component instance.
   */
  constructor(id2, dh) {
    this.id = id2;
    this.datahandler = dh;
  }
  /**
   * The data reference links straight into the DataHandler's component space for this data.
   * 
   * ```
   * comp_instance.data.key = "val"
   * ```
   * is equivalent to
   * 
   * ```
   * datahandler_instance._data[id].key = "val"
   * ```
   * 
   * @returns {Object} A reference to a unique memory space for this object where its data may be found.
   */
  get data() {
    let data2 = this.datahandler.data_get_ref(this.id);
    if (data2 == void 0) throw new Error(
      `${this.constructor.name} is stale: record no longer exists in ${this.datahandler.constructor.name} for ID: '${this.id}'.`
    );
    return data2;
  }
  /**
   * The settings reference is unique to this record ID, but shared across all record ID's.
   */
  get settings() {
    let settings = this.datahandler.settings_get_ref(this.id);
    if (settings == void 0) throw new Error(
      `${this.constructor.name} is stale: record no longer exists in ${this.datahandler.constructor.name} for ID: '${this.id}'.`
    );
    return settings;
  }
  set data(v) {
    throw new Error("Can not overwrite datalink.");
  }
  set settings(v) {
    throw new Error("Can not overwrite datalink.");
  }
  /**
   * Check if this component equals another component. If they are of the same ClassDef and same ID, they are
   * equal.
   * @param {Component} component another component instance
   */
  equals(component) {
    return component instanceof this.constructor && this.id == component.id;
  }
};
var DataHandler = class {
  static {
    __name(this, "DataHandler");
  }
  static {
    __name2(this, "DataHandler");
  }
  /** @type {Object} This is where all local data for this DataHandler is stored. */
  _data;
  /**
   * Create a new datahandler instance. At the base level, this merely sets up an empty data variable.
   */
  constructor() {
    this._data = {};
  }
  /**
   * @abstract
   * Retrieve all 'tracked' data from the server that has not yet already been pulled down. Depending on
   * implementation, this might simply be all of the data that exists. A REST implementation may choose to track
   * certain ID's and only retrieve certain rows. However it happens, pull() should all desired data that the
   * datahandler has so far been configured to want available locally.
   * 
   * @returns {Promise} A promise that will resolve when the data pull is complete
   */
  async pull() {
  }
  /**
   * @abstract
   * Update the server to match this local client. Implementations will vary. All data can be sent to server,
   * or only the subset that has changed (for efficiency). As a result of calling this, the server data should
   * match that of the local client for all data in this datahandler.
   * 
   * @returns {Promise} A promise that will resolve when the data push is complete
   */
  async push() {
  }
  /**
   * @abstract
   * Get a unique string / name of some sort that signifies this datahandler. This is used for situations
   * where a list of DH's needs to be keyed and accessed uniquely. Must be implemented in child.
   * 
   * @returns {String} Unique string for this TYPE of datahandler.
   */
  get name() {
  }
  /**
   * Get the current data-state checksum for this datahandler. This method may be overridden by a child
   * to take advantage of checksum caching.
   * 
   * @returns {String} 32 char checksum.
   */
  get checksum() {
    return this.generate_checksum();
  }
  /**
   * @abstract
   * Generate a new, unique checksum that reflects the current state of this DataHandler.
   * 
   * @returns {String} 32 char checksum.
   */
  generate_checksum() {
  }
  /**
   * Call pull() on multiple datahandlers in parallel. 
   * 
   * @param {Array} dh_list A list of datahandlers
   * 
   * @returns {Promise} A promise that will resolve with no arguments when all data is pulled down.
   */
  static data_refresh_multiple(dh_list) {
    return new Promise((res, rej) => {
      var all_promises = [];
      dh_list.forEach((dh) => {
        all_promises.push(dh.pull());
      });
      Promise.all(all_promises).then(() => {
        res();
      });
    });
  }
};
var DHTabular = class extends DataHandler {
  static {
    __name(this, "DHTabular");
  }
  static {
    __name2(this, "DHTabular");
  }
  /** @type {Object} A place for local 'settings' to tie to a record */
  _settings;
  /**
   * Create a new datahandler instance. At the base level, this merely sets up an empty data variable.
   */
  constructor() {
    super();
    this._settings = {};
  }
  /**
   * Update a record for an ID. If the record does not exist, it will be created. Existing records will
   * have all values from 'data' assigned over on a per-key basis. This means that existing data keys
   * for an existing record that are NOT present in the supplied data will NOT be removed.
   * 
   * @param {*} id The ID of the record to delete.
   * @param {Object} data The data to set for this record.
   */
  data_update_record(id2, data2) {
    if (this._data[id2] == void 0) this._data[id2] = {};
    if (this._settings[id2] == void 0) this._settings[id2] = {};
    Object.assign(this._data[id2], data2);
  }
  /**
   * Get information for a specific record. The returned object is a reference. Modifying it will modify
   * record data.
   * 
   * @param {*} id The ID of the record
   * 
   * @returns {Object} Data for this record or undefined if no such ID exists
   */
  data_get_ref(id2) {
    return this._data[id2];
  }
  /**
   * Delete all data and settings for the provided record ID.
   * 
   * @param {*} id The ID of the record to delete
   */
  data_delete_record(id2) {
    delete this._data[id2];
    delete this._settings[id2];
  }
  /**
   * @returns {Array} A list of currently known ID's.
   */
  get_all_ids() {
    return Object.keys(this._data);
  }
  /**
   * Perform a basic operation similar to SQL's WHERE clause. For now, this only performs equality-matching.
   * 
   * The filter_data object should resemble:
   * 
   * ```
   * {
   *      'col_name': MATCHING_COL_VALUE,
   *      'col2_name': MATCHING_COL2_VALUE,
   *      ...
   * }
   * ```
   * 
   * All known records that have `col_name` value equal to `MATCHING_COL_VALUE` and col2 etc. will be returned.
   * 
   * @param {Object} filter_data Object with data column names to values
   * 
   * @returns {Object} id-mapped data for each matching tabular record. This is NOT dereferenced.
   */
  where(filter_data) {
    let out = {};
    Object.entries(this._data).forEach(([id2, data2]) => {
      let all_match = true;
      Object.entries(filter_data).forEach(([k, v]) => {
        if (data2[k] != v) all_match = false;
      });
      if (all_match) {
        out[id2] = data2;
      }
    });
    return out;
  }
  /**
   * Get reference to settings space for the provided ID.
   * 
   * @param {*} id The ID of the record
   * 
   * @returns {Object} Settings for this record or undefined if no such ID exists
   */
  settings_get_ref(id2) {
    return this._settings[id2];
  }
  /**
   * TODO Checksum Caching
   * This will be neccessary for the future. I'm not setting it up just yet because too much is on my stack
   * already.
   * 1. Add a Proxy for _data and _settings so that generic set operations cause checksum update.
   * 2. Add a sort of context manager for temporarily disabling autoregen during mass operations.
   * 3. Cause that context manager to be used during push() and pull()
   */
  /**
   * The checksum for a tabular datahandler is composed of both data and settings.
   */
  generate_checksum() {
    return checksum_json([this._data, this._settings]);
  }
  /**
   * @abstract
   * Get a component instance of the relevant type for this DataHandler. Component instances are really
   * just containers for code that store both their settings and data back here in the datahandler. Multiple
   * instances of a Component for the same ID will refer to the exact same locations in memory.
   * 
   * This may be called any number of times in any number of places, and all instances of a component for a
   * certain ID will behave as if they are, in fact, the same component.
   * 
   * @param {*} id The ID to get a component for.
   * 
   * @returns {Component}
   */
  comp_get(id2) {
  }
};
var PUSH_CONFLICT_RESOLUTIONS = {
  /** This will resolve push conflicts by raising an exception and placing the burden on the developer. */
  WITH_EXCEPTION: Symbol("WITH_EXCEPTION"),
  /** This will resolve push conflicts by presuming that the server accepted changes, but did not report so. */
  KEEP_CHANGES: Symbol("KEEP_CHANGES"),
  /** This will resolve push conflicts by presuming that the server rejected changes, but did not report so. */
  DISCARD_CHANGES: Symbol("DISCARD_CHANGES")
};
var JSON_HEADERS = {
  "Accept": "application/json",
  "Content-Type": "application/json"
};
var ErrorREST = class extends Error {
  static {
    __name(this, "ErrorREST");
  }
  static {
    __name2(this, "ErrorREST");
  }
  /**
   * Construct an error to raise when a REST operation fails. This will just auto-format the error message
   * and add specified fields to the error for upstream reading.
   * 
   * @param {String} operation An informal, plain english string describing what we were attempting
   * @param {String} method The HTTP method verb that was used e.g. GET or PUT
   * @param {Number} http_code The response HTTP code e.g. 200, 403
   */
  constructor(operation, method, http_code) {
    super(`Operation '${operation}' fails with code ${http_code}`);
    this.data = {
      operation,
      method,
      http_code
    };
  }
};
var DHREST = class extends DHTabular {
  static {
    __name(this, "DHREST");
  }
  static {
    __name2(this, "DHREST");
  }
  /** @type {URL} The url at which access to this API is made */
  api_url;
  /** @type {Array} The currently-tracked ID's for this datahandler instance */
  _tracked_ids;
  /** @type {Array} A list of ID's that have been marked for refresh. */
  _marked_ids;
  /** @type {Object} A mirror of _data that contains only data that originated from the server. No local changes. */
  _data_from_server;
  /** @type {Boolean} Whether the bulk_get method is used to fetch multiple ID's */
  _bulk_get_enabled;
  /** @type {Boolean} Whether the bulk_update method is used to update multiple ID's */
  _bulk_update_enabled;
  /** @type {Boolean} Whether cachebusting is enabled. If so, all fetch operations will cachebust. */
  _cache_bust_enabled;
  /** @type {string} The key of the ID for a record in server-returned data */
  _id_key;
  /** @type {PUSH_CONFLICT_RESOLUTIONS} how this dh instance will resolve push conflicts */
  push_conflict_res;
  /**
   * Construct a new REST DataHandler that will point at the provided URL.
   * 
   * The api_url can be an absolute URL to another domain, or one relative to the current domain's root
   * 
   * @param {string} api_url The root path to the REST API routes, e.g. '/api/v2/noun'
   * @param {Boolean} bulk_get Whether to get multiple at once with bulk fetching. Default true
   * @param {Boolean} bulk_update Whether to update multiple at once with bulk update. Default true
   * @param {string} id_key What key in record data represents the ID. Defaults to "id"
   */
  constructor(api_url, bulk_get = true, bulk_update = false, id_key = "id") {
    super();
    if (api_url.slice(-1) == "/") api_url = api_url.substring(0, api_url.length - 1);
    try {
      this.api_url = new URL(api_url);
    } catch {
      this.api_url = new URL(api_url, window.location.origin);
    }
    this._bulk_get_enabled = bulk_get;
    this._bulk_update_enabled = bulk_update;
    this._cache_bust_enabled = true;
    this._id_key = id_key;
    this.push_conflict_res = PUSH_CONFLICT_RESOLUTIONS.WITH_EXCEPTION;
    this._tracked_ids = [];
    this._marked_ids = [];
    this._data_from_server = {};
  }
  /**
   * Unique name for a REST datahandler is it's constructor name followed by api url.
   */
  get name() {
    return `${this.constructor.name}_${this.api_url}`;
  }
  /**
   * Retrieve all 'tracked' data from the server that has not yet already been pulled down. This can be called
   * as frequently as wished and will only bother the server when tracked data is found to be missing.
   * 
   * **Warning**: Any data that has changed on the server **by other clients** since the *last time* this method
   * was called will not be updated unless they have been marked for refresh. See mark_for_refresh().
   * 
   * **Implementation**
   * In this REST implementation, this looks at our tracked ID's and local cache data in _data. All tracked ID's
   * that are not in _data will be fetched with _get_many() and stored in _data.
   * 
   * @returns {Promise} A promise that will resolve when the data pull is complete
   */
  async pull() {
    let ids_missing = [];
    this._tracked_ids.forEach((id2) => {
      if (this._data[id2] == void 0) ids_missing.push(id2);
    });
    let ids_to_pull = [.../* @__PURE__ */ new Set([...this._marked_ids, ...ids_missing])];
    return this._get_many(ids_to_pull).then(() => {
      this._marked_ids = [];
    });
  }
  /**
   * Update the server to match this local client. This can be called as frequently as wished, as only changes
   * that have occurred as a result of local actions will be sent.
   * 
   * **Warning**: Calling this could precipitate a change in local data, as the UPDATE on the server may
   * incur some code that makes additional changes, in this table or perhaps elsewhere. This DH's local
   * copy will be brought up-to-date with ALL changes automaticaly. Other DH's will not.
   * 
   * **Implementation** In this REST implementation, this looks at a cache of local that reflects what the
   * server ought to contain (and indeed will contain if no other clients have made independent changes).
   * Any differences between that cache and local data will be sent to the server.
   * 
   * @returns {Promise} A promise that will resolve when the data push is complete
   */
  async push() {
    let change_map = this._local_data_xor();
    return this._put_many(change_map).then(() => {
      Object.keys(this._data).forEach((id2) => {
        this._all_keys = [.../* @__PURE__ */ new Set([
          ...Object.keys(this._data[id2]),
          ...Object.keys(this._data_from_server[id2])
        ])];
        this._all_keys.forEach((k) => {
          if (this._data[id2][k] != this._data_from_server[id2][k]) {
            this._push_resolve_conflict(id2, k);
          }
        });
      });
    });
  }
  /**
   * This function is neccessary in the event that the server doesn't report a change.
   * 
   * Consider the following situation:
   * 
   * id 2 has update sent for `{k1: v1, k2: v2}`, because
   * 		`_data[2] = {k1: v1, k2: v2}` and `_data_from_server[2] = {k1: PRE, k2: PRE}`
   * 
   * Perhaps the server responds with `{k1: v1}` as the 'updated' response. This is a problem,
   * because now there's still a conflict for 'k2' and push() will trigger a request every
   * time it is called.
   * 
   * To deal with this:
   * A) An error could be raised, forcing the developer to investigate the issue.
   * B) All effected ID's could be marked for refresh and a pull() called.
   * C) Local cache of 'server data' could be altered to match the changes we've made, which implicitly
   *    assumes that the server has *accepted* the new value, just not reported it.
   * D) Local data could be made to match local cache of 'server data', which would discard any local
   *    changes and implicitly assume that the server has rejected the new value, but not reported it.
   * 
   * @param {*} id The ID of the object with a conflict.
   * @param {string} k The key to the data dict where the conflict was noticed.
   */
  _push_resolve_conflict(id2, k) {
    if (this.push_conflict_res == PUSH_CONFLICT_RESOLUTIONS.WITH_EXCEPTION) {
      throw new Error(`Push conflict when updating <${this.constructor.name}:${id2}> - key '${k}'was nominally updated but not reported by server. Value was changed from${this._data_from_server[id2][k]} to ${this._data[id2][k]}`);
    } else if (this.push_conflict_res == PUSH_CONFLICT_RESOLUTIONS.KEEP_CHANGES) {
      this._data_from_server[id2][k] = this._data[id2][k];
    } else if (this.push_conflict_res == PUSH_CONFLICT_RESOLUTIONS.DISCARD_CHANGES) {
      this._data[id2][k] = this._data_from_server[id2][k];
    }
  }
  /**
   * Mark the following ID's for refresh. Next time pull() is called, these ID's will have fresh state
   * data pulled regardless of whether state data already exists locally.
   * 
   * This can be called multiple times with overlapping ID's safely.
   * 
   * @param {*} id_or_ids Either a single ID or a list of ID's
   */
  mark_for_refresh(id_or_ids) {
    if (!(id_or_ids instanceof Array)) id_or_ids = [id_or_ids];
    let ids = id_or_ids;
    this._marked_ids = [.../* @__PURE__ */ new Set([...this._marked_ids, ...ids])];
  }
  /**
   * Mark all tracked ID's for refresh.
   */
  mark_all_for_refresh() {
    this.mark_for_refresh(this._tracked_ids);
  }
  /**
   * @param {*} id The ID to get a URL for, or undefined for base URL e.g. /api/url/
   * @returns {URL} Of the form www.xxxxxx.com/api/url/id
   */
  _url_for(id2) {
    if (id2) {
      return new URL(id2, this.api_url + "/");
    } else {
      return this.api_url;
    }
  }
  /**
   * Create a new object via the API this DH points at. This will:
   * + Fire a POST request at the 'plural' URL
   * + Update local data with the result
   * + Track the newly created record.
   * 
   * The contents of 'data' will be specific to the object being created. This can be overridden in an
   * object-specific subclass to define arguments and provide documentation, if desired, but super() should
   * still be called with a proper data object in the end.
   * 
   * @param {Object} data Key/value mapped data for new device record.
   * 
   * @returns {Promise} That will resolve with the new ID as an argument when the new record has been created.
   */
  async create(data2) {
    return new Promise((res, rej) => {
      return this._create(data2).then((returned_data) => {
        if (!(this._id_key in returned_data)) {
          rej(
            `When creating new ${this.constructor.name} record, returned data did not contain an ID on key '${this._id_key}'. Check that the id_key constructor param is correct.`
          );
        }
        let id2 = returned_data[this._id_key];
        this._local_data_set_from_server(id2, returned_data);
        res(id2);
      }).catch((e) => {
        rej(e);
      });
    });
  }
  /**
   * Actually do the heavy lifting to create a new object via the API this DH points at. This will:
   * + Fire a POST request at the 'plural' URL
   * + Update local data with the result
   * + Track the newly created record.
   * 
   * @param {Object} data Key/value mapped data for new device record.
   * 
   * @returns {Promise} That will resolve with the returned data as an argument when the new record has been created.
   */
  async _create(data2) {
    return fetch(
      this._url_for(void 0),
      {
        method: "POST",
        body: JSON.stringify(data2),
        headers: JSON_HEADERS
      }
    ).then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new ErrorREST(
          "Create new",
          "POST",
          response.status
        );
      }
    });
  }
  /**
   * Delete a record by ID. This will perform the deletion on the server and then update local records
   * accordingly if successful. Data record will be deleted and ID will be untracked.
   * 
   * @param {*} id The ID of the record to delete.
   * 
   * @returns {Promise} That will resolve when the record has successfully been deleted.
   */
  async delete(id2) {
    return this._delete(id2).then(() => {
      this.data_delete_record(id2);
      this.untrack_ids([id2]);
    });
  }
  /**
   * Delete a record by ID via a DELETE request sent to the 'plural' URL. Cascading effects may need
   * to be considered. This will not change the internal state of this datahandler - it is only concerned
   * with prosecuting the REST operation.
   * 
   * @param {*} id The ID of the record to delete.
   * 
   * @returns {Promise} That will resolve when the record has successfully been deleted.
   */
  async _delete(id2) {
    return new Promise((res, rej) => {
      fetch(
        this._url_for(id2),
        {
          method: "DELETE"
        }
      ).then((response) => {
        if (response.status == 200) {
          res();
        } else {
          rej(`Deletion of <${this.constructor.name}:${id2}> fails with code ${response.status}`);
        }
      });
    });
  }
  /**
   * Shorthand to fire a GET request at the plural URL to get a list of available ID's.
   * 
   * **On Filtering**
   * Filtering is made automatically possible via the included 'filter_data' arg. When it is provided,
   * it will take the form {"k1": "v1", "k2": "v2", ...}. The returned ID's should all have record data
   * rows "k1" that have value "v1" and "k2" with "v2", etc.
   * 
   * Record data that is excluded from serialization (for example, user passhash) is not allowed for filtering
   * and will trip an error.
   * 
   * @param {Object} filter_data Optional data to filter response by.
   * 
   * @returns {Promise} That resolves with the list of ID's available.
   */
  async list(filter_data) {
    return new Promise((res, rej) => {
      let altered_url = this._url_for(void 0);
      if (filter_data) {
        altered_url = new URL(this._url_for(void 0) + "_get_filtered");
        altered_url.searchParams.append("filter", btoa(JSON.stringify(filter_data)));
      }
      let opts = {
        method: "GET"
      };
      if (this._cache_bust_enabled) {
        opts.cache = "no-store";
      }
      fetch(
        altered_url,
        opts
      ).then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          rej(new ErrorREST(
            "Fetch list of ID's",
            "GET",
            response.status
          ));
        }
      }).then((data2) => {
        res(data2);
      });
    });
  }
  /**
   * Fire a classic GET request at the singular URL to get the data for the indicated instance by ID.
   * 
   * @param {*} id The ID to get data for
   * 
   * @returns {Promise} A promise that will resolve with data for this record
   */
  async _get(id2) {
    return new Promise((res, rej) => {
      let opts = {
        method: "GET"
      };
      if (this._cache_bust_enabled) {
        opts.cache = "no-store";
      }
      fetch(
        this._url_for(id2),
        opts
      ).then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          rej(`Get data for <${this.constructor.name}:${id2}> fails with code ${response.status}`);
        }
      }).then((data2) => {
        res(data2);
      });
    });
  }
  /**
   * Fire a classic PUT request at the singular URL to update some data for the indicated instance by ID.
   * 
   * @param {*} id The ID to get data for
   * @param {Object} data Key/value pairs of data which shall be sent to the server to update this record
   * 
   * @returns {Promise} A promise that will resolve with new data for this record
   */
  async _put(id2, data2) {
    return new Promise((res, rej) => {
      fetch(
        this._url_for(id2),
        {
          method: "PUT",
          body: JSON.stringify(data2),
          headers: JSON_HEADERS
        }
      ).then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          rej(`Update data for <${this.constructor.name}:${id2}> fails with code ${response.status}`);
        }
      }).then((data3) => {
        res(data3);
      });
    });
  }
  /**
   * Fire a bulk get command against the API. This method is more efficient than firing many individual GET
   * commands. However, there seems to be no generally accepted format for this. Furthermore, it mostly
   * mitigates the advantages of caching.
   * 
   * Bulk get, on my systems, is achieved by sending a URL parameter along with a GET request to the general
   * API URL. The format of this parameter is:
   * 
   * ```
   * "/api/url/object?ids=BASE_64_ENCODED_ID_LIST"
   * 
   * let BASE_64_ENCODED_ID_LIST = btoa(JSON.stringify(id_list))
   * ```
   * 
   * This has the consequence of enforcing only UTF-8 characters for ID's, which I am Ok with.
   * 
   * I intend to do some research with this method, in fact, and find whether caching and getting single
   * resources can perform better than multi-fetch in the long run. But that relies on discovering a safe
   * way to cache resources that might one day change, as they are after all in a database. Hmm...
   * 
   * @param {Array} ids ID's to get information for.
   * 
   * @returns {Promise} That resolves with a data_map of id to Object with data for all requested ID's.
   */
  async _get_bulk(ids) {
    let altered_url = new URL(this._url_for(void 0) + "_get_bulk");
    altered_url.searchParams.append("ids", btoa(JSON.stringify(ids)));
    return new Promise((res, rej) => {
      if (ids.length == 0) {
        res({});
        return;
      }
      let opts = {
        method: "GET"
      };
      if (this._cache_bust_enabled) {
        opts.cache = "no-store";
      }
      fetch(
        altered_url,
        opts
      ).then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          rej(`Update data for <${this.constructor.name}:${ids}> fails with code ${response.status}`);
        }
      }).then((data2) => {
        res(data2);
      });
    });
  }
  /**
   * Fire a bulk update command against the API. This method is more efficient than firing many individual
   * PUT requests, and furthermore does not have any downsides as caching was never an option.
   * 
   * Bulk put, on my systems, is achieved by sending a dict of the form:
   * 
   * ```
   * {
   * 		1: {key: val, key2: val2, ...}
   * 		2: {key: val, key2: val2, ...}
   * 		...
   * 		n: {key: val, key2: val2, ...}
   * }
   * ```
   * 
   * With an id-mapped data object for all ID's to update.
   * 
   * @param {Object} data_map ID-mapped Objects which contain 'data' for classic PUT requests.
   * 
   * @returns {Promise} A promise that will resolve a similar ID map with whatever was updated.
   */
  async _put_bulk(data_map) {
    throw "TODO Not yet implemented... need to think about how errors and discrepancies are handled.";
    return fetch(
      this._url_for(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: JSON_HEADERS
      }
    );
  }
  /**
   * This is an internal helper method which will contact the server to get a new, full
   * set of data for every ID included. Depending on instance configuration, this will either do so
   * with a bulk operation (GET /api/noun?ids=[1, 2, 3]) or by making many individual GET requests
   * (GET /api/noun/1, GET /api/noun/2, ...).
   * 
   * @param {Array} ids The ID's to fetch.
   * 
   * @returns {Promise} A promise that will resolve without args when all id's have been gotten and stored
   */
  async _get_many(ids) {
    if (this._bulk_get_enabled) {
      return this._get_bulk(ids).then((data_map) => {
        Object.entries(data_map).forEach(([id2, data2]) => {
          this._local_data_set_from_server(id2, data2);
        });
      });
    } else {
      var all_promises = [];
      ids.forEach((id2) => {
        let get_and_set = new Promise((res, rej) => {
          this._get(id2).then((data_returned) => {
            this._local_data_set_from_server(id2, data_returned);
            res();
          });
        });
        all_promises.push(get_and_set);
      });
      return Promise.all(all_promises);
    }
  }
  /**
   * This is an internal helper method which will cause the server to update records for all object data
   * in the provided data_map. Depending on instance configuration, this will either use a bulk update
   * operation or spawn a great many individual updates.
   * 
   * @param {Object} data_map ID-mapped Objects which contain 'data' for classic PUT requests.
   * 
   * @returns {Promise} A promise that will resolve with no args when all updates are complete.
   */
  async _put_many(data_map) {
    if (this._bulk_update_enabled) {
      return this._put_bulk(data_map);
    } else {
      var all_promises = [];
      Object.entries(data_map).forEach(([id2, data2]) => {
        let put_and_set = new Promise((res, rej) => {
          this._put(id2, data2).then((data_returned) => {
            this._local_data_set_from_server(id2, data_returned);
            res();
          });
        });
        all_promises.push(put_and_set);
      });
      return Promise.all(all_promises);
    }
  }
  /**
   * This is a handy piece of automation that will track all ID's available. This might be quite a few,
   * so beware.
   * 
   * Under the hood, this is achieved by firing a GET request at the plural URL and collecting the ID's
   * that it returns.
   * 
   * @returns {Promise} That will resolve when all ID's have been collected for tracking.
   */
  async track_all() {
    return this.list().then((ids) => {
      this.track_ids(ids);
    });
  }
  data_delete_record(id2) {
    super.data_delete_record(id2);
    delete this._data_from_server[id2];
  }
  /**
   * Track the provided list of ID's.
   * 
   * A tracked id will automatically be pulled by pull() actions. To track an ID is, generally, to ensure
   * that its data will always be available to the frontend more or less automatically.
   * 
   * @param {Array} ids A list of ID's to track. They will likely be ints, but might be strings. All unique.
   */
  track_ids(ids) {
    this._tracked_ids = [.../* @__PURE__ */ new Set([...this._tracked_ids, ...ids])];
  }
  /**
   * Untrack a set of ID's. This will:
   * 
   * 1. Remove the ID from tracking, ensuring that future pull()'s won't fetch data for it.
   * 2. Remove the record data for this ID from this datahandler instance's data entirely.
   * 
   * @param {Array} ids A list of ID's to untrack.
   */
  untrack_ids(ids) {
    for (var x = ids.length - 1; x >= 0; x--) {
      let id2 = ids[x];
      var index = this._tracked_ids.indexOf(id2);
      if (index != -1) {
        this._tracked_ids.splice(index, 1);
      }
      this.data_delete_record(id2);
    }
  }
  /**
   * Untrack all currently tracked ID's. This will:
   * 
   * 1. Remove all IDs from tracking, ensuring that future pull()'s won't fetch data for them.
   * 2. Remove all record data for these IDs from this datahandler instance's data entirely.
   */
  untrack_all() {
    this.untrack_ids(this._tracked_ids);
  }
  /**
   * Set data for this object in the local data cache. This should only ever be called for data that is
   * **known to be true** from the server.
   * 
   * This updates both our local data (which may contain local changes) and our local cache of server data
   * (which never contains local changes).
   * 
   * @param {*} id The ID of the record
   * @param {Object} data The data that corresponds with this object (some or all)
   */
  _local_data_set_from_server(id2, data2) {
    this.data_update_record(id2, data2);
    if (this._data_from_server[id2] == void 0) this._data_from_server[id2] = {};
    Object.assign(this._data_from_server[id2], data2);
  }
  /**
   * Compare the local data to the local cache of server data and see if we've made any local
   * changes. If we have, produce a data_map which contains only those values which
   * have changed.
   * 
   * @returns {Object} A data_map object where vals are {colname-key: row-value} dicts
   * 	of local changes that are not yet on the server.
   */
  _local_data_xor() {
    var data_map = {};
    Object.keys(this._data_from_server).forEach((id2) => {
      var server_data = this._data_from_server[id2], local_data = this._data[id2], diffs = {};
      if (local_data == void 0) {
        throw `Local record for '${id2}' does not exist in local data. Something has gone wrong.`;
      }
      Object.keys(server_data).forEach((k) => {
        if (server_data[k] != local_data[k]) {
          diffs[k] = local_data[k];
        }
      });
      if (Object.keys(diffs).length > 0) {
        data_map[id2] = diffs;
      }
    });
    return data_map;
  }
};
var Region = class _Region {
  static {
    __name(this, "_Region");
  }
  static {
    __name2(this, "Region");
  }
  /** Get how long the mouse must hover over a tooltip to show it, in seconds.*/
  static get tooltip_hover_time() {
    return 2;
  }
  /** Get the attribute name for 'member' tags. See get_member_element()*/
  static get member_attr_name() {
    return "rfm_member";
  }
  /** @type {Fabricator} The fabricator that this instance has been set to use. undefined it not used. */
  _fab;
  /** @type {Boolean} Whether or not this region is currently active.*/
  _active;
  /** @type {Object.<string, Region>} Sub-regions that are nested within this region's model. Key-value mapped on ID */
  subregions;
  /** @type {Region} This will be set if this region is linked as a subregion to a parent region. */
  superregion;
  /** @type {Object.<str, DataHandler>} Map of datahandlers that this region is subscribed to. */
  datahandlers;
  /** 
   * @type {Object.<str, *>} Static data that is unique to the instance of the region. Can not change after
   * construction.*/
  config;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings;
  /** @type {RegionSwitchyard} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} The DOM element that represents the overall container for this region. */
  reg;
  /** @type {Object} Key-value map on member name of members. */
  _member_cache;
  /** @type {Boolean} Whether or not this region has been ethereal-enabled */
  ethereal;
  /** @type {Object} Key-value mapping for checksums of model data */
  _model_checksums;
  /** @type {Object.<str, Function>} A map of keys to handler-types */
  _handlers;
  /**
   * Instantiate a new region instance. Merely constructing a region does nothing except allocate a bit of space
   * in memory.
   * 
   * The region-creation toolchain is as follows:
   * 1. Instantiate the region (constructor).
   * 2. Fabricate the region. This is done by calling fab() on the instance. This step is technically optional;
   *    if the DOM for this region already exists in the page then fab() shouldn't be called.
   * 3. Link the new region to some point within the existing region heirarchy, as well as various pointers
   *    that make working with regions convenient. This is done with link().
   * 
   * When creating custom region classes, it's a good idea to extend the constructor to type declare
   * all class internal variables. See sample site for an example.
   * 
   * @param {Object} config Optional config key/value pairs to override defaults.
   */
  constructor(config) {
    this._active = true;
    this.subregions = {};
    this.config = this._config_default();
    this.datahandlers = {};
    this.settings = {};
    this._member_cache = {};
    this._model_checksums = {};
    this._model_aux_tracked = {};
    this.ethereal = false;
    this._handlers = {
      _on_render: []
    };
    Object.assign(this.config, config);
    this.paste_allowed_components = [];
    this.anchor = {
      enabled: 0,
      path: this.id
    };
  }
  /**
   * Fabricate this region's DOM. This will use the Fabricator that has been defined for this region
   * in fab_get().
   * 
   * @param {Fabricator} fab The fabricator to use to generate this region's DOM structure.
   * 
   * @returns {this} itself for function call chaining
   */
  fab() {
    this._fab = this.fab_get();
    return this;
  }
  /**
   * @abstract
   * Get an instance of a Fabricator object for this region. Not every region needs to define a fabricator.
   * Some regions will simply bind themselves to existing code in the webpage and have no need for this method.
   * Recall that config is available at this point during region construction.
   * 
   * @returns {Fabricator}
   */
  fab_get() {
  }
  /**
   * Perform linking operations for this region:
   * + Link this region to its super-region and vice versa
   * + Link this region to the specific element in webpage DOM that it represents.
   * + Link this region to the switchyard and datahandlers and setup certain events.
   * + Assign a unique in-memory ID for this region and set the reg_el's ID to the same.
   * + Fabrication links (if fab() was called earlier), including links to this.$element and linking $elements
   *   to the reg_el.
   * 
   * @param {Region} reg_super The super (or parent) region that this region will be a subregion of.
   * @param {HTMLElement} reg_el The main element for this region, which this region will be bound to.
   * 
   * @returns {this} itself for function call chaining
   */
  link(reg_super, reg_el) {
    this.swyd = reg_super.swyd;
    this.swyd._focus_region_setup_listeners(this);
    this.reg = RHElement.wrap(reg_el);
    this.reg.setAttribute("rfm_reg", this.constructor.name);
    this._link_ids();
    this.superregion = reg_super;
    reg_super._link_subregion(this);
    this._link_fabricate();
    this._create_subregions();
    this._on_link_post();
    return this;
  }
  /**
   * @protected
   * Setup a unique ID for this region and ensure this region's reg matches.
   */
  _link_ids() {
    this.id = this.swyd._id_get_next(this.constructor.name);
    this.reg.id = this.id;
  }
  /**
   * @protected
   * Use this region's _fab (if it is defined) to generate DOM elements for this region. Those elements
   * will be appended direclty under this regions reg object. Pointers will be created between this region
   * instance and those members (e.g. this.member_name -> RHElm(<div rfm_member=member_name>))
   */
  _link_fabricate() {
    if (this._fab === void 0) return;
    this._fab.fabricate();
    this._fab.append_to(this.reg);
    for (const [member_name, member] of Object.entries(this._fab.get_members())) {
      this[member_name] = member;
    }
  }
  /**
   * @abstract
   * This is called after linking is complete. Anything which should be done as part of the creation of a region
   * but relies on all regional structure already being setup should go here. This might include:
   * + Manually binding DOM elements in non-fabricated regions to HTML-defined tags.
   * + Registering events to elements.
   */
  _on_link_post() {
  }
  /**
   * @private
   * Link the provided region to this region as a subregion. This should only be performed once per subregion,
   * but can be performed any number of times for this region.
   * 
   * If the subregion has already been registered, an error will be raised.
   * 
   * @param {Region} reg 
   */
  _link_subregion(reg) {
    this.subregions[reg.id] = reg;
  }
  /**
   * @abstract
   * This is called after linking is complete (just after _on_link_post()). This function can be overridden
   * by child classes to explicitly instantiate subregions that are required for this region to function.
   */
  _create_subregions() {
  }
  /**
   * Subscribe this region to a specific datahandler. By subscribing a region to a datahandler, we ensure
   * that the region will use this datahandler's checksum when deciding whether or not to actually re-render.
   * 
   * @param {*} dh_or_list A DataHandler instance or list of instances
   */
  datahandler_subscribe(dh_or_list) {
    if (!(dh_or_list instanceof Array)) dh_or_list = [dh_or_list];
    dh_or_list.forEach((dh) => {
      if (dh == void 0) throw new Error("Tried to subscribe to undefined datahandler.");
      if (this.datahandlers[dh.name] != void 0) throw new Error(`DH ${dh.name} already registered.`);
      this.datahandlers[dh.name] = dh;
    });
  }
  /**
   * Ethereal regions are regions that are not embedded in the usual 'concrete' chain of DOM elements that nest
   * up to the region element. They are 'free floating' so to speak, and can appear anywhere on screen. The
   * point of such a region is mostly to be used as a sort of 'overlay' or in-app popup.
   * 
   * Regional has a bit of magic here to abstract away the bother of managing things like overlays. Calling
   * etherealize() during the region-creation stage will result in the following behaviors for this region:
   * 1. This region's Z-index will be set to the 'z_index_eth_base' config in the switchyard, placing it in
   *    front of all other regions.
   * 2. Classes will be applied to this reg that will position it absolutely to completely fill the viewport.
   *    The reg will be set to a grey color with opacity so that only DOM within the region is clickable
   *    and appears focused.
   * 
   * Some restrictions:
   * 1. This function should be called AFTER link() because reg must be available.
   * 2. This region must be a direct child of the switchyard.
   * 
   * @param {Number} [z_index] An optional secondary z-index, which should be considered to be relative only to
   * 		other etherealized regions.
   * 
   * @returns {this} This, for function call chaining
   */
  etherealize(z_index) {
    if (!this.reg) throw new RegionalStructureError("Must link() before etherealize()");
    if (!(this.superregion instanceof RegionSwitchyard)) throw new RegionalStructureError(
      "Ethereal regions must be direct children of the Switchyard"
    );
    if (!z_index) z_index = 0;
    this.ethereal = true;
    this.reg.classList.add("rcss-eth");
    this.reg.style.zIndex = this.swyd.config.z_index_eth_base + z_index;
    this.reg.hide();
    return this;
  }
  /**
   * Bind an input region (usually very small, like a text box or dropdown) to this region such
   * 
   * Should the settings key be an arg of this function??
   * 
   * @param {RegInput} input The input to tie into this region.
   */
  input_add(input) {
    throw TODOError("Write new Region Input mechanism. May require different args..");
  }
  /**
   * Get an $element for a 'member' of this region. A member is a DOM element that belongs to this region which
   * is *unique* within this region. It may not be unique across other regions. The member 'name' is like
   * its ID, but unique to only this region.
   * 
   * There should be only one member per member name. Within the DOM, a member is given a custom attribute
   * like 'rfm_member=member_name'. This is searched by query, which is fast these days.
   * 
   * To keep things fast, the result of the query is cached within this region's memory against its member
   * name. For this reason, member elements should not be deleted or hot-swapped.
   * 
   * @param {str} member_name The name of the member. Unique to this region.
   * 
   * @throws {RegionalStructureError}
   * 
   * @return {HTMLElement} The member element
   */
  member_get(member_name) {
    if (member_name in this._member_cache) {
      return this._member_cache[member_name];
    }
    let statement = "[" + _Region.member_attr_name + "=" + member_name + "]";
    let $el = this.reg.querySelector(statement);
    if (!$el) throw new RegionalStructureError("Region " + this.id + " does not have member '" + member_name + "'.");
    this._member_cache[member_name] = $el;
    return $el;
  }
  /**
   * Get the ClassDef for this region's context menu.
   */
  get context_menu() {
    return ContextMenu;
  }
  /**
   * @abstract
   * Child classes that use config shall override this to define config defaults.
   * 
   * @returns {Object} Default config object for this class.
   */
  _config_default() {
    return {};
  }
  /**
   * This initiates a reset of the settings of this region back to their default values (e.g. those present
   * on pageload). All subregions will also have their settings refresh - this action ripples downwards.
   */
  settings_refresh() {
    this._on_settings_refresh();
    for (const [subreg_id, subreg] of Object.entries(this.subregions)) {
      subreg.settings_refresh();
    }
  }
  /**
   * @abstract
   * @protected
   * This is called whenever this specific region has its settings refreshed. This is the preferred location
   * to setup settings information in a Region subclass.
   */
  _on_settings_refresh() {
  }
  /**
   * Completely redraw this region and all active subregions. This will ripple downwards to across all 
   * sub-regions and reginputs unless this region is unactive.
   * 
   * **Caching**
   * A cached-checksum system is employed to determine whether the workhorse _on_render() method
   * should even be called. A region only needs to be re-rendered when the 'model' that informs the render
   * has changed. Most of the time, the model is composed only of region settings and subscribed data.
   * Sometimes regions will refer to other data, such as a settings value of a super-region. In this event,
   * that data can be tracked as well by calling `render_checksum_add_tracked()` on post load.
   * 
   * 
   * If neither data nor settings have changed for a region, it will not be re-rendered
   * (unless forced). However, even if nothing has changed the render() call will still ripple downwards.
   * 
   * @param {Boolean} force If set, force the render even if this region's settings and data have not changed.
   */
  render(force = false) {
    if (!this.is_active()) {
      return;
    }
    for (const [subreg_id, subreg] of Object.entries(this.subregions)) {
      if (subreg.is_active()) {
        subreg.render(force);
      }
    }
    if (force || this._render_has_model_changed()) {
      this._on_render();
      this._handlers._on_render.forEach((handler) => {
        handler();
      });
    }
  }
  /**
   * Add a hook that will be called just after this._on_render is called.
   * 
   * @param {Function} fn Will be called without args _on_render()
   */
  render_add_handler(fn) {
    this._handlers._on_render.push(fn);
  }
  /**
   * @abstract
   * @protected
   * This is called whenever this specific region has its settings refreshed. This is the preferred location
   * to actually place the code that will 'redraw' a region.
   */
  _on_render() {
  }
  /**
   * Check whether the model (data and settings) have changed since this region was last rendered. If they
   * have, this function will also update the checksums. Calling this function twice in a row will ALWAYS
   * result in false being returned.
   * 
   * This is achieved by getting a checksum for region settings and subscribed datahandler states and
   * comparing that checksum against the checksums at last graphical render.
   * 
   * @returns {Boolean} True if an update is required.
   */
  _render_has_model_changed() {
    let current_checksums = this._render_checksums_get();
    let update_needed = false;
    for (const [k, checksum] of Object.entries(current_checksums)) {
      if (checksum != this._model_checksums[k]) {
        update_needed = true;
        break;
      }
    }
    if (!update_needed) return false;
    this._model_checksums = current_checksums;
    return true;
  }
  /**
   * Get the checksum map for this object. Keys are the names of the data which was used to create each
   * checksum. By default, this should return a key for the settings of the region along with any
   * subscribed datahandlers.
   * 
   * @returns {Object.<String, String>} A map of checksums for this object.
   */
  _render_checksums_get() {
    let current_checksums = { "reg_settings": checksum_json(this.settings) };
    Object.entries(this.datahandlers).forEach(([name, dh]) => {
      current_checksums[name] = dh.checksum;
    });
    Object.entries(this._model_aux_tracked).forEach(([name, aux_fn]) => {
      let aux_v = aux_fn();
      if (aux_v == void 0) aux_v = 0;
      current_checksums[name] = checksum_json(aux_v);
    });
    return current_checksums;
  }
  /**
   * This function will add an 'auxiliary' tracked piece of data to the render checksums. This indicates
   * to the region machinery that the provided data is part of the model for this region even though it
   * does not lie within region settings and data.
   * 
   * The aux_fn provided will be called with no arguments to produce a return value. This return value will
   * be checksum'd, so it must be JSON serializable. This function will be called very frequently, so take
   * care that it is not expensive!
   * 
   * @param {String} name The name of this checksum addition. This should be unique relative to this class inst.
   * @param {Function} aux_fn The function that returns the checksummable value.
   */
  render_checksum_add_tracked(name, aux_fn) {
    this._model_aux_tracked[name] = aux_fn;
  }
  /**
   * Return True if the current objects on the clipboard can paste here, False if even one of them can not.
   */
  can_paste() {
    return this.swyd.clipboard.has_copied_of_type(this.paste_allowed_components);
  }
  /**
   * @abstract
   * This function should be overwritten in any child class that allows pasting. Called by app on a paste
   * maneuver.
   * @param {Event} e The originating event
   * @param {Component} component
   */
  paste_component(e, component) {
  }
  /**
   * This is called by the switchyard for top-level subregions to propagate key events down the region
   * heirarchy.
   * 
   * @param {str} name The name of the event that was fired. Either keyup or keydown
   * @param {Event} e The keyboard event that was fired.
   */
  _key_event_prop(name, e) {
    if (!this.is_active()) return;
    if (name == "keydown") this.key_event_down(e);
    else if (name == "keyup") this.key_event_up(e);
    for (const [subreg_id, subreg] of Object.entries(this.subregions)) {
      subreg._key_event_prop(e);
    }
  }
  /**
   * @abstract
   * Called whenever there is a keydown event. Override this in child classes to add behavior.
   * 
   * Key events in regional are handled slightly differently than other events. Normally, when a key event
   * occurs it will apply to anything 'content editable' like an input or a textarea. If nothing of the sort
   * is 'in focus', it ripples up until it hits the document.
   * 
   * For some regions, it's handy to capture key events for certain hotkey-type functions (CTRL+S to save, for
   * example). A keydown can not be directly bound to most tags that a reg is likely to be, so region-specific
   * keypress handling requires a bit of its own logic. The Switchyard has listening methods that specifically
   * propagate the event to all regions that are currently 'active'. When a keydown event occurs, unless it
   * is captured (for instance, by a focused input box) all active regions will have this method called.
   * 
   * @param {KeyboardEvent} e The keyboard event from the native handler.
   */
  key_event_down(e) {
  }
  /**
   * @abstract
   * Called whenever there is a keyup event. Override this in child classes to add behavior. Only called if
   * region is active.
   * 
   * See docstring for key_event_down() for more info.
   * 
   * @param {KeyboardEvent} e The keyboard event from the native handler.
   */
  key_event_up(e) {
  }
  /**
   * Determine whether or not this region is currently active. Only active regions will have be shown and
   * have ripple-down actions like settings_refresh() and render() propagate.
   * 
   * @returns {Boolean}
   */
  is_active() {
    return this._active;
  }
  /**
   * Activate this region.
   * 
   * Regions can be 'active' or 'disactive. An active region is visible and functioning. A 'disactive' region
   * is hidden in the DOM and effectively disabled in the regional structure. A 'disactive' region will:
   * + Not re-render when render is called.
   * + Have events disabled
   * 
   * This function is not intended to be extended by subclasses. Most of the time, activation behavior should
   * go in on_activate().
   */
  activate() {
    this.settings_refresh();
    this._active = true;
    this._on_activate_pre();
    for (let x = 0; x < this.subregions.length; x++) {
      this.subregions[x].activate();
    }
    this.reg.show();
    this.swyd.focus_region_set(this);
    if (this.anchor.enabled) {
      this._anchor_activate();
    }
    this.render();
    this._on_activate_post();
  }
  /**
   * @abstract
   * This is called when a region is activated, just before all sub-regions are activated. Any changes
   * made to settings here will be available for subregions.
   */
  _on_activate_pre() {
  }
  /**
   * @abstract
   * This is called when a region is activated, just after the core function has finished setting it up.
   * By the time this is called, settings_refresh and render has been called for this region
   * and all sub-regions that have also been activated.
   */
  _on_activate_post() {
  }
  /**
   * Deactivate this region.... TODO
   */
  deactivate() {
    if (this.active) this.on_deactivate();
    this.active = false;
    for (let x = 0; x < this.subregions.length; x++) {
      this.subregions[x].deactivate();
    }
    this.reg.hide();
  }
  /**
   * @abstract
   * Called on deactivate(), but ONLY if this region was actually active.
   */
  _on_deactivate() {
  }
};
var RegOneChoice = class extends Region {
  static {
    __name(this, "RegOneChoice");
  }
  static {
    __name2(this, "RegOneChoice");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegTwoChoiceNav"] {
				& .cont
				{
					max-width: 30em;
					padding: 0.5em;
					background-color: white;
				}
				& .title
				{
					
				}
				& .text
				{
					padding-top: 0.5em;
					padding-bottom: 0.5em;
				}
				& .row
				{
					display: flex; flex-direction: row; justify-content: flex-end;
				}
				$ .btn
				{
					cursor: pointer;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member='cont' class='cont'>
				<div rfm_member="title" class='title'>Title</div>
				<div rfm_member="text" class='text'>Text</div>
				<div class='row'>
					<button class='btn' rfm_member="continue"> Continue </button>
				</div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RHElement}*/
  cont;
  /** @type {RHElement}*/
  title;
  /** @type {RHElement}*/
  text;
  /** @type {RHElement}*/
  continue;
  /** @type {Function} The promise resolve created when a choice is actively presented. */
  _choice_promise_res;
  _on_link_post() {
    this.continue.addEventListener("click", () => {
      this.choice_continue();
    });
  }
  /**
   * Called when the user clicks the continue button.
   */
  choice_continue() {
    if (this._choice_promise_res == void 0) return;
    this._choice_promise_res();
  }
  /**
   * Present the user with a message. The message is configured by the parameters below. This region will
   * be re-rendered with the provided input and activated.
   * 
   * A promise is returned that will resolve when the user clicks the continue button.
   * 
   * @param {String} title The title of the overlay
   * @param {String} text The text of the overlay. This should explain what the user is being asked to confirm
   * @param {String} continue_label The text of the 'continue' button. Defaults to "Continue"
   */
  async present_message(title, text, continue_label = "Continue") {
    this.activate();
    this.settings.title = title;
    this.settings.text = text;
    this.settings.continue = continue_label;
    this.render();
    return new Promise((res, rej) => {
      this._choice_promise_res = res;
    }).finally(() => {
      this._choice_promise_res = void 0;
      this.deactivate();
    });
  }
  _on_settings_refresh() {
    this.settings.title = "Make A Choice";
    this.settings.text = "Either confirm or deny this action.";
    this.settings.continue = "Continue";
  }
  _on_render() {
    this.title.text(this.settings.title);
    this.text.text(this.settings.text);
    this.continue.text(this.settings.continue);
  }
  _on_deactivate() {
    this.choice_continue();
  }
};
var RegTwoChoice = class extends Region {
  static {
    __name(this, "RegTwoChoice");
  }
  static {
    __name2(this, "RegTwoChoice");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegTwoChoiceNav"] {
				& .cont
				{
					max-width: 30em;
					padding: 0.5em;
					background-color: white;
				}
				& .title
				{
					
				}
				& .text
				{
					padding-top: 0.5em;
					padding-bottom: 0.5em;
				}
				& .row
				{
					display: flex; flex-direction: row; justify-content: space-between;
				}
				$ .btn
				{
					cursor: pointer;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member='cont' class='cont'>
				<div rfm_member="title" class='title'>Title</div>
				<div rfm_member="text" class='text'>Text</div>
				<div class='row'>
					<button class='btn' rfm_member="deny"> Deny </button>
					<div style="width: 5em"></div>
					<button class='btn' rfm_member="confirm"> Confirm </button>
				</div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RHElement}*/
  cont;
  /** @type {RHElement}*/
  title;
  /** @type {RHElement}*/
  text;
  /** @type {RHElement}*/
  deny;
  /** @type {RHElement}*/
  confirm;
  /** @type {Function} The promise resolve created when a choice is actively presented. */
  _choice_promise_res;
  /** @type {Function} The promise reject created when a choice is actively presented. */
  _choice_promise_rej;
  _on_link_post() {
    this.deny.addEventListener("click", () => {
      this.choice_deny();
    });
    this.confirm.addEventListener("click", () => {
      this.choice_confirm();
    });
  }
  /**
   * Deny the active choice promise, if there is one.
   */
  choice_deny() {
    if (this._choice_promise_rej == void 0) return;
    this._choice_promise_rej();
  }
  /**
   * Confirm the active choice promise, if there is one.
   */
  choice_confirm() {
    if (this._choice_promise_res == void 0) return;
    this._choice_promise_res();
  }
  /**
   * Present the user with a choice. The choice is configured by the parameters below. This region will
   * be re-rendered with the provided input and activated.
   * 
   * A promise is returned that will resolve if the user clicks the confirm button or reject if the user
   * clicks the deny button or deactivates the region.
   * 
   * @param {String} title The title of the overlay
   * @param {String} text The text of the overlay. This should explain what the user is being asked to confirm
   * @param {String} deny_label The text of the 'deny' button. Defaults to "Deny"
   * @param {String} confirm_label The text of the 'confirm' button. Defaults to "Confirm"
   */
  async present_choice(title, text, deny_label = "Deny", confirm_label = "Confirm") {
    this.activate();
    this.settings.title = title;
    this.settings.text = text;
    this.settings.deny = deny_label;
    this.settings.confirm = confirm_label;
    this.render();
    return new Promise((res, rej) => {
      this._choice_promise_res = res;
      this._choice_promise_rej = rej;
    }).finally(() => {
      this._choice_promise_res = void 0;
      this._choice_promise_rej = void 0;
      this.deactivate();
    });
  }
  _on_settings_refresh() {
    this.settings.title = "Make A Choice";
    this.settings.text = "Either confirm or deny this action.";
    this.settings.deny = "Deny";
    this.settings.confirm = "Confirm";
  }
  _on_render() {
    this.title.text(this.settings.title);
    this.text.text(this.settings.text);
    this.deny.text(this.settings.deny);
    this.confirm.text(this.settings.confirm);
  }
  _on_deactivate() {
    this.deny();
  }
};
var RegIn = class extends Region {
  static {
    __name(this, "RegIn");
  }
  static {
    __name2(this, "RegIn");
  }
  /** @type {Number} If undefined, debouncer is disabled. If defined, the debouncer duration in seconds. */
  _debouncer_duration;
  /** @type {Boolean} The number of debouncing actions that have occured within the operation */
  _debouncer_count = 0;
  /** @type {Object} Reference to variable at which region input value is stored */
  _value_ref;
  /** @type {String} The key in `value_ref` at which value is stored: `value_ref[value_key] = value` */
  _value_key;
  /**
   * @type {Function} If configured, the validation function for this input. Accepts one arg (the user-input
   * value) and expected to return True or False, depending on validity of data.
   */
  _val_fn;
  /** @type {string} Message to display when validation fails */
  _val_fail_text;
  /** @type {RHElement} The validation failure notice element, manually defined by external code*/
  _val_fail_notice_ovr;
  /** @type {RHElement} The default validation failure notice element, generated by RegIn or child */
  _val_fail_notice_base;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description Local copy of the input value. This will always match the view. */
    value: void 0,
    /** @description Set to true if we are in 'validation failure' state. */
    val_failure_state: void 0
  };
  constructor() {
    super();
    this._value_update_handlers = [];
  }
  /**
   * Perform linking operations for this region:
   * + Link this region to its super-region and vice versa
   * + Link this region to the specific element in webpage DOM that it represents.
   * + Link this region to the switchyard and datahandlers and setup certain events.
   * + Assign a unique in-memory ID for this region and set the reg_el's ID to the same.
   * + Fabrication links (if fab() was called earlier), including links to this.$element and linking $elements
   *   to the reg_el.
   * 
   * The additional final two parameters allow this input region to store its value by reference in a location
   * of the implementor's choosing. This will most commonly be `superregion.settings` and `some_settings_key`.
   * It could also, for example, refer to the Switchyard settings or some Component's settings. It could
   * even be tied directly to data in a Datahandler!
   * 
   * @param {Region} reg_super The super (or parent) region that this region will be a subregion of.
   * @param {HTMLElement} reg_el The main element for this region, which this region will be bound to.
   * @param {Object} value_ref Reference to object in which region input value is stored. See above.
   * @param {String} value_key The key in `value_ref` at which value is stored: `value_ref[value_key] = value`
   * 
   * @returns {this} itself for function call chaining
   */
  link(reg_super, reg_el, value_ref, value_key) {
    super.link(reg_super, reg_el);
    this._value_ref = value_ref;
    this._value_key = value_key;
    return this;
  }
  _on_link_post() {
    this.render_checksum_add_tracked("regin_value_ref", () => {
      return this._value_ref[this._value_key];
    });
  }
  /**
   * Add a handler that will be called whenever the value for this input updates as a result of an action
   * taken by the user.
   * 
   * @param {Function} fn A function to call when the value for this object updates. Arg: new value
   */
  add_value_update_handler(fn) {
    this._value_update_handlers.push(fn);
  }
  /**
   * @protected
   * This should be called the child class whenever the 'value' for this input is altered by the user via
   * the 'view' (e.g. the DOM rendered by the browser) as frequently as possible. For an <input> tag, this
   * would be every keystroke, etc.
   * 
   * Commonly, this will take the form:
   * `$el.addEventListener("input", (e) => {this.view_alters_value($el.value)});`
   * 
   * @param {*} value Whatever the value has changed to.
   */
  _view_alters_value(value) {
    if (this._debouncer_duration) {
      this._debouncer_count++;
      window.setTimeout(function(original_debouncer_count, original_value) {
        if (this._debouncer_count == original_debouncer_count) {
          this._view_alters_value_prosecute_update(original_value);
          this._debouncer_count = 0;
        }
      }.bind(this, this._debouncer_count, value), this._debouncer_duration * 1e3);
    } else {
      this._view_alters_value_prosecute_update(value);
    }
  }
  /**
   * @private
   * 
   * Called whenever value has actually changed post debouncer. At this stage, local value settings (model)
   * is always altered to match. Then validation (if configured) occurs.
   * 
   * If validation fails for the current input, the local value (e.g. this.settings.value) will match but
   * the new value will NOT be propagated 'upwards' to the superregion until the user corrects it.
   * 
   * @param {*} value Whatever the value has changed to.
   */
  _view_alters_value_prosecute_update(value) {
    this.settings.value = value;
    if (this._val_fn && !this._val_fn(value)) {
      this.settings.val_failure_state = true;
    } else {
      this.settings.val_failure_state = false;
      this._view_alter_propagate(value);
    }
    this.render();
  }
  /**
   * @private
   * 
   * Actually propagate the new value upwards to the model/settings of the superregion and re-render it.
   * 
   * @param {*} value Whatever the value has changed to. Will be validated if validation is enabled.
   */
  _view_alter_propagate(value) {
    this._value_ref[this._value_key] = value;
    this.superregion.render();
    this._value_update_handlers.forEach((fn) => {
      fn(value);
    });
  }
  /**
   * Provide a validation function to this class, against which all user-input data will be validated.
   * The function should take one argument (the value) and return true/false depending on whether the data
   * was valid.
   * 
   * For example, a validation function to ensure input was a Number might resemble:
   * `(value)=>{return (!isNaN(value))}`
   * 
   * If validation is enabled and input fails, then the value the user input will still wind up in
   * `this.settings.value`. However, it will not propagate upwards to `superregion.settings` until the
   * user fixes it. While the input is in this 'validation failure' mode, the configured 'validation notice'
   * element will be shown.
   * 
   * @param {Function} fn The function to validate input values with.
   * @param {string} failure_text The text that will appear in the 'error' notice given to the user.
   */
  validation_set(fn, failure_text) {
    this._val_fn = fn;
    this._val_fail_text = failure_text;
  }
  /**
   * Set the validation notice element manually. This element will be shown() when the input region is
   * in 'validation failure' state and hidden when it is not. The innerHTML of this element will be set
   * to a message describing the failure.
   * 
   * By default, all input regions have *some sort* of validation failure notice mechanism. The absolute
   * default is to automatically generate a floating <div> tag. *Good* implementations of RegIn subclasses
   * will define one in their Fabricators. However, if this method is called a custom one may be provided.
   * 
   * @param {HTMLElement} el_notice A notice element to hide() and show() as needed.
   */
  validation_notice_setup(el_notice) {
    _val_fail_notice_ovr = RHElement.wrap(el_notice);
  }
  /**
   * This will get the validation failure notice element, or generate it if it did not exist.
   * 
   * The fallbacks are as follows
   * 1. Manual override is checked (e.g. validation_notice_setup())
   * 2. Local already-set-up copy is checked (generated by Fabricator and stored at this._val_notice)
   * 3. Local copy is generated
   * 
   * @returns {RHElement} The validation notice element to use for this input.
   */
  _val_notice_get() {
    if (this._val_fail_notice_ovr) return this._val_fail_notice_ovr;
    if (this._val_fail_notice_base) return this._val_fail_notice_base;
    let notice = document.createElement("div");
    notice.style.position = "absolute";
    notice.style.backgroundColor = "white";
    notice.style.padding = "2px";
    this._val_fail_notice_base = RHElement.wrap(notice);
    return this._val_fail_notice_base;
  }
  /**
   * Set a debouncer for this input. When a debouncer is active, a series of view-value alterations that occurs
   * with no more than the debouncing delay between updates will all be considered one update. This can be
   * helpful when we don't wish to incur too many render() updates as values change.
   * 
   * @param {Number} duration_s The number of seconds to use when debouncing, or undefined to disable.
   */
  debouncer_set(duration_s) {
    this._debouncer_duration = duration_s;
  }
  /**
   * @protected
   * This is called whenever this specific region has its settings refreshed. This is the preferred location
   * to setup settings information in a Region subclass.
   */
  _on_settings_refresh() {
    this.settings.value = void 0;
    this.settings.val_failure_state = false;
  }
  /**
   * Completely redraw this region and all active subregions. Overridden here to selectively pull from
   * super-region settings value if it has changed from last time we pulled it.
   */
  render(force) {
    if (!this.settings.val_failure_state) {
      this.settings.value = this._value_ref[this._value_key];
    }
    super.render(force);
  }
  /**
   * @protected
   * This is called whenever this specific region has its settings refreshed. This is the preferred location
   * to actually place the code that will 'redraw' a region.
   * 
   * Don't forget to call super() on child classes!
   */
  _on_render() {
    this._val_notice_get().innerHTML = this._val_fail_text;
    this.settings.val_failure_state ? this._val_notice_get().show() : this._val_notice_get().hide();
  }
};
var RegInInput = class extends RegIn {
  static {
    __name(this, "RegInInput");
  }
  static {
    __name2(this, "RegInInput");
  }
  /** @type {RHElement} The input tag reference */
  input;
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegInInput"] {
				/* Hold the text area and search box vertically in a column. */
				& .val-notice {
					position: absolute;
					padding: 2px;
					border: 1px solid grey;
					border-radius: 5px;
					color: red;
					background-color: white;
					display: none;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<input rfm_member='input'>
			<div rfm_member='val_notice' class='val-notice'></div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /**
   * This is called after linking is complete. It is used here to bind events.
   */
  _on_link_post() {
    this.input.addEventListener("input", () => {
      this._view_alters_value(this.input.value);
    });
  }
  /**
   * Helper method to setup validation for this input that will require the input to be a number.
   * 
   * @param {string} [failure_text] Optional special failure text to display to user. If not provided, a
   * 		generic message will be returned.
   */
  validation_set_number(failure_text) {
    if (!failure_text) failure_text = "Input must be a number.";
    this.validation_set((value) => {
      return !isNaN(value);
    }, failure_text);
  }
  /**
   * Helper method to setup validation for this input that will require the input to be a validly parsable
   * email.
   * 
   * @param {string} [failure_text] Optional special failure text to display to user. If not provided, a
   * 		generic message will be returned.
   */
  validation_set_email(failure_text) {
    if (!failure_text) failure_text = "Email is not in valid form.";
    this.validation_set(validate_email, failure_text);
  }
  /**
   * Helper method to setup validation for this input that will require the input to be a number between
   * or equal to the two provided values.
   * 
   * @param {Number} low The low value for the range this number can be
   * @param {Number} high The high value for the range this number can be
   * @param {string} [failure_text] Optional special failure text to display to user. If not provided, a
   * 		generic message will be returned.
   */
  validation_set_number_clamped(low, high, failure_text) {
    if (!failure_text) failure_text = "Input must be a number between " + low + " and " + high + ".";
    this.validation_set((value) => {
      if (isNaN(value)) return false;
      num = Number(value);
      return low <= num && num <= high;
    }, failure_text);
  }
  _on_render() {
    super._on_render();
    this.input.value = this.settings.value;
  }
};
var RegInCheckbox = class extends RegIn {
  static {
    __name(this, "RegInCheckbox");
  }
  static {
    __name2(this, "RegInCheckbox");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegInCheckbox"] {
				/* Hold the text area and search box vertically in a column. */
				& .cont {
				}
				& .checkbox {
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member="cont">
				<input rfm_member="checkbox" type="checkbox">
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RHElement} The input with type="checkbox" */
  checkbox;
  /** @type {RHElement} The input container <div> */
  cont;
  /** @type {String} A secondary identifier that's only used when this checkbox is in a radio group */
  _radio_cb_value;
  /** @type {RadioGroup} The radio group that this checkbox belongs to, if a radio group has been setup */
  _radio_group;
  /**
   * This is called after linking is complete. It is used here to bind events.
   */
  _on_link_post() {
    this.checkbox.addEventListener("input", () => {
      this._view_alters_value(this.checkbox.checked);
    });
    this.render_checksum_add_tracked("regin_cb_radio_value_ref", () => {
      if (this._radio_group != void 0) return this._radio_group._value_ref[this._radio_group._value_key];
      return 0;
    });
  }
  _on_settings_refresh() {
    this.settings.value = false;
  }
  _on_render() {
    super._on_render();
    this.checkbox.checked = this.settings.value;
  }
  /**
   * This method will bind together a set of checkbox regions to mimic the behavior of a set of radio buttons.
   * When one is checked, the others will all be made unchecked. The value ref will always be set to the
   * currently checked checkbox's value or undefined if none are checked.
   * 
   * @param {Array.<RegInCheckbox>} checkboxes A set of checkboxes to tie together
   * @param {Array.<String>} cb_values A corresponding list of 'values' which will be used to indicate
   * 		which checkbox is currently selected.
   * @param {Object} value_ref Reference to object in which region input value is stored. See above.
   * @param {String} value_key The key in `value_ref` at which value is stored: `value_ref[value_key] = value`
   * 
   * @returns {RadioGroup} Formed of these checkboxes.
   */
  static combine_into_radio(checkboxes, cb_values, value_ref, value_key) {
    return new RadioGroup(checkboxes, cb_values, value_ref, value_key);
  }
};
var RadioGroup = class {
  static {
    __name(this, "RadioGroup");
  }
  static {
    __name2(this, "RadioGroup");
  }
  /** @type {RegionSwitchyard} */
  swyd;
  /**
   * Create a new radio button group formed of the checkboxes provided.
   * 
   * @param {Array.<RegInCheckbox>} checkboxes A set of checkboxes to tie together
   * @param {Array.<String>} cb_values A corresponding list of 'values' which will be used to indicate
   * 		which checkbox is currently selected.
   * @param {Object} value_ref Reference to object in which region input value is stored. See above.
   * @param {String} value_key The key in `value_ref` at which value is stored: `value_ref[value_key] = value`
   */
  constructor(checkboxes, cb_values, value_ref, value_key) {
    if (checkboxes.length != cb_values.length) throw new Error("Number of boxes and values must match.");
    this._checkboxes = checkboxes;
    this._cb_values = cb_values;
    this._value_ref = value_ref;
    this._value_key = value_key;
    this._checkboxes[0].render_add_handler(() => {
      this._on_superregion_render();
    });
    this.swyd = this._checkboxes[0].swyd;
    this._value_update_handlers = [];
    checkboxes.forEach((checkbox, i) => {
      if (checkbox._radio_group != void 0) throw new Error("Checkbox already has radio group!");
      checkbox._radio_cb_value = cb_values[i];
      checkbox.add_value_update_handler((new_value) => {
        this._on_checkbox_value_altered(checkbox, new_value);
      });
      checkbox._radio_group = this;
    });
    this._state_set_context = false;
  }
  /**
   * Add a handler that will be called whenever the value for this input updates as a result of an action
   * taken by the user.
   * 
   * @param {Function} fn A function to call when the value for this object updates. Arg: new value
   */
  add_value_update_handler(fn) {
    this._value_update_handlers.push(fn);
  }
  /**
   * Called when the value for a checkbox updates.
   * 
   * @param {RegInCheckbox} checkbox The checkbox that changed
   * @param {*} new_value 
   */
  _on_checkbox_value_altered(checkbox, new_value) {
    if (this._state_set_context) return;
    try {
      this._state_set_context = true;
      if (new_value) {
        this._group_state_set_from_value(checkbox._radio_cb_value);
      } else {
        this._group_state_set_from_value(void 0);
      }
      let state = this._group_state_get();
      this._value_update_handlers.forEach((handler) => {
        handler(state);
      });
      this._value_ref[this._value_key] = state;
      this.swyd.render();
    } finally {
      this._state_set_context = false;
    }
  }
  /**
   * Called when the first checkbox has its _on_render() called. This is
   * used to update the checkbox group if the value_ref is changed programmatically.
   */
  _on_superregion_render() {
    if (!this._state_set_context && this._group_state_get() != this._value_ref[this._value_key]) {
      this._state_set_context = true;
      try {
        this._group_state_set_from_value(this._value_ref[this._value_key]);
      } finally {
        this._state_set_context = false;
      }
    }
  }
  /**
   * Set the states of all checkboxes on the basis of the provided 'selected' value.
   * 
   * @param {String} cb_value Value of checkbox to select, or undefined to unselect all.
   */
  _group_state_set_from_value(cb_value) {
    if (cb_value != void 0 && this._cb_values.indexOf(cb_value) == -1) {
      throw new Error(`Value ${cb_value} does not correspond to any checkboxes in group.`);
    }
    this._checkboxes.forEach((regin_cb) => {
      if (cb_value != void 0 && regin_cb._radio_cb_value == cb_value) {
        regin_cb._view_alters_value(true);
      } else {
        regin_cb._view_alters_value(false);
      }
    });
  }
  /**
   * Infer what the state of the radio group should be on the basis of what is selected.
   * 
   * @returns {String} The cb_value of the currently selected checkbox or 'undefined'.
   */
  _group_state_get() {
    let out = void 0;
    this._checkboxes.forEach((regin_cb) => {
      if (regin_cb.settings.value) {
        out = regin_cb._radio_cb_value;
      }
    });
    return out;
  }
};
var RegInTextArea = class _RegInTextArea extends RegIn {
  static {
    __name(this, "_RegInTextArea");
  }
  static {
    __name2(this, "RegInTextArea");
  }
  /** @type {RHElement} */
  textarea;
  /** @type {Boolean} Whether or not the more complex tab-behavior is enabled. */
  tab_enabled;
  /** @type {Array} A list of states, in order from newest to oldest, that this textarea has had. */
  _undo_states;
  /** @type {Array} A list of states, in order from newest to oldest, that we have 'undone'. */
  _redo_states;
  /** @type {Number} The max number of undo states that will be stored at a time */
  _undo_max_states;
  constructor(...args) {
    super(...args);
    this.tab_enabled = true;
    this._undo_states = [];
    this._undo_max_states = 20;
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegInTextArea"] {
				/* Hold the text area and search box vertically in a column. */
				& .textarea {
					box-sizing: border-box;
					resize: none;
					height: 100%;
					width: 100%;
					tab-size: 4;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<textarea rfm_member='textarea' class='textarea' spellcheck="false"></textarea>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /**
   * This is called after linking is complete. It is used here to bind events.
   */
  _on_link_post() {
    this.textarea.addEventListener("input", (e) => {
      this._view_alters_value(this.textarea.value);
    });
    this.textarea.addEventListener("keydown", (e) => {
      let start = this.textarea.selectionStart, end = this.textarea.selectionEnd;
      this.settings.selmem = { start, end };
      if (this.tab_enabled && e.key == "Tab") {
        e.preventDefault();
        let out;
        if (e.shiftKey) {
          out = _RegInTextArea._text_shift_tab_behavior_alter(this.textarea.value, start, end);
        } else {
          out = _RegInTextArea._text_tab_behavior_alter(this.textarea.value, start, end);
        }
        this.textarea.value = out.text;
        this.textarea.selectionEnd = out.selend;
        this.textarea.selectionStart = out.selstart;
        this._view_alters_value(this.textarea.value);
      }
      if (this.tab_enabled && e.key == "Enter") {
        e.preventDefault();
        let out = _RegInTextArea._text_newline_behavior_alter(this.textarea.value, start, end);
        this.textarea.value = out.text;
        this.textarea.selectionEnd = out.selend;
        this.textarea.selectionStart = out.selstart;
        this._view_alters_value(this.textarea.value);
      }
      if (e.ctrlKey && e.code == "KeyZ") {
        e.preventDefault();
        this.undo();
      }
      if (e.ctrlKey && e.code == "KeyY") {
        e.preventDefault();
        this.redo();
      }
    });
  }
  get sel() {
    return `<${this.textarea.selectionStart}:${this.textarea.selectionEnd}>`;
  }
  /**
   * Extended here to capture undo / redo state.
   */
  _view_alters_value_prosecute_update(value) {
    this._undo_state_add(this.settings.value);
    this._redo_states = [];
    super._view_alters_value_prosecute_update(value);
    this.settings.sel = { start: this.textarea.selectionStart, end: this.textarea.selectionEnd };
  }
  /**
   * Causes this textarea to revert to the most recent 'undo' state. This includes the content and the
   * selection locations.
   */
  undo() {
    let state = this._undo_states.shift();
    if (state == void 0) return;
    this._redo_state_add(this.settings.value);
    this.settings.value = state.value;
    this._view_alter_propagate(state.value);
    this.textarea.selectionStart = state.sel.start;
    this.textarea.selectionEnd = state.sel.end;
  }
  /**
   * Causes this textarea to re-revert back up the 'redo' chain of 'undo' states that have resulted from
   * a series of 'undo' operations. The 'redo' chain only exists after a series of consecutive undo
   * operations has occured and before further action from the view has taken place.
   */
  redo() {
    let state = this._redo_states.shift();
    if (state == void 0) return;
    this._undo_state_add(this.settings.value);
    this.settings.value = state.value;
    this._view_alter_propagate(state.value);
    this.textarea.selectionStart = state.sel.start;
    this.textarea.selectionEnd = state.sel.end;
  }
  /**
   * Add an 'undo' state to the list. This will become the most recent state. If the undo state list is long
   * enough, the oldest previous state will be removed. A true copy will be created, all references purged.
   * 
   * @param {*} value Some value, which should correspond to this.settings.value. Must be JSON-serializable
   */
  _undo_state_add(value) {
    this._undo_states.unshift(JSON.parse(JSON.stringify(
      {
        sel: { start: this.settings.selmem.start, end: this.settings.selmem.end },
        value
      }
    )));
  }
  /**
   * Add a 'redo' state to the list. The 'redo' list is only available when a series of 'undo's have just
   * occurred. The moment that another 'undo' state is added, the 'redo' state is cleared and no longer
   * available.
   * 
   * @param {*} value Some value, which should correspond to this.settings.value. Must be JSON-serializable
   */
  _redo_state_add(value) {
    this._redo_states.unshift(JSON.parse(JSON.stringify(
      {
        sel: { start: this.settings.selmem.start, end: this.settings.selmem.end },
        value
      }
    )));
  }
  /**
   * This implements a different newline event behavior for the textarea. In this behavior, newline inserts
   * a newline **followed by the same number of tabs** as the preceeding line has before any text.
   * 
   * @param {String} text Text at the start of the newline event.
   * @param {Number} selstart The index, in the string, of selection start
   * @param {Number} selend The index, in the string, of the selection end
   * 
   * @returns {Object} With keys: text, selstart, selend for the new configuration of this text selection.
   */
  static _text_newline_behavior_alter(text, selstart, selend) {
    let out = { text: "" };
    let text_i = selstart - 1, n_tabs = 0;
    while (text_i >= 0) {
      if (text[text_i] == "	") n_tabs += 1;
      if (text[text_i] == "\n") break;
      text_i--;
    }
    let inserted = "\n";
    for (let x = 0; x < n_tabs; x++) {
      inserted += "	";
    }
    out.text = text.substring(0, selstart) + inserted + text.substring(selend);
    out.selstart = selstart + inserted.length;
    out.selend = out.selstart;
    return out;
  }
  /**
   * Determine how to modify text in a textarea as the result of a tab keydown even in which SHIFT is not held.
   * 
   * If selection is a point, a tab is inserted.
   * If selection is a one-line range, then the range is deleted and tab is inserted.
   * If selection is a multi-line range, tabs are inserted at the start of all lines and no text is deleted.
   * 
   * @param {String} text The value of the text when this behavior event occurred
   * @param {Number} selstart The index, in the string, of selection start when event occurred
   * @param {Number} selend The index, in the string, of the selection end when the event occurred
   * 
   * @returns {Object} With keys: text, selstart, selend for the new configuration of this text selection.
   */
  static _text_tab_behavior_alter(text, selstart, selend) {
    let out = { text: "" };
    if (selstart == selend) {
      out.text = text.substring(0, selstart) + "	" + text.substring(selend);
      out.selstart = selstart + 1;
      out.selend = out.selstart;
      return out;
    }
    let seltext = text.substring(selstart, selend);
    if (seltext.indexOf("\n") == -1) {
      out.text = text.substring(0, selstart) + "	" + text.substring(selend);
      out.selstart = selstart + 1;
      out.selend = out.selstart;
    } else {
      let selected_lines = _RegInTextArea._text_get_selected_lines(text, selstart, selend);
      out.text = text;
      selected_lines.reverse().forEach((first_char_i) => {
        if (first_char_i == text.length) {
          out.text += "	";
        } else {
          out.text = out.text.substring(0, first_char_i) + "	" + out.text.substring(first_char_i);
        }
      });
      out.selend = selend + selected_lines.length;
      out.selstart = selstart;
    }
    return out;
  }
  /**
   * Determine how to modify text in a textarea as the result of a tab event in which SHIFT is also held.
   * 
   * If selection is a point following a tab character, the character is removed.
   * If selection is a one-line range, nothing occurs
   * If selection is a multi-line range, all lines with a tab character at the start of the line have that
   *    tab character removed.
   * 
   * @param {String} text The value of the text when this behavior event occurred
   * @param {Number} selstart The index, in the string, of selection start when event occurred
   * @param {Number} selend The index, in the string, of the selection end when the event occurred
   * 
   * @returns {Object} With keys: text, selstart, selend for the new configuration of this text selection.
   */
  static _text_shift_tab_behavior_alter(text, selstart, selend) {
    let out = { text: "" };
    if (selstart == selend) {
      if (text.indexOf("	") != -1)
        out.text = text.substring(0, selstart - 1) + text.substring(selend);
      out.selstart = selstart - 1;
      out.selend = out.selstart;
      return out;
    }
    let seltext = text.substring(selstart, selend);
    if (seltext.indexOf("\n") == -1) return { "text": text, "selstart": selstart, "selend": selend };
    let selected_lines = _RegInTextArea._text_get_selected_lines(text, selstart, selend), n_remd = 0;
    out.text = text;
    selected_lines.reverse().forEach((first_char_i) => {
      if (first_char_i == text.length) {
      } else {
        if (out.text[first_char_i] == "	") {
          n_remd += 1;
          out.text = out.text.substring(0, first_char_i) + out.text.substring(first_char_i + 1);
        }
      }
    });
    out.selend = selend - selected_lines.length;
    out.selstart = selstart;
    return out;
  }
  /**
   * Get a list of selected-line start indices.
   * 
   * A line is 'selected' if any of the selection range touches this line. This includes the final
   * 'empty string' line. If there's a trailing newline that is selected, it will be given an index
   * that's actually NOT IN THE PROVIDED 'text' string. It will be equal to the length of the string.
   * 
   * @param {String} text Text to search through
   * @param {Number} selstart The index, in the string, of selection start
   * @param {Number} selend The index, in the string, of the selection end
   * 
   * @returns {Array.<Number>} A list of indices of the first character of each selected line.
   */
  static _text_get_selected_lines(text, selstart, selend) {
    let lines = text.split("\n"), line, text_i = 0, line_contained_selection = false, sel_line_indices = [], line_start = 0;
    for (let line_i = 0; line_i < lines.length; line_i++) {
      line_contained_selection = false;
      line = lines[line_i];
      line_start = text_i;
      for (let char_i = 0; char_i < line.length; char_i++) {
        if (line[char_i] != text[text_i]) throw "DEVCHECK";
        if (selstart <= text_i && text_i <= selend + 1) line_contained_selection = true;
        text_i += 1;
      }
      if (selstart <= text_i && text_i <= selend + 1) line_contained_selection = true;
      if (line_contained_selection) {
        sel_line_indices.push(line_start);
      }
      if (line_i != lines.length - 1) {
        text_i += 1;
      }
    }
    return sel_line_indices;
  }
  /**
   * Extended to add the selection flags. These are needed for UNDO / REDO tracking.
   */
  _on_settings_refresh() {
    this.settings.selmem = { start: 0, end: 0 };
  }
  _on_render() {
    super._on_render();
    this.textarea.value = this.settings.value;
  }
};
var DispatchClientJS = class {
  static {
    __name(this, "DispatchClientJS");
  }
  static {
    __name2(this, "DispatchClientJS");
  }
  /**
   * Initialize a dispatch client which can communicate with a central dispatch server. This client will be assigned
   * a unique session id and all requests to the server will have this ID associated with it.
   * This client adheres to the JSONRPC 2.0 standard for communication.
   * 
   * @param {String} server_domain The absolute URL that points to the domain of this dispatch server (e.g. https://www.theroot.tech)
   * @param {String} dispatch_route The route to the dispatch request handler. Default "/_dispatch"
   * @param {String} client_name Client namespace to operate under. Default is 'js'
   * @param {Boolean} verbose Whether or not to print log messages. Default is True
   */
  constructor(server_domain, dispatch_route = "/_dispatch", client_name = "js", verbose = 1) {
    this.dispatch_url = server_domain + dispatch_route;
    this.base_url = server_domain;
    this.verbose = verbose;
    this.client_name = client_name;
    this.session_id = this.gen_session_id();
    this.foreign_type = "js";
    this.base_data = {};
    this.client_functions = {};
    this.server_functions = [];
    this._cookies = {};
    this.csrf_token = void 0;
    this.polling_fast = 1;
    this.polling_slow = 5;
    this.request_timeout = 10;
    this.log_debug("Initialized to point at " + this.dispatch_url + " with session ID: " + this.session_id);
  }
  /**
   * Call this on a dispatch client instance only once to set up the mapping
   * of available functions on the backend.
   * 
   * It is not neccessary to use this function. It's perfectly appropriate to never call this and to use
   * call_server_function() instead.
   * 
   * @returns {Promise} A promise which will resolve when the backend functions have been queried.
   */
  setup_backend_functions() {
    return new Promise((res, rej) => {
      this.call_server_function("__dispatch__get_functions").then((result) => {
        this.server_functions = result;
        this.log_debug("Found " + this.server_functions.length + " server functions.");
        this.server_functions.forEach((fname) => {
          this[fname] = /* @__PURE__ */ function(c_ref_fname) {
            return function(...rest_args) {
              return this.call_server_function(c_ref_fname, ...rest_args);
            };
          }(fname);
          this.log_debug(fname);
        });
        res();
      }).catch((error) => {
        throw "DISPATCH ERROR: C" + error.code + ": '" + error.message + "'";
      });
    });
  }
  /**
   * Provide a csrf token to append to all requests which originate from this dispatch client.
   * 
   * @param {String} csrf_token The csrf token to append to all requests
   */
  setup_csrf(csrf_token) {
    this.log_debug("Added csrf token '" + csrf_token + "' to dispatch.");
    this.csrf_token = csrf_token;
  }
  /**
   * Call a function on the running dispatch backend associated with this client. This function call will be provided
   * with all given arguments.
   * 
   * @param {string} function_name The name of the backend function to call
   * @param  {...*} args Any number of arguments to provide to the backend function. Keyword arguments are not supported.
   * 
   * @returns {Promise} A promise that will resolve with the JSONRPC 'result' object or reject with the error
   */
  call_server_function(function_name, ...args) {
    var params = encodeURIComponent(JSON.stringify(args)), permanent_data = encodeURIComponent(JSON.stringify(this.base_data));
    var data2 = {
      "jsonrpc": "2.0",
      "method": function_name,
      "params": params,
      "id": this.session_id,
      "__dispatch__permanent_data": permanent_data
    };
    var debug_datastring = JSON.stringify(data2), mlen = Math.min(debug_datastring.length, 256);
    if (function_name != "__dispatch__client_poll") {
      this.log_debug("Calling " + function_name + " with " + debug_datastring.substring(0, mlen));
    }
    return new Promise((res, rej) => {
      this.get_json(this.dispatch_url, data2).then((response_data) => {
        var result = response_data.result;
        var error = response_data.error;
        if (result != void 0) {
          res(result);
        } else if (error != void 0) {
          console.error(error);
          rej(error);
        } else {
          console.error(response_data);
          throw "Neither result nor error defined in dispatch response.";
        }
      }).catch((code, message) => {
        if (code >= 300 && code < 500) {
          console.error("Server returns code '" + code + "' when attempting dispatch request. Check that client is configured properly.");
        } else if (code >= 500 && code < 600) {
          console.error("Server returns code '" + code + "' when attempting dispatch request. Check that server is configured properly.");
        } else {
          throw "Unhandled http response code '" + code + "'";
        }
        rej(code, message);
      });
    });
  }
  /**
   * A pure javascript method to send a POST request to a url with some data.
   * 
   * @param {String} url The url to send the post request to
   * @param {Object} data A set of key/value pairs with post parameters and data. All post parameter values
   * 	should be in forms that can be directly converted to a string (so not Object or Array)
   * 
   * @returns {Promise} A promise that will resolve upon receiving a 200 with the result data
   * 	or reject (upon non-200) with arguments (code, message)
   */
  get_json(url, data2) {
    return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      var param_string = "";
      for (const [key, val] of Object.entries(data2)) {
        param_string += encodeURIComponent(key) + "=" + encodeURIComponent(val) + "&";
      }
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      if (this.csrf_token != void 0) {
        xhr.setRequestHeader("X-CSRFToken", this.csrf_token);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status === 200) {
            res(JSON.parse(xhr.responseText));
          } else {
            rej(xhr.status, xhr.responseText);
          }
        }
      };
      xhr.send(param_string);
    });
  }
  /**
   * Set the polling interval.
   * 
   * @param {Number} interval Number of seconds between polls. 
   */
  polling_set_frequency(interval) {
    this._polling_enable(interval);
  }
  /**
   * Set dispatch polling to the faster rate.
   */
  polling_set_fast() {
    this.polling_set_frequency(this.polling_fast);
  }
  /**
   * Set dispatch polling to the slower rate.
   */
  polling_set_slow() {
    this.polling_set_frequency(this.polling_slow);
  }
  /**
   * Enable polling to communicate with server and check for server-initiated function calls. This function
   * may be called any number of times to change the polling interval dynamically.
   * @param {Number} poll_interval The amount of seconds between polls
   */
  _polling_enable(poll_interval) {
    this._polling_disable();
    this.polling_fn_id = window.setInterval(this._polling_function.bind(this), poll_interval * 1e3);
  }
  /**
   * Disables polling and does cleanup. Safe to call even if polling is not happening.
   */
  _polling_disable() {
    if (this.polling_fn_id != void 0) {
      window.clearInterval(this.polling_fn_id);
      this.polling_fn_id = void 0;
    }
  }
  /**
   * This is the function that is called every time the poll interval has passed. It is responsible for
   * communicating with the server to determine if any server-initiated function calls have occurred.
   */
  _polling_function() {
    this.call_server_function("__dispatch__client_poll", this.session_id, this.client_name).then((result) => {
      var function_blocks = result.queued_functions;
      function_blocks.forEach((function_block) => {
        this.client_call_bound_function(function_block.fname, function_block.args);
      });
    }).catch((e) => {
      console.warn("Standard poll has failed");
      console.warn(e);
    });
  }
  /**
   * Call a function which has been bound using client_bind_function(). This is generally called by
   * polling when the server instigates a function call.
   *
   * @param {String} function_name The name of the function to call
   * @param {Array} args A list of arguments to be provided to the function when we call it 
   */
  client_call_bound_function(function_name, args) {
    var fn = this.client_functions[function_name];
    if (fn == void 0) {
      this.log("Warning: Server attempts to call unbound frontend function '" + function_name + "'");
      return;
    }
    var print_args = JSON.stringify(args);
    if (print_args.length > 256) print_args = print_args.substring(0, 256) + "...";
    this.log_debug("Calling frontend function: " + function_name + print_args);
    fn.apply(null, args);
  }
  /**
   * Bind a function to this client so the server can call it. For now, the return value of this
   * function is entirely ignored.
   * @param {Function} frontend_fn The function to be called, with some sort of 'self' context bound
   * @param {String} function_name Can be provided to set a specific name for a function.
   * 		This must be provided for anon functions. Default is to use the given name of the provided function.
   */
  client_bind_function(frontend_fn, function_name) {
    var name = function_name || frontend_fn.name;
    if (name == "anonymous" || name == "") {
      if (function_name == void 0) {
        throw "GPQERROR: Function name not provided when binding function " + frontend_fn;
      }
      name = function_name;
    }
    if (name.substring(0, 6) == "bound ") {
      name = name.substring(6);
    }
    this.log_debug("Binding dispatch callable function '" + function_name + "'");
    this.client_functions[name] = frontend_fn;
  }
  /**
   * Modify a post request data block to have any base_data and perhaps to prevent caching.
   * 
   * @param {Object} request_data The key-value dict that is sent to the server in the POST request
   * @param {Boolean} prevent_caching OPTIONAL: If true, add a special param to prevent caching. Default True.
   */
  prep_data(request_data, prevent_caching) {
    prevent_caching = prevent_caching || 1;
    if (prevent_caching) {
      request_data.__dispatch__cache_bust = (/* @__PURE__ */ new Date()).getTime();
    }
    request_data = Object.assign({}, request_data, this.base_data);
    return request_data;
  }
  /**
   * Get a very-likely-to-be-unique hash ID for this 'session'. This hash is used on the backend to determine
   * which browser window from which a request originates. While this ID is not guaranteed to be unique,
   * it is extremely unlikely it will overlap with another. Even if it does, the problem will be temporary
   * and will be solved next time the page is refreshed.
   */
  gen_session_id() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  /**
   * Log a message, but only in verbose mode.
   * @param {String} message A message to be printed
   */
  log_debug(message) {
    if (this.verbose) {
      console.log(message);
    }
  }
  /**
   * Log a message whether verbose or not.
   * @param {String} message A message to be printed
   */
  log(message) {
    console.log(message);
  }
};
var RegionSwitchyard = class extends Region {
  static {
    __name(this, "RegionSwitchyard");
  }
  static {
    __name2(this, "RegionSwitchyard");
  }
  /**
   * Instantiate a new Switchyard region. A webapp should have only one instance of this for a page at
   * a time.
   * 
   * The creation process for a Switchyard region is similar to any region, but with an extra step:
   * 1. Instantiate, which does nothing but setup memory
   * 2. Fabricate, which will often do nothing as for all but the smallest applications it makes more
   *    sense to break the visuals of the page into at least one layer of regions below the switchyard.
   * 3. Link, which is a little different from a subregion as there's no super-region for a switchyard.
   *    Literal linking-into-DOM is also optional. See link()'s description for more info.
   * 4. Load, which kicks of a chain of loading operations to pull down data, setup dispatch, etc.
   * 
   * It's good practice to extend this constructor in a child class to setup type definitions for subregions
   * and datahandlers. See example site. TODO
   */
  constructor() {
    super();
    this._loading = false;
    this.config = {
      /** @description The base z-index of an ethereal region (overlay) */
      z_index_eth_base: 100
    };
    this.dispatch_config = {
      /** @description The domain to point Dispatch requests at. Defaults to page domain. */
      domain: window.location.origin,
      /** @description The route that dispatch aims at. The default is /_dispatch. */
      route: "/_dispatch",
      /** @description The 'namespace' that this regional application operates under */
      namespace: "js",
      /** @description Whether to print logs in verbose mode. */
      verbose: false,
      /**
       * @description Whether or not to load functions from server, increasing load times but improving
       * syntax for backend calls.
       * */
      load_functions: 0
    };
    this._focus_settings = {
      /** @description The currently in-focus region. can be undefined. */
      region: void 0,
      /** @description A timestamp used to prevent focus propagation. */
      timestamp: void 0
    };
    this._id_gen_map = {};
    this._call_on_load = [];
    this._css_setup();
    this._setup_key_events();
  }
  /**
   * Linking for a Switchyard is substantially different from regular regions. The link method
   * is entirely overridden and performs only a subset of actions. Furthermore, it's not a requirement
   * to actually have linking element in the DOM. A Switchyard can be 'DOMless' with no literal
   * DOM connection, if so desired.
   * 
   * Linking operations for the switchyard includes:
   * + Link this region to the specific element in webpage DOM that it represents.
   * + Assign a unique in-memory ID for this region and set the reg_el's ID to the same.
   * + Fabrication links (if fab() was called earlier), including links to this.$element and linking $elements
   *   to the reg_el.
   * 
   * @param {HTMLElement} reg_el The DOM element for the switchyard, or undefined to leave it 'DOMless'
   * 
   * @returns {this} itself for function call chaining
   */
  link(reg_el) {
    if (reg_el === void 0) {
      reg_el = document.createElement("div");
    }
    this.reg = reg_el;
    this.reg.setAttribute("rfm_reg", this.constructor.name);
    this.swyd = this;
    this._link_ids();
    this._link_fabricate();
    this._create_datahandlers();
    this._create_subregions();
    this._on_link_post();
    return this;
  }
  /**
   * @abstract
   * 
   * This method should create all datahandlers that are needed for this application during the link()
   * phase of overall instantiation. This is called at the same time as _create_subregions() and only exists
   * to provide extra guidance as to the 'correct' place to define datahandlers.
   * 
   * Note that this function is NOT asynchronous. If the implementation desires datahandlers to have some
   * data available upon app load, use _load_datahandlers() as well.
   * 
   * Such a function might resemble:
   * _create_datahandlers()
   * {
   *     this.dh_one = new DHREST()
   *     this.dh_two = new DHTabuler()
   * 
   *     this.datahandler_subscribe([this.dh_one, this.dh_two])
   * }
   */
  _create_datahandlers() {
  }
  /**
   * This method is the primary data loader for the region structure. It will load the following in this order:
   * + Dispatch (which is instant unless configured to pull server methods)
   * + Anything special, which would be defined in a subclass of RegionSwitchyard
   * + Datahandlers as implemented in subclass. This may or may not result in actual loading, imp. dependent.
   * 
   * @returns {Promise} A promise that resolves when the app is fully loaded.
   */
  async load() {
    this.settings_refresh();
    this._loading = true;
    return this._load_dispatch().then(() => {
      this.on_loaded_dispatch();
      return this._load_special();
    }).then(() => {
      this.on_loaded_specials();
      return this._load_datahandlers();
    }).then(() => {
      this._loading = false;
      this.on_load_complete();
      this._call_on_load.forEach((fn) => fn());
      this.render();
    }).catch((e) => {
      this.on_load_failed(e);
      throw e;
    });
  }
  /**
   * @returns {Boolean} True if this switchyard is asynchronously loading things and false otherwise
   */
  is_loading() {
    return this._loading;
  }
  /**
   * Called to initiate the dispatch BACKEND for this app if one is used. Other backend-communication methods
   * can be easily added to the _load_special() for each app, but dispatch is so prevalent among regional
   * applications that a special function will exist for it here.
   * 
   * This function will resolve immediately unless dispatch has been configured to load functions.
   * 
   *  @returns {Promise} A promise which loads dispatch.
   */
  async _load_dispatch() {
    return new Promise((res, rej) => {
      let csrf_token = this.token_get_csrf(), cfg = this.dispatch_config;
      this.dispatch = new DispatchClientJS(cfg.domain, cfg.route, cfg.namespace, cfg.verbose);
      this.dispatch.setup_csrf(csrf_token);
      if (cfg.load_functions) {
        this.dispatch.setup_backend_functions().then(res).catch(rej);
      } else {
        res();
      }
    });
  }
  /**
   * @abstract
   * Called to load any special resources which must exist before the regional structure can operate.
   * 
   * @returns {Promise} A promise which loads special resources.
   */
  async _load_special() {
    return Promise.resolve();
  }
  /**
   * @abstract
   * Overwrite in child class to setup datahandlers for this project. Use of this method is only required
   * if certain datahandlers MUST be available when load() completes. This is ultimately a convenience method
   * which can be used to, for example:
   * + Setup any tracking that is desired so data is available on load() completion.
   * + Call pull() so that tracked data is available.
   * 
   * ```
   * _create_datahandlers()
   * {
   *     this.dh_one = new DHREST()
   *     this.dh_two = new DHTabuler()
   * 
   *     this.datahandler_subscribe([this.dh_one, this.dh_two])
   * }
   * 
   * _load_datahandlers()
   * {
   *     this.dh_one.track_ids([1, 2, 3])
   * 
   *     return this.pull()
   * }
   * ```
   * 
   * @returns {Promise} A promise that will resolve when datahandlers are setup.
   */
  async _load_datahandlers() {
    return Promise.resolve();
  }
  /**
   * @abstract
   * Called when dispatch is loaded.
   */
  on_loaded_dispatch() {
  }
  /**
   * @abstract
   * Called when all special resources are loaded
   */
  on_loaded_specials() {
  }
  /**
   * @abstract
   * Called at the end of the _load() process. All data is loaded and regions are setup.
   */
  on_load_complete() {
  }
  /**
   * @abstract
   * Called if, at any point, the load fails for some reason.
   * 
   * @param {Error} e The error that caused load failure.
   */
  on_load_failed(e) {
  }
  /**
   * Register a function to be executed when the loading stage is complete. This will fire after the
   * post-load settings_refresh() but before the post-load render().
   * 
   * @param {Function} fn A function that will execute with no arguments when the loading stage is complete.
   */
  call_on_load(fn) {
    this._call_on_load.push(fn);
  }
  /**
   * @magic
   * Inject the custom CSS classes used by regional. All of these start with 'rcss', which is a sort
   * of magic token I suppose which generally shouldn't be used for classnames to prevent overlap.
   * 
   * Prater code workday:
   * Pigeons coo from nearby tree;
   * Bumblebees drift by.
   */
  _css_setup() {
    css_inject(
      /* css */
      `
			.rcss-eth {
				width: 100vw; height: 100vh;
				position: absolute;
				top: 0; left: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(25,25,25,0.65);
			}
		`
    );
  }
  /**
   * Get a new ID for the given namespace. This will always return a unique string ID for whatever namespace
   * is given. In fact, no namespace can be given and a unique namespace will still be returned.
   * 
   * @param {String} id_namespace Some identifying information, so this ID can be human-read more clearly
   */
  _id_get_next(id_namespace) {
    if (typeof dom_src === "string") throw TypeError("Namespace ID must be string. Was " + id_namespace);
    if (!(id_namespace in this._id_gen_map)) {
      this._id_gen_map[id_namespace] = 0;
    }
    this._id_gen_map[id_namespace] += 1;
    return id_namespace + this._id_gen_map[id_namespace];
  }
  // A unique number to slap on the end of requests for anti-caching.
  static get unique() {
    return (/* @__PURE__ */ new Date()).getTime();
  }
  /**
   * Modify a $.getJSON request data block to have a unique parameter which prevents caching.
   * @param {Object} request_data The key-value dict that is sent to the server in a $.getJSON request.
   */
  anticache(request_data) {
    request_data._ = RegionApp.unique;
    return request_data;
  }
  /**
   * Modify a plain URL (e.g. not a POST url) to have some random noise on the end that prevents it from
   * pulling out of cache.
   * @param {Object} url A plain url, like a src.
   */
  anticache_url(url) {
    return url + "?_=" + RegionApp.unique;
  }
  /**
   * @abstract
   * Get a CSRF token for this app. Behavior must be implemented in child app to work.
   * 
   * A CSRF token is not required for most RMF operations, but some key ones (like dispatch) will fail without it.
   */
  token_get_csrf() {
  }
  /**
   * Get the dispatch route url for this application. This function determines whether or not a dispatch backend will be loaded for this
   * app. This function is intended to be overwritten in applications which use dispatch
   * 
   * @returns {str} The route URL for this app's dispatch. Can be a full url like "http://www.aperture.com/_dispatch" or a relative one like
   * "/_dispatch"
   */
  dispatch_get_url() {
  }
  /**
   * Get the namespace which this app's dispatch instance should operate under.
   * 
   * @returns {str} The namespace string (see dispatch documentation)
   */
  dispatch_get_namespace() {
  }
  /**
   * Return the path to the dispatch module. This is defined by default as ../lib/dispatch.js but may be overridden in the app's child
   * class.
   */
  dispatch_get_module_path() {
    return "../lib/dispatch.js";
  }
  /**
   * Get the dispatch backend for this app. This will just return this._dispatch_backend if there is one. If not, an error will be thrown
   * 
   * @return {DispatchClientJS} dispatch instance of the connected backend for this app
   */
  get dispatch_backend() {
    if (this._dispatch_backend == void 0) {
      throw "App " + this.constructor.name + " has not defined a dispatch backend. Define a dispatch_get_url() method in the application class.";
    }
    return this._dispatch_backend;
  }
  /**
   * Call this to setup the listeners for focus. This is straightforward, but it belongs in the switchyard
   * rather than base region class because it is in the switchyard that all the data lives.
   * 
   * @param {Region} region 
   */
  _focus_region_setup_listeners(region) {
    this.reg.addEventListener("click", (e) => {
      if (e != void 0) {
        if (e.timeStamp == this._focus_settings.timestamp) {
          return;
        }
        this._focus_settings.timestamp = e.timeStamp;
      }
      this.swyd.focus_region_set(this);
    });
  }
  /**
   * Get the region that has most recently been brought into 'focus'. A region can be set as 'focused' if it is
   * activated, right clicked, or clicked. Note that this focus is independent of what the browser might
   * refer to as 'focused'.
   * 
   * @returns {Region} The currently in-focus region, or undefined if there is not one.
   */
  focus_region_get() {
    return this._focus_settings.region;
  }
  /**
   * Set the current focus region. This is called by the subregions when they are activated, right clicked, or
   * clicked.
   * 
   * //TODO write tests
   * 
   * @param {Region} region The region to set as focused
   */
  focus_region_set(region) {
    this._focus_settings.region = region;
  }
  /**
   * Key events in regional are handled slightly differently than other events. Normally, when a key event
   * occurs it will apply to anything 'content editable' like an input or a textarea. If nothing of the sort
   * is 'in focus', it ripples up until it hits the document.
   * 
   * For some regions, it's handy to capture key events for certain hotkey-type functions (CTRL+S to save, for
   * example). A keydown can not be directly bound to most tags that a reg is likely to be, so region-specific
   * keypress handling requires a bit of its own logic. The Switchyard has listening methods that specifically
   * propagate the event to all regions that are currently 'active'. When a keydown event occurs, unless it
   * is captured (for instance, by a focused input box) all active regions will have this method called.
   * 
   * This method sets up the global key event handlers so that key presses propagate to active regions. This
   * can be called at any point - the regional structure does not have to be instantiated for this to work.
   */
  _setup_key_events() {
    document.addEventListener("keydown", (e) => {
      for (const [subreg_id, subreg] of Object.entries(this.subregions)) {
        subreg._key_event_prop("keydown", e);
      }
    });
    document.addEventListener("keyup", (e) => {
      for (const [subreg_id, subreg] of Object.entries(this.subregions)) {
        subreg._key_event_prop("keyup", e);
      }
    });
  }
  /**
   * If specifics are not important, this can be used to automatically create and append an element to
   * the <body> of the page which can be the root region element for an ethereal region.
   * 
   * @returns {RHElement} An element that has been newly created and appended to document body.
   */
  eth_reg_create() {
    let el = RHElement.wrap(document.createElement("div"));
    document.body.append(el);
    return el;
  }
  /**
   * Deactivate all associated regions.
   */
  deactivate_all() {
    for (var x = 0; x < this.subregions.length; x++) {
      this.subregions[x].deactivate();
    }
  }
};

// cognatio/web/client/navigator/src/regs/reg_in_cb_lever.js
var RegInCBLever = class extends RegInCheckbox {
  static {
    __name(this, "RegInCBLever");
  }
  /** @type {RHElement} The input with type="checkbox" */
  checkbox;
  /** @type {RHElement} The input container <div> */
  cont;
  /** @type {RHElement} The container for the lever that turns. */
  lever;
  /** @type {RHElement} The little light to the right of the lever */
  light;
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegInCBLever"] {
				/* This toplevel cont should always be square, with 100% rmargin and 50% lmargin. */
				& .cont {
					position: relative;
					width: 2em; height: 2em;
					background-color: transparent;
					margin-right: 2em;
					margin-left: 1em;
				}
				& .checkbox {
					position: absolute;
					all: unset;
				}
				& .lever {
					position: absolute;
					width: 100%; height: 100%;
					top: 0%;
					transition: .5s;
					display: flex; align-items: center; justify-content: center;
					cursor: pointer;
					border-radius: 50%;
				}
				& .lever .hub {
					position: absolute;
					box-sizing: border-box;
					width: 100%; height: 100%;
					border-radius: 50%;
					background-color: var(--metal-blue);
					border: 1px solid var(--metal-blue-dark);

					display: flex; align-items: center; justify-content: center;
				}
				& .lever .hub-inner {
					position: absolute;
					box-sizing: border-box;
					width: 80%; height: 80%;
					border-radius: 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .lever .post {
					box-sizing: border-box;
					position: absolute;
					right: 90%; top: 40%;
					width: 40%; height: 20%;
					border-top-right-radius: 10% 50%;
					border-bottom-right-radius: 10% 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .lever .ball {
					box-sizing: border-box;
					position: absolute;
					left: -50%; top: 38%;
					width: 24%; height: 24%;
					border-radius: 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .light-socket {
					position: absolute;
					left: 125%; top: 25%;
					width: 50%; height: 50%;
					background-color: var(--metal-grey);
					border-radius: 50%;

					display: flex; align-items: center; justify-content: center;
				}
				& .light {
					width: 50%; height: 50%;
					background-color: var(--metal-grey);
					border-radius: 50%;
				}
				& input:checked + .lever {
					transform: rotate(135deg);
					transition-timing-function: cubic-bezier(.56,.19,.86,.62);
				}
				& input:checked ~ .light-socket > .light {
					background-color: var(--green);
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<label>
				<div rfm_member="cont" class="cont">
					<input rfm_member="checkbox" class="checkbox" type="checkbox">
					<div rfm_member="lever" class="lever">
						<div class="hub">
							<div class="hub-inner"></div>
						</div>
						<div class="post"></div>
						<div class="ball"></div>
					</div>
					<div class='light-socket'>
						<div class='light' rfm_member='light'></div>
					</div>
				</div>
			</label>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
};

// cognatio/web/client/navigator/src/regs/reg_in_cb_typeset.js
var RegInCBTypeset = class extends RegInCheckbox {
  static {
    __name(this, "RegInCBTypeset");
  }
  /** @type {RHElement} The input with type="checkbox" */
  checkbox;
  /** @type {RHElement} The input container <div> */
  cont;
  /** @type {RHElement} The actual, visible marker of the input */
  visual_checkbox;
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegInCBTypeset"] {
				& .cont {
					position: relative;
					width: 100%; height: 100%;
					background-color: transparent;
					display: flex; align-items: center; justify-content: center;
				}
				& .checkbox {
					position: absolute;
					all: unset;
				}
				& input:checked + .check {
					display: flex;
				}
				& input:checked ~ .light-socket > .light {
					background-color: var(--green);
				}
				& .visual-checkbox {
					box-sizing: border-box;
					width: 100%; height: 100%;
					border: 1px solid var(--punchcard-beige-darker);
					cursor: pointer;
				}
				& .check {
					position: absolute;
					top: 20%;
					display: none;
					color: var(--red);
					font-size: 200%;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member="cont" class="cont">
				<input rfm_member="checkbox" class="checkbox" type="checkbox">
				<div class="check">*</div>
				<div rfm_member="visual_checkbox" class="visual-checkbox">
				</div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
};

// cognatio/web/client/navigator/src/regs/reg_one_choice.js
var RegOneChoiceNav = class extends RegOneChoice {
  static {
    __name(this, "RegOneChoiceNav");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegOneChoiceNav"] {
				& .cont
				{
					max-width: 30em;
					color: var(--punchcard-beige-darker);
					border-radius: 5px;
					overflow: hidden;
					border: 1px solid var(--punchcard-beige-darker);

					font-family: "IBMPlexMono";
				}
				& .text
				{
					padding-bottom: 0.5em;
					padding-left: 0.5em;
					padding-right: 0.5em;
				}
				& .row
				{
					display: flex; flex-direction: row; justify-content: flex-end;
				}
				& button
				{
					margin: 0.5em;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<punchcard>
				<div rfm_member='cont' class='cont background'>
					<div rfm_member="title" class='line-title'>Title</div>
					<div rfm_member="text" class='text'>Text</div>
					<div class='row'>
						<button class='button' rfm_member="continue"> Continue </button>
					</div>
				</div>
			</punchcard>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
};

// cognatio/web/client/navigator/src/regs/reg_two_choice.js
var RegTwoChoiceNav = class extends RegTwoChoice {
  static {
    __name(this, "RegTwoChoiceNav");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegTwoChoiceNav"] {
				& .cont
				{
					max-width: 30em;
					color: var(--punchcard-beige-darker);
					border-radius: 5px;
					overflow: hidden;
					border: 1px solid var(--punchcard-beige-darker);

					font-family: "IBMPlexMono";
				}
				& .text
				{
					padding-bottom: 0.5em;
					padding-left: 0.5em;
					padding-right: 0.5em;
				}
				& .row
				{
					display: flex; flex-direction: row; justify-content: space-between;
				}
				& button
				{
					margin: 0.5em;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<punchcard>
				<div rfm_member='cont' class='cont background'>
					<div rfm_member="title" class='line-title'>Title</div>
					<div rfm_member="text" class='text'>Text</div>
					<div class='row'>
						<button class='button' rfm_member="deny"> Deny </button>
						<div style="width: 5em"></div>
						<button class='button' rfm_member="confirm"> Confirm </button>
					</div>
				</div>
			</punchcard>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
};

// cognatio/web/client/navigator/src/regs/reg_sw_nav.js
var RegSWNav = class extends RegionSwitchyard {
  static {
    __name(this, "RegSWNav");
  }
  constructor() {
    super();
    this.dispatch_config.load_functions = 1;
    this.default_page_name = "gateway";
  }
  fab_get() {
    let css = (
      /* css */
      `

			[rfm_reg="RegSWNav"] {

				/* The 'parent' class here is the <body> */
				overflow: hidden;

				/* This sits at the very top level to intercept scrolling so the whole window doesn't scroll,
				which ruines the ethereal behaviors. */
				& .cont-scroll {
					width: 100vw;
					height: 100vh;
					overflow: auto;
				}
				/* The master container for the navigator. One level below the 'scrolling' container */
				& .cont-master {
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
				/* The main split container that holds the viewport, editor, controls and coords */
				& .cont-split {
					box-sizing: border-box;
					width: 100vw; height: 100vh;
					display: flex;
					flex-direction: row;
					overflow: hidden;
					position: relative; /* Needed so that abs-pos children will clip out correctly. */
				}
				/* A small container for the controls in the top left. Bound to cont-split, not browser viewport */
				& .cont-controls {
					position: absolute;
					top: 0; left: 0;
					/* Width / height set by content within */
					display: flex;
					flex-direction: column;
					pointer-events: none;
				}
				/* A small container for the coords in the bottom left. Bound to cont-split, not browser viewport */
				& .cont-coords {
					position: absolute;
					bottom: 0; left: 0;
				}
				/* Main container in cont-split to hold the navigator map region */
				& .cont-map {
					height: 100%;
					width: 100%; /* Width is managed more specifically by region machinery */
					border: 1px dashed grey;

					transition: 0.5s;
				}
				/* Main container in cont-split to hold the navigator editor region */
				& .cont-editor {
					position: absolute;
					height: 100%;
					width: 100%; /* Width is managed more specifically by region machinery */
					
					transition: 0.5s;
				}
				/* Container for the resources region, not shown by default. */
				& .cont-resources {
					width: 100%;
					min-height: 20em; /* Max height is set on cont-scrolling within RegResources */
					display: inherit;
				}
			}
		`
    );
    let css_body = (
      /* css */
      `
			body {margin: 0px}
		`
    );
    let html = (
      /* html */
      `
		<div rfm_member='cont_scroll' class='cont-scroll'>
			<div rfm_member='cont_master' class='cont-master'>
				<div class='cont-split'>
					<div rfm_member='cont_map' class='cont-map'></div>
					<div rfm_member='cont_editor' class='cont-editor'></div>
					<div rfm_member='cont_controls' class='cont-controls'></div>
					<div rfm_member='cont_coords' class='cont-coords'></div>
				</div>
				<div rfm_member='cont_resources' class='cont-resources' style='display: none'></div>
			</div>
		</div>
		`
    );
    return new Fabricator(html).add_css_rule(css).add_css_rule(css_body);
  }
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description The current app-side page that is selected for viewing. Undefined is valid. */
    page_id: void 0,
    /** @description Whether or not the editor pane should be shown presently */
    show_editor: void 0,
    /** @description Whether or not the resources pane should be shown presently */
    show_resources: void 0,
    /** @description The width that the editor should take, of the overall page, as decimal percent */
    editor_width: void 0,
    /** @description Whether or not the map is enabled. If enabled, files and editor are disabled. */
    map_enabled: void 0,
    /** @description True when a page is actively loading in. Referenced by many child regions.*/
    page_loading: void 0,
    /** @description The hash that was last used to set a page */
    last_hash: void 0
  };
  /** @type {RHElement} */
  cont_scroll;
  /** @type {RHElement} */
  cont_master;
  /** @type {RHElement} */
  cont_map;
  /** @type {RHElement} */
  cont_editor;
  /** @type {RHElement} */
  cont_resources;
  /** @type {RegCoords} */
  reg_coords;
  /** @type {RegNewPage} */
  reg_page_new;
  /** @type {RegAlterPage} */
  reg_page_alter;
  /** @type {RegTwoChoiceNav} */
  reg_two_choice;
  /** @type {RegOneChoiceNav} */
  reg_one_choice;
  /** @type {RegControls} */
  reg_controls;
  /** @type {RegMap} */
  reg_map;
  /** @type {RegEditor} */
  reg_editor;
  /** @type {RegResources} */
  reg_resources;
  /** @type {RegResourceNew} */
  reg_resource_new;
  /** @type {RegLogin} */
  reg_login;
  /** @type {DHPage} */
  dh_page;
  /** @type {DHPageContent} */
  dh_page_content;
  /** @type {DHPageResource} */
  dh_page_resource;
  /** @type {DHEdge} */
  dh_edge;
  /**
   * Navigate to a page by URL. This ultimately calls page_nav() and page_set(), but only after resolving this
   * URL as an internal page that actually exists.
   * 
   * @param {String} url The URL of the page to navigate to.
   * 
   * @returns {Promise} That resolves when the page is set and loaded or rejects if something is or goes wrong.
   */
  async page_nav_url(url) {
    if (!url_is_internal(url)) {
      let err = new Error("Currently navigator does not support non-internal URL's.");
      err.non_internal = true;
      throw err;
    }
    let page_name = url_to_page_name(url);
    if (page_name == void 0) throw new Error(`Url '${url}' can not be parsed to page name.`);
    return this.swyd.dh_page.list({ "name": page_name }).then((ids) => {
      if (ids.length == 0) {
        throw new Error(`Page '${page_name}' does not exist.`);
      }
      return this.swyd.page_nav(ids[0]);
    });
  }
  /**
   * 'Navigate' to a page by ID. This differs from page_set in that it adds certain ergonomic checks that
   * might call for user input, such as an 'unsaved changes, are you sure?' type event.
   * 
   * @param {Number} id The ID of the page to navigate gracefully to.
   */
  async page_nav(id2) {
    let promise_unsaved = Promise.resolve();
    if (this.swyd.reg_editor.has_unsaved_changes) {
      promise_unsaved = this.swyd.reg_two_choice.present_choice(
        "Unsaved Changes",
        "There are changes in the editor that have not been pushed to the server. These changes will be lost if the Navigator jumps to a new page. Are you sure you wish to proceed?",
        "No",
        "Yes"
      );
    }
    return promise_unsaved.then(() => {
      return this.page_set(id2);
    });
  }
  /**
   * Set the page that all regions are pointing at. This handles all the complexity of loading a new page:
   * + Ensuring all needed datahandlers have correct, up-to-date data
   * + Handling master loading state
   * + Propagating proper errors in the event that predictable errors occur (like lack of authentication)
   * + Handling the null-case (e.g. nothing selected)
   * 
   * @param {Number} id The ID of the page to select or undefined to unload all.
   * @param {Boolean} prevent_rollback If true, do not roll back to previous ID if load fails.
   * 
   * @returns {Promise} A promise that resolves when the new page has been selected and all resources loaded.
   */
  async page_set(id2, prevent_rollback) {
    let prev_id = this.settings.page_id;
    this.settings.page_loading = true;
    if (id2 == void 0) {
      throw "ID was undefined - reset all page tracking DH's and regions.";
    }
    this.dh_page_resource.current_page_set(id2);
    let wait = new Promise((res, rej) => {
      window.setTimeout(() => {
        res();
      }, 1e3);
    });
    let page;
    return this.dh_page_resource.track_all().catch((e) => {
      if (e instanceof ErrorREST && e.data.http_code == 403) {
        let prom;
        if (this.settings.user_id == void 0) {
          prom = this.reg_two_choice.present_choice(
            "Page Access Not Authorized",
            "This page requires authorization to view, and you are not logged into an account. Would you like to sign in?",
            "Go Back",
            "Log In"
          ).then(() => {
            this.reg_login.activate();
          });
        } else {
          prom = this.reg_one_choice.present_message(
            "Page Access Not Authorized",
            "Your user account is not authorized to view this page."
          );
        }
        return prom.finally(() => {
          throw "Interrupt then chain.";
        });
      }
      throw e;
    }).then(() => {
      this.dh_page.track_ids([id2]);
      return this.dh_page.pull();
    }).then(() => {
      this.settings.page_id = id2;
      page = this.dh_page.comp_get(id2);
      this.dh_page_content.track(id2, page.page_url);
      this.reg_coords.settings.local_page_name = page.name;
    }).then(() => {
      return this.dh_page_resource.pull();
    }).then(() => {
      return this.dh_page_content.pull();
    }).then(() => {
      return this._load_entire_graph();
    }).then(() => {
      return this.dh_edge.track_all_for_page(id2);
    }).then(() => {
      return this.dh_edge.pull();
    }).then(() => {
      if (window.location.hash != "") window.location.hash = page.name;
      this.settings.page_loading = false;
      this.render();
    }).catch((e) => {
      console.error(e);
      this.settings.page_loading = false;
      if (!prevent_rollback) return this.page_set(prev_id, true);
    });
  }
  /**
   * This is the preferred way to set / unset the map view of the network. It's valid to merely change
   * map_enabled and re-render the whole stack. However, calling this method edge-clears some other settings
   * to preserve a more aesthetically pleasing transition.
   * 
   * @param {Boolean} map_enabled Whether map mode should be enabled.
   */
  set_view(map_enabled) {
    if (map_enabled) {
      this.settings.show_editor = false;
      this.settings.show_resources = false;
    }
    this.settings.map_enabled = map_enabled;
    this.render();
  }
  /**
   * Set the current logged-in user_id for this browser session. Sets in settings and edge triggers dh updates.
   * 
   * @param {Number} user_id The user ID or undefined if not logged in.
   * 
   * @returns {Promise} That resolves when set operation is complete.
   */
  async set_user(user_id) {
    this.settings.user_id = user_id;
    if (user_id == void 0) return Promise.resolve();
    this.dh_user.track_ids([user_id]);
    return this.dh_user.pull();
  }
  /**
   * Check an error that results from a request-based operation to see if the user merely needs to login.
   * If the error is in fact a 403 (indicating a login is needed) present the user with a one or twochoice
   * that tells them they need to login, or login to a different account.
   * 
   * @param {Error} e The error that was caught
   * @param {String} title The title of the overlays that pops up. Should indicate the action attempted. Optional.
   * 
   * @returns {Promise} that reject immediately if not auth error or resolve when the user takes action otherwise
   */
  async prompt_login(e, title) {
    title = title || "Action Not Authorized";
    if (e instanceof ErrorREST && e.data.http_code == 403 || e.code == 403) {
      let prom;
      if (this.swyd.settings.user_id == void 0) {
        prom = this.swyd.reg_two_choice.present_choice(
          title,
          "Authorization is required to perform this action, and you are not logged into an account. Would you like to sign in?",
          "Go Back",
          "Log In"
        ).then(() => {
          this.swyd.reg_login.activate();
        });
      } else {
        prom = this.swyd.reg_one_choice.present_message(
          title,
          "Your user account is not authorized to perform this action."
        );
      }
      return prom;
    } else {
      return Promise.resolve();
    }
  }
  _create_subregions() {
    this.reg_loading = new RegLoading().fab().link(this, document.getElementById("reg_loading"));
    this.reg_map = new RegMap().fab().link(this, this.cont_map);
    this.reg_editor = new RegEditor().fab().link(this, this.cont_editor);
    this.reg_resources = new RegResources().fab().link(this, this.cont_resources);
    this.reg_coords = new RegCoords().fab().link(this, this.cont_coords);
    this.reg_controls = new RegControls().fab().link(this, this.cont_controls);
    this.reg_page_new = new RegNewPage().fab().link(this, this.eth_reg_create()).etherealize();
    this.reg_page_alter = new RegAlterPage().fab().link(this, this.eth_reg_create()).etherealize();
    this.reg_resource_new = new RegResourceNew().fab().link(this, this.eth_reg_create()).etherealize();
    this.reg_one_choice = new RegOneChoiceNav().fab().link(this, this.eth_reg_create()).etherealize();
    this.reg_two_choice = new RegTwoChoiceNav().fab().link(this, this.eth_reg_create()).etherealize();
    this.reg_login = new RegLogin().fab().link(this, this.eth_reg_create()).etherealize();
  }
  async _create_datahandlers() {
    this.dh_page = new DHPage();
    this.dh_page_content = new DHPageContent(this);
    this.dh_page_resource = new DHPageResource(this);
    this.dh_edge = new DHEdge();
    this.dh_user = new DHREST("/api/v1/user", false, false);
    this.datahandler_subscribe([this.dh_page, this.dh_page_content, this.dh_page_resource]);
  }
  /**
   * Overridden here to load user before rest of load is proceeded with.
   */
  async _load_special() {
    return this.dispatch.call_server_function("get_logged_in_user_id").then((data2) => {
      return this.set_user(data2["id"]);
    });
  }
  async _load_datahandlers() {
    return this._load_entire_graph().then(() => {
      return this._select_default_page();
    }).then((page_id) => {
      this.settings.page_id = page_id;
      return this.dh_page.pull();
    });
  }
  /**
   * @returns {Promise} That tracks and pulls all pages and edges.
   */
  async _load_entire_graph() {
    return this.dh_page.track_all().then(() => {
      return this.dh_page.pull();
    }).then(() => {
      return this.dh_edge.track_all();
    }).then(() => {
      return this.dh_edge.pull();
    });
  }
  on_load_complete() {
    this.page_set(this.settings.page_id);
    this.reg_loading.fade_out();
    window.addEventListener("hashchange", () => {
      if (window.location.hash == this.settings.last_hash) return;
      this._select_default_page().then((id2) => {
        this.settings.last_hash = window.location.hash;
        return this.page_set(id2);
      });
    });
    if (this.settings.page_id != void 0) {
      let page = this.dh_page.comp_get(this.settings.page_id);
      this.settings.last_hash = "#" + page.name;
      window.location.hash = page.name;
    }
  }
  on_load_failed(e) {
    this.reg_one_choice.present_message(
      "Loading Error",
      "The COGNATIO NAVIGATOR encountered an unrecoverable error during loading."
    );
  }
  /**
   * This will determine what the 'default' page should be. The logic is as follows:
   * 1. Use the page in the current browser URL. If we're at /nav, then:
   * 2. Check if there's an anchor. If not,
   * 3. Use this.default_page_name. If that does not exist, then:
   * 4. Return undefined.
   * 
   * @returns {Promise} That will resolve with ID or undefined.
   */
  async _select_default_page() {
    return new Promise((res, rej) => {
      let page_name;
      if (String(window.location.pathname).includes("/page/")) {
        page_name = window.location.pathname.split("/").pop().split(".").pop();
      } else if (window.location.hash.length > 0) {
        page_name = window.location.hash.replace("#", "");
      } else {
        page_name = this.default_page_name;
      }
      this.dh_page.list({ "name": page_name }).then((ids) => {
        if (ids.length == 0) {
          res(void 0);
        } else {
          res(ids[0]);
        }
      });
    });
  }
  /**
   * @returns {CompPage} The active page or None if undefined
   */
  get page_active() {
    if (this.settings.page_id == void 0) return void 0;
    return this.dh_page.comp_get(this.settings.page_id);
  }
  _on_settings_refresh() {
    this.settings.page_id = void 0;
    this.settings.show_editor = false;
    this.settings.show_resources = false;
    this.settings.map_enabled = false;
    this.settings.editor_width = 0.5;
    this.settings.page_loading = false;
  }
  _on_render() {
    let sep_pct;
    if (this.settings.show_editor) {
      sep_pct = 100 * (1 - this.settings.editor_width);
    } else {
      sep_pct = 100;
    }
    this.cont_map.style.width = `${sep_pct}%`;
    this.cont_editor.style.left = `${sep_pct}%`;
    this.cont_editor.style.width = `${100 * this.settings.editor_width}%`;
    if (this.settings.show_resources) {
      this.cont_resources.show();
    } else {
      this.cont_resources.hide();
    }
  }
};

// cognatio/web/client/navigator/src/regs/reg_sw_login.js
var RegSWLogin = class extends RegionSwitchyard {
  static {
    __name(this, "RegSWLogin");
  }
  constructor() {
    super();
    this.dispatch_config.load_functions = 1;
  }
  fab_get() {
    let css = (
      /* css */
      `

			[rfm_reg="RegSWLogin"] {

				/* The 'parent' class here is the <body> */
				overflow: hidden;

				& .cont-master {
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
			}
		`
    );
    let css_body = (
      /* css */
      `
			body {margin: 0px}
		`
    );
    let html = (
      /* html */
      `
		<div rfm_member='cont_master' class='cont-master'>
		</div>
		`
    );
    return new Fabricator(html).add_css_rule(css).add_css_rule(css_body);
  }
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {};
  /** @type {RHElement} */
  cont_master;
  /** @type {RegLogin} */
  reg_login;
  _create_subregions() {
    this.reg_loading = new RegLoading().fab().link(this, document.getElementById("reg_loading"));
    this.reg_login = new RegLogin().fab().link(this, this.eth_reg_create()).etherealize();
  }
  async _create_datahandlers() {
    this.dh_user = new DHREST("/api/v1/user", false, false);
  }
  on_load_complete() {
    this.reg_login.activate();
    this.reg_loading.fade_out();
  }
  on_load_failed(e) {
    console.error(e);
  }
  /**
   * Called when the user successfully logs in. Will redirect back to whatever page originated the login
   * or to 'nav' if there's no originator.
   * 
   * @param {Number} user_id The user ID or undefined if not logged in.
   * 
   * @returns {Promise} That resolves when set operation is complete.
   */
  async set_user(user_id) {
    let url = new URL(window.location), next = url.searchParams.get("next");
    if (!next) {
      next = "/nav";
    }
    window.location.href = next;
    return Promise.resolve();
  }
  _on_settings_refresh() {
  }
  _on_render() {
  }
};

// cognatio/web/client/navigator/src/regs/reg_map.js
var RegMap = class extends Region {
  static {
    __name(this, "RegMap");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegMap"] {
				/* The backdrop is the 'black void' of the background. It does not move. */
				& .cont-backdrop {
					position: relative;
					width: 100%; height: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;

					background-color: var(--metal-dark);
				}
				/* Things are positioned in the map. It preserves parent location and size so that viewport
				can inherit, but overflow is visible so things positioned way far away can still render.
				
				Transitions are applied against this to pan and zoom about.
				*/
				& .cont-map {
					position: absolute;
					width: 100%; height: 100%;
					overflow: visible;
					
					transform: scale(1, 1) translate(0px, 0px);
					transition: 0.5s;
				}
				& .cont-viewport {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;
					overflow: visible;
					box-sizing: border-box;

					background-color: white;
				}
				& .cont-viewport.map-enabled {
					box-shadow: 0px 0px 25px 25px var(--ethblue-lightest);
					border: 4px solid var(--ethblue-dark);
				}
				/* A sub-div of the map that exists purely as an administrative division so that map bodies
				can be cleared with empty() */
				& .cont-network {
					position: absolute;
					width: 100%; height: 100%;
					top: 50%; left: 50%;
					overflow: visible;

					background-color: transparent;
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<div class='cont-backdrop'>
			<div rfm_member='map' class='cont-map'>
				<div rfm_member='cont_network' class='cont-network'></div>
				<div rfm_member='cont_viewport' class='cont-viewport'></div>
			</div>
		</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  settings = {
    /** @description Zoom level. 0.5 is zoomed out such that objects are 50% of size, etc. */
    zoom: void 0,
    /** @description X-coordinate (px) of the map that the center of reg container will be over. */
    x: void 0,
    /** @description Y-coordinate (px) of the map that the center of reg container will be over. */
    y: void 0,
    /** @description The network instance, which stores map location info for nodes. */
    network: void 0
  };
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RegViewport} */
  reg_viewport;
  /** @type {RHElement} */
  cont_viewport;
  /** @type {RHElement} */
  cont_network;
  /** @type {RHElement} */
  map;
  _create_subregions() {
    this.reg_viewport = new RegViewport().fab().link(this, this.cont_viewport);
  }
  _on_link_post() {
    this.datahandler_subscribe(this.swyd.dh_edge);
    this.datahandler_subscribe(this.swyd.dh_page);
    this.render_checksum_add_tracked("map_enabled", () => {
      return this.swyd.settings.map_enabled;
    });
    this.render_checksum_add_tracked("active_page_id", () => {
      return this.swyd.settings.page_id;
    });
    this._setup_pan_and_zoom_handlers();
  }
  /**
   * Bind the event handlers that allow a 'pan' operation to occur via click-and-drag. This is not a drag
   * event.
   */
  _setup_pan_and_zoom_handlers() {
    this._clickdrag = {
      lmb_held: false,
      rmb_held: false,
      lmb_last: { x: 0, y: 0 }
    };
    this.reg.addEventListener("mousedown", (e) => {
      if (e.button == 0) {
        this._clickdrag.lmb_held = true;
        this._clickdrag.lmb_last.x = e.clientX;
        this._clickdrag.lmb_last.y = e.clientY;
      }
      if (e.button == 2) this._clickdrag.rmb_held = true;
    });
    this.reg.addEventListener("mouseup", (e) => {
      this._clickdrag.lmb_held = false;
      this._clickdrag.rmb_held = false;
    });
    this.reg.addEventListener("mousemove", throttle_leading(1e3 / 120, (e) => {
      if (this._clickdrag.lmb_held) {
        this._pan_by(
          new Vector2D(
            e.clientX - this._clickdrag.lmb_last.x,
            e.clientY - this._clickdrag.lmb_last.y
          )
        );
        this._clickdrag.lmb_last.x = e.clientX;
        this._clickdrag.lmb_last.y = e.clientY;
      }
    }));
    this._wheel = {
      accrued_delta: 0
    };
    this.reg.addEventListener("wheel", (e) => {
      this._wheel.accrued_delta += e.wheelDelta;
    });
    this.reg.addEventListener("wheel", throttle_leading(1e3 / 120, (e) => {
      let bb = this.reg.getBoundingClientRect();
      let p_vp_cursor = new Vector2D(
        e.clientX - bb.x - bb.width / 2,
        e.clientY - bb.y - bb.height / 2
      );
      this._zoom_at(this._wheel.accrued_delta, p_vp_cursor);
      this._wheel.accrued_delta = 0;
    }));
  }
  /**
   * 
   * @param {Number} page_id The ID of the node that was clicked.
   */
  _node_click(page_id) {
    this.swyd.page_nav(page_id);
  }
  /**
   * Transform vector points from origin of viewport to origin of map coord systems and is in viewport space.
   * 
   * @returns {Vector2D} The map's transform coords as a vector.
   */
  get T() {
    return new Vector2D(this.settings.x, this.settings.y);
  }
  set T(vec) {
    this.settings.x = vec.x;
    this.settings.y = vec.y;
  }
  /**
   * Coordinate transform a vector.
   * 
   * @param {Vector2D} vec Input vector in map coordinates
   * 
   * @returns {Vector2D} Output vector in viewport coordinates
   */
  coord_m2vp(vec) {
    return vec.add(this.T.mult_scalar(-1)).mult_scalar(1 / this.settings.zoom);
  }
  /**
   * Coordinate transform a vector.
   * 
   * @param {Vector2D} vec Input vector in viewport coordinates
   * 
   * @returns {Vector2D} Output vector in map coordinates
   */
  coord_vp2m(vec) {
    return this.T.add(vec.mult_scalar(this.settings.zoom));
  }
  /**
   * Zoom the map in our out by an amount.
   * 
   * @param {Number} amount The amount to zoom by. Intended to be a wheeldelta. Positive in, negative out.
   */
  _zoom(amount) {
    let scale_diff = amount / 1e3;
    this.settings.zoom += scale_diff * this.settings.zoom;
    this.render();
  }
  /**
   * Zoom the map in our out by an amount 'centered' about the provided coordinate in viewport-space.
   * 
   * @param {Number} amount The amount to zoom by. Intended to be a wheeldelta. Positive in, negative out.
   * @param {Vector2D} p_vp_center The position to center by, in viewport coords.
   */
  _zoom_at(amount, p_vp_center) {
    let scale_diff = amount / 1e3;
    let z0 = 1, z1 = this.settings.zoom, z2 = this.settings.zoom + scale_diff * this.settings.zoom;
    let t01 = this.T;
    let c0 = p_vp_center;
    let c1 = c0.subtract(t01).mult_scalar(z0 / z1);
    let c2 = c1;
    let t02 = c0.subtract(c2.mult_scalar(z2 / z0));
    this.settings.zoom = z2;
    this.T = t02;
    this.render();
  }
  /**
   * Pan by a relative amount. This is not in map coords, but in viewport coords. It will need to be adjusted
   * by the scale number.
   * 
   * @param {Vector2D} vec_vp
   */
  _pan_by(vec_vp) {
    this.T = this.T.add(vec_vp);
    this.render();
  }
  /**
   * Adjust the location that the center of the map viewport is aiming, in terms of map space. For example,
   * -100, -100 would position the center of the current page iframe 100px down and to the right
   * of the center of the map viewport.
   * 
   * @param {Number} x The x-coord of center of map viewport, in pixels.
   * @param {Number} y The y-coord of center of map viewport, in pixels.
   */
  _pan_abs(x, y) {
    this.settings.x = x;
    this.settings.y = y;
    this.render();
  }
  /**
   * Construct a new Network instance from the page and edge datahandlers. The data contained in the network
   * instance can be thought of as a cache of the datahandler info. It is stored in region settings and
   * checksummed like any other driving local setting.
   * 
   * Mass is converted from it's usual N-words to a 'weight' value, which is more appropriate for mapping.
   * Weight is 1 + (mass / 1000)
   * 
   * @returns {Network} Network instance, unsolved.
   */
  network_construct() {
    let edges = {}, nodes = {};
    Object.entries(this.swyd.dh_edge._data).forEach(([id2, data2]) => {
      edges[id2] = {
        id: id2,
        nid_orig: data2.page_id_orig,
        nid_term: data2.page_id_term,
        wt: data2.bond_strength_cached
      };
    });
    Object.entries(this.swyd.dh_page._data).forEach(([id2, data2]) => {
      nodes[id2] = {
        id: id2,
        wt: 1 + data2.mass_cached / 1e3
      };
    });
    let full_network = new Network(nodes, edges, this.swyd.settings.page_id);
    return full_network.subnetwork_get(2);
  }
  /**
   * This is intended to be called pretty frequently to solve the network. It will only do so if some feed
   * data has changed. Right now, this is only the edge and node data from the datahandlers.
   * 
   * @returns {Promise} That resolves when the network is solved. If already solved, resolve immediately.
   */
  async _network_solve() {
    return new Promise((res, rej) => {
      let csums_old = this.settings.network_checksums, csums_new = {
        "csum_dh_edge": this.swyd.dh_edge.checksum,
        "csum_dh_page": this.swyd.dh_page.checksum,
        "literal_page_id": this.swyd.settings.page_id
      }, all_match = true;
      Object.entries(csums_new).forEach(([key, csum]) => {
        if (csums_old[key] != csum) all_match = false;
      });
      if (!all_match) {
        this.settings.network_checksums = csums_new;
        this.settings.network = this.network_construct();
        this.settings.network.solve();
        console.log(`Solved network in ${this.settings.network._solution_time_ms}ms`);
      }
      res();
    });
  }
  _on_settings_refresh() {
    this.settings.zoom = 0.5;
    this.settings.x = 0;
    this.settings.y = 0;
    this.settings.network = void 0;
    this.settings.network_checksums = {};
    this.settings.base_node_dia = 0.025;
    this.settings.base_node_dist = 1;
    this.settings.base_edge_thick = 5e-3;
    this.settings.network_scale = 2e3;
  }
  _on_render() {
    if (this.swyd.settings.map_enabled) {
      let z = this.settings.zoom, x = this.settings.x, y = this.settings.y;
      this.map.style.transform = `translate(${x}px, ${y}px) scale(${z}, ${z})`;
      this.cont_viewport.classList.add("map-enabled");
      window.setTimeout(() => {
        this.map.style.transition = "0s";
      }, 500);
      this._network_solve().then(() => {
        this._render_network(this.settings.network);
      });
    } else {
      this.cont_viewport.classList.remove("map-enabled");
      this.map.style.transform = "";
      this.map.style.transition = "";
    }
  }
  /**
   * Re-render the entire map's network-dependent graphics. This will be many nodes and edges.
   * 
   * @param {Network} network A network instance that is configured. Does not have to be solved.
   */
  _render_network(network) {
    this.cont_network.empty();
    network.edges_get_flat().forEach((edgeref) => {
      this.cont_network.append(
        this._draw_edge(
          this._map_network_coord_transform(network.nodes[edgeref.node_id_1].pos),
          this._map_network_coord_transform(network.nodes[edgeref.node_id_2].pos),
          // Scale from 1 to 2 on strength.
          (1 + edgeref.wt / 5) * this.settings.base_edge_thick * this.settings.network_scale,
          edgeref.double
        )
      );
    });
    Object.values(network.nodes).forEach((node) => {
      this.cont_network.append(
        this._draw_node(
          node.id,
          this.swyd.dh_page.comp_get(node.id).name,
          this._map_network_coord_transform(node.pos),
          node.wt * this.settings.base_node_dia * this.settings.network_scale / 2
        )
      );
    });
  }
  /**
   * This translates a vector from network space to map space.
   * 
   * @param {Vector2D} vec 
   */
  _map_network_coord_transform(vec) {
    return vec.mult_scalar(this.settings.network_scale);
  }
  /**
   * Draw an 'edge' for the map in terms of absolute coords from A to B.
   * 
   * @param {Vector2D} A
   * @param {Vector2D} B
   * @param {Number} weight Weight of line, px
   * @param {Boolean} double If true, draw double lines at half weight each
   * 
   * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
   */
  _draw_edge(A, B, weight, double) {
    let css = (
      /* css */
      `
			edge {
			
				position: absolute;
				width: 0; height: 0;
				
				& .edge {
					position: absolute;
					height: 0px;

					box-shadow: 0px 0px ${weight * 4}px ${weight}px var(--ethblue-lightest);
					background-color: var(--ethblue-light);

					border-top-style: solid;
					border-bottom-style: solid;
					border-top-color: var(--ethblue-light);
					border-bottom-color: var(--ethblue-light);
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<edge rfm_member='point'>
			<div rfm_member='edge' class='edge'></div>
		</edge>
		`
    );
    let vc = A.add(B).mult_scalar(0.5);
    let dir = B.add(A.mult_scalar(-1));
    let fab = new Fabricator(html).add_css_rule(css);
    fab.fabricate();
    let point = fab.get_member("point"), edge = fab.get_member("edge");
    point.style.transform = `translate(${vc.x}px, ${vc.y}px) rotate(${dir.theta}rad)`;
    edge.style.width = `${dir.magnitude}px`;
    edge.style.left = `-${dir.magnitude / 2}px`;
    edge.style.borderWidth = `${weight / 2}px`;
    edge.style.top = `-${weight / 2}px`;
    if (double) {
      edge.style.height = `${weight}px`;
      edge.style.backgroundColor = "transparent";
      edge.style.top = `-${weight}px`;
    }
    return point;
  }
  /**
   * Draw a 'node' for the map in terms of absolute coords at P
   * 
   * @param {Number} node_id The node / page ID that this node represents.
   * @param {String} node_name The name, or title, of the node as it will appear on the map.
   * @param {Vector2D} P {x:x, y:y} px
   * @param {Number} radius The radius of the circle that forms the node.
   * 
   * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
   */
  _draw_node(node_id, node_name, P, radius) {
    let halo_mult = 3, magfield_dia = radius * halo_mult * 4, line_height = radius * 2;
    let css = (
      /* css */
      `
			node {
				position: absolute;
				width: 0; height: 0;

				& .node {
					position: absolute;
					width: ${radius * 2}px; height: ${radius * 2}px;
					left: -${radius}px; top: -${radius}px;
					box-sizing: border-box;

					box-shadow: 0px 0px ${radius * halo_mult * 2}px ${radius * halo_mult}px var(--ethblue-lightest);

					border-radius: ${radius * 2}px;
					background-color: white;
					/*border: ${radius / 4}px solid var(--ethblue-lightest);*/
				}
				& .magfield {
					position: absolute;
					width: ${magfield_dia}px; height: ${magfield_dia}px;
					left: -${magfield_dia / 2}px; top: -${magfield_dia / 2}px;
					border-radius: ${magfield_dia / 2}px;
					box-sizing: border-box;

					cursor: pointer;

					border: ${radius / 5}px solid transparent;
				}
				& .magfield:hover {
					border: ${radius / 5}px solid white;
				}
				& .title {
					position: absolute;
					height: ${line_height}px;
					top: -${line_height / 2}px;
					left: ${magfield_dia / 2}px;
					display: flex; align-items: center;

					color: var(--ethblue-lightest);
					font-family: "IBMPlexMono";
					background-color: transparent;
					user-select: none;
					font-size: ${line_height}px;
				}
				& .title::selection {
					background-color: none;
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<node rfm_member='point'>
			<div rfm_member='title' class='title'>${node_name}</div>
			<div rfm_member='node' class='node'></div>
			<div rfm_member='magfield' class='magfield'></div>
		</node>
		`
    );
    let fab = new Fabricator(html).add_css_rule(css);
    fab.fabricate();
    let point = fab.get_member("point");
    let magfield = fab.get_member("magfield");
    let title = fab.get_member("title");
    point.style.transform = `translate(${P.x}px, ${P.y}px)`;
    magfield.addEventListener("click", () => {
      this._node_click(node_id);
    });
    return point;
  }
};

// cognatio/web/client/navigator/src/regs/reg_viewport.js
var RegViewport = class extends Region {
  static {
    __name(this, "RegViewport");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegViewport"] {
				/* Hold the text area and search box vertically in a column. */
				& .cont_main {
					width: 100%; height: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
				& .events-disabled {
					pointer-events: none;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<iframe rfm_member='vp_iframe' class='cont_main'>
			</iframe>
			<div rfm_member='loading_layer' class='cog-loading-layer'>
				<div class='cog-loader'></div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  vp_iframe;
  /** @type {RHElement} */
  loading_layer;
  _on_link_post() {
    this.datahandler_subscribe(this.swyd.dh_page_content);
    this.render_checksum_add_tracked("map_enabled", () => {
      return this.swyd.settings.map_enabled;
    });
    this.render_checksum_add_tracked("loading", () => {
      return this.swyd.settings.page_loading;
    });
    window.document.addEventListener("iframe_href_nav", (e) => {
      this._on_iframe_href_nav_event(e);
    });
  }
  /**
   * This method handles custom events generated by the iframe tap within the iframe's context.
   * 
   * @param {CustomEvent} e Custom event from our code in the iframe.
   */
  _on_iframe_href_nav_event(e) {
    let target_url = e.detail.link;
    this.swyd.page_nav_url(target_url);
  }
  /**
   * This is called every render to update the source code of the iframe. iframe source is 100% managed
   * by the Viewport region. When the iframe code is updated, the iframe's internal js restarts and all
   * memory is lost. This should occur as infrequently as possible (only when code has changed) so that
   * if there's code running in the viewport it does not constantly restart.
   */
  _iframe_code_update() {
    let src = this.swyd.dh_page_content.get_vp_src();
    let src_cs = checksum_json({ "src": src });
    if (this._last_src_cs == src_cs) return;
    this._last_src_cs = src_cs;
    this.vp_iframe.setAttribute("srcdoc", src);
  }
  _on_render() {
    this._iframe_code_update();
    this.vp_iframe.class_set("events-disabled", this.swyd.settings.map_enabled);
    this.loading_layer.style.opacity = this.swyd.settings.page_loading ? "35%" : "";
  }
};

// cognatio/web/client/navigator/src/regs/reg_editor.js
var RegEditor = class extends Region {
  static {
    __name(this, "RegEditor");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegEditor"] {
				/* This positions the lectern and containing papers to the correct location. */
				& .cont-lectern {
					box-sizing: border-box;
					position: relative;
					width: 100%; height: 100%;

					display: flex; flex-direction: column;
					justify-content: center;

					background-color: var(--brass-light);
					border-left: 2px solid var(--brass-dark);
					border-bottom: 2px solid var(--brass-dark);
					border-top: 2px solid var(--brass-dark);

					transition: 1s;
				}
				/* This container will always nestle into the lectern properly. */
				& .cont-papers {
					box-sizing: border-box;
					width: 100%;
					
					flex-grow: 1;

					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;

					padding-right: 1em;
					padding-left: 1em;
					padding-top: 0.5em;
				}
				& .cont-editor {
					position: relative;
					box-sizing: border-box;
					width: 100%;

					flex-grow: 1;
					
					border: 1px solid black;
					padding-left: 2em;
					padding-top: 2em;
					padding-bottom: 1em;
					border-bottom: none;

					background-color: var(--white-off);
					overflow: hidden;
				}
				& .lectern-base {
					box-sizing: border-box;
					width: calc(100% - 1em);
					height: 0.5em;
					margin-bottom: .5em;
					margin-left: 0.5em;
					margin-right: 0.5em;

					background-color: var(--brass-lightest);
					border: 1px solid var(--metal-blue-dark);
					border-radius: 0.5em;
				}
				& .row {
					display: flex; flex-direction: row;
				}
				& .red-line {
					position: absolute;
					top: 0; left: 0;
					background-color: transparent;
					pointer-events: none;
				}
				& .red-line.top {
					width: 100%; height: 2em;
					border-bottom: 1px solid  var(--red-light);
				}
				& .red-line.left {
					width: 2em; height: 100%;
					border-right: 1px solid  var(--red-light);
				}
				/* Modify the regin text area */
				textarea {
					border: none;
					white-space: pre;
					font-family: "IBMPlexMono";
					font-size: 0.8em;
					background-color: var(--white-off);
				}
				textarea:focus {
					outline: none;
				}
				textarea.wrap-bound {
					text-wrap: wrap;
					width: auto;
				}
				& .ruler-row {
					position: absolute;
					top: 1em; left: 2em;
					height: 1em;

					display: flex; flex-direction: row;
					justify-content: center;
				}
				& .ruler-label {
					color: var(--red-light);
					font-family: "IBMPlexMono";
					font-size: 0.7em;
					padding-left: 0.2em;
					cursor: pointer;
				}
				& .ruler-label:hover {
					text-decoration: underline;
				}
				& .ruler {
					user-select: none;
					pointer-events: none;
					padding: 0px;
					resize: none;

					height: 100%;
					
					border-right: 1px solid  var(--red-light);
					background-color: transparent;
				}
				& .ribbon {
					position: relative;
					box-sizing: border-box;
					margin-left: 0.5em;
					padding: 0.25em;

					border: 1px solid var(--metal-dark);
					border-bottom: none;
					border-top-left-radius: 0.25em;
					border-top-right-radius: 0.25em;

					color: white;
					font-weight: 500;
					background-color: var(--red);

					transition: 0.5s;
				}
				& .ribbon.collapsed {
					transform: translate(0, 1.25em);
					transition: 0.5s;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div class='cont-lectern'>
				<div rfm_member='cont_papers' class='cont-papers'>
					<div class='row'>
						<button rfm_member='btn_apply' class='ribbon collapsed'> Apply </button>
						<button rfm_member='btn_upload' class='ribbon collapsed'> Upload </button>
					</div>
					<div rfm_member='cont_editor' class='cont-editor'>
						<div class='ruler-row'>
							<textarea class='ruler' cols=115></textarea>
							<div rfm_member='ruler_115' class='ruler-label'>115</div>
						</div>
						<div class='ruler-row'>
							<textarea class='ruler' cols=80></textarea>
							<div rfm_member='ruler_80' class='ruler-label'>80</div>
						</div>
						<div class='red-line left'></div>
						<div class='red-line top'></div>
						<div rfm_member='loading_layer' class='cog-loading-layer'>
							<div class='cog-loader'></div>
						</div>
					</div>
				</div>
				<div class='lectern-base'></div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  settings = {
    /** @description The last URL that this editor had its code loaded for. */
    page_id_loaded_for: void 0,
    /** @description Local copy of the 'code' for the currently loaded page. Will change as user edits. */
    local_code: void 0,
    /** @description Ruler offset in characters, or undefined to disable. Sets a hard word wrap */
    ruler_offset: void 0
  };
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_editor;
  /** @type {RHElement} */
  cont_papers;
  /** @type {RHElement} */
  btn_apply;
  /** @type {RHElement} */
  btn_upload;
  /** @type {RHElement} */
  ruler_80;
  /** @type {RHElement} */
  ruler_115;
  /** @type {RegInTextArea} */
  editor;
  _create_subregions() {
    this.editor = new RegInTextArea().fab().link(this, this.cont_editor, this.settings, "local_code");
  }
  _on_link_post() {
    this.datahandler_subscribe(this.swyd.dh_page_content);
    this.render_checksum_add_tracked("loading", () => {
      return this.swyd.settings.page_loading;
    });
    this.btn_apply.addEventListener("click", () => {
      this.code_apply();
    });
    this.btn_upload.addEventListener("click", () => {
      this.code_upload();
    });
    this.editor.textarea.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.code == "KeyS") {
        e.preventDefault();
        this.code_upload();
      }
      if (e.ctrlKey && e.code == "KeyD") {
        e.preventDefault();
        this.duplicate_line();
      }
    });
    this.ruler_80.addEventListener("click", () => {
      this.set_ruler(80);
    });
    this.ruler_115.addEventListener("click", () => {
      this.set_ruler(115);
    });
  }
  /**
   * Get whether there are any unsaved changes in the editor field that would be lost if the editor was reset.
   * 
   * @returns {Boolean}
   */
  get has_unsaved_changes() {
    return this.settings.local_code != this.swyd.dh_page_content.get_src() || this.swyd.dh_page_content.can_push();
  }
  /**
   * Get whether or not there are unapplied changes in the editor that are not reflected in the viewport.
   * 
   * @returns {Boolean}
   */
  get has_unapplied_changes() {
    return this.settings.local_code != this.swyd.dh_page_content.get_src();
  }
  /**
   * This is called every render to check whether or not the code for this region should be
   * overwritten. Code is only overwritten *automatically* when the page URL changes.
   */
  code_update() {
    if (this.settings.local_code == void 0 || this.settings.page_id_loaded_for != this.swyd.settings.page_id) {
      this.settings.local_code = this.swyd.dh_page_content.get_src();
      this.settings.page_id_loaded_for = this.swyd.settings.page_id;
      this.render();
    }
  }
  /**
   * This is called to apply the current code in the editor to the Viewport's IFrame. This renders it, after
   * a fashion, so that it may be observed. This does NOT send the new code to the server, however.
   */
  code_apply() {
    this.swyd.dh_page_content.set_src(this.settings.local_code);
    this.swyd.render();
  }
  /**
   * Call this to send the current local code to the server. An update of local code will trigger a graph
   * network refresh for this page, so we need to refresh the following datahandlers:
   * dh_page - Mass might have changed
   * dh_edge - Edges might have had strengths updated, or new ones might exist. Deletions not possible currently.
   * 
   * @returns {Promise} Promise to resolve when server is updated and datahandler's match up.
   */
  async code_upload() {
    this.code_apply();
    return new Promise((res, rej) => {
      this.swyd.dh_page_content.push().then(() => {
        return this.swyd.dh_page.network_update_for_page(this.swyd.dh_edge, this.swyd.settings.page_id);
      }).then(() => {
        this.swyd.render(true);
        res();
      }).catch((e) => {
        this.swyd.prompt_login(e, "Page Alteration Not Authorized");
        throw e;
      });
    });
  }
  /**
   * Duplicate the line on which the cursor currently rests. If there's a range selected, nothing occurs.
   */
  duplicate_line() {
    let start = this.editor.textarea.selectionStart, end = this.editor.textarea.selectionEnd, textarea = this.editor.textarea, text = textarea.value;
    if (start != end) return;
    let line_start_i = RegInTextArea._text_get_selected_lines(text, start, end)[0];
    let line_end_i = text.indexOf("\n", line_start_i);
    let line = text.substring(line_start_i, line_end_i);
    text = text.substring(0, line_end_i) + "\n" + line + text.substring(line_end_i);
    textarea.value = text;
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
    this.editor._view_alters_value(textarea.value);
  }
  /**
   * Set the hard, word-wrap enforcing ruler for the editor textarea.
   * 
   * @param {Number} n_chars Number of chars
   */
  set_ruler(n_chars) {
    if (this.settings.ruler_offset == n_chars) {
      this.settings.ruler_offset = void 0;
    } else {
      this.settings.ruler_offset = n_chars;
    }
    this.render();
  }
  _on_settings_refresh() {
    this.settings.page_id_loaded_for = void 0;
    this.settings.local_code = this.swyd.dh_page_content.get_src();
  }
  _on_render() {
    if (this.swyd.dh_page_content.get_src() != void 0) {
      this.code_update();
    }
    let upload_name = this.has_unsaved_changes ? "Upload" : "Upload";
    this.btn_upload.text(upload_name);
    this.btn_apply.class_set("collapsed", !this.has_unapplied_changes);
    this.btn_upload.class_set("collapsed", !this.has_unsaved_changes);
    this.loading_layer.style.opacity = this.swyd.settings.page_loading ? "35%" : "";
    if (this.settings.ruler_offset == void 0) {
      this.editor.textarea.removeAttribute("cols");
      this.editor.textarea.classList.remove("wrap-bound");
    } else {
      this.editor.textarea.setAttribute("cols", this.settings.ruler_offset);
      this.editor.textarea.classList.add("wrap-bound");
    }
  }
};

// cognatio/web/client/navigator/src/regs/reg_resources.js
var RegResources = class extends Region {
  static {
    __name(this, "RegResources");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegResources"] {
				& .cont-main {
					box-sizing: border-box;
					width: 100%;

					display: flex; flex-direction: column;
					justify-content: center;
					
					border-top: 5px solid var(--metal-blue-dark);
					background-color: var(--metal-blue);
				}
				& .cont-exterior {
					box-sizing: border-box;
					width: 100%;
					height: 100%;
					padding-left: 1.5em; padding-right: 1.5em;
					
					display: flex; flex-direction: column;
					justify-content: center;
				}
				& .cont-arched {
					box-sizing: border-box;
					width: 100%;
					height: 100%;

					border: 5px solid var(--metal-blue-dark);
					border-top-left-radius: 5em;
					border-top-right-radius: 5em;
					border-bottom: none;

					overflow: hidden;
				}
				& .cont-scrolling {
					width: 100%; height: 100%;
					overflow: scroll;
					max-height: 50vh;
				}
				& .cont-files {
					width: 100%;
					display: flex; flex-direction: row;
					justify-content: center;
					flex-wrap: wrap;
				}
				& .bolt-row {
					display: flex; flex-direction: row;
					justify-content: space-between;
					box-sizing: border-box;
					width: 100%;
				}
				& .bolt {
					margin: 0.5em;
					width: 0.5em;
					height: 0.5em;
					border-radius: 0.5em;
					background-color: var(--metal-blue-light);
					border: 0.18em solid var(--metal-blue-dark);
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<div class="cont-main">
			<div class='bolt-row'>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
			</div>
			<div class='cont-exterior'>
				<div class='cont-arched'>
					<div class='cont-scrolling'>
						<div rfm_member='cont_files' class='cont-files'>
						</div>
					</div>
				</div>
			</div>
		</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  settings = {};
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_files;
  _create_subregions() {
  }
  _on_link_post() {
    this.datahandler_subscribe([this.swyd.dh_page_resource]);
    this.render_checksum_add_tracked("cont_files_width", () => {
      return this.cont_files.clientWidth;
    });
  }
  _on_settings_refresh() {
  }
  _on_render() {
    this.cont_files.empty();
    if (this.swyd.settings.page_id == void 0) {
    } else {
      let resource_ids = this.swyd.dh_page_resource.get_all_ids();
      resource_ids.forEach((filename) => {
        this.cont_files.append(
          this._draw_file(
            this.swyd.dh_page_resource.comp_get(filename)
          )
        );
      });
      let el_new_file = this._draw_file_new();
      this.cont_files.append(el_new_file);
      let n_row = Math.floor(this.cont_files.clientWidth / el_new_file.dims_outer().x);
      let n_last_row = this.cont_files.children.length % n_row;
      let n_needed = n_row - n_last_row;
      if (n_last_row == 0) n_needed = 0;
      for (let i = 0; i < n_needed; i++) {
        this.cont_files.append(this._draw_file_ballast());
      }
    }
  }
  /**
   * Draw a representation of a file.
   * 
   * @param {CompFile} cfile 
   * 
   * @returns {RHElement} An element ready to be dropped into place with all event handlers bound.
   */
  _draw_file(cfile) {
    let css = (
      /* css */
      `
			filebox {
				box-sizing: border-box;
				display: flex; flex-direction: row;
				align-items: center;

				width: 24em; height: 7.5em;
				padding: 0.5em;
				margin: 0.5em;
				border-radius: 1em;

				background-color: var(--metal-light);
				border: 1px solid var(--metal-blue-dark);
				color: var(--dark);

				& .icon-cont {
					box-sizing: border-box;
					height: 6.5em;
					width: 6.5em;
					border-radius: 0.5em;
					overflow: hidden;

					border: 2px solid var(--metal-lighter);
				}
				& .icon {
					width: 100%;
					height: 100%;
					object-fit: contain;
					background-color: var(--metal-blue-dark);
				}
				& .label-cont {
					overflow: hidden;
					height: 5em;
					margin-left: 0.5em;
					margin-right: 0.5em;
					flex-grow: 1;
					border-radius: 5px;
					
					border: 1px solid var(--punchcard-beige-darker);
					background-color: var(--punchcard-beige-dark);
				}
				& .label {
					height: 4.5em;
					padding: 0.5em;
					padding-top: 0;
					margin-top: 0.5em;

					background-color: var(--punchcard-beige);
					border-top: 1px solid var(--punchcard-beige-darker);
				}
				& .label-row {
					position: relative;
					width: 100%;
					height: 1.333em;
					display: flex; flex-direction: row;
					align-items: flex-end;
					justify-content: space-between;

					font-family: "IBMPlexMono";
				}
				& .label-row.underline {
					border-bottom: 1px solid var(--punchcard-beige-darker);
				}
				& .label-filename-text {
					width: 100%;
					max-height: 2.7em;
					line-height: 1.37;
					position: absolute; top: 0; left: 0;
					font-family: "IBMPlexMono";
					text-wrap: wrap;
					word-wrap: break-word;
					overflow: hidden;
				}
				& .label-button {
					
				}
				& .label-button:hover {
					text-decoration: underline;
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<filebox rfm_member='filebox'>
			<button class='icon-cont'>
				<img rfm_member='icon' class='icon'>
			</button>
			<div class='label-cont'>
				<div class='label'>
					<div class='label-row underline'>
						<div rfm_member='filename' class='label-filename-text'></div>
					</div>
					<div class='label-row underline'></div>
					<div class='label-row'>
						<button rfm_member='link' class='label-button'> >> Link</button>
						<button rfm_member='delete' class='label-button'> >> Delete</button>
					</div>
				</div>
			</div>
		</filebox>
		`
    );
    let fab = new Fabricator(html).add_css_rule(css).fabricate();
    fab.get_member("filename").text(cfile.filename);
    fab.get_member("icon").setAttribute("src", cfile.icon_url);
    fab.get_member("link").addEventListener("click", () => {
      let disp_word = "Copied";
      try {
        navigator.clipboard.writeText(cfile.data.url);
      } catch (e) {
        disp_word = "Error";
        console.warn("Can not copy to clipboard. Security reason?");
      }
      fab.get_member("link").text(`[${disp_word}]`);
      window.setTimeout(() => {
        fab.get_member("link").text(">> Link");
      }, 500);
    });
    fab.get_member("delete").addEventListener("click", () => {
      this.swyd.reg_two_choice.present_choice(
        "Delete Resource",
        `Are you sure you want to permanently delete '${cfile.filename}'?`,
        "No",
        "Yes"
      ).then(() => {
        return this.swyd.dh_page_resource.delete(cfile.id);
      }).then(() => {
        this.render();
      });
    });
    fab.get_member("icon").addEventListener("click", () => {
      this.render();
    });
    return fab.get_member("filebox");
  }
  /**
   * Draw a container to indicate where a 'new file' can be created. This will look similar to the other
   * file tags and piggybacks off of those file container's CSS.
   * 
   * @returns {RHElement} An element ready to be dropped into place with all event handlers bound.
   */
  _draw_file_new() {
    let html = (
      /* html */
      `
		<filebox rfm_member='filebox'>
			<button rfm_member='icon_cont' class='icon-cont'>
				<img rfm_member='icon' class='icon' src='/nav/assets/icons/file_upload.svg'>
			</button>
			<div class='label-cont'>
				<div class='label'>
					<div class='label-row underline'>
						<div rfm_member='filename' class='label-filename-text'></div>
					</div>
					<div class='label-row underline'></div>
					<div class='label-row'>
						<button rfm_member='create' class='label-button'> >> Create New</button>
					</div>
				</div>
			</div>
		</filebox>
		`
    );
    let fab = new Fabricator(html).fabricate();
    let create = /* @__PURE__ */ __name(() => {
      this.swyd.reg_resource_new.activate();
    }, "create");
    fab.get_member("create").addEventListener("click", create);
    fab.get_member("icon").addEventListener("click", create);
    return fab.get_member("filebox");
  }
  /**
   * Draw a 'ballast' container, that is, a container that is invisible and cannot be interacted with, but
   * nonetheless takes up space.
   * 
   * @returns {RHElement} An element ready to be dropped into place
   */
  _draw_file_ballast() {
    let html = (
      /* html */
      `
		<filebox rfm_member='filebox' style='opacity: 0; pointer-events: none'>
			<button rfm_member='icon_cont' class='icon-cont'>
			</button>
			<div class='label-cont'>
			</div>
		</filebox>
		`
    );
    let fab = new Fabricator(html).fabricate();
    return fab.get_member("filebox");
  }
};

// cognatio/web/client/navigator/src/regs/reg_coords.js
var RegCoords = class extends Region {
  static {
    __name(this, "RegCoords");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegCoords"] {
				/* The absolute master container for the navigator. */
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					display: flex;
					flex-direction: row;
					pointer-events: all;

					transition: 0.1s;
				}
				& .cont-outer.bump {
					left: -10px;
				}
				& .cont-outer.silly {
					left: 100vw;
					top: -200vh;
					transition: 10s;
				}
				& .cont-inner {

					display: flex;
					flex-direction: row;
					padding: 0.5em;
					align-items: center;
					cursor: default;
					border-right: 1px solid var(--brass-dark);
				}
				& .ribbon {
					cursor: pointer;

					padding-right: 1em; height: 100%;

					background-color: var(--brass-light);
					border-top-right-radius: 0.75em;
					border-top: 2px solid var(--brass-dark);
					border-right: 2px solid var(--brass-dark);
				}
				& .regin-page-name-cont {
					
				}
				& button:hover {
					text-decoration: underline;
				}
				& input {
					all: unset;
					cursor: text;
					color: white;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<machine rfm_member='cont_outer' class='cont-outer'>
				<div class='ribbon'>
					<div rfm_member='cont_inner' class='cont-inner bg-panel'>
						<div class='terminal'>
							<div style='margin-right: 0.1em'>>>/</div>
							<div rfm_member='regin_page_name_cont' class='regin-page-name-cont'></div>
						</div>
						<button rfm_member='btn_jump' class='button-nameplate legible'>Jump</button>
					</div>
				</div>
			</machine>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_outer;
  /** @type {RHElement} */
  cont_inner;
  /** @type {RHElement} */
  btn_jump;
  /** @type {RegInInput} The page-name regin */
  regin_page_name;
  /** @type {RHElement} The div tag that contains the page-name regin.*/
  regin_page_name_cont;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description ETC */
    local_page_name: void 0
  };
  _create_subregions() {
    this.regin_page_name = new RegInInput().fab().link(this, this.regin_page_name_cont, this.settings, "local_page_name");
  }
  _on_link_post() {
    this.cont_inner.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    this.btn_jump.addEventListener("click", () => {
      this._jump().catch((e) => {
        this.bump();
      });
    });
    this.regin_page_name.member_get("input").addEventListener("keydown", (e) => {
      if (e.code == "Enter") {
        this._jump().catch((e2) => {
          this.bump();
        });
      }
    });
  }
  /**
   * Try to jump to whatever the local page name is.
   * 
   * @returns {Promise} That will resolve when page is loaded or reject when failed.
   */
  async _jump() {
    return new Promise((res, rej) => {
      if (this.settings.local_page_name == void 0 || this.settings.local_page_name.length == 0) {
        this.settings.local_page_name = [
          "ENTRY NEEDED",
          "STILL NOT IT...",
          "I'M WARNING YOU",
          "MKAY BYE"
        ][this.settings.silly];
        this.settings.silly += 1;
        this.render();
        rej("No page.");
      }
      if (this.settings.local_page_name == this.swyd.page_active.name) {
        rej("Page already loaded.");
      }
      this.swyd.page_nav_url(`/page/${this.settings.local_page_name}`).then(() => {
        res();
      });
    });
  }
  /**
   * Cause the coords interface to 'bump' to the left for 0.2 seconds.
   */
  bump() {
    this.cont_outer.classList.add("bump");
    window.setTimeout(() => {
      this.cont_outer.classList.remove("bump");
    }, 100);
  }
  _on_render() {
    if (this.settings.silly >= 4) this.cont_outer.classList.add("silly");
  }
  /**
   * On settings lifecycle:
   * The local page name is effectively independent. When the page is changed at the swyd level, this setting
   * will be forcibly overridden. Otherwise it's whatever the user most recently typed in.
   */
  _on_settings_refresh() {
    this.settings.local_page_name = "ERROR";
    this.settings.silly = 0;
  }
};

// cognatio/web/client/navigator/src/regs/reg_controls.js
var RegControls = class extends Region {
  static {
    __name(this, "RegControls");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegControls"] {
				& .cont-main {
					pointer-events: all;
					display: flex;
					flex-direction: row;
					align-items: flex-start;
					
					padding-right: 1em;
					background-color: var(--brass-light);
					cursor: pointer;
					border-bottom-right-radius: 0.75em;
					border-bottom: 2px solid var(--brass-dark);
					border-right: 2px solid var(--brass-dark);
					
					position: relative;
					top: 0; left: 0;

					transition: 0.5s;
				}
				& .cont-main.collapsed {
					left: calc(1em - 100% - 1px);
				}
				& .cont-col {
					cursor: default;

					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
					padding: 0.5em;
					
					border-right: 1px solid var(--brass-dark);
				}
				& button {
					display: flex; flex-direction: row; align-items: center;
					margin-top: 0.5em;
				}
				& button:hover > .button-nameplate {
					text-decoration: underline;
				}
				& button:hover > .btn-circle {
					background-color: var(--brass-light);
				}
				& .btn-circle {
					box-sizing: border-box;
					width: 1.25em; height: 1.25em;
					border-radius: 1em;
					background-color: var(--brass);
					border: 1px solid var(--brass-dark);

					cursor: pointer;
				}
				& button label {
					cursor: pointer;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<machine rfm_member='ribbon' class='cont-main'>
				<div rfm_member='cont_col' class='cont-col bg-panel'>
					<div class='title'> CONTROLS </div>
					<button rfm_member='btn_page_new'>
						<div class='btn-circle'></div>
						<label class="button-nameplate legible">New</label>
					</button>
					<button rfm_member='btn_page_alter'>
						<div class='btn-circle'></div>
						<label class="button-nameplate legible">Alter</label>
					</button>
					<div class='cb-lever-group' style='margin-top: 0.75em'>
						<div rfm_member='checkbox_show_editor'></div><label class="nameplate legible">Editor</label>
					</div>
					<div class='cb-lever-group'>
						<div rfm_member='checkbox_show_resources'></div><label class="nameplate legible">Files</label>
					</div>
					<div class='cb-lever-group'>
						<div rfm_member='checkbox_map_enabled'></div><label class="nameplate legible">Map</label>
					</div>
				</div>
			</machine>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  btn_page_new;
  /** @type {RHElement} */
  btn_page_alter;
  /** @type {RHElement} */
  checkbox_show_editor;
  /** @type {RHElement} */
  checkbox_show_resources;
  /** @type {RHElement} */
  checkbox_map_enabled;
  /** @type {RHElement} */
  ribbon;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description Whether or not the controls panel is 'collapsed' to the left for editing. */
    collapsed: void 0
  };
  _create_subregions() {
    this.ricb_show_editor = new RegInCBLever().fab().link(
      this,
      this.checkbox_show_editor,
      this.swyd.settings,
      "show_editor"
    );
    this.ricb_show_resources = new RegInCBLever().fab().link(
      this,
      this.checkbox_show_resources,
      this.swyd.settings,
      "show_resources"
    );
    this.ricb_map_enabled = new RegInCBLever().fab().link(
      this,
      this.checkbox_map_enabled,
      this.swyd.settings,
      "map_enabled"
    );
  }
  _on_link_post() {
    this.btn_page_new.addEventListener("click", (e) => {
      this.swyd.reg_page_new.activate();
    });
    this.btn_page_alter.addEventListener("click", (e) => {
      this.swyd.reg_page_alter.activate();
    });
    this.ricb_show_editor.add_value_update_handler((value) => {
      this.swyd.render();
    });
    this.ricb_show_resources.add_value_update_handler((value) => {
      this.swyd.render();
      this.swyd.render();
      this.swyd.cont_scroll.scrollTo({
        top: this.swyd.cont_resources.clientHeight,
        behavior: "smooth"
      });
    });
    this.ricb_map_enabled.add_value_update_handler((value) => {
      this.swyd.set_view(value);
    });
    this.ribbon.addEventListener("click", (e) => {
      this.collapsed_toggle();
    });
    this.cont_col.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
  /**
   * Toggle whether the controls panel is collapsed or fully visible;
   */
  collapsed_toggle() {
    this.settings.collapsed = !this.settings.collapsed;
    this.render();
  }
  _on_settings_refresh() {
    this.settings.collapsed = false;
  }
  _on_render() {
    if (this.settings.collapsed) {
      this.ribbon.classList.add("collapsed");
    } else {
      this.ribbon.classList.remove("collapsed");
    }
  }
};

// cognatio/web/client/navigator/src/regs/reg_page_new.js
var RegNewPage = class _RegNewPage extends Region {
  static {
    __name(this, "RegNewPage");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegNewPage"] {
				& .cont-main {
					width: 40em;
					display: flex;
					flex-direction: column;
				}
				& .cont-top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				& .cont-mid {
					display: flex;
					flex-direction: column;
					padding: 0.5em;
				}
				& .cont-bot  {
					display: flex;
					justify-content: space-between;
				}
				& input {
					all: unset;
					cursor: text;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<punchcard class='cont-main punchcard-cont'>
				<div class='error'>
					<div rfm_member="error" class='error-inner'>ERROR</div>
				</div>
				<div class='cont-main background'>
					<div class='cont-top line-title'>
						<div> COG NEW PAGE INSTRUCTION CARD </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							Name: 
							<label style='margin-left: 0.5em' rfm_member='regin_page_name_cont'></label>
						</div>
						<div class='line underline'>
							
						</div>
						<div class='line' style='margin-right: 1em'>
							<div class='underline' style='margin-right: 1em'> Read Access: </div>
							<label class='cb-label'>
								Public <div rfm_member='cbp_public' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Friends <div rfm_member='cbp_friends' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Private <div rfm_member='cbp_private' class='cb-cont'></div>
							</label>
						</div>
					</div>
				</div>
				<div class='cont-bot'>
					<div style='flex-grow: 1;'>
						<div class='punchrow-bounder'></div>
						<div rfm_member='punchrow_cont' class='punchrow-cont'></div>
						<div class='punchrow-bounder'></div>
					</div>
					<div class='background button-br-cont' style='padding: 0.5em'>
						<button rfm_member='send' class='button'>>> Send</div>
					</div>
				</div>
			</punchcard>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RegInInput} The page-name regin */
  regin_page_name;
  /** @type {RHElement} The div tag that contains the page-name regin.*/
  regin_page_name_cont;
  /** @type {RHElement} Slot in which to place punchrow. */
  punchrow_cont;
  /** @type {RHElement}*/
  cbp_public;
  /** @type {RHElement}*/
  cbp_friends;
  /** @type {RHElement}*/
  cbp_private;
  /** @type {RHElement} A div in which error text can be placed..*/
  error;
  /** @type {RHElement}*/
  send;
  /** @type {RHElement}*/
  close;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description The page name as entered in input */
    page_name: void 0,
    /** @description The page read access bit */
    page_read_access: void 0,
    /** @description Error text to show to user */
    error: void 0
  };
  _create_subregions() {
    this.regin_page_name = new RegInInput().fab().link(this, this.regin_page_name_cont, this.settings, "page_name");
    this.regin_page_name.member_get("input").setAttribute("placeholder", "Random Name");
    this.regin_cbp_private = new RegInCBTypeset().fab().link(this, this.cbp_private, this.settings, "cbp_private");
    this.regin_cbp_friends = new RegInCBTypeset().fab().link(this, this.cbp_friends, this.settings, "cbp_friends");
    this.regin_cbp_public = new RegInCBTypeset().fab().link(this, this.cbp_public, this.settings, "cbp_public");
    this.regin_cbp_radio = RegInCheckbox.combine_into_radio(
      [this.regin_cbp_private, this.regin_cbp_friends, this.regin_cbp_public],
      [2, 1, 0],
      this.settings,
      "page_read_access"
    );
  }
  _on_link_post() {
    this.send.addEventListener("click", () => {
      this._create_page().then(() => {
        this.deactivate();
      });
    });
    this.close.addEventListener("click", () => {
      this.deactivate();
    });
  }
  /**
   * Launch a series of server commands to create a new page off of existing input data.
   * 
   * @returns {Promise} That resolves when the new page has been created with new page ID as argument.
   */
  _create_page() {
    this.settings.error = void 0;
    return new Promise((res, rej) => {
      let reg = /^[a-zA-Z0-9_]*$/, name = this.settings.page_name;
      if (name == void 0 || name.length == 0) {
        name = void 0;
      } else if (name.search(reg) == -1) {
        this.settings.error = "ERROR: Name must be alphanumeric and contain no spaces.";
      }
      if (this.settings.page_read_access == void 0) {
        this.settings.error = "ERROR: Read Access must be specified.";
      }
      this.render();
      if (this.settings.error) {
        rej();
        return;
      }
      let promise_unsaved = Promise.resolve();
      if (this.swyd.reg_editor.has_unsaved_changes) {
        promise_unsaved = this.swyd.reg_two_choice.present_choice(
          "Unsaved Changes",
          "There are changes in the editor that have not been pushed to the server. These changes will be lost if the Navigator jumps to a new page. Are you sure you wish to proceed?",
          "No",
          "Yes"
        );
      }
      let new_id;
      promise_unsaved.then(() => {
        return this.swyd.dh_page.create(this.settings.page_read_access, name);
      }).then((_new_id) => {
        new_id = _new_id;
        return this.swyd.dispatch.call_server_function("page_set_content", new_id, HTML_STUBS.BASIC);
      }).then(() => {
        return this.swyd.page_set(new_id);
      }).then(() => {
        res();
      }).catch((e) => {
        this.swyd.prompt_login(e, "Page Creation Not Authorized").then(() => {
          this.deactivate();
        });
        throw e;
      });
    });
  }
  _on_settings_refresh() {
    this.settings.page_name = "";
    this.settings.page_read_access = 0;
    this.settings.error = void 0;
  }
  _on_render() {
    let fwd_data = [this.settings.page_name, this.settings.page_read_access];
    let str_data = JSON.stringify(fwd_data).split("").reverse().join("");
    this.punchrow_cont.empty();
    this.punchrow_cont.append(_RegNewPage.draw_punchrow(str_data));
    if (this.settings.error) {
      this.error.show();
      this.error.text(this.settings.error);
    } else {
      this.error.hide();
    }
  }
  /**
   * Create a punchrow on the basis of the binary representation of the provided string, which should represent
   * any data that can change as a result of user input. This is a fun little method, but is purely cosmetic
   * and has no utility for cognatio function.
   * 
   * @returns {RHElement} A constructed punchrow element.
   */
  static draw_punchrow(str_data) {
    function text2Binary(string) {
      return string.split("").map(function(char) {
        return char.charCodeAt(0).toString(2);
      }).join(" ");
    }
    __name(text2Binary, "text2Binary");
    let binstr = text2Binary(str_data);
    let punchrow = document.createElement("div");
    punchrow.classList.add("punchrow");
    let pip;
    pip = new Fabricator(
      /* html */
      `<div class="punchrow-hole-padding" style='width: 0.5em'></div>`
    );
    pip.fabricate().append_to(punchrow);
    for (let i = 0; i < binstr.length; i++) {
      let char = binstr[i];
      if (char == "1") {
        pip = new Fabricator(
          /* html */
          `<div class="punchrow-hole"></div>`
        );
      } else {
        pip = new Fabricator(
          /* html */
          `<div class="punchrow-hole-padding"></div>`
        );
      }
      pip.fabricate().append_to(punchrow);
    }
    pip = new Fabricator(
      /* html */
      `<div class="punchrow-hole-padding" style="flex-grow: 1"></div>`
    );
    pip.fabricate().append_to(punchrow);
    return punchrow;
  }
};

// cognatio/web/client/navigator/src/regs/reg_page_alter.js
var RegAlterPage = class extends Region {
  static {
    __name(this, "RegAlterPage");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegAlterPage"] {
				/* The absolute master container for the navigator. */
				& .cont-main {
					width: 40em;
					display: flex;
					flex-direction: column;
				}
				& .cont-top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				& .cont-mid {
					display: flex;
					flex-direction: column;
					padding: 0.5em;
				}
				& .cont-bot  {
					display: flex;
					justify-content: space-between;
				}
				& input {
					all: unset;
					cursor: text;
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<punchcard class='cont-main punchcard-cont'>
				<div class='error'>
					<div rfm_member="error" class='error-inner'>ERROR</div>
				</div>
				<div class='cont-main background'>
					<div class='cont-top line-title'>
						<div> COG PAGE INSTRUCTION SET </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							Name:
							<label style='margin-left: 0.5em' rfm_member='regin_page_name_cont'></label>
						</div>
						<div class='line underline'>
							
						</div>
						<div class='line' style='margin-right: 1em'>
							<div class='underline' style='margin-right: 1em'> Read Access: </div>
							<label class='cb-label'>
								Public <div rfm_member='cbp_public' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Friends <div rfm_member='cbp_friends' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Private <div rfm_member='cbp_private' class='cb-cont'></div>
							</label>
						</div>
					</div>
				</div>
				<div class='cont-bot'>
					<div style='flex-grow: 1;'>
						<div class='punchrow-bounder'></div>
						<div rfm_member='punchrow_cont' class='punchrow-cont'></div>
						<div class='punchrow-bounder'></div>
					</div>
					<div class='background button-br-cont' style='padding: 0.5em'>
						<button rfm_member='send' class='button'>>> Send</div>
					</div>
				</div>
			</punchcard>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RegInInput} The page-name regin */
  regin_page_name;
  /** @type {RHElement} The div tag that contains the page-name regin.*/
  regin_page_name_cont;
  /** @type {RHElement} Row in which to place punch holes.*/
  punchrow;
  /** @type {RHElement}*/
  cbp_public;
  /** @type {RHElement}*/
  cbp_friends;
  /** @type {RHElement}*/
  cbp_private;
  /** @type {RHElement} A div in which error text can be placed..*/
  error;
  /** @type {RHElement}*/
  send;
  /** @type {RHElement}*/
  close;
  /** @description Settings object for this region. This is local data which is erased on page refresh. */
  settings = {
    /** @description The page name as entered in input */
    page_name: void 0,
    /** @description The page read access bit */
    page_read_access: void 0,
    /** @description Error text to show to user */
    error: void 0
  };
  _create_subregions() {
    this.regin_page_name = new RegInInput().fab().link(this, this.regin_page_name_cont, this.settings, "page_name");
    this.regin_page_name.member_get("input").setAttribute("readonly", "true");
    this.regin_cbp_private = new RegInCBTypeset().fab().link(this, this.cbp_private, this.settings, "cbp_private");
    this.regin_cbp_friends = new RegInCBTypeset().fab().link(this, this.cbp_friends, this.settings, "cbp_friends");
    this.regin_cbp_public = new RegInCBTypeset().fab().link(this, this.cbp_public, this.settings, "cbp_public");
    this.regin_cbp_radio = RegInCheckbox.combine_into_radio(
      [this.regin_cbp_private, this.regin_cbp_friends, this.regin_cbp_public],
      [2, 1, 0],
      this.settings,
      "page_read_access"
    );
  }
  _on_link_post() {
    this.send.addEventListener("click", () => {
      this._alter_page().then(() => {
        this.deactivate();
      });
    });
    this.close.addEventListener("click", () => {
      this.deactivate();
    });
  }
  /**
   * Collect the settings configured on this card and fire a PUT request at the server.
   * 
   * @returns {Promise} That resolves when complete.
   */
  async _alter_page() {
    this.settings.error = void 0;
    return new Promise((res, rej) => {
      if (this.settings.page_read_access == void 0) {
        this.settings.error = "ERROR: Read Access must be specified.";
      }
      this.render();
      if (this.settings.error) {
        rej();
        return;
      }
      this.swyd.page_active.data.name = this.settings.page_name;
      this.swyd.page_active.data.read_access_int = this.settings.page_read_access;
      this.swyd.dh_page.push().then(() => {
        this.swyd.render();
        res();
      });
    });
  }
  _on_settings_refresh() {
    this.settings.page_name = "";
    this.settings.page_read_access = 0;
    this.settings.error = void 0;
  }
  _on_render() {
    let fwd_data = [this.settings.page_name, this.settings.page_read_access];
    let str_data = JSON.stringify(fwd_data).split("").reverse().join("");
    this.punchrow_cont.empty();
    this.punchrow_cont.append(RegNewPage.draw_punchrow(str_data));
    if (this.settings.error) {
      this.error.show();
      this.error.text(this.settings.error);
    } else {
      this.error.hide();
    }
  }
  _on_activate_pre() {
    if (this.swyd.page_active == void 0) return;
    this.settings.page_name = this.swyd.page_active.data.name;
    this.settings.page_read_access = this.swyd.page_active.data.read_access_int;
  }
};

// cognatio/web/client/navigator/src/regs/reg_resource_new.js
var RegResourceNew = class extends Region {
  static {
    __name(this, "RegResourceNew");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegResourceNew"] {
				& .cont-main {
					width: 40em;
					display: flex;
					flex-direction: column;
				}
				& .cont-top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				& .cont-mid {
					display: flex;
					flex-direction: column;
					padding: 0.5em;
				}
				& .cont-bot  {
					display: flex;
					justify-content: space-between;
				}
				& input {
					all: unset;
					cursor: text;
				}
				& .file-cont {
					cursor: pointer;
				}
				& .file-input {
					display: none;
				}
				& .prog-row {
					display: flex; flex-direction: row;
				}
				& .prog-bar {
					color: var(--red);
					font-family: "IBMPlexMono";
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<punchcard class='cont-main punchcard-cont'>
				<div class='error'>
					<div rfm_member="error" class='error-inner'>ERROR</div>
				</div>
				<div class='cont-main background'>
					<div class='cont-top line-title'>
						<div> COG NEW RESOURCE INSTRUCTION CARD </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							<div style='margin-right: 0.5em;'>Upload Name: </div>
							<label rfm_member='regin_filename_cont' style='flex-grow: 1'></label>
						</div>
						<div class='line underline'>
							<div rfm_member='prog_row' class='prog-row'>
								Uploading: [<span rfm_member='prog_bar' class='prog-bar'></span>] (
								<span rfm_member='prog_pct'></span>)%
							</div>
						</div>
						<div class='line' style='margin-right: 1em'>
							<div class='underline' style='margin-right: 1em'> Attach File: </div>
							<div rfm_member='file_cont' class='file-cont'>
								<input type="file" rfm_member="file_input" class='file-input'>
								<button rfm_member='file_button' class='button'>>> Select File</button>
							</div>
						</div>
					</div>
				</div>
				<div class='cont-bot'>
					<div style='flex-grow: 1;'>
						<div class='punchrow-bounder'></div>
						<div rfm_member='punchrow_cont' class='punchrow-cont'></div>
						<div class='punchrow-bounder'></div>
					</div>
					<div class='background button-br-cont' style='padding: 0.5em'>
						<button rfm_member='send' class='button'>>> Send</div>
					</div>
				</div>
			</punchcard>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  close;
  /** @type {RHElement} */
  filename;
  /** @type {RHElement} */
  error;
  /** @type {RHElement} */
  send;
  /** @type {RHElement} */
  file_cont;
  /** @type {RHElement} */
  file_input;
  /** @type {RHElement} */
  file_button;
  /** @type {RHElement} */
  prog_row;
  /** @type {RHElement} */
  prog_bar;
  /** @type {RHElement} */
  prog_pct;
  settings = {
    filename: void 0,
    /** @description Read-only file as selected in input. */
    file: void 0,
    /** @description Float between 0 and 1 that represents upload progress. Undefined if none in progress */
    progress: void 0
  };
  _create_subregions() {
    this.regin_filename = new RegInInput().fab().link(this, this.regin_filename_cont, this.settings, "filename");
    this.regin_filename.member_get("input").setAttribute("placeholder", "No file selected...");
    this.regin_filename.member_get("input").style.width = "100%";
    this.file_cont.addEventListener("click", () => {
      this.file_input.click();
    });
    this.file_input.addEventListener("change", () => {
      this.settings.file = this.file_input.files[0];
      this.settings.filename = this.settings.file.name;
      this.render();
    });
  }
  _on_link_post() {
    this.close.addEventListener("click", () => {
      this.deactivate();
    });
    this.send.addEventListener("click", () => {
      this.upload_file();
    });
  }
  /**
   * Upload a new file object as interpreted from the settings of this region.
   * 
   * @returns {Promise} That resolves when file is uploaded.
   */
  async upload_file() {
    this.settings.error = void 0;
    return new Promise((res, rej) => {
      let reg = /^[a-zA-Z0-9_.]*$/, name = this.settings.filename;
      if (name == void 0 || name.length == 0) {
        name = void 0;
      } else if (name.search(reg) == -1) {
        this.settings.error = "ERROR: Name must be alphanumeric and contain no spaces.";
      }
      if (this.swyd.dh_page_resource.get_all_ids().indexOf(name) != -1) {
        this.settings.error = "ERROR: Filename is already taken and must be unique.";
      }
      if (this.settings.file == void 0) {
        this.settings.error = "ERROR: Must select a file to upload.";
      }
      this.render();
      if (this.settings.error) {
        rej();
        return;
      }
      let prog_update = /* @__PURE__ */ __name((prog) => {
        this.settings.progress = prog;
        this.render();
      }, "prog_update");
      this.swyd.dh_page_resource.create(name, this.settings.file, prog_update).then(() => {
        this.swyd.render();
        this.deactivate();
        res();
      });
    });
  }
  _on_settings_refresh() {
    this.settings.filename = "No file selected...";
    this.settings.progress = void 0;
  }
  _on_render() {
    let fwd_data = [this.settings.filename];
    let str_data = JSON.stringify(fwd_data).split("").reverse().join("");
    this.punchrow_cont.empty();
    this.punchrow_cont.append(RegNewPage.draw_punchrow(str_data));
    if (this.settings.error) {
      this.error.show();
      this.error.text(this.settings.error);
    } else {
      this.error.hide();
    }
    if (this.settings.file != void 0) {
      this.file_button.text(`[${this.settings.file.name}]`);
    } else {
      this.file_button.text(">> Select File");
    }
    this.prog_row.hide();
    if (this.settings.progress != void 0) {
      this.prog_row.show();
      let n = 20;
      let txt = "";
      for (let i = 0; i < n; i++) {
        txt += i < this.settings.progress * n ? "*" : " ";
      }
      this.prog_bar.text(txt);
      this.prog_pct.text(Math.round(this.settings.progress * 100));
    }
  }
};

// cognatio/web/client/navigator/src/regs/reg_loading.js
var RegLoading = class extends Region {
  static {
    __name(this, "RegLoading");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegLoading"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					opacity: 100%;
					background-color: var(--white-off);
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member='cont_outer' class='cont-outer'>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_outer;
  _create_subregions() {
    this.reg_constellation = new RegConstellation({
      text_left: "COGNATIO",
      text_right: "LOADING"
    }).fab().link(this, this.cont_outer);
  }
  _on_link_post() {
    this.reg.style.backgroundColor = "transparent";
  }
  /**
   * Causes this region to fade to 0% opacity and then deactivate entirely.
   * 
   * @returns {Promise} that resolves when fade-out is complete.
   */
  async fade_out() {
    let fade_rate_s = 1;
    this.cont_outer.style.opacity = "0%";
    this.cont_outer.style.transition = `${fade_rate_s}s`;
    return new Promise((res, rej) => {
      window.setTimeout(() => {
        this.deactivate();
        res();
      }, fade_rate_s * 1e3);
    });
  }
};

// cognatio/web/client/navigator/src/regs/reg_constellation.js
var RegConstellation = class extends Region {
  static {
    __name(this, "RegConstellation");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegConstellation"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					background-color: var(--white-off);
				}
				& .frame {
					position: absolute;
					width: 0; height: 0;
					background-color: transparent;
				}
				& .constellation {
					position: absolute;
					width: 0; height: 0;
					background-color: transparent;
				}
				& .polar-frame {
					position: absolute;
					width: 0; height: 0;
					left: 0px; height: 0px;
					background-color: transparent;
				}
				& .ring {
					position: absolute;
					box-sizing: border-box;
					border: 1px;
				}
				& .point {
					position: absolute;
					width: 0px; height: 0px;
					top: 0px; left: 0px;
				}
				& .radial-line {
					position: absolute;
					box-sizing: border-box;
					border-top-width: 1px;
					border-right-width: 0px;
					border-left-width: 0px;
					border-bottom-width: 0px;
					height: 0px;
					top: 0.5px;
				}
				& .radial-text {
					position: absolute;
					overflow: visible;
				}
				& .frame-border-dashed {
					border-color: var(--metal-light);
					border-style: dashed;
				}
				& .frame-border-red {
					border-color: var(--red);
					border-style: solid;
				}
				& .star-major {
					position: absolute;
					background-color: var(--dark);
				}
				& .edge {
					background-color: var(--metal-light);
					height: 1px;
					left: 0px;
					position: absolute;
				}
				& .rotate-slow {
					animation: rotation_cw 300s infinite linear;
				}
				& .rotate-slower {
					animation: rotation_ccw 600s infinite linear;
				}
				& .text-title {
					font-size: 35px;
					font-family: "IBMPlexMono";
				}
			}
		`
    );
    let css_rotate_cw = (
      /* css */
      `
			@keyframes rotation_cw {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(359deg);
				}
			}
		`
    );
    let css_rotate_ccw = (
      /* css */
      `
			@keyframes rotation_ccw {
				from {
					transform: rotate(359deg);
				}
				to {
					transform: rotate(0deg);
				}
			}
		`
    );
    let html = (
      /* html */
      `
			<div rfm_member='cont_outer' class='cont-outer'>
				<div class='frame rotate-slow' style='left: 50%; top: 50%'>
					<div class='frame rotate-slower'>
						<div rfm_member='const_offset' class='constellation rotate-slower' style='left: 35vw;'></div>
						<div rfm_member='frame_offset' class='constellation rotate-slower' style='left: 35vw;'></div>
					</div>
					<div rfm_member='frame_center' class='constellation'></div>
					<div rfm_member='const_center' class='constellation rotate-slow'></div>
				</div>
			</div>
		`
    );
    return new Fabricator(html).add_css_rule(css).add_css_rule(css_rotate_cw).add_css_rule(css_rotate_ccw);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_outer;
  /** @type {RHElement} */
  const_center;
  /** @type {RHElement} */
  const_offset;
  /** @type {RHElement} */
  frame_center;
  /** @type {RHElement} */
  frame_offset;
  settings = {
    /** @description Text that will appear orbiting the left  */
    text_left: void 0,
    /** @description ETC */
    text_right: void 0
  };
  _config_default() {
    return {
      text_left: "",
      text_right: ""
    };
  }
  _on_link_post() {
    this._on_render();
    this.network = this.generate_constellation(5, 5);
    this.network_offset = this.generate_constellation(6, 4);
    this.network.solve();
    this.network_offset.solve();
  }
  _on_render() {
    let bb = this.cont_outer.getBoundingClientRect();
    let polar_dotted = this._draw_polar_frame(
      72,
      100,
      "frame-border-dashed",
      this.cont_outer.getBoundingClientRect()
    );
    let polar_red = this._draw_polar_frame(
      72,
      100,
      "frame-border-red",
      { width: bb.width * 2, height: bb.height }
    );
    this.frame_center.empty();
    this.frame_offset.empty();
    this.frame_center.append(polar_dotted);
    this.frame_offset.append(polar_red);
    this.const_center.empty();
    this.const_offset.empty();
    if (this.network) {
      this._draw_network(this.network, this.const_center, 15);
      this._draw_network(this.network_offset, this.const_offset, 30);
    }
    let text1 = this._draw_radial_text(
      new Vector2D(0, 0),
      210,
      this.config.text_left,
      "text-title",
      "#6e726e",
      90
    );
    let text3 = this._draw_radial_text(
      new Vector2D(0, 0),
      210,
      this.config.text_right,
      "text-title",
      "#984B43",
      90
    );
    this.const_center.append(text1);
    this.const_offset.append(text3);
  }
  /**
   * Generate a 'constellation', that is, a random network with N nodes.
   * 
   * The general plan here is to generate the 'origin' node, and then work outwards with decreasing numbers
   * of orbiting nodes for each 'order' away from the center.
   * 
   * This decrease should proceed by approximately halving each time until 1 is reached, and then propagating
   * until there are exactly as many nodes as called for. Some randomness will be thrown in.
   * 
   * @param {Number} n_nodes number of nodes to have in the constellation
   * 
   * @returns {Network}
   */
  generate_constellation(n_orders, density) {
    let max_node_wt = 2;
    let n_first = density;
    let origin_node = { id: 1, wt: max_node_wt };
    let last_order_of_nodes = [origin_node], last_order = 0, last_node_id = 1, last_edge_id = 1;
    let nodes = { 1: origin_node }, edges = {};
    for (let order = 0; order < n_orders; order++) {
      order = last_order + 1;
      let n_children = Math.floor(n_first / 2 ** (order - 1));
      n_children = Math.max(n_children, 1);
      let current_order_nodes = [];
      last_order_of_nodes.forEach((node) => {
        let n_children_actual = n_children;
        let rand = Math.random();
        if (rand > 0.66) n_children_actual++;
        else if (rand < 0.44) n_children_actual--;
        for (let i = 0; i < n_children_actual; i++) {
          last_node_id++;
          last_edge_id++;
          let wt = linterp(0, n_orders, 0.5, max_node_wt, order) + (Math.random() * 0.5 - 0.25);
          let child_node = { id: last_node_id, wt };
          let child_edge = { id: last_edge_id, wt: 1, nid_orig: node.id, nid_term: child_node.id };
          nodes[child_node.id] = child_node;
          edges[child_edge.id] = child_edge;
          current_order_nodes.push(child_node);
        }
      });
      last_order_of_nodes = current_order_nodes;
      last_order = order;
    }
    return new Network(nodes, edges, origin_node.id);
  }
  /**
   * Draw the provided network onto the provided element. Element will NOT be cleared.
   * 
   * @param {Network} network A filled-out network at any state
   * @param {RHElement} el An element into which all network nodes and edges will be absolutely positioned
   * @param {Number} upscale Amount to upscale native network coordsys by for viewing
   */
  _draw_network(network, el, upscale) {
    let scaler = /* @__PURE__ */ __name((vec) => {
      return vec.mult_scalar(upscale);
    }, "scaler");
    Object.values(network.edges).forEach((edge) => {
      el.append(this._draw_edge(
        scaler(edge.node_orig.pos),
        scaler(edge.node_term.pos)
      ));
    });
    Object.values(network.nodes).forEach((node) => {
      el.append(this._draw_star_major(
        scaler(node.pos),
        node.wt
      ));
    });
  }
  /**
   * Draw an 'edge' for the map in terms of absolute coords from A to B.
   * 
   * @param {Vector2D} A
   * @param {Vector2D} B
   * 
   * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
   */
  _draw_edge(A, B) {
    let html = (
      /* html */
      `
		<div rfm_member='point' class='point'>
			<div rfm_member='edge' class='edge'></div>
		</div>
		`
    );
    let fab = new Fabricator(html);
    fab.fabricate();
    let point = fab.get_member("point");
    let edge = fab.get_member("edge");
    let vc = A.add(B).mult_scalar(0.5);
    let dir = B.add(A.mult_scalar(-1));
    point.style.transform = `translate(${vc.x}px, ${vc.y}px) rotate(${dir.theta}rad)`;
    edge.style.width = `${dir.magnitude}px`;
    edge.style.left = `-${dir.magnitude / 2}px`;
    edge.style.top = `-${1 / 2}px`;
    return point;
  }
  /**
   * Draw a 'major' star at the specified coordinates and return an element that can be placed in a 'frame'
   * element that will show correctly.
   * 
   * @param {Object} location {x:px, y:px} of the centerpoint of the star
   * @param {Number} size As a multiple of standard, e.g. 1.0 will return the 'default' size and 2.0 will double
   * 
   * @returns {RHElement}
   */
  _draw_star_major(location, size) {
    let html = (
      /* html */
      `
			<div rfm_member='point' class='point'>
				<div rfm_member='star' class='star-major'>

					<svg width="100%" height="100%" version="1.1" viewBox="0 0 37.042 37.042" 
						xmlns="http://www.w3.org/2000/svg">
						<path d="m18.521-2.3734e-7s-1e-6 13.229-2.6458 15.875-15.875 2.6458-15.875 2.6458 
						13.229-1e-6 15.875 2.6458 2.6458 15.875 2.6458 15.875-1e-6 -13.229 2.6458-15.875 
						15.875-2.6458 15.875-2.6458-13.229-1e-6 
						-15.875-2.6458c-2.6458-2.6458-2.6458-15.875-2.6458-15.875z" 
						fill="none" stroke="#888888" stroke-width="2"/>
					</svg>
				</div>
			</div>
		`
    );
    let fab = new Fabricator(html);
    fab.fabricate();
    let star = fab.get_member("star");
    let point = fab.get_member("point");
    let size_base = 15, sz = size * size_base;
    let angle = new Vector2D(location.x, location.y).theta;
    star.style.width = `${sz}px`;
    star.style.height = `${sz}px`;
    star.style.left = `-${sz / 2}px`;
    star.style.top = `-${sz / 2}px`;
    star.style.borderRadius = `${sz / 2}px`;
    point.style.left = `${location.x}px`;
    point.style.top = `${location.y}px`;
    point.style.transform = `rotate(${angle}rad)`;
    if (size < 1.5) {
      star.style.backgroundColor = "transparent";
    }
    return point;
  }
  /**
   * Draw a frame of borders to represent a polar coordinate.
   * 
   * @param {Number} n_radial How many radial lines to spread from the center. It's best if this is a multiple
   * 							of six.
   * @param {Number} ring_period Difference in radius between one ring and the next.
   * @param {String} border_class Class name to set border color and style.
   * @param {Object} bounding_box {width: px, height: px} size of a box to be completely filled by frame.
   * 
   * @returns {RHElement} An element containing all created elements that form the wireframe.
   */
  _draw_polar_frame(n_radial, ring_period, border_class, bounding_box) {
    let frame = RHElement.wrap(document.createElement("div"));
    frame.classList.add("polar-frame");
    let r_min = Math.sqrt((bounding_box.width / 2) ** 2 + (bounding_box.height / 2) ** 2), r = ring_period, n_rings = Math.ceil(r_min / r);
    for (let i = 0; i < n_rings; i++) {
      let ring = document.createElement("div");
      let ring_r = r * (i + 1);
      ring.style.width = `${ring_r * 2}px`;
      ring.style.height = `${ring_r * 2}px`;
      ring.style.top = `-${ring_r}px`;
      ring.style.left = `-${ring_r}px`;
      ring.style.borderRadius = `${ring_r}px`;
      ring.classList.add(border_class);
      ring.classList.add("ring");
      frame.append(ring);
    }
    for (let i = 0; i < n_radial; i++) {
      let html = (
        /* html */
        `
				<div rfm_member='point' class='point'>
					<div rfm_member='line' class='radial-line ${border_class}'></div>
				</div>
			`
      );
      let fab = new Fabricator(html);
      fab.fabricate();
      let radial = fab.get_member("point");
      let line = fab.get_member("line");
      let radial_w = r_min;
      let radial_angle = 360 / n_radial * i;
      let r_offset = 3 * r;
      if (i % (n_radial / 12) == 0) r_offset = r;
      else if (i % (n_radial / 24) == 0) r_offset = 2 * r;
      radial.style.transform = `rotate(${radial_angle}deg)`;
      line.style.width = `${radial_w}px`;
      line.style.transform = `translate(${r_offset}px, 0px)`;
      frame.append(radial);
    }
    return frame;
  }
  /**
   * Create text on an arc tracing 'radius' about a point defined by location. This is done using the
   * SVG method. It's a little clunky. Color, for example, must be manually provided
   * 
   * @param {Vector2D} location 
   * @param {Number} radius 
   * @param {String} text 
   * @param {String} text_class
   * @param {String} color Hex color code for text.
   * @param {Number} angle The angle at which the center of text will be aligned.
   * 
   * @returns {RHElement}
   */
  _draw_radial_text(location, radius, text, text_class, color, angle) {
    let html = (
      /* html */
      `
		<div rfm_member='point' class='point'>
			<div rfm_member='inner' class='radial-text'>
				<svg class='radial-text' width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<path
					id="circlePath"
					d="
					M 0, ${radius}
					a ${radius},${radius} 0 1,1 ${2 * radius},0
					${radius},${radius} 0 1,1 ${-2 * radius},0
					"
					fill="none"
					stroke="none"
					/>
					<text style="text-anchor: middle;" class='${text_class}' fill=${color}>
						<textPath href="#circlePath" startOffset="50%">
							${text}
						</textPath>
					</text>
				</svg>
			</div>
		</div>
		`
    );
    let fab = new Fabricator(html);
    fab.fabricate();
    let point = fab.get_member("point");
    let inner = fab.get_member("inner");
    point.style.top = `${location.x}px`;
    point.style.left = `${location.y}px`;
    inner.style.top = `${-radius}px`;
    inner.style.left = `${-radius}px`;
    inner.style.width = `${radius * 2}px`;
    inner.style.height = `${radius * 2}px`;
    inner.style.rotate = `${angle - 180}deg`;
    return point;
  }
};

// cognatio/web/client/navigator/src/regs/reg_login.js
var RegLogin = class extends Region {
  static {
    __name(this, "RegLogin");
  }
  fab_get() {
    let css = (
      /* css */
      `
			[rfm_reg="RegLogin"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					opacity: 100%;
					background-color: var(--white-off);
				}
				& .constellation {
					top: 0; left: 0;
					width: 100%; height: 100%;
				}
				/** Outer layer exists so that messenger can be defined by gauge width / height but not bound
				by overflow hidden. */
				& .gauge-box {
					position: absolute;
					width: 20em; height: 20em;
					top: calc(50% - 10em); left: calc(50% - 10em);
				}
				/** This is the master circular object at the center of the screen. */
				& .gauge {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;
					box-sizing: border-box;

					background-color: var(--metal-lighter);
					border: 3px solid var(--brass);
					border-radius: 10em;

					overflow: hidden;
				}
				/** Internal component that rotates from 90 to 0 degrees as view is changed.s */
				& .cont-rotate {
					position: absolute;
					width: 300%; height: 300%;
					top: -100%; left: -200%;

					transition: 1s;
				}
				/** Position an interface within the rotating div. */
				& .cont-rotate-inner {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;

					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;

					pointer-events: none;
				}
				/** Contain an interface. This just ensures box size is right. */
				& .cont-interface {
					position: relative;
					width: calc(100% / 3); height: calc(100% / 3);
					border-radius: 50%;
					box-sizing: border-box;
					
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;

					pointer-events: all;
				}
				& .interface {
					position: relative;
					width: 80%; height: 80%;
					box-sizing: border-box;
					border-radius: 50%;
					overflow: hidden;
					
					color: var(--brass-light);
					font-family: "IBMPlexMono";

					border: 3px solid var(--brass);
					background-color: var(--brass-lightest);
					
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					box-shadow: grey 0.25em 0.25em;
				}
				& .interface-rec {
					width: 100%;
					box-sizing: border-box;
					padding-left: 10%; padding-right: 10%;
					border-top: 2px solid var(--brass);
					border-bottom: 2px solid var(--brass);
				}
				& .title {
					color: var(--brass-light);
					font-size: 1.3em;
					font-weight: 400;

					margin: 0.25em;
				}
				& .button {
					margin: 0.5em;
					padding: 0.25em;
					border-radius: 0.5em;
					border: 2px solid var(--brass);
				}
				& button:hover {
					text-decoration: underline;
				}
				& .bolt-lane {
					position: absolute;
					width: 90%; height: 0;

					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;
				}
				& bolt {
					position: absolute;
					width: 1em; height: 1em;
					border-radius: 50%;
					right: -0.5em;
					box-sizing: border-box;

					border: 2px solid var(--brass);
					background-color: var(--brass-lightest);
				}
				& .input-line {
					margin-top: 0.5em;
				}
				& .input-line:last-of-type {
					margin-bottom: 0.5em;
				}
				& input {
					all: unset;
					cursor: text;
					color: white;
				}
				& .messenger {
					position: absolute;
					top: calc(50% - 2em); left: 4%;
					height: 4em; width: 80%;

					background-color: white;
					border: 2px solid var(--brass);

					box-shadow: inset 0px 0px 1em 1em var(--white-off);
				}
				& .messenger-text {
					margin-left: 1em;
					border-left: 6px double var(--red);
					box-sizing: border-box;
					height: 100%;
					color: var(--red);

					padding: 0.5em;
				}
			}
		`
    );
    let html = (
      /* html */
      `
		<div rfm_member='cont_outer' class='cont-outer'>
			<div rfm_member='constellation' class='constellation'></div>
			<div class='gauge-box'>
				<div rfm_member='messenger' class='messenger'>
					<div rfm_member='messenger_text' class='messenger-text'></div>
				</div>
				<div class='gauge'>
					<div rfm_member='cont_rotate' class='cont-rotate'>
						<div class='cont-rotate-inner' style='transform: rotate(90deg)'>
							<div class='cont-interface'>
							<machine class='interface'>
									<div class='title'> New Account </div>
									<div class='interface-rec'>
										<div class='terminal input-line'>
											<div rfm_member='new_email'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='new_password'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='new_password2'></div>
										</div>
									</div>
									<div class='row'>
										<button rfm_member='btn_new' class='button'>Create</button>
										<button rfm_member='btn_to_login' class='button'>Back</button>
									</div>
								</machine>
								<div class='bolt-lane' style='transform: rotate(0deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(30deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(60deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(90deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(120deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(150deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(180deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(210deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(240deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(270deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(300deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(330deg)'><bolt></bolt></div>
							</div>
						</div>
						<div class='cont-rotate-inner'>
							<div class='cont-interface'>
								<machine class='interface'>
									<div class='title'> Navigator Login </div>
									<div class='interface-rec'>
										<div class='terminal input-line'>
											<div rfm_member='login_email' name='email' autocomplete='email'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='login_password' name='password' autocomplete='password'></div>
										</div>
									</div>
									<div class='row'>
										<button rfm_member='btn_login' class='button'>Login</button>
										<button rfm_member='btn_to_signup' class='button'>New</button>
									</div>
								</machine>
								<div class='bolt-lane' style='transform: rotate(0deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(30deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(60deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(90deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(120deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(150deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(180deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(210deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(240deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(270deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(300deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(330deg)'><bolt></bolt></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`
    );
    return new Fabricator(html).add_css_rule(css);
  }
  /** @type {RegSWNav} Reference to the switchyard region. */
  swyd;
  /** @type {RHElement} */
  cont_outer;
  /** @type {RHElement} */
  cont_rotate;
  /** @type {RHElement} */
  login_email;
  /** @type {RHElement} */
  login_password;
  /** @type {RHElement} */
  btn_to_signup;
  /** @type {RHElement} */
  btn_login;
  /** @type {RHElement} */
  btn_to_login;
  /** @type {RHElement} */
  btn_new;
  /** @type {RHElement} */
  messenger;
  /** @type {RHElement} */
  messenger_text;
  _create_subregions() {
    this.reg_constellation = new RegConstellation({
      text_left: "COGNATIO",
      text_right: "NAVIGATOR"
    }).fab().link(this, this.constellation);
    this.regin_login_email = new RegInInput().fab().link(this, this.login_email, this.settings, "login_email");
    this.regin_login_email.member_get("input").setAttribute("placeholder", "Email");
    this.regin_login_password = new RegInInput().fab().link(this, this.login_password, this.settings, "login_password");
    this.regin_login_password.member_get("input").setAttribute("placeholder", "Password");
    this.regin_login_password.member_get("input").setAttribute("type", "password");
    this.regin_new_email = new RegInInput().fab().link(this, this.new_email, this.settings, "new_email");
    this.regin_new_email.member_get("input").setAttribute("placeholder", "Email");
    this.regin_new_password = new RegInInput().fab().link(this, this.new_password, this.settings, "new_password");
    this.regin_new_password.member_get("input").setAttribute("placeholder", "Password");
    this.regin_new_password.member_get("input").setAttribute("type", "password");
    this.regin_new_password2 = new RegInInput().fab().link(this, this.new_password2, this.settings, "new_password2");
    this.regin_new_password2.member_get("input").setAttribute("placeholder", "Password");
    this.regin_new_password2.member_get("input").setAttribute("type", "password");
  }
  _on_link_post() {
    this.datahandler_subscribe(this.swyd.dh_user);
    this.btn_to_signup.addEventListener("click", () => {
      this.settings.interface = 1;
      this.render();
    });
    this.btn_login.addEventListener("click", () => {
      this.login();
    });
    this.btn_to_login.addEventListener("click", () => {
      this.settings.interface = 0;
      this.render();
    });
    this.btn_new.addEventListener("click", () => {
      this.create();
    });
    let enter_listener = /* @__PURE__ */ __name((action, e) => {
      if (e.code == "Enter") {
        e.preventDefault();
        action.bind(this)();
      }
    }, "enter_listener");
    this.regin_login_email.member_get("input").addEventListener("keydown", enter_listener.bind(this, this.login));
    this.regin_login_password.member_get("input").addEventListener("keydown", enter_listener.bind(this, this.login));
    this.regin_new_email.member_get("input").addEventListener("keydown", enter_listener.bind(this, this.create));
    this.regin_new_password.member_get("input").addEventListener("keydown", enter_listener.bind(this, this.create));
    this.regin_new_password2.member_get("input").addEventListener("keydown", enter_listener.bind(this, this.create));
  }
  /**
   * Attempt to log in with current settings.
   */
  login() {
    this.settings.message = "";
    let email = this.settings.login_email;
    let pw = this.settings.login_password;
    if (!validate_email(email)) {
      this.settings.message = "Email is invalid.";
      this.render();
      return;
    }
    if (pw.length == 0) {
      this.settings.message = "A password is required.";
      this.render();
      return;
    }
    this.swyd.dispatch.call_server_function("login", email, pw).then((id2) => {
      return this.swyd.set_user(id2);
    }).then(() => {
      this.deactivate();
    }).catch((e) => {
      this.settings.message = "Account with these credentials does not exist.";
      this.render();
    });
  }
  /**
   * Attempt to create a new account with provided info.
   */
  create() {
    this.settings.message = "";
    let email = this.settings.new_email;
    let password = this.settings.new_password;
    let password2 = this.settings.new_password2;
    if (!validate_email(email)) {
      this.settings.message = "Email is invalid.";
      this.render();
      return;
    }
    if (password.length < 12) {
      this.settings.message = "Password must be at least twelve characters.";
      this.render();
      return;
    }
    if (password != password2) {
      this.settings.message = "You fool! Passwords do not match.";
      this.render();
      return;
    }
    this.swyd.dispatch.call_server_function("account_create", email, password).then((id2) => {
      this.settings.message = "Account created! Now log in.";
      this.settings.interface = 0;
      this.render();
    }).catch((e) => {
      if (e.code == 700) {
        this.settings.message = "Account with this email already exists.";
      } else {
        this.settings.message = "Server rejected new account.";
      }
      this.render();
    });
  }
  /**
   * Toggle which interface is visible.
   */
  toggle_interface() {
    this.settings.interface = this.settings.interface ? 0 : 1;
    this.render();
  }
  _on_settings_refresh() {
    this.settings.interface = 0;
    this.settings.message = "";
    this.settings.login_email = "";
    this.settings.login_password = "";
    this.settings.new_email = "";
    this.settings.new_password = "";
    this.settings.new_password2 = "";
  }
  _on_render() {
    this.cont_rotate.style.transform = `rotate(${this.settings.interface * -90}deg)`;
    this.messenger.style.left = this.settings.message.length > 0 ? "-80%" : "";
    this.messenger_text.text(this.settings.message);
  }
};

// cognatio/web/client/navigator/src/comps/comp_page.js
var CompPage = class extends Component {
  static {
    __name(this, "CompPage");
  }
  /**
   * @returns {String} the name of this page
   */
  get name() {
    return this.data.name;
  }
  /**
   * @returns {String} The absolute URL to the HTML for this page
   */
  get page_url() {
    return `${window.location.origin}/page/${this.data.name}.html`;
  }
};

// cognatio/web/client/navigator/src/comps/comp_file.js
var icon_map = {
  "png": "self",
  "jpg": "self",
  "jpeg": "self",
  "svg": "self",
  "txt": "/nav/assets/icons/file_text.svg",
  "md": "/nav/assets/icons/file_text.svg",
  "log": "/nav/assets/icons/file_text.svg",
  "unknown": "/nav/assets/icons/file_unknown.svg"
};
var CompFile = class extends Component {
  static {
    __name(this, "CompFile");
  }
  /**
   * @returns {String} Extension for this file, parsed from filename.
   */
  get ext() {
    return path_ext(this.id);
  }
  /**
   * @returns {String} The filename of this file. This is a pure convenience getter.
   */
  get filename() {
    return this.id;
  }
  /**
   * The logic here is not terribly complex - certain formats will simply use their own URL (images) and
   * others map to a fixed set of icons.
   * 
   * @returns {String} The correct icon URL for this file, as interpreted by the file extension
   */
  get icon_url() {
    let url = icon_map[this.ext];
    if (url == "self") url = this.data.url;
    if (!url) url = icon_map["unknown"];
    return url;
  }
};

// cognatio/web/client/navigator/src/comps/comp_edge.js
var CompEdge = class extends Component {
  static {
    __name(this, "CompEdge");
  }
};

// cognatio/web/client/navigator/src/dh/dh_page.js
var PageAccessMode = {
  PUBLIC: 0,
  SHARED: 1,
  PRIVATE: 2
};
var DHPage = class extends DHREST {
  static {
    __name(this, "DHPage");
  }
  constructor() {
    super("/api/v1/page");
  }
  /**
   * Create a new page. This will not actually set any content for the page, use RPC for that.
   * 
   * @param {int} read_access Read access mode.
   * @param {string} [name] Optional name to provide. If not provided, a random hash will be chosen.
   * 
   * @returns {Promise} That will resolve with the new ID as an argument when the new record has been created
   */
  create(read_access, name = void 0) {
    let data2 = {
      read_access_int: read_access
    };
    if (name != void 0) data2["name"] = name;
    return super.create(data2);
  }
  /**
   * Get a component instance of the relevant type for this DataHandler. Component instances are really
   * just containers for code that store both their settings and data back here in the datahandler. Multiple
   * instances of a Component for the same ID will refer to the exact same locations in memory.
   * 
   * This may be called any number of times in any number of places, and all instances of a component for a
   * certain ID will behave as if they are, in fact, the same component.
   * 
   * @param {*} id The ID to get a component for.
   * @returns {CompPage}
   */
  comp_get(id2) {
    return new CompPage(id2, this);
  }
  /**
   * TODO finish this method. It will be quite complex, but very efficient. 
   * 
   * @param {Number} start_id The ID of the center of the ripple, or the start-node to traverse edges from.
   * @param {Number} max_order The maximum number distance to track.
   */
  track_and_pull_ripple(start_id, max_order) {
  }
  /**
   * Check for network updates around a specific page. This will ensure that the page's weight and connecting
   * edges are all up to date. This is intended to be called after a page's source has changed and handles the
   * cases where page mass changes, edges are added, altered, or removed.
   * 
   * @param {DHEdge} dh_edge The edge datahandler reference
   * @param {Number} page_id The ID of the page to update nodes and edges for
   * 
   * @returns {Promise} That resolves when update is complete.
   */
  async network_update_for_page(dh_edge, page_id) {
    return dh_edge.track_all_for_page(page_id).then((ids) => {
      dh_edge.get_edges_for_page(page_id).forEach((existing_edge) => {
        if (ids.indexOf(existing_edge.id) == -1) {
          dh_edge.untrack_ids([existing_edge.id]);
        }
      });
      dh_edge.mark_for_refresh(ids);
      return dh_edge.pull();
    }).then(() => {
      this.mark_for_refresh(page_id);
      return this.pull();
    });
  }
};

// cognatio/web/client/navigator/src/dh/dh_page_content.js
var DHPageContent = class extends DataHandler {
  static {
    __name(this, "DHPageContent");
  }
  /** @type {RegSWNav} */
  swyd;
  /** @type {String} The URL that was last pull()'d with. */
  _last_pulled_url;
  /** @type {String} Checksum of data last time it was pushed.  */
  _last_pushed_checksum;
  /** @type {Number} The ID of the page that is currently being tracked.  */
  _tracked_page_id;
  /** @type {String} The URL of the page that is currently being tracked.  */
  _tracked_page_url;
  /**
   * Instantiate a new page.
   * 
   * @param {RegSWNav} swyd Instance of the switchyard, so that dispatch can be used for RPC
   */
  constructor(swyd) {
    super();
    this._last_pulled_url = void 0;
    this._last_pushed_checksum = void 0;
    this._tracked_page_id = void 0;
    this._tracked_page_url = void 0;
    this.swyd = swyd;
  }
  /**
   * Some notes on source code:
   * There are two additional scripts that are managed here. One should only exist in the src loaded into
   * the iframe: the iframe_tap.js code. The other should only exist on the server: the page_tap.js code.
   * Neither should ever be visible to the editor.
   * 
   * The base _data.page_src variable is taken to be the 'pure' form of source, without the extra scripts
   * added in. The iframe script is added and removed when roundtripping to the iframe, and the page script
   * is added and removed when roundtripping to the server.
   * 
   * @returns {String} The literal current source
   */
  get_src() {
    return this._data.page_src;
  }
  /**
   * Get source code for the viewport. This is slightly different from the base source code - it will have
   * some script code injected at the end so that internal comms can occur between the iframe and the nav app.
   * 
   * @returns {String} The source code to be loaded into the viewport.
   */
  get_vp_src() {
    return this._data.page_src + this.iframe_tap_script;
  }
  /**
   * Get source code for server. It has an extra script appended.
   * 
   * @returns {String} Server export source
   */
  get_server_src() {
    return this._data.page_src + this.page_tap_script;
  }
  /**
   * Set the source data for the datahandler. This may originate from any location. Some modification may be
   * performed on the source as it is set, if the source contained the special injected script code.
   * 
   * @param {String} new_src New code to set as the source data for this datahandler
   */
  set_src(new_src) {
    this._data.page_src = new_src.replace(this.iframe_tap_script, "").replace(this.page_tap_script, "");
  }
  /**
   * @returns {String} The literal code to be injected such that the VP will have iframe tapping enabled.
   */
  get iframe_tap_script() {
    return (
      /* html */
      `<script async src="/nav/scripts/iframe_tap.js"><\/script>`
    );
  }
  /**
   * @returns {String} The literal code that's appended for roundtrip with server.
   */
  get page_tap_script() {
    return (
      /* html */
      `<script async src="/nav/scripts/page_tap.js"><\/script>`
    );
  }
  async pull() {
    if (this._last_pulled_url == this._tracked_page_url) return Promise.resolve();
    if (this._tracked_page_url == void 0) {
      this._data.page_src = "";
      return Promise.resolve();
    }
    return fetch(
      this._tracked_page_url,
      {
        method: "GET",
        cache: "no-store"
      }
    ).then((response) => {
      if (response.status == 200) {
        return response.text();
      } else {
        throw `Get source content for ${this._tracked_page_url} fails with code ${response.status}`;
      }
    }).then((response_text) => {
      this.set_src(response_text);
      this._last_pushed_checksum = this.generate_checksum();
    });
  }
  /**
   * Force a hard-pull that will get the current copy of HTML for the tracked URL regardless of local caching.
   * This will overwrite any local changes that have been made. Beware!
   */
  async pull_hard_refresh() {
    this._last_pulled_url = void 0;
    return this.pull();
  }
  async push() {
    let current_checksum = this.generate_checksum();
    if (this._last_pushed_checksum == current_checksum || this._tracked_page_id == void 0) {
      return Promise.resolve();
    }
    return this.swyd.dispatch.call_server_function(
      "page_set_content",
      this._tracked_page_id,
      this.get_server_src()
    ).then(() => {
      this._last_pushed_checksum = current_checksum;
    });
  }
  /**
   * @returns {Boolean} Whether or not the current source code has been changed since last pushed.
   */
  can_push() {
    return this._last_pushed_checksum != this.generate_checksum();
  }
  get name() {
    return "dh_page_content";
  }
  /**
   * Track a page by ID and URL. This will not instigate a new pull(), that must be done manually after
   * calling this.
   * 
   * @param {Number} id The ID of the page to track
   * @param {String} url The URL of the page to track
   */
  track(id2, url) {
    this._tracked_page_id = id2;
    this._tracked_page_url = url;
  }
  generate_checksum() {
    return checksum_json(this._data);
  }
};

// cognatio/web/client/navigator/src/dh/dh_page_resource.js
var DHPageResource = class extends DHREST {
  static {
    __name(this, "DHPageResource");
  }
  /** @type {Number} The ID of the page that this datahandler is looking at the resources of. */
  current_page_id;
  /** @type {Number} The max size of a payload that will be sent in a single request. */
  _max_payload_size;
  constructor() {
    super("/api/v1/page", false, false);
    this.current_page_id = void 0;
    this._max_payload_size = 512 * 1024;
  }
  /**
   * Set the page to look at the resources of. This will clear any existing data.
   * 
   * @param {Number} page_id 
   */
  current_page_set(page_id) {
    this.current_page_id = page_id;
    this.untrack_all();
  }
  /**
   * @param {*} id The ID to get a URL for, or undefined for base URL e.g. /api/url/
   * @returns {URL} Of the form www.xxxxxx.com/api/url/id
   */
  _url_for(id2) {
    if (id2) {
      return new URL(this.current_page_id + "/resource/" + id2, this.api_url + "/");
    } else {
      return new URL(this.current_page_id + "/resource", this.api_url + "/");
    }
  }
  /**
   * Create a new file. The file name must be specified and a file object provided. The file might be
   * broken up into parts if it is sufficiently large. The file name should not already exist.
   * 
   * **On Checksum**
   * Currently there's a discrepancy between the serverside checksum implementation and clientside. Digging
   * through this is going to take loads of time. For the present I'm just going to check that filesize matches.
   * When the upload is complete, the returned checksum will be verified locally.
   * 
   * @param {String} file_name The name the file shall have, including extension. This is the same as "ID"
   * @param {Blob} file The file to upload
   * @param {Function} prog_cb A callback that will report progress as a float.
   * 
   * @returns {Promise} That will resolve when the file has been uploaded and verified.
   */
  async create(file_name, file, prog_cb) {
    if (!prog_cb) prog_cb = /* @__PURE__ */ __name(() => {
    }, "prog_cb");
    return new Promise((res, rej) => {
      let promise_fns = [];
      let start_loc = 0;
      while (start_loc < file.size) {
        let end_loc = Math.min(start_loc + this._max_payload_size, file.size);
        let payload = file.slice(start_loc, end_loc);
        let _start_loc = start_loc;
        promise_fns.push(() => {
          return this._create(file_name, payload, _start_loc).then((data2) => {
            prog_cb(end_loc / file.size);
            return data2;
          });
        });
        start_loc = end_loc;
      }
      return serial_promises(promise_fns).then((returned_data_list) => {
        let final_data = returned_data_list.pop();
        let id2 = final_data[this._id_key];
        if (file.size != final_data.size) throw new Error("Error in upload: resulting filesizes do not match.");
        this._local_data_set_from_server(id2, final_data);
        res(id2);
      });
    });
  }
  /**
   * Upload one chunk of a file (or the whole file). Returned data includes checksum
   * 
   * @param {String} file_name The name the file shall have, including extension. This is the same as "ID"
   * @param {Blob} payload A binary object to send as a payload
   * @param {Number} offset Write offset in bytes for this chunk. Zero for first chunk or whole file.
   * 
   * @returns {Promise} That will resolve with the returned data as an argument when the upload is complete.
   */
  async _create(file_name, payload, offset) {
    return new Promise((res, rej) => {
      const form_data = new FormData();
      form_data.append("file", payload);
      form_data.append("write_offset", offset);
      fetch(
        this._url_for(file_name),
        {
          method: "POST",
          body: form_data
          // Note that headers are NOT set for form data. Browser will do it
        }
      ).then((response) => {
        if (response.status == 200) {
          res(response.json());
        } else {
          rej(`Creation of new ${this.constructor.name} fails with code ${response.status}`);
        }
      });
    });
  }
  /**
   * Disable _put and push() manually.
   */
  async _put(id2, data2) {
    throw new Error("PUT is not allowed for this type of resource.");
  }
  /**
   * Get a component instance of the relevant type for this DataHandler. Component instances are really
   * just containers for code that store both their settings and data back here in the datahandler. Multiple
   * instances of a Component for the same ID will refer to the exact same locations in memory.
   * 
   * This may be called any number of times in any number of places, and all instances of a component for a
   * certain ID will behave as if they are, in fact, the same component.
   * 
   * @param {String} filename the filename with extension. This doubles as ID for this DH.
   * 
   * @returns {CompFile}
   */
  comp_get(filename) {
    return new CompFile(filename, this);
  }
};

// cognatio/web/client/navigator/src/dh/dh_edge.js
var DHEdge = class extends DHREST {
  static {
    __name(this, "DHEdge");
  }
  constructor() {
    super("/api/v1/edge");
  }
  /**
   * Get all edge's that touch a page and track all. This does not call pull().
   * 
   * @param {Number} page_id The ID of the page to start tracking all for
   * 
   * @returns {Promise} That resolves (with ids for convenience) when all nodes for indicated page are tracked.
   */
  async track_all_for_page(page_id) {
    let all_ids = [];
    return this.list({ "page_id_orig": page_id }).then((ids) => {
      all_ids = all_ids.concat(ids);
      return this.list({ "page_id_term": page_id });
    }).then((ids) => {
      all_ids = [.../* @__PURE__ */ new Set([...all_ids, ...ids])];
      this.track_ids(all_ids);
      return all_ids;
    });
  }
  /**
   * Get all edges that link to or from the indicated page. This performs no requests - DH should already be
   * up to date.
   * 
   * @param {Number} page_id The ID of the page to get comps for
   * 
   * @returns {Array.<CompEdge>} A list of comps that link to or from this page
   */
  get_edges_for_page(page_id) {
    let out = [];
    Object.entries(this._data).forEach(([id2, data2]) => {
      id2 = Number(id2);
      if (data2.page_id_term == page_id || data2.page_id_orig == page_id) {
        out.push(this.comp_get(id2));
      }
    });
    return out;
  }
  /**
   * Get a component instance of the relevant type for this DataHandler. Component instances are really
   * just containers for code that store both their settings and data back here in the datahandler. Multiple
   * instances of a Component for the same ID will refer to the exact same locations in memory.
   * 
   * This may be called any number of times in any number of places, and all instances of a component for a
   * certain ID will behave as if they are, in fact, the same component.
   * 
   * @param {*} id The ID to get a component for.
   * @returns {CompEdge}
   */
  comp_get(id2) {
    return new CompEdge(id2, this);
  }
};

// cognatio/web/client/navigator/src/etc/html_stubs.js
var HTML_STUBS = {
  /**
   * An extremely basic HTML stub with just a body and head.
   */
  BASIC: (
    /* html */
    `<html>
	<head></head>
	<body></body>
</html>
`
  )
};

// cognatio/web/client/navigator/src/etc/vector.js
var Vector2D = class _Vector2D {
  static {
    __name(this, "Vector2D");
  }
  /**
   * Instantiate a new vector quantity.
   * 
   * @param {Number} x X-value of end of vector
   * @param {Number} y Y-value of end of vector
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Get the value of the angle to this vector (theta) in radians.
   */
  get theta() {
    if (this._theta == void 0) {
      this._theta = Math.atan2(this.y, this.x);
    }
    return this._theta;
  }
  /**
   * Get the length of this vector, the absolute value, the magnitude.
   */
  get magnitude() {
    if (this._mag == void 0) {
      this._mag = Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    return this._mag;
  }
  /**
   * Short for 'pythagorean sum'. Not sure what to call this. Get the sum of the square of x and y.
   */
  get pysum() {
    if (this._pythag == void 0) {
      this._pythag = this.x ** 2 + this.y ** 2;
    }
    return this._pythag;
  }
  /**
   * Add a series of vectors together.
   * 
   * @param {*} vec_or_vecs Either a vector2d or a list of vector2d's
   * 
   * @returns {Vector2D} A new vector instance that is the sum of all provided and self.
   */
  add(vec_or_vecs) {
    let vecs = vec_or_vecs instanceof Array ? vec_or_vecs : [vec_or_vecs];
    vecs.push(this);
    return _Vector2D.sum(vecs);
  }
  /**
   * Subtract the provided vector from this vector and return a new vector.
   * 
   * @param {Vector2D} vec
   */
  subtract(vec) {
    return this.add(vec.mult_scalar(-1));
  }
  /**
   * Sum a list of vectors.
   * 
   * @param {Array} vecs List of vectors
   * 
   * @returns {Vector2D}
   */
  static sum(vecs) {
    let x = 0, y = 0;
    vecs.forEach((vec) => {
      x += vec.x;
      y += vec.y;
    });
    return new _Vector2D(x, y);
  }
  /**
   * Perform scalar multiplication against this vector
   * 
   * @param {Number} m Scalar value to multiply this vector by
   * 
   * @returns {Vector2D} Resulting vector.
   */
  mult_scalar(m) {
    return new _Vector2D(this.x * m, this.y * m);
  }
  /**
   * Get whether the provided vector equals this vector. Equal if x == x and y == y, but with a slight
   * tolerance to deal with nastly floating point rounding.
   * 
   * @param {Vector2D} vec
   * @param {Number} tol Optional multiplier for tolerance. Default 1E-6
   * 
   * @returns {Boolean} 
   */
  equals(vec, tol = 1e-6) {
    return this.at(vec.x, vec.y, tol);
  }
  /**
   * Get whether this vector 'points at' the provided coords. Equal if x == x and y == y, but with a slight
   * tolerance to deal with nastly floating point rounding.
   * 
   * @param {Number} x x-coord
   * @param {Number} y y-coord
   * 
   * @returns {Boolean}
   */
  at(x, y, tol = 1e-6) {
    let dx = x - this.x, dy = y - this.y;
    return dx < tol && dy < tol;
  }
  /**
   * Construct a new vector from polar, rather than cartesian, coordiantes. Theta is taken to be CCW positive
   * from the x-axis.
   * 
   * @param {Number} theta Angle in radians
   * @param {Number} dist Distance
   * 
   * @returns {Vector2D} The resulting vector
   */
  static from_polar(theta, dist) {
    return new _Vector2D(
      dist * Math.cos(theta),
      dist * Math.sin(theta)
    );
  }
};

// cognatio/web/client/navigator/src/etc/network.js
var Network = class _Network {
  static {
    __name(this, "Network");
  }
  /**
   * Instantiate a new Network instance. All provided data will be safely de-referenced and truly copied to
   * prevent accidental back-modification in, for example, a datahandler.
   * 
   * The iterative solver will need to be run with `solve()` before the results of this network can be used.
   * 
   * ```
   * // Nodes are expected to take the form:
   * {
   *     id: X // ID back reference
   *     wt: X // Weight of the node, as an integer
   * }
   * // Edges are expected to take the form:
   * {
   *     id: X // ID back reference
   *     wt: X // Weight of the edge, as an integer
   *     nid_orig: X // ID of originating end of edge
   *     nid_term: X // ID of terminating end of edge
   * }
   * ```
   * 
   * Nodes with no edges are removed.
   * 
   * @param {Object} nodes ID-datadict map of node data.
   * @param {Object} edges ID-datadict map of edge data.
   * @param {Number} focal_point_id The ID of the 'focal point' node.
   * @param {Number} mean_dist The mean distance between centers of average nodes.
   */
  constructor(nodes, edges, focal_point_id, mean_dist = 1) {
    this.nodes = {};
    this.edges = {};
    Object.values(nodes).forEach((data2) => {
      this.nodes[data2.id] = { id: data2.id, wt: data2.wt };
    });
    Object.values(edges).forEach((data2) => {
      this.edges[data2.id] = { id: data2.id, wt: data2.wt, nid_orig: data2.nid_orig, nid_term: data2.nid_term };
    });
    this.focal_point_id = focal_point_id;
    this.focal_node = this.nodes[this.focal_point_id];
    this.K_bond = 1;
    this.K_mass = 1;
    this.step_max_movement = 0.1;
    this.step_break_thresh = 0.01;
    this.configure_mean_dist(mean_dist);
    this._setup_crosslink_edges();
    this._setup_order_nodes();
    Object.keys(this.nodes).forEach((node_id) => {
      if (this.nodes[node_id].order == void 0) {
        delete this.nodes[node_id];
      }
    });
    this._setup_node_kinematics();
  }
  /**
   * Configure the constants such that the distance between two wt=1 nodes connected with one wt=1 edge
   * will balance to the provided distance.
   * 
   * @param {Number} dist The average distance between centers.
   */
  configure_mean_dist(dist) {
    this.K_bond = 1;
    this.K_mass = dist ** 2 / 2;
  }
  /**
   * @returns {Number} The mean distance that two standard nodes with one edge will position between centers.
   */
  get mean_dist() {
    return Math.sqrt(2 * (this.K_mass / this.K_bond));
  }
  /**
   * Cross-link provided edges into provided nodes. This will give each node three `edges` properties, where
   * 
   * ```
   * node.edges_orig = [edge_ref_1, edge_ref_2, ...] // Edges that originate with this node
   * node.edges_term = [edge_ref_8, edge_ref_9, ...] // Edges that terminate on this node
   * ```
   * 
   * Also link nodes by reference to edges.
   * 
   * ```
   * edge.node_orig = NODE_REF
   * edge.node_term = NODE_REF
   * ```
   */
  _setup_crosslink_edges() {
    Object.values(this.nodes).forEach((node) => {
      node.edges_orig = [];
      node.edges_term = [];
    });
    Object.entries(this.edges).forEach(([id2, edge_data]) => {
      if (this.nodes[edge_data.nid_orig] == void 0) throw new Error("Edge node ref not in node list.");
      if (this.nodes[edge_data.nid_term] == void 0) throw new Error("Edge node ref not in node list.");
      this.nodes[edge_data.nid_orig].edges_orig.push(this.edges[id2]);
      this.nodes[edge_data.nid_term].edges_term.push(this.edges[id2]);
      this.edges[id2].node_orig = this.nodes[edge_data.nid_orig];
      this.edges[id2].node_term = this.nodes[edge_data.nid_term];
    });
  }
  /**
   * Quantify and organize nodes on the basis of 'order', where order is the minimum number of steps required to
   * reach a node starting at the focal point.
   * 
   * This function will give each node the `order` property, which is simply how many steps are required to
   * get back to the focal node.
   */
  _setup_order_nodes() {
    if (Object.keys(this.nodes).length == 0) return;
    Object.values(this.nodes).forEach((node) => {
      delete node.order;
    });
    let current_order = 0, next_order_node_list = {}, current_node_list = [this.focal_node];
    while (current_node_list.length > 0) {
      current_node_list.forEach((node) => {
        if (node.order != void 0) return;
        node.order = current_order;
        node.edges_orig.forEach((edge) => {
          if (edge.node_term.order == void 0) {
            next_order_node_list[edge.node_term.id] = edge.node_term;
          }
        });
        node.edges_term.forEach((edge) => {
          if (edge.node_orig.order == void 0) {
            next_order_node_list[edge.node_orig.id] = edge.node_orig;
          }
        });
      });
      current_order += 1;
      current_node_list = Object.values(next_order_node_list);
      next_order_node_list = {};
    }
  }
  /**
   * Setup the kinematics for each node. At the start, velocity and acceleration will simply be zero. However,
   * position is trickier. To create networks that will solve in reasonable amounts of time to deterministic
   * arrangements, deliberate seeding of position is required. To choose a seeding algorithm is to choose how
   * the graph will appear, so this function is highly important and will likely need variants that deal
   * with different levels of network complexity.
   * 
   * FOR NOW the network is only intended to have one or two 'steps' outward from the focal point. The seeding
   * algo for this is as follows:
   * 1. Position focal point at origin
   * 2. Add first-order nodes at equal-radial spacing about the focal point, starting at 0 degrees and
   *    increasing in order of node ID (purely arbitrary but consistent)
   * 3. For each first-order node, position all of its second-order nodes at equal-radius spacing on a
   *    range of degrees centered on a line the same direction away from the origin as the parent. The width
   *    of this range will be equal to 2x the angular distance between two nodes in the last-order's span.
   * 
   * The behavior of such a placement will be stranger the more interconnected the 1st, 2nd, etc. order nodes
   * are with each other.
   */
  _setup_node_kinematics() {
    if (Object.keys(this.nodes).length == 0) return;
    Object.values(this.nodes).forEach((node) => {
      node.vel = new Vector2D(0, 0);
      node.acc = new Vector2D(0, 0);
    });
    this.focal_node.pos = new Vector2D(0, 0);
    this._setup_kinematics_position(this.focal_node, Math.PI / 2, Math.PI);
  }
  /**
   * A recursive helper function that positions all downstream nodes of the provided node.
   * 
   * @param {Object} node Reference to the node that we are positioning the children of. Must itself
   * 						be positioned already.
   * @param {Number} center_angle The 'center angle' for the range of downstream children
   * @param {Number} range The angular range that downstream children will occupy. 
   */
  _setup_kinematics_position(node, center_angle, range) {
    let downstream = {};
    node.edges_orig.forEach((edge) => {
      if (edge.node_term.order > node.order) {
        downstream[edge.node_term.id] = edge.node_term;
      }
    });
    node.edges_term.forEach((edge) => {
      if (edge.node_orig.order > node.order) {
        downstream[edge.node_orig.id] = edge.node_orig;
      }
    });
    downstream = Object.values(downstream);
    if (downstream.length == 0) return;
    let angle_start = center_angle - range / 2, angle_end = center_angle + range / 2, angles = _Network.space_between(angle_start, angle_end, downstream.length);
    downstream.sort((a, b) => {
      return a.id - b.id;
    });
    let furtherdown_range = range / downstream.length;
    downstream.forEach((downstream_node, downstream_i) => {
      downstream_node.pos = node.pos.add(Vector2D.from_polar(angles[downstream_i], this.mean_dist));
      let furtherdown_center = angles[downstream_i];
      this._setup_kinematics_position(
        downstream_node,
        furtherdown_center,
        furtherdown_range
      );
    });
  }
  /**
   * Given configuration and data, solve this graph to produce a 2D coordinates for all nodes. The solution
   * will be iterative in nature and could take some time depending on graph size.
   */
  solve() {
    let n_steps = 0, t_start = Date.now();
    while (true) {
      let solved = this._solve_step();
      if (solved) break;
      if (n_steps > 5e3) {
        throw new Error("Hit max steps when solving.");
      }
      n_steps++;
    }
    this._solution_time_ms = Date.now() - t_start;
  }
  /**
   * Solve a single step of the simulation.
   * 
   * @returns {Boolean} True if solution is stable
   */
  _solve_step() {
    let step = 0.1, max_vel = 0;
    Object.values(this.nodes).forEach((node) => {
      max_vel = Math.max(Math.abs(node.vel.magnitude), max_vel);
    });
    if (max_vel > 0) {
      let computed_step = this.step_max_movement / max_vel;
      step = Math.min(computed_step, step);
    }
    let net_forces = this._solve_forces();
    let maxes = { rpos: new Vector2D(0, 0), rvel: new Vector2D(0, 0), acc: new Vector2D(0, 0) };
    Object.values(this.nodes).forEach((node) => {
      if (node.id == this.focal_point_id) return;
      let net_force = net_forces[node.id];
      let f_friction = node.vel.mult_scalar(-1);
      net_force = net_force.add(f_friction);
      node.acc = net_force.mult_scalar(1 / node.wt);
      let rvel = node.acc.mult_scalar(step);
      node.vel = node.vel.add(rvel);
      let rpos = node.vel.mult_scalar(step);
      node.pos = node.pos.add(rpos);
      if (rpos.pysum > maxes.rpos.pysum) maxes.rpos = rpos;
      if (rvel.pysum > maxes.rvel.pysum) maxes.rvel = rvel;
      if (node.acc.pysum > maxes.acc.pysum) maxes.acc = node.acc;
    });
    let maxv = this.step_break_thresh ** 2;
    if (maxes.rpos.pysum < maxv && maxes.rvel.pysum < maxv && maxes.acc.pysum < maxv) {
      return true;
    }
    return false;
  }
  /**
   * Determine the net force on each node given current position.
   * 
   * @returns {Object} ID-map of node to net force vector.
   */
  _solve_forces() {
    let net_forces = {};
    Object.values(this.nodes).forEach((node) => {
      let forces = [];
      Object.values(this.nodes).forEach((other_node) => {
        if (node.id == other_node.id) return;
        forces.push(
          this.fvec_mass_get(node, other_node)
        );
      });
      node.edges_orig.forEach((edge) => {
        forces.push(
          this.fvec_bond_get(edge)
        );
      });
      node.edges_term.forEach((edge) => {
        forces.push(
          this.fvec_bond_get(edge).mult_scalar(-1)
        );
      });
      net_forces[node.id] = Vector2D.sum(forces);
    });
    return net_forces;
  }
  /**
   * Get the force vector that exists between N1 and N2 on the basis of the edge from N1 to N2. This will
   * not account for any edges from N2 to N1 (edges are directional).
   * 
   * The signs of resulting force are relative to N1. If N2 is located up and to the right of N1, then the
   * attractive force pulling the two together will have positive x and y.
   * 
   * F_bond = bond_str * K_bond * R
   * That is, bond force increases with the strength of the bond and distance between nodes.
   * 
   * @param {Object} edge The edge between N1 and N2
   * 
   * @returns {Vector2D} Resulting force vector, signs relative to N1
   */
  fvec_bond_get(edge) {
    let v_12 = new Vector2D(
      edge.node_term.pos.x - edge.node_orig.pos.x,
      edge.node_term.pos.y - edge.node_orig.pos.y
    );
    return v_12.mult_scalar(this.K_bond * edge.wt);
  }
  /**
   * Get the force vector that exists betweewn N1 and N2 on the basis of the mass of the two nodes.
   * 
   * The signs of resulting force are relative to N1. If N2 is located up and to the right of N1, then the
   * repulsive force of the two masses will have negative x and y.
   * 
   * @param {Object} n1 The first node (e.g. perspective node)
   * @param {Object} n2 The other node
   * 
   * @returns {Vector2D} Resulting force vector, signs relative to N1
   */
  fvec_mass_get(n1, n2) {
    let v_12 = new Vector2D(n2.pos.x - n1.pos.x, n2.pos.y - n1.pos.y);
    return v_12.mult_scalar(-1 * this.K_mass * ((n1.wt + n2.wt) / (v_12.x ** 2 + v_12.y ** 2)));
  }
  /**
   * Get a flat list of edges for this node. The list will be composed of objects that seem similar to edge
   * references, but are in fact not the literal edge reference objects. Changing these objects will NOT
   * alter network.edges. Object form:
   * 
   * ```
   * {
   *      other_node_id: int,
   *      wt: int,
   *      double: bool
   * }
   * ```
   * 
   * @param {Object} node Node reference
   * 
   * @returns {Array} List of edges, flat.
   */
  node_get_flat_edges(node) {
    let other_nodes = {};
    node.edges_orig.forEach((edge) => {
      other_nodes[edge.node_term.id] = {
        other_node_id: edge.node_term.id,
        wt: edge.wt,
        double: false
      };
    });
    node.edges_term.forEach((edge) => {
      if (other_nodes[edge.node_orig.id] == void 0) {
        other_nodes[edge.node_orig.id] = {
          other_node_id: edge.node_orig.id,
          wt: edge.wt,
          double: false
        };
      } else {
        other_nodes[edge.node_orig.id].wt += edge.wt;
        other_nodes[edge.node_orig.id].double = true;
      }
    });
    return Object.values(other_nodes);
  }
  /**
   * Get a 'flat' list of edges. This list has no 'doubled' edges (e.g. two different edges for each in a
   * bidirectional connection). The returned objects are dereferenced.
   * 
   * ```
   * {
   *     node_id_1: int
   *     node_id_2: int
   *     wt: int
   *     double: bool
   * }
   * ```
   * 
   * @returns {Array} Of objects of above form
   */
  edges_get_flat() {
    let out = [];
    Object.values(this.edges).forEach((edge) => {
      let edgeref = {
        node_id_1: edge.node_orig.id,
        node_id_2: edge.node_term.id,
        wt: edge.wt,
        double: false
      };
      Object.values(this.edges).forEach((edge_inner) => {
        if (edge.id == edge_inner.id) return;
        if (edge.node_orig.id == edge_inner.node_term.id && edge.node_term.id == edge_inner.node_orig.id) {
          edgeref.wt += edge_inner.wt;
          edgeref.double = true;
        }
      });
      out.push(edgeref);
    });
    return out;
  }
  /**
   * Get a new network that's composed of a subset of this one from the focal point out to a certain order.
   * If max_order = 1, then the returned network would have the focal point and all 1st order nodes.
   * 
   * @param {Number} max_order Maximum order of node to have in returned network.
   * 
   * @returns {Network} Instantiated but unsolved
   */
  subnetwork_get(max_order) {
    let nodes = {}, edges = {};
    Object.values(this.nodes).forEach((node) => {
      if (node.order > max_order) return;
      nodes[node.id] = node;
      node.edges_orig.forEach((edge) => {
        if (edge.node_term.order <= max_order) {
          edges[edge.id] = edge;
        }
      });
      node.edges_term.forEach((edge) => {
        if (edge.node_orig.order <= max_order) {
          edges[edge.id] = edge;
        }
      });
    });
    return new _Network(nodes, edges, this.focal_point_id, this.mean_dist);
  }
  /**
   * Given a span and a number of points, position those points within the span similar to the flexbox
   * space-between ruling. If there's only one point, it will be centered.
   * 
   * @param {Number} start Start of span
   * @param {Number} end End of span
   * @param {Number} n Number of points
   * 
   * @returns {Array} Of point positions in span
   */
  static space_between(start, end, n) {
    if (n <= 0) throw new Error("n must be > 1");
    if (start >= end) throw new Error("must describe a range");
    if (n == 1) return [(start + end) / 2];
    let out = [], spacing = (end - start) / (n - 1);
    for (let i = 0; i < n; i++) {
      out.push(start + i * spacing);
    }
    return out;
  }
  /**
   * This method exists, currently, so that checksums can be made off it. So only renderable data need be
   * preserved.
   */
  toJSON() {
    let data2 = {
      "nodes": [],
      "edges": []
    };
    Object.values(this.nodes).forEach((node) => {
      data2.nodes.push({
        id: node.id,
        x: node.pos.x,
        y: node.pos.y,
        wt: node.wt
      });
    });
    Object.values(this.edges).forEach((edge) => {
      data2.nodes.push({
        id: edge.id,
        nid_orig: edge.nid_orig,
        nid_term: edge.nid_term,
        wt: edge.wt
      });
    });
    return data2;
  }
};

// cognatio/web/client/navigator/src/etc/paths.js
var url_is_internal = /* @__PURE__ */ __name((url_string) => {
  let url;
  try {
    url = new URL(url_string);
  } catch (e) {
    return true;
  }
  return url.origin === window.origin;
}, "url_is_internal");
var url_to_page_name = /* @__PURE__ */ __name((url_string) => {
  if (!url_is_internal(url_string)) return void 0;
  let url;
  try {
    url = new URL(url_string);
  } catch (e) {
    url = new URL(url_string, window.origin);
  }
  let path_bits = url.pathname.split("/");
  let fname_bits = path_bits[path_bits.length - 1].split(".");
  let fname = fname_bits[0];
  if (fname.length == "") return void 0;
  return fname;
}, "url_to_page_name");
export {
  CompEdge,
  CompFile,
  CompPage,
  DHEdge,
  DHPage,
  DHPageContent,
  DHPageResource,
  HTML_STUBS,
  Network,
  PageAccessMode,
  RegAlterPage,
  RegConstellation,
  RegControls,
  RegCoords,
  RegEditor,
  RegInCBLever,
  RegInCBTypeset,
  RegLoading,
  RegLogin,
  RegMap,
  RegNewPage,
  RegOneChoiceNav,
  RegResourceNew,
  RegResources,
  RegSWLogin,
  RegSWNav,
  RegTwoChoiceNav,
  RegViewport,
  Vector2D,
  url_is_internal,
  url_to_page_name
};
