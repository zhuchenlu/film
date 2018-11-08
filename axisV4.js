//你的D3代码


function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform.rescaleX(xScale);//获得缩放后的scale
    var s = d3.event.transform;
    console.log(t);

    g.select("#axis-x").call(xAxis.scale(t));
    // g.select(".myRect").attr("width", area.x(function(d) { return xt(d.date); }));
    g.selectAll(".MyRect").attr("width", function (d) { return t(d.结束帧数) - t(d.开始帧数); })
        .attr("x", function (d) { return t(d.开始帧数); });

    context.selectAll(".brush").call(brush.move, xScale.range().map(d3.event.transform.invertX, d3.event.transform))

}

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || xScale2.range();
    xScale.domain(s.map(xScale2.invert, xScale2));

    g.select("#axis-x").call(xAxis);

    g.call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

    g.selectAll(".MyRect").attr("width", function (d) { return xScale(d.结束帧数) - xScale(d.开始帧数); })
        .attr("x", function (d) { return xScale(d.开始帧数); });

}


var width = 1300; //画布的宽度
var height = 600; //画布的高度
// var padding = 30;

var svg = d3.select(".axis") //选择文档中的body元素
    .append("svg") //添加一个svg元素
    .attr("class", "svgContainer")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 20, right: 20, bottom: 50, left: 50 };
var margin2 = { top: 400, right: 20, bottom: 30, left: 40 };
var areaWidth = svg.attr("width") - margin.left - margin.right,//获得绘图区的宽高
    areaHeight = svg.attr("height") - margin.top - margin.bottom;
var areaWidth2 = svg.attr("width") - margin2.left - margin2.right,//获得绘图区的宽高
    areaHeight2 = svg.attr("height") - margin2.top - margin2.bottom;
console.log(areaWidth);


var g = svg.append("g")
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .attr("class", "zoom");

var context = svg.append("g")
    .attr("class", "context")
    .attr("width", areaWidth2)
    .attr("height", areaHeight2)
    .attr("transform", "translate(" + margin2.left + "," + "250" + ")");

var sceneTexts = ["远", "全", "中", "半身", "近", "特", "0", "特写", "近景", "半身景", "中景", "全景", "远景"];
var yTexts = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
var compositionTexts = ["动态构图", "静态构图"];
var compositionColors = ["#f36161", "#68ACEc"];
var moveTexts = ["静止", "扫视", "倾斜", "升降", "变焦", "推拉", "旋转", "跟踪"];
var impressionTexts = ["主观镜头", "客观镜头"];

var scene = d3.scaleBand()
    .domain(sceneTexts)
    .range(yTexts);

var composition = d3.scaleBand()
    .domain(compositionTexts)
    .range(compositionColors);
//x轴比例尺
var xScale = d3.scaleLinear()
    .domain([0, 182821])
    .range([0, 1200]);
var xScale2 = d3.scaleLinear()
    .domain([0, 182821])
    .range([0, 1200]);
//y轴的比例尺
var yScale = d3.scaleBand()
    .domain(sceneTexts)
    .range([-80, 80]);
var yScale2 = d3.scaleBand()
    .domain(sceneTexts)
    .range([-40, 40]);
//添加坐标轴 

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
var xAxis2 = d3.axisBottom(xScale2);
var yAxis2 = d3.axisLeft(yScale);

//生成坐标轴
var xaxis = g.append("g")
    .attr("class", "axis")
    .attr("id", "axis-x")
    // .attr("transform", "translate(40,300)")
    .attr("transform", "translate(40,80)")
    .call(xAxis)
    .append("text") //添加坐标轴说明
    .text("帧数")
    .attr("transform", "translate(" + (areaHeight) + ",0)"); //指定坐标轴说明的坐标
var yaxis = g.append("g")
    .attr("class", "axis")
    // .attr("transform", "translate(40,300)")
    .attr("transform", "translate(40,80)")
    .call(yAxis)
    .append("text") //添加坐标轴说明
    .text("景距")
    .attr("transform", "translate(0,-100)"); //指定坐标轴说明的坐标

// var clip = g.append("clipPath") //添加一个剪切区，超出这个区的图形都不显示
//     .attr("id", "clip")
//     .append("rect")
//     // .attr("width",1000)
//     // .attr("height", 200)
//     .attr("class", "rect");

