// ==UserScript==
// @name         长江雨课堂_HITSZ
// @namespace    http://www.lynliam.top/
// @version      1.2
// @description  长江雨课堂自动化脚本_HITSZ
// @author       Lyn Liam
// @match        https://changjiang.yuketang.cn/v2/web/*
// @icon         https://www.google.com/s2/favicons?domain=yuketang.cn
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/3.4.1/jquery.min.js
// @source       https://github.com/lynliam/changjiang.yuketang_tampermonkey
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    console.log('url: ' + currentUrl)
    setTimeout(function(){


        let zk_btn = $("span.blue.ml20");
        zk_btn.click();
        // function is_video(){
        //     $("svg.icon > use")
        // }
        setTimeout(function(){
            let a = $("section.leaf_list__wrap:first");
            let a_list = a.find("section.activity__wrap");
            //let svg_list = a.find("svg.icon");
            //let type_list = a_list.find("icon");
            for(let i=0; i<a_list.length; i++){
                // 观看进行中与未开始的视频
                console.log(i+'---'+a_list[i].lastChild.innerText);
                console.log(i+'---'+a_list[i].firstChild.innerText);
                console.log(a_list[i].firstChild.innerText.match("Video"))
                console.log('正则数字匹配'+a_list[i].firstChild.innerText.match(/[2-3]\.[0-9]/) != null )

                let svg_icons = $(a_list[i]).find("svg.icon")  //包含两个icons，一个是"shipin"，另一个是"yiwancheng"
                console.log('svg' + svg_icons[0].firstChild.getAttribute('xlink:href'))
                //console.log("标题为数字小于4" + Number(a_list[i].firstChild.innerText) )
                //console.log("type的属性" + type_list[i])
                // let type = type_list[i].children.attributes
                if(a_list[i].lastChild.innerText.indexOf("进行中")>-1 || (a_list[i].lastChild.innerText === "未开始" && svg_icons[0].firstChild.getAttribute('xlink:href').match("#icon-shipin"))){

                    a_list[i].click();
                    setTimeout(function(){
                        let title = $("div.title-fl span")[0].innerText;  // 标题
                        //let timeout = 3000;  // 控制计时器间隔
                       // let reg = /[0-9]+.[0-9]+/g;  // 正则匹配进度
                        // let reg = /[0-9]+(\.[0-9]+)?/;
                        let reg = /([0-9]+(?:\.[0-9]+)?)%/;
                        setTimeout(function(){
                            let pause_btn = $("xt-bigbutton.pause_show");  // 暂停按钮
                            if(pause_btn.length === 1){  // 判断按钮是否显示
                                console.log("视频未播放---自动点击播放视频");
                                pause_btn.click();
                            }
                        },1500);

                        const rate = 2;
                        // 静音
                        function claim() {
                            $(
                                "#video-box > div > xt-wrap > xt-controls > xt-inner > xt-volumebutton > xt-icon"
                            ).click();
                        }

                        function fun(className, selector)
                        {
                            var mousemove = document.createEvent("MouseEvent");
                            mousemove.initMouseEvent("mousemove", true, true, window, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, null);
                            document.getElementsByClassName(className)[0].dispatchEvent(mousemove);
                            document.querySelector(selector).click();
                        }

                        // 加速
                        function speed() {
                            let keyt = '';
                            if(rate === 2 || rate === 1){
                                keyt = "[keyt='" + rate + ".00']"
                            }else{
                                keyt = "[keyt='" + rate + "']"
                            }
                            fun("xt_video_player_speed", keyt);
                        }

                        let video;
                        const videoPlay = setInterval(function () {
                            // 获取播放器
                            video = document.getElementsByClassName("xt_video_player")[0];
                            if (!video) {
                                return;
                            }
                            claim();
                            setTimeout(function () {
                                // 视频开始5s之后再开启倍速(已加速)
                                speed()
                            },10);
                            window.clearInterval(videoPlay);
                        }, 500);

                        // 是否播放完成的检测
                        const playTimeOut = setInterval(function () {
                            if (!video) {
                                return;
                            }
                            // 没有静音
                            if (video.volume != 0) {
                                claim();
                            }
                            video.play();
                        }, 1000);


                        // 计时器监听进度
                        let jsq = setInterval(function(){
                            let w = $("span.text:eq(1)")[0];  // 进度元素
                            console.log(title+'---'+w.innerText);
                            console.log(w.innerText);
                            let matchResult = w.innerText.match(reg);
                            if (matchResult && matchResult[1]) {
                                let progress = Number(matchResult[1]);
                                console.log(title+'---进度：'+ progress +'%');
                                console.log('progress是否大于90:'+ progress)
                                // 使用 progress 的代码
                            } else {
                                console.error("进度文本格式不正确或没有匹配项");
                                let progress = 100;
                                if(progress>99){
                                console.log("视频已看完")
                                clearInterval(jsq);
                                window.clearInterval(playTimeOut);
                                window.history.back();
                                setTimeout(function(){
                                    window.parent.location.reload();
                                },3000);
                            }
                            }
                            //let progress = Number(w.innerText.match(reg)[0]);  // 匹配进度转为数字
                            //if(w.innerText=="完成度：100%"){

                            //}
                        },3000);
                    },3000);
                    return false;
                }

                // 读未读的图文
                if(a_list[i].lastChild.innerText === "未读"){
                    console.log(i+'---'+a_list[i].lastChild.innerText);
                    a_list[i].click();
                    setTimeout(function(){
                        let title = $("div.title-fl span")[0].innerText;
                        setTimeout(function(){
                            window.history.back();
                            setTimeout(function(){
                                window.parent.location.reload();
                            },1500);
                        },1000);
                    },2000);
                    return false;
                }

                // 进行未发言的讨论
                if (a_list[i].lastChild.innerText === "未发言" || a_list[i].lastChild.innerText === " 未发言"){
                    console.log(i+'---'+a_list[i].lastChild.innerText);
                    a_list[i].click();
                    setTimeout(function(){
                        let content = "good";
                        let text_element = $("textarea.el-textarea__inner")[0];
                        let button_element = $("button.el-button")[0];

                        text_element.value = content;
                        // 创建一个 input 事件
                        let inputEvent = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });

                        // 创建一个 change 事件
                        let changeEvent = new Event('change', {
                            bubbles: true,
                            cancelable: true,
                        });

                        // 触发 input 事件
                        text_element.dispatchEvent(inputEvent);

                        // 触发 change 事件
                        text_element.dispatchEvent(changeEvent);
                        setTimeout(()=>{
                            button_element.click();
                        }, 1000);

                        console.log("已发言完毕");

                        setTimeout(function () {
                            window.history.back();
                            setTimeout(function(){
                                window.parent.location.reload();
                            }, 1500);
                        }, 1000);
                    }, 3000);
                    return false;
                }

                // 判断如果最后一条并且为已完成或已读 结束任务
                if(i===a_list.length-1 && (a_list[i].lastChild.innerText === "已完成" || a_list[i].lastChild.innerText === "已读")){
                    // window.history.back(-1);
                    console.log("全部完成");
                    alert("已完成！");
                    return false;
                }
            }
        },500);
        const reloadTime = 1;
        setTimeout(function () {
            // 如果保存了课程列表路径就回退的课程列表页面
            if(currentUrl === window.location.href){
                window.location.replace(currentUrl)
                location.reload()
            }
        },reloadTime * 60 * 1000);
    },1000);

})();
