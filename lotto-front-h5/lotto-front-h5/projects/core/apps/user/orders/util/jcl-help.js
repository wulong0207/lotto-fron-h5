/*
 * @Author: nearxu 
 * @Date: 2017-11-14 20:32:13 
 * 竞彩篮球的公共方法 
 */
import React , {Component} from 'react';
import { subInner } from '@/utils/utils';
import { isEmpty } from 'lodash';

export default {
    //获取胜负结果
    getMatchDes(code){
        switch(code){
            case "3": return "胜";
            case "1": return "平";
            case "0": return "负";
        }
        return "";
    },
  
    //获取大小分描述
    getDxDes(code){
        code = code || "";
        if(code.indexOf("99") >= 0){
            return  "大分" ;
        }else if(code.indexOf("00") >= 0){
            return "小分";
        }else {
            return "";
        }
    },

    //获取胜分差   主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
        //             客胜 1-5(11)  6-10(12) 11-15(13) 16-20(14) 21-25(15) 26+(16)
    getSfcWF(code){
        let result = "";
        switch(code){
            case "01": result = "主胜1-5";break;
            case "02": result = "主胜6-10";break;
            case "03": result = "主胜11-15";break;
            case "04": result = "主胜16-20";break;
            case "05": result = "主胜21-25";break;
            case "06": result = "主胜26+";break;

            case "11": result = "主负1-5";break;
            case "12": result = "主负6-10";break;
            case "13": result = "主负11-15";break;
            case "14": result = "主负16-20";break;
            case "15": result = "主负21-25";break;
            case "16": result = "主负26+";break;
        }

        return result;
    },

    //获取半全场描述
    getHalfDes(gameResult) {
        let result = "";
        if(gameResult){
            result = this.getMatchDes(gameResult[0]) + "-" + this.getMatchDes(gameResult[1]);
        }
        return result;
    },

    // 大小分 彩果
    getDxf(val,dxfWF) {
        let caiguo = '';
        let arr = dxfWF.split(',') ||[];
        let matchKey = subInner(val,'[',']');
        matchKey = matchKey.match(/\d+(\.\d)?/)
        if(matchKey) {
            matchKey = matchKey[0];
        }
        for(var i=0;i<arr.length;i++) {
            if(arr[i].indexOf(matchKey) > -1) {
                if(arr[i].split('|')[1] == "99") {
                    caiguo = "大分";
                }else {
                    caiguo = "小分";
                }
            }
        }
        return caiguo;
    },
    // 让分胜负的彩果
    getLetWf(val,letWf) {
        let caiguo = '';
        let matchKey = subInner(val,'[',']');
        matchKey = matchKey.match(/\d+(\.\d)?/)
        if(matchKey) {
            matchKey = matchKey[0];
        }
        let letWfArr = letWf.split(',') ||[];
        for(var i=0;i<letWfArr.length;i++) {
            if(letWfArr[i].indexOf(matchKey) > -1) {
                if(letWfArr[i].split('|')[1] == "3") {
                    caiguo = "让分主胜";
                }else {
                    caiguo = "让分主负";
                }
            }
        }
        return caiguo;
    },
    /**
     * 获取比赛方式
     */
    getMatchKind(code){
        let result;
        let codeResult = subInner((code || ""), '', '(');
        if(codeResult.indexOf("S") >= 0){
            result = codeResult.replace(/S/g, "胜负");
        }else if(codeResult.indexOf("R") >= 0){
            result = codeResult.replace(/R/g, "让分胜负");
        }else if(codeResult.indexOf("C") >= 0){
            result = codeResult.replace(/C/g, "胜分差");
        }else if(codeResult.indexOf("D") >= 0){
            result = codeResult.replace(/D/g, "大小分");
        }else{
            result = "--";
        }
        return result;
    },

}