context.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,40)")
    .call(xAxis2)
    .append("text") //添加坐标轴说明
    .text("帧数")

var brush = d3.brushX() //设置关联比例
    // .extent([[0, 0], [width, height2]])
    .on("brush", brushed);


var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    // .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

// context.append("g")
//     .attr("class", "brush")
//     //   .attr("height", 40)
//     .call(brush)
//     .call(brush.move, xScale.range());

// g.call(zoom);
d3.csv("7.csv", function (error, csvdata) {

    if (error) {
        console.log(error);
    }



    var begin_data = [];
    var end_data = [];
    var diff_data = [];
    var scene_data = [];
    var SimilarityMirror = [];
    var mode_data = "";
    csvdata.forEach(function (d) {
        begin_data.push(d.开始帧数);
        end_data.push(d.结束帧数);
        diff_data.push(d.帧数差);
        scene_data.push(d.景距);
        if (d.景距 == "半身景") {
            mode_data += "半身";
        }
        else if (d.景距 == "") {
            mode_data += "空白";
        }
        else {
            mode_data += d.景距;
        }
    });
    csvdata.forEach(function (d) {
        if (d.相似镜头.indexOf("相似") + 1) {
            SimilarityMirror.push(d);
        }
    });

    //模式提取的数据获取方法
    function creatMode(pattern, ratio) {
        var indexs = [];
        var str = mode_data;
        var count = 0;
        var csv_index = 0;
        while (str.search(pattern) != -1) {
            var index = str.search(pattern);
            if (count == 0) {
                csv_index = csv_index + index / 2;
                count++;
            }
            else {
                csv_index = csv_index + index / 2 + (pattern.length / 2);
                count++;
            }
            indexs.push(csv_index);
            str = str.substring(index + pattern.length, str.length);
        }
        console.log("提取到的模式个数：" + count);
        var newdata = [];
        console.log(indexs);

        indexs.forEach(function (d) {
            for (i = 0; i < pattern.length / 2; i++) {
                newdata.push(csvdata[d + i]);
            }
        });
        console.log(newdata);
        var clear = svg.selectAll("rect").remove();
        // init(newdata);
        init(newdata, "MyRect", "300", yScale);
        init(newdata, "MyRectBrush", "510", yScale2);
        select_detail();
    }

    //模式提取的页面响应
    var quire_strs = [];
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;
        var number = 0;
        $(document).on('click', '#add', function () {
            quire_strs.push(this.value);
            var clone = $("[name='clonerow']");
            number++;
            var newInput =
                '<label class="layui-label" display="block" id="number' + number + '">' + this.value + ' + </label>';
            $('#clonerow').append(newInput);
        });
        $(document).on('click', '#delete', function () {
            quire_strs.pop();
            var order = "number" + number;
            var container = document.getElementById("clonerow");
            var myNode = document.getElementById(order);
            container.removeChild(myNode);
            number--;
        });
        $(document).on('click', '#submit', function () {
            var str = "";
            quire_strs.forEach(function (d) {
                str += d;
            });
            if (str == "") {
                alert("输入模式为空");
            }
            else {
                console.log("用户待提取模式：" + str);
                creatMode(str, 0.3);
            }
        });
        $(document).on('click', '#reset', function () {
            var container = document.getElementById("clonerow");
            for (i = number; i > 0; i--) {
                var order = "number" + i;
                var myNode = document.getElementById(order);
                container.removeChild(myNode);
            }
            quire_strs = [];
            number = 0;
            var clear = svg.selectAll("rect").remove();
            // init(csvdata);
            init(csvdata, "MyRect", "300", yScale);
            init(csvdata, "MyRectBrush", "510", yScale2);
            select_detail();
        });
    });

    //分类查看的页面响应
    layui.use('form', function () {
        var form = layui.form;

        form.on('checkbox(fenlei)', function (data) {
            var temp = [];
            var newdata = [];
            var jingtou = $("[name='g1']");
            var goutu = $("[name='g2']");
            var jiaodu = $("[name='g3']");
            var jingju = $("[name='g4']");
            var yundong = $("[name='g5']");
            console.log(jingtou["0"]["checked"]);
            console.log(jingtou["1"]["checked"]);
            if (jingtou["0"]["checked"]) {
                csvdata.forEach(function (d) {
                    if (d.帧数差 / 25 >= 10) {
                        newdata.push(d);
                    }
                });
            }
            if (jingtou["1"]["checked"]) {
                csvdata.forEach(function (d) {
                    if (d.帧数差 / 25 < 10) {
                        newdata.push(d);
                    }
                });
            }
            if (goutu["0"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.影视构图方式 == "动态构图") {
                        temp.push(d);
                    }
                });
            }
            if (goutu["1"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.影视构图方式 == "静态构图") {
                        temp.push(d);
                    }
                });
            }
            newdata = temp;
            temp = [];
            if (jiaodu["0"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.拍摄角度 == "平") {
                        temp.push(d);
                    }
                });
            }
            if (jiaodu["1"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.拍摄角度 == "仰") {
                        temp.push(d);
                    }
                });
            }
            if (jiaodu["2"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.拍摄角度 == "俯") {
                        temp.push(d);
                    }
                });
            }
            newdata = temp;
            temp = [];
            if (jingju["0"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "远景") {
                        temp.push(d);
                    }
                });
            }
            if (jingju["1"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "全景") {
                        temp.push(d);
                    }
                });
            }
            if (jingju["2"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "中景") {
                        temp.push(d);
                    }
                });
            }
            if (jingju["3"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "半身景") {
                        temp.push(d);
                    }
                });
            }
            if (jingju["4"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "近景") {
                        temp.push(d);
                    }
                });
            }
            if (jingju["5"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.景距 == "特写") {
                        temp.push(d);
                    }
                });
            }
            newdata = temp;
            temp = [];
            if (yundong["0"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "倾斜") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["1"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "静止") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["2"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "跟踪") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["3"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "扫视") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["4"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "升降") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["5"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "旋转") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["6"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "推拉") {
                        temp.push(d);
                    }
                });
            }
            if (yundong["7"]["checked"]) {
                newdata.forEach(function (d) {
                    if (d.摄像机运动方式 == "变焦") {
                        temp.push(d);
                    }
                });
            }
            newdata = temp;
            temp = [];
            console.log(newdata);
            var clear = svg.selectAll("rect").remove();
            // init(newdata);
            init(newdata, "MyRect", "300", yScale);
            init(newdata, "MyRectBrush", "510", yScale2);
            select_detail();
        });

    });

    function init(data, className, transY, scaleY) {

        context.append("g")
            .attr("class", "brush")
            //   .attr("height", 40)
            .call(brush)
            .call(brush.move, xScale.range());

        g.call(zoom);
        var rects = g.selectAll("." + className)
            .data(data)
            .enter()

            .append("rect")
            .attr("class", className)
            // .attr("class", function (d) {
            //     if (d.摄像机运动方式 == "静止") {
            //         return "still";
            //     }
            //     else{
            //         return "MyRect";
            //     }
            // })
            // .attr("id",)
            .attr("transform", "translate(40," + transY + ")")
            // .transition()
            // .duration(1)
            // .ease("bounce")
            // .delay(function (d, i) {
            //     return 10 * i;
            // })
            .attr("fill", function (d) {
                //目前静态构图，为蓝色，动态构图为红色，配色有待考究，同种运动方式，表示符号一致
                if (d.影视构图方式 == "静态构图") {
                    if (d.摄像机运动方式 == "静止") {
                        return "url(#still1)"
                    }
                    if (d.摄像机运动方式 == "倾斜") {
                        return "url(#tilt1)"
                    }
                    if (d.摄像机运动方式 == "跟踪") {
                        return "url(#track1)"
                    }
                    if (d.摄像机运动方式 == "扫视") {
                        return "url(#glance1)"
                    }
                    if (d.摄像机运动方式 == "升降") {
                        return "url(#lift1)"
                    }
                    if (d.摄像机运动方式 == "旋转") {
                        return "url(#rotate1)"
                    }
                    if (d.摄像机运动方式 == "推拉") {
                        return "url(#pushPull1)"
                    }
                    if (d.摄像机运动方式 == "变焦") {
                        return "url(#zoom1)"
                    }
                }
                if (d.影视构图方式 == "动态构图") {
                    if (d.摄像机运动方式 == "静止") {
                        return "url(#still2)"
                    }
                    if (d.摄像机运动方式 == "倾斜") {
                        return "url(#tilt2)"
                    }
                    if (d.摄像机运动方式 == "跟踪") {
                        return "url(#track2)"
                    }
                    if (d.摄像机运动方式 == "扫视") {
                        return "url(#glance2)"
                    }
                    if (d.摄像机运动方式 == "升降") {
                        return "url(#lift2)"
                    }
                    if (d.摄像机运动方式 == "旋转") {
                        return "url(#rotate2)"
                    }
                    if (d.摄像机运动方式 == "推拉") {
                        return "url(#pushPull2)"
                    }
                    if (d.摄像机运动方式 == "变焦") {
                        return "url(#zoom2)"
                    }
                }
            })

            .attr("x", function (d) {
                return xScale(d.开始帧数);
            })
            .attr("y", function (d) {
                //表示客观镜头的坐标轴在上
                // if (d.镜头给观众的印象 == "客观镜头") {
                if (d.拍摄角度 == "俯") {
                    //分布在x轴以下
                    return 0 - 220;
                } else {
                    return -scaleY(d.景距) - 7 - 220;
                }
                // }
                //表示主观镜头的坐标轴在下
                // else {
                //     if (d.拍摄角度 == "俯") {
                //         return 200;
                //     } else {
                //         return -yScale(d.景距) - 7 + 200;
                //     }
                // }

            })
            .attr("width", function (d) {
                return xScale(d.帧数差);
            })
            .attr("height", function (d) {
                if (d.拍摄角度 == "平") {
                    //分布在X轴的两侧
                    return 2 * (scaleY(d.景距) + 7);
                } else {
                    //拍摄角度为仰，分布在X轴上方
                    return (scaleY(d.景距) + 7);
                }

            });
    }

    init(csvdata, "MyRect", "300", yScale);
    init(csvdata, "MyRectBrush", "510", yScale2);


    //鼠标hover显示电影镜头细节的框
    var tooltip = d3.select(".layui-table")

    function select_detail() {
        svg.selectAll(".MyRect")
            .on('mouseover', function (d) {

                tooltip.select('.time').html(d.帧数差 / 25 + "s");
                tooltip.select('.length').html(d.摄像机拍摄方式);
                tooltip.select('.composition').html(d.影视构图方式);
                tooltip.select('.movement').html(d.摄像机运动方式);
                tooltip.select('.angle').html(d.拍摄角度);
                tooltip.select('.scene').html(d.景距);

                // console.log(this);
                var dataset = d;
                console.log(dataset);
                d3.select(this)
                    .style("fill", "#ffffff")
                    .style("stroke", "#E3C39D")
                    .style("stroke-width", "2px")
                    .style("cursor", "pointer")
                    .append("img")
                    .attr("xlink:href", "bofang.png");

                    $(this).click(function(){
                    //   console.log("cedcds");
                    //   console.log(myPlayer.currentTime());
                    //   console.log(d.开始帧数/23.98);
                      myPlayer.currentTime(d.开始帧数/25);
                      console.log(d.开始帧数/25);
                      myPlayer.play();
                      });

                tooltip.style('display', 'block');
                tooltip.style('opacity', 2);
                detailRectsRender(d);

                // console.log(d);

                if (d.摄像机拍摄方式 == "长镜头") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "长镜头") { $(this).attr("checked", "checked"); }
                        //             special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机拍摄方式 == "短镜头") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "短镜头") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }

                if (d.影视构图方式 == "动态构图") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "动态构图") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.影视构图方式 == "静态构图") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "静态构图") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }

                if (d.拍摄角度 == "平") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "平") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.拍摄角度 == "仰") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "仰") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.拍摄角度 == "俯") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "俯") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }

                if (d.景距 == "远景") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "远景") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.景距 == "全景") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "全景") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.景距 == "中景") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "中景") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                } if (d.景距 == "半身景") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "半身景") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.景距 == "近景") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "近景") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.景距 == "特写") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "特写") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }

                if (d.摄像机运动方式 == "倾斜") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "倾斜") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "静止") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "静止") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "跟踪") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "跟踪") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                } if (d.摄像机运动方式 == "扫视") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "扫视") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "升降") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "升降") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "旋转") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "旋转") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "推拉") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "推拉") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
                else if (d.摄像机运动方式 == "变焦") {
                    // console.log($(this).val()); 
                    $("input[type=radio]").each(function () {
                        // console.log($(this).val());          

                        if ($(this).val() == "变焦") { $(this).attr("checked", "checked"); }
                        //special.radio(); //这个是用来美化radio的
                    });
                }
            })
            .on('mousemove', function (d) {
                // tooltip.style('margin-top', (200) + 'px')
                //         .style('margin-left', (0) + 'px')
                //         .style('position', 'absolute');
                //                    console.log(d3.event.layerY + 10)
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .style("fill", function (d) {
                        if (d.影视构图方式 == "静态构图") {
                            if (d.摄像机运动方式 == "静止") {
                                return "url(#still1)"
                            }
                            if (d.摄像机运动方式 == "倾斜") {
                                return "url(#tilt1)"
                            }
                            if (d.摄像机运动方式 == "跟踪") {
                                return "url(#track1)"
                            }
                            if (d.摄像机运动方式 == "扫视") {
                                return "url(#glance1)"
                            }
                            if (d.摄像机运动方式 == "升降") {
                                return "url(#lift1)"
                            }
                            if (d.摄像机运动方式 == "旋转") {
                                return "url(#rotate1)"
                            }
                            if (d.摄像机运动方式 == "推拉") {
                                return "url(#pushPull1)"
                            }
                            if (d.摄像机运动方式 == "变焦") {
                                return "url(#zoom1)"
                            }
                        }
                        if (d.影视构图方式 == "动态构图") {
                            if (d.摄像机运动方式 == "静止") {
                                return "url(#still2)"
                            }
                            if (d.摄像机运动方式 == "倾斜") {
                                return "url(#tilt2)"
                            }
                            if (d.摄像机运动方式 == "跟踪") {
                                return "url(#track2)"
                            }
                            if (d.摄像机运动方式 == "扫视") {
                                return "url(#glance2)"
                            }
                            if (d.摄像机运动方式 == "升降") {
                                return "url(#lift2)"
                            }
                            if (d.摄像机运动方式 == "旋转") {
                                return "url(#rotate2)"
                            }
                            if (d.摄像机运动方式 == "推拉") {
                                return "url(#pushPull2)"
                            }
                            if (d.摄像机运动方式 == "变焦") {
                                return "url(#zoom2)"
                            }
                        }
                    })
                    .style("stroke", "none")
                var nowData = this;
                layui.use('form', function () {
                    var form = layui.form;

                    //监听提交
                    form.on('submit(formDemo)', function (data) {
                        var group1 = $("[name='group1']").filter(":checked");
                        console.log(group1.attr("value"));
                        var group2 = $("[name='group2']").filter(":checked");
                        console.log(group2.attr("value"));
                        var group3 = $("[name='group3']").filter(":checked");
                        console.log(group3.attr("value"));
                        var group4 = $("[name='group4']").filter(":checked");
                        console.log(group4.attr("value"));
                        var group5 = $("[name='group5']").filter(":checked");
                        console.log(group5.attr("value"));
                        d.摄像机拍摄方式 = group1.attr("value");
                        d.影视构图方式 = group2.attr("value");
                        d.摄像机运动方式 = group5.attr("value");
                        d.景距 = group4.attr("value");
                        d.拍摄角度 = group3.attr("value");
                        detailRectsRender(d);

                        //体现在坐标系上
                        d3.select(nowData)
                            .style("fill", function (d) {
                                if (d.影视构图方式 == "静态构图") {
                                    if (d.摄像机运动方式 == "静止") {
                                        return "url(#still1)"
                                    }
                                    if (d.摄像机运动方式 == "倾斜") {
                                        return "url(#tilt1)"
                                    }
                                    if (d.摄像机运动方式 == "跟踪") {
                                        return "url(#track1)"
                                    }
                                    if (d.摄像机运动方式 == "扫视") {
                                        return "url(#glance1)"
                                    }
                                    if (d.摄像机运动方式 == "升降") {
                                        return "url(#lift1)"
                                    }
                                    if (d.摄像机运动方式 == "旋转") {
                                        return "url(#rotate1)"
                                    }
                                    if (d.摄像机运动方式 == "推拉") {
                                        return "url(#pushPull1)"
                                    }
                                    if (d.摄像机运动方式 == "变焦") {
                                        return "url(#zoom1)"
                                    }
                                }
                                if (d.影视构图方式 == "动态构图") {
                                    if (d.摄像机运动方式 == "静止") {
                                        return "url(#still2)"
                                    }
                                    if (d.摄像机运动方式 == "倾斜") {
                                        return "url(#tilt2)"
                                    }
                                    if (d.摄像机运动方式 == "跟踪") {
                                        return "url(#track2)"
                                    }
                                    if (d.摄像机运动方式 == "扫视") {
                                        return "url(#glance2)"
                                    }
                                    if (d.摄像机运动方式 == "升降") {
                                        return "url(#lift2)"
                                    }
                                    if (d.摄像机运动方式 == "旋转") {
                                        return "url(#rotate2)"
                                    }
                                    if (d.摄像机运动方式 == "推拉") {
                                        return "url(#pushPull2)"
                                    }
                                    if (d.摄像机运动方式 == "变焦") {
                                        return "url(#zoom2)"
                                    }
                                }
                            })
                            .attr("y", function (d) {
                                //表示客观镜头的坐标轴在上
                                // if (d.镜头给观众的印象 == "客观镜头") {
                                if (d.拍摄角度 == "俯") {
                                    //分布在x轴以下
                                    return 0;
                                } else {
                                    return -yScale(d.景距) - 7;
                                }
                                // }
                                //表示主观镜头的坐标轴在下
                                // else {
                                // if (d.拍摄角度 == "俯") {
                                //     return 200;
                                // } else {
                                //     return -yScale(d.景距) - 7 + 200;
                                // }
                                // }

                            })
                            .attr("height", function (d) {
                                if (d.拍摄角度 == "平") {
                                    //分布在X轴的两侧
                                    return 2 * (yScale(d.景距) + 7);
                                } else {
                                    //拍摄角度为仰，分布在X轴上方
                                    return (yScale(d.景距) + 7);
                                }

                            });
                        return false;
                    });

                });

                // $('#submit').click(function (d) {
                //     console.log("de");
                //     var group1 = $("[name='group1']").filter(":checked");
                //     var group2 = $("[name='group2']").filter(":checked");
                //     var group3 = $("[name='group3']").filter(":checked");
                //     var group4 = $("[name='group4']").filter(":checked");
                //     var group5 = $("[name='group5']").filter(":checked");

                //     d.摄像机拍摄方式 = group1.attr("value");
                //     d.影视构图方式 = group2.attr("value");
                //     d.摄像机运动方式 = group5.attr("value");
                //     d.景距 = group4.attr("value");
                //     d.拍摄角度 = group3.attr("value");
                //     console.log(d.摄像机拍摄方式);
                //     d3.select(this)
                //         .style("fill", function (d) {
                //             if (d.影视构图方式 == "静态构图") {
                //                 if (d.摄像机运动方式 == "静止") {
                //                     return "url(#still1)"
                //                 }
                //                 if (d.摄像机运动方式 == "倾斜") {
                //                     return "url(#tilt1)"
                //                 }
                //                 if (d.摄像机运动方式 == "跟踪") {
                //                     return "url(#track1)"
                //                 }
                //                 if (d.摄像机运动方式 == "扫视") {
                //                     return "url(#glance1)"
                //                 }
                //                 if (d.摄像机运动方式 == "升降") {
                //                     return "url(#lift1)"
                //                 }
                //                 if (d.摄像机运动方式 == "旋转") {
                //                     return "url(#rotate1)"
                //                 }
                //                 if (d.摄像机运动方式 == "推拉") {
                //                     return "url(#pushPull1)"
                //                 }
                //                 if (d.摄像机运动方式 == "变焦") {
                //                     return "url(#zoom1)"
                //                 }
                //             }
                //             if (d.影视构图方式 == "动态构图") {
                //                 if (d.摄像机运动方式 == "静止") {
                //                     return "url(#still2)"
                //                 }
                //                 if (d.摄像机运动方式 == "倾斜") {
                //                     return "url(#tilt2)"
                //                 }
                //                 if (d.摄像机运动方式 == "跟踪") {
                //                     return "url(#track2)"
                //                 }
                //                 if (d.摄像机运动方式 == "扫视") {
                //                     return "url(#glance2)"
                //                 }
                //                 if (d.摄像机运动方式 == "升降") {
                //                     return "url(#lift2)"
                //                 }
                //                 if (d.摄像机运动方式 == "旋转") {
                //                     return "url(#rotate2)"
                //                 }
                //                 if (d.摄像机运动方式 == "推拉") {
                //                     return "url(#pushPull2)"
                //                 }
                //                 if (d.摄像机运动方式 == "变焦") {
                //                     return "url(#zoom2)"
                //                 }
                //             }
                //         })
                //         .attr("y", function (d) {
                //             //表示客观镜头的坐标轴在上
                //             if (d.镜头给观众的印象 == "客观镜头") {
                //                 if (d.拍摄角度 == "俯") {
                //                     //分布在x轴以下
                //                     return 0;
                //                 } else {
                //                     return -yScale(d.景距) - 7;
                //                 }
                //             }
                //             //表示主观镜头的坐标轴在下
                //             else {
                //                 if (d.拍摄角度 == "俯") {
                //                     return 200;
                //                 } else {
                //                     return -yScale(d.景距) - 7 + 200;
                //                 }
                //             }

                //         })
                //         .attr("height", function (d) {
                //             if (d.拍摄角度 == "平") {
                //                 //分布在X轴的两侧
                //                 return 2 * (yScale(d.景距) + 7);
                //             } else {
                //                 //拍摄角度为仰，分布在X轴上方
                //                 return (yScale(d.景距) + 7);
                //             }

                //         });

                // });
            });
    }
    select_detail();

    //细节方块渲染
    function detailRectsRender(d) {

        var detailRects = d3.selectAll(".detail")
            .attr("x", 150 - 1.5 * xScale(d.帧数差))
            .attr("width", 3 * xScale(d.帧数差))
            .attr("height", 3 * yScale(d.景距))
            .attr("display", "block")
            .attr("fill", function () {
                if (d.影视构图方式 == "静态构图") {
                    if (d.摄像机运动方式 == "静止") {
                        return "url(#still1)"
                    }
                    if (d.摄像机运动方式 == "倾斜") {
                        return "url(#tilt1)"
                    }
                    if (d.摄像机运动方式 == "跟踪") {
                        return "url(#track1)"
                    }
                    if (d.摄像机运动方式 == "扫视") {
                        return "url(#glance1)"
                    }
                    if (d.摄像机运动方式 == "升降") {
                        return "url(#lift1)"
                    }
                    if (d.摄像机运动方式 == "旋转") {
                        return "url(#rotate1)"
                    }
                    if (d.摄像机运动方式 == "推拉") {
                        return "url(#pushPull1)"
                    }
                    if (d.摄像机运动方式 == "变焦") {
                        return "url(#zoom1)"
                    }
                }
                if (d.影视构图方式 == "动态构图") {
                    if (d.摄像机运动方式 == "静止") {
                        return "url(#still2)"
                    }
                    if (d.摄像机运动方式 == "倾斜") {
                        return "url(#tilt2)"
                    }
                    if (d.摄像机运动方式 == "跟踪") {
                        return "url(#track2)"
                    }
                    if (d.摄像机运动方式 == "扫视") {
                        return "url(#glance2)"
                    }
                    if (d.摄像机运动方式 == "升降") {
                        return "url(#lift2)"
                    }
                    if (d.摄像机运动方式 == "旋转") {
                        return "url(#rotate2)"
                    }
                    if (d.摄像机运动方式 == "推拉") {
                        return "url(#pushPull2)"
                    }
                    if (d.摄像机运动方式 == "变焦") {
                        return "url(#zoom2)"
                    }
                }
            });

    }
  
    //将电影的放映时间条与坐标轴的移动形成对应
    //  myPlayer.on('timeupdate', function () {
    //     $(".svgContainer").css("margin-left",-myPlayer.currentTime());
    //     console.log('当前播放时间：'+ myPlayer.currentTime()+"秒"+myPlayer.currentTime()*24+"帧");
    // });

    // //相似镜头部分
    //         var circles = svg.selectAll("circle")
    //                 .data(csvdata)
    //                 .enter()
    //                 .append("circle")
    //                 //以相似镜头中心时间点为圆心，长度为直径画圆，这样所有的相似镜头都以圆表示，大小代表镜头长短
    //                 .attr("cx",function(d){
    //                     return xScale(d.开始帧数)+xScale(d.帧数差/2)+40;
    //                         })
    //                 .attr("cy",function(d){
    //                     return "700";
    //                 })
    //                 .attr("r",function(d){
    //                     return xScale(d.帧数差/2);})
    //                 .attr("display",function (d) {
    //                     if(d.相似镜头.indexOf("相似"))
    //                     {
    //                         return "none";
    //                     }
    //                 })
    //                 .style("fill","#7E5686")
    //                 .attr("opacity","0.5")
    //                 .attr("cursor","pointer")
    //                 .on("mouseover", function(d) {
    //                     d3.select(this)
    //                             .attr("opacity", "0.7");

    //                 })
    //                 .on("mouseout", function() {
    //                     d3.select(this)
    //                             .attr("opacity", 0.5);
    //                 });

    //         var w=700;
    //         var h =1400;
    //         var firstBegin = SimilarityMirror[0].开始帧数;
    //         var firstDiff = SimilarityMirror[0].帧数差;
    //         var last = 40;
    //         console.log(last);
    // //Var for plotting
    //         var delta = 50;
    //         var xScale = w/(500+delta*2);
    //         var rScale=4;  //Scale for day-circles

    //         var initDelay = 0;  //Initial Delay before starting
    //         var aDelay=1000;  //Delay per day
    //         var fadeDay; //Timeout for fading day text
    //         var isAniOver = false;
    //         var love_colors = ["#7E5686", "#A5AAD9", "#FE4365"];

    //             var xScale = d3.scale.linear()
    //                     .domain([0, 182821])
    //                     .range([0, 5000]);

    //         SimilarityMirror.sort(function (a,b) {
    //             var str1 = new String(a.相似镜头);
    //             var str2 = new String(b.相似镜头);
    //             var str3 = a.开始帧数;
    //             var str4 = b.开始帧数;
    //             if(str1.slice(2)-str2.slice(2)>0)
    //             {
    //                 return 1;
    //             }
    //             else if(str1.slice(2)-str2.slice(2)==0)
    //             {
    //                 if(str3-str4>0)
    //                 {
    //                     return 1;
    //                 }
    //                 else
    //                 {
    //                     return -1;
    //                 }
    //             }
    //             else {
    //                 return -1;
    //             }
    //         })
    //         console.log(csvdata)
    //         var arcs = svg.selectAll("path")
    //             .data(SimilarityMirror)
    //             .enter()
    //             .append("path")
    //             .attr({
    //                 d: function(d,i) {
    //                     if(d.相似镜头.indexOf("相似")+1){
    //                         var nextX = xScale(d.开始帧数)+xScale(d.帧数差/2)+40;
    //                         if(nextX>0)
    //                         {
    //                             var prevX = last;
    //                             var r = Math.abs((nextX-prevX)/2);
    //                             last = xScale(d.开始帧数)+xScale(d.帧数差/2)+40;
    //                             // console.log("M "+prevX+" "+(h/2)+" A "+r+" "+r+" 0 0 1 "+nextX+" "+(h/2));
    //                             return "M "+prevX+" "+(h/2)+" A "+r+" "+(r)+" 0 0 1 "+nextX+" "+(h/2);
    //                         } else return "M 0 0";
    //                     }
    //                 },
    //                 'fill': 'none',
    //                 'opacity': 0.6,
    //                 'stroke': "rgb(10,20,40)", //250
    //                 'stroke-width': "2",
    //                 'stroke-dasharray': "0, 3000"
    //             })
    //             .transition()
    //             .duration(aDelay*2)
    //             .ease("linear")
    //             .delay(function(d,i) {return i*(aDelay) + initDelay;})
    //             .attr({
    //                 'stroke': "rgb(210,220,240)",
    //                 'stroke-width': "4",
    //                 'stroke-dasharray': "3000, 0"
    //             })
    //             .transition()
    //             .duration(aDelay/2)
    //             .ease("linear")
    //             .delay(function(d,i) {return (i+1)*(aDelay) + initDelay;})
    //             .attr({
    //                 'stroke-width': "1",
    //                 'stroke': love_colors[1]
    //             });
});


