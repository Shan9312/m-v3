/**
 * 工具类
 */
import Vue from 'vue';
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt';
let test = window.location.href;
export default {
  //encryptor加密（RSA）
  encryptors(word){
    var encryptor = new JSEncrypt()
    if(test.indexOf("reach_dist")>0 || test.indexOf("reachtest")>0 || test.indexOf("localhost")>0){
      encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfrUN3e9QJY0fytA/s2Lw734mEKE4Xm51/Z/KwvbPW3fg2PWrpWiytrh3dPYt/LL4lSHJkYHo8dlEvcol47N8AvARbFEZjzL/NSiQMgnAMtxuujPZpBFAhLO56G5VOsjpF78Ofu0iWbDOBgwqtYJFDhTLhH/TkEMA4r3KqTZzSTQIDAQAB')
    }else{
      encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnt3x59+DvVW/NXbhXy1x+ucALectoiwaN9KgLkRkqFj1Qr79FGQeaZKnE0Bgg5TF6FUZdXoiqInD1Zkq50Re7oMP8kKNkMaEuLgUYtM5k0vBtIuyd2cifk96r1q17xc3fbfwTtb6oEnbY2zlalE9NfeldZZJsT9Xind7yMHzdUQIDAQAB')
    }
    return encryptor.encrypt(word);
  },
  //crypto加密（aes）
  encrypt(word, keyStr){ 
    if(test.indexOf("reach_dist")>0 || test.indexOf("reachtest")>0 || test.indexOf("localhost")>0){
      keyStr = keyStr ? keyStr : '1aa1a07778e8464f';
    }else{
      keyStr = keyStr ? keyStr : '9e0d9955a5c84869';
    }
    var key  = CryptoJS.enc.Utf8.parse(keyStr);
    var srcs =  CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode:CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    var resword = encrypted.toString();
    return this.encryptors(resword);
  },
  //crypto解密
  decrypt(word, keyStr){  
    if(test.indexOf("reach_dist")>0 || test.indexOf("reachtest")>0 || test.indexOf("localhost")>0){
      keyStr = keyStr ? keyStr : '1aa1a07778e8464f';
    }else{
      keyStr = keyStr ? keyStr : '9e0d9955a5c84869';
    }
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },

}