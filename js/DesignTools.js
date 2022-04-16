const fs = require('fs')
const path = require('path')

// 给字符串加单引号
var add_single_quotes = function (text) {
    text = "'" + text + "'"
    text = text.replace(/\\/g, '\\\\')
    text = text.replace(/\\\\\\/g, '\\\\')
    return text
}


// 总目录
var root_dir
// 插件目录
var DesignTools_dir
// 记录创建图像的文件
var create_info_file
// 导出图片的信息
var export_info_file
// 记录字体大小信息文件
var font_size_info_file
// 记录字体的文件
var font_info_file
// 默认配色文件
var default_color_schemes_file
// 配色方案psd文件 
var color_schemes_psd_file

// 设置文件
var setting_file
// 设置列表
var setting_list

// 事件前缀
var event_prefix = "com.neo.designTool."

// 临时文件
var temp_file

window.onload = function () {
    init_app()
}

var init_app = function () {

    var cs = new CSInterface()

    // 总目录
    root_dir = path.join(cs.getSystemPath(SystemPath.USER_DATA), 'neo_ps_extention')
    // 如果不存在就创建
    if (!fs.existsSync(root_dir)) {
        fs.mkdirSync(root_dir)
    }

    // 插件文件目录
    DesignTools_dir = path.join(root_dir, 'DesignTools')
    // 如果不存在就创建
    if (!fs.existsSync(DesignTools_dir)) {
        fs.mkdirSync(DesignTools_dir)
    }

    // 创建记录创建图像的文件
    create_info_file = path.join(DesignTools_dir, "create_info.txt")
    if (!fs.existsSync(create_info_file)) {
        fs.writeFileSync(create_info_file, "800,800,72,主图\n790,1300,72,电脑详情页\n750,1300,72,手机详情页\n1920,700,72,电脑首页,PIXELS\n210,297,300,A4,毫米")

        var create_info = fs.readFileSync(create_info_file).toString()
        create_element("input", create_info, "create_file")
    } else {
        var create_info = fs.readFileSync(create_info_file).toString()
        create_element("input", create_info, "create_file")
    }


    // 创建记录字体大小信息的文件
    font_size_info_file = path.join(DesignTools_dir, "font_size_info.txt")
    if (!fs.existsSync(font_size_info_file)) {
        fs.writeFileSync(font_size_info_file, "20\n25\n30\n35\n40\n45\n50")
        var font_size_info = fs.readFileSync(font_size_info_file).toString()
        create_font_size_element("input", font_size_info, "change_font_size")
    } else {
        var font_size_info = fs.readFileSync(font_size_info_file).toString()
        create_font_size_element("input", font_size_info, "change_font_size")
    }


    // 创建记录字体信息的文件
    font_info_file = path.join(DesignTools_dir, "font_info.txt")
    if (!fs.existsSync(font_info_file)) {
        fs.writeFileSync(font_info_file, "SourceHanSansCN-Heavy,思黑H\nSourceHanSansCN-Bold,思黑B\nSourceHanSansCN-Regular,思黑R\nSourceHanSansCN-Normal,思黑N")
        var font_info = fs.readFileSync(font_info_file).toString()
        create_font_element("input", font_info, "change_font")
    } else {
        var font_info = fs.readFileSync(font_info_file).toString()
        create_font_element("input", font_info, "change_font")
    }


    // 创建记录导出图像信息的文件
    export_info_file = path.join(DesignTools_dir, "export_info.txt")
    if (!fs.existsSync(export_info_file)) {
        fs.writeFileSync(export_info_file, "0,80,,JPEG\n0,100,,JPEG\n750,80,,JPEG\n800,80,PIXELS,PNG")

        var export_info = fs.readFileSync(export_info_file).toString()
        create_export_element("input", export_info, "export_img")
    } else {
        var export_info = fs.readFileSync(export_info_file).toString()
        create_export_element("input", export_info, "export_img")
    }

    // 创建默认配色文件
    default_color_schemes_file = path.join(DesignTools_dir, "default_color_schemes.txt")
    if (!fs.existsSync(default_color_schemes_file)) {
        fs.writeFileSync(default_color_schemes_file, "C01@@rgb(41, 90, 165)###C02@@rgb(90, 155, 213)###C03@@rgb(41, 90, 169)###C04@@rgb(253, 255, 239)###C05@@rgb(243, 133, 165)###C06@@rgb(205, 181, 89)###C07@@rgb(48, 181, 213)###C08@@rgb(255, 255, 255)###C09@@rgb(193, 30, 28)###C10@@rgb(247, 143, 98)###C11@@rgb(253, 231, 10)###C12@@rgb(213, 149, 23)###C13@@rgb(41, 181, 205)###C14@@rgb(245, 255, 241)###C15@@rgb(116, 123, 177)###")
        var default_color_schemes = fs.readFileSync(default_color_schemes_file).toString()
        // create_font_element("input", default_color_schemes_file, "change_font")
    } else {
        var default_color_schemes = fs.readFileSync(default_color_schemes_file).toString()
        // create_font_element("input", default_color_schemes_file, "change_font")
    }


    // 临时文件
    temp_file = path.join(DesignTools_dir, "temp.txt")
    if (!fs.existsSync(temp_file)) {
        fs.writeFileSync(temp_file, '')
    }


    // 刷新参考线列表
    get_exit_guides_js()

    // 载入默认配色方案
    load_default_color_schemes_js()


    // color_schemes_file.psd 的源文件，放在插件目录中的img里面
    source_color_schemes_psd_file = cs.getSystemPath(SystemPath.EXTENSION) + "/img/color_schemes_file.psd"
    // 用户配置文件目录(C:\Users\Administrator.USER-20181115EQ\AppData\Roaming\neo_ps_extention\DesignTools\)
    color_schemes_psd_file = path.join(DesignTools_dir, "color_schemes_file.psd")

    // 如果插件目录里面没有 color_schemes_file.psd 文件,就把这个文件复制进去
    if (!fs.existsSync(color_schemes_psd_file)) {
        try {
            // node的版本的4.X，没有这个函数
            // fs.copyFileSync(source_color_schemes_psd_file, color_schemes_psd_file)
            fs.writeFileSync(color_schemes_psd_file, fs.readFileSync(source_color_schemes_psd_file))
        } catch (error) {
            alert(error)
        }
    }

    // 创建默认配色文件
    setting_file = path.join(DesignTools_dir, "setting.txt")
    if (!fs.existsSync(setting_file)) {
        fs.writeFileSync(setting_file, "create_btn")
        var setting = fs.readFileSync(setting_file).toString()
        setting_list = setting.split("\n")
    } else {
        var setting = fs.readFileSync(setting_file).toString()
        setting_list = setting.split("\n")
    }
    // default_panel = setting_list[0]

    // 切换到默认面板
    // switch_panel(default_panel)
    switch_btn_class(setting_list[0])

    // 文档被激活的时候执行(打开或者获取焦点)
    cs.addEventListener("documentAfterActivate", function (event) {
        // 载入参考线
        get_exit_guides_js()
        // 设置默认的参考图层
        set_reference_layer_js("doc")
    })

    // 文档取消激活的时候执行(关闭或者失去焦点)
    cs.addEventListener("documentAfterDeactivate", function (event) {
        // 载入参考线
        get_exit_guides_js()
    })
}


/***********************************
 * 切换面板
 ***********************************/

//  备注：在这里登记一下 按钮的id，以及面板的id，就能实现点击按钮切换面板的功能了

// 面板的 id 列表
panel_list = ['guides_panel', 'color_panel', 'create_panel', 'other_panel', 'postprocess_panel']
// 切换面板的按钮的 id 列表
panel_btn_list = ['guides_btn', 'color_btn', 'create_btn', 'other_btn', 'postprocess_btn']

// 默认面板
// var default_panel = "create_panel"
var default_panel = "color_panel"

// 切换面板
var switch_panel = function (id) {
    for (i = 0; i < panel_list.length; i++) {
        if (panel_list[i] == id) {
            document.getElementById(panel_list[i]).removeAttribute("hidden");
        } else {
            document.getElementById(panel_list[i]).setAttribute("hidden", true);
        }
    }
}

// 切换按钮的样式
var switch_btn_class = function (btn_id) {

    fs.writeFileSync(setting_file, btn_id)

    // 被点击的按钮设置为选中的样式
    var dom = document.getElementById(btn_id)
    // if (dom.className == "switch_btn") {
        dom.className = "switch_btn_selecte"

        switch_panel(btn_id.replace('btn', 'panel'))

        // 其他按钮设置回普通样式
        for (i = 0; i < panel_btn_list.length; i++) {
            if (panel_btn_list[i] != btn_id) {
                document.getElementById(panel_btn_list[i]).className = "switch_btn"
            }

        }
    // }
}

/***********************************
 * 通用
 ***********************************/
// 用来打开文件
var read_setting_file_js = function () {

    var cs = new CSInterface()
    setting_file_name = path.join(DesignTools_dir, "setting.txt")

    if (!fs.existsSync(setting_file_name)) {
        alert('mk_setting_file()')
    }

    setting_file_name = add_single_quotes(setting_file_name)

    cs.evalScript("openData(" + setting_file_name + ")");

}


// 通过名称删除图层(name：名称中包含的文字)
var delete_layers_by_name_js = function (name) {
    var comfirm_text = "确定要删除所有名字包含：【" + name + "】的图层吗？"

    var comfirm = window.confirm(comfirm_text)
    if (comfirm) {
        var cs = new CSInterface()
        cs.evalScript("delete_layers_by_name(" + add_single_quotes(name) + ")")
    }
}

// 创建元素
var create_element = function (type, create_info, target_id) {
    var create_list = create_info.split("\n")
    for (i = 0; i < create_list.length; i++) {
        var info_list = create_list[i].split(',')
        var ele = document.createElement(type)
        ele.type = "button"
        ele.value = info_list[3]
        ele.className = "default_btn normal_btn_size"
        // 添加个自定义属性，下面onclick要用
        ele.btn_index = i
        // ele.onclick = eval("new_file_js(" + info_list[0].toString() + "," + info_list[1].toString() + "," + info_list[2].toString() + "," + info_list[3].toString()+")")
        ele.onclick = function () {
            // 通过自定义的btn_index来获取对应的参数(width、height等)
            var info_list = create_list[this.btn_index].split(',')
            new_file_js(info_list[0], info_list[1], info_list[2], info_list[3], info_list[4])
        }
        var target_ele = document.getElementById(target_id)
        target_ele.appendChild(ele)
    }

}
// 导出图片
var create_export_element = function (type, export_info, target_id) {

    // export_info 长这样：0,80\n790,80\n750,80\n800,80,PIXELS
    var export_list = export_info.split("\n")
    for (i = 0; i < export_list.length; i++) {
        var img_info_list = export_list[i].split(",")
        var ele = document.createElement(type)
        ele.type = "button"
        if (img_info_list[0] == 0) {
            if (img_info_list[3] != undefined) {
                ele.value = "原尺寸" + " [" + img_info_list[1] + ", " + img_info_list[3].toLowerCase().replace("e", "") + "]"
            } else {
                ele.value = img_info_list[0] + " [" + img_info_list[1] + ", jpg]"
            }
        } else {
            if (img_info_list[3] != undefined) {
                ele.value = img_info_list[0] + " [" + img_info_list[1] + ", " + img_info_list[3].toLowerCase().replace("e", "") + "]"
            } else {
                ele.value = img_info_list[0] + " [" + img_info_list[1] + ", jpg]"
            }
        }
        ele.className = "default_btn export_btn_size"
        // 添加个自定义属性，下面onclick要用
        ele.img_size = img_info_list[0]
        ele.img_quality = img_info_list[1]
        ele.img_units = img_info_list[2]
        ele.img_type = img_info_list[3]
        // }
        ele.onclick = function () {
            // 通过自定义的btn_index来获取对应的参数(width、height等)
            export_img_js(this.img_size, this.img_quality, this.img_units, this.img_type, "single")
        }
        var target_ele = document.getElementById(target_id)
        target_ele.appendChild(ele)
    }

}

// 创建 font_size 元素
var create_font_size_element = function (type, create_info, target_id) {
    var font_size_list = create_info.split("\n")
    for (i = 0; i < font_size_list.length; i++) {
        var size = font_size_list[i]
        var ele = document.createElement(type)
        ele.type = "button"
        ele.value = size
        ele.className = "default_btn normal_btn_size"
        ele.onclick = function () {
            set_font_size_js(this.value)
        }
        var target_ele = document.getElementById(target_id)
        target_ele.appendChild(ele)
    }

}


// 创建 font 元素
var create_font_element = function (type, create_info, target_id) {
    var font_list = create_info.split("\n")
    for (i = 0; i < font_list.length; i++) {
        var font_info_list = font_list[i].split(",")
        var ele = document.createElement(type)
        ele.type = "button"
        ele.value = font_info_list[1]
        ele.font_name = font_info_list[0]
        ele.className = "default_btn normal_btn_size"

        ele.onclick = function () {
            set_font_js(this.font_name)
        }
        var target_ele = document.getElementById(target_id)
        target_ele.appendChild(ele)
    }

}
/***********************************
 ***********************************
 * 常用
 ***********************************
 ***********************************/


/***********************************
 * 新建
 ***********************************/
// 修改创建信息的文件
var change_create_info = function () {
    var info = fs.readFileSync(create_info_file)
    var ele_div = document.getElementById("modify_create_info")
    ele_div.style.display = "block"
    // var ele_info = ele_div.childNodes[1]
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    ele_info.value = info
}
// 重置
var reset_create_info = function () {

    var is_confirm = confirm("确定要重置创建文件列表吗？")
    if (is_confirm) {
        fs.writeFileSync(create_info_file, "800,800,72,主图\n790,1300,72,电脑详情页\n750,1300,72,手机详情页\n1920,700,72,电脑首页,PIXELS\n210,297,300,A4,毫米")
        location.reload()
    }
}
var confirm_change_create_info = function () {
    var ele_div = document.getElementById("modify_create_info")
    ele_div.style.display = "none"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    var info = ele_info.value

    fs.writeFileSync(create_info_file, info)
    location.reload()

}

var cancel_change_create_info = function () {
    var ele_div = document.getElementById("modify_create_info")
    ele_div.style.display = "none"
}


// 字体大小 - start
// 修改 font_size 的文件
var change_font_size_info = function () {
    var info = fs.readFileSync(font_size_info_file)
    var ele_div = document.getElementById("modify_font_size_info")
    ele_div.style.display = "block"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    ele_info.value = info
}
// 重置
var reset_font_size_info = function () {
    var is_confirm = confirm("确定要重置字体大小列表吗？")
    if (is_confirm) {
        fs.writeFileSync(font_size_info_file, "20\n25\n30\n35\n40\n45\n50")
        location.reload()
    }
}
var confirm_change_font_size_info = function () {
    var ele_div = document.getElementById("modify_font_size_info")
    ele_div.style.display = "none"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    var info = ele_info.value

    fs.writeFileSync(font_size_info_file, info)
    location.reload()

}

var cancel_change_font_size_info = function () {
    var ele_div = document.getElementById("modify_font_size_info")
    ele_div.style.display = "none"
}
// 字体大小 - end

// 修改字体 - strat
// 修改 font_size 的文件
var change_font_info = function () {
    var info = fs.readFileSync(font_info_file)
    var ele_div = document.getElementById("modify_font_info")
    ele_div.style.display = "block"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    ele_info.value = info
}
// 重置
var reset_font_info = function () {
    var is_confirm = confirm("确定要重置字体列表吗？")
    if (is_confirm) {
        fs.writeFileSync(font_info_file, "SourceHanSansCN-Heavy,思黑H\nSourceHanSansCN-Bold,思黑B\nSourceHanSansCN-Regular,思黑R\nSourceHanSansCN-Normal,思黑N")
        location.reload()
    }
}
var confirm_change_font_info = function () {
    var ele_div = document.getElementById("modify_font_info")
    ele_div.style.display = "none"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    var info = ele_info.value

    fs.writeFileSync(font_info_file, info)
    location.reload()

}

var cancel_change_font_info = function () {
    var ele_div = document.getElementById("modify_font_info")
    ele_div.style.display = "none"
}

var get_font_name_js = function () {
    var cs = new CSInterface()
    cs.evalScript("get_font_name()")
}

// 修改字体 - end 


// 新建文件
var new_file_js = function (width, height, ppi, name, units) {
    width = parseInt(width)
    height = parseInt(height)
    ppi = parseInt(ppi)

    // 字符串要加上单引号或者双引号
    name = add_single_quotes(name)
    var funG = "new_file (" + width + "," + height + "," + ppi + "," + name + "," + add_single_quotes(units) + ")";
    var cs = new CSInterface()
    cs.evalScript(funG);
}

// 从剪贴板新建文件
var new_file_from_clipboard_js = function () {
    var cs = new CSInterface()
    cs.evalScript("new_file_from_clipboard()")
}


var create_text_layer_js = function (font, type) {

    // 获取当前选中的radio的value
    var align = ""
    var attitude = document.getElementsByName("text_align");
    for (var i = 0; i < attitude.length; i++) {
        if (attitude[i].checked == true) {
            align = attitude[i].value;
        }
    }
    var cs = new CSInterface()
    cs.evalScript("create_text_layer(" + add_single_quotes(font) + "," + add_single_quotes(type) + "," + add_single_quotes(align) + ")")
}
/***********************************
 * 参考线
 ***********************************/

//自由参考线
var free_guide_line_js = function (position) {
    var cs = new CSInterface();
    position = add_single_quotes(position)
    cs.evalScript("free_guide_line(" + position + ")");
}

var clear_all_guides_js = function () {
    var cs = new CSInterface()
    cs.evalScript("clear_all_guides()")
}


//清除所有参考线
var clearRef_js = function () {
    var cs = new CSInterface();
    cs.evalScript("clearRef()");
}

// 刷新列表
var get_exit_guides_js = function () {

    var cs = new CSInterface();

    // 添加事件监听
    cs.addEventListener(event_prefix + "get_exit_guides_ready",
        function (Event) {
            // alert(Event.type +" : " + Event.data);
            refresh_guides_list(Event.data)
        }
    );

    cs.evalScript("get_exit_guides(" + add_single_quotes(temp_file) + ")");


    // 刷新参考线列表
    var refresh_guides_list = function (guides_data) {
        // var all_guides = fs.readFileSync(temp_file).toString()
        var all_guides = guides_data
        var guides_list = all_guides.split("-#-")

        // 获取select
        var obj = document.getElementById('guides_list');
        // 清空select里面的所有option
        obj.options.length = 0

        for (i = 0; i < guides_list.length; i++) {
            var single_guides_list = guides_list[i].split("$")
            // alert(single_guides_list[0])
            // alert(single_guides_list[1])
            var option = document.createElement("option")
            option.value = single_guides_list[1]
            option.innerHTML = single_guides_list[0]

            obj.appendChild(option)
            // //添加一个选项
            // obj.options.add(new Option(single_guides_list[0], single_guides_list[1])); //这个兼容IE与firefox
        }

    }
}

// 选项改变的时候
var change_guides = function () {
    //获取选中项的value值
    var myselect = document.getElementById("guides_list");
    var index = myselect.selectedIndex;
    var optionValue = myselect.options[index].value;
    var cs = new CSInterface()
}
// 清空并应用当前参考线
var clear_and_use_current_guides_js = function () {
    var myselect = document.getElementById("guides_list");
    var index = myselect.selectedIndex;
    var guides_info = myselect.options[index].value;
    var cs = new CSInterface()

    // 清空所有参考线
    cs.evalScript("clear_all_guides()");
    // 应用当前参考线
    cs.evalScript("use_current_guides(" + add_single_quotes(guides_info) + ")")
}
// 应用当前参考线
var use_current_guides_js = function () {
    var myselect = document.getElementById("guides_list");
    var index = myselect.selectedIndex;
    var guides_info = myselect.options[index].value;
    var cs = new CSInterface()
    cs.evalScript("use_current_guides(" + add_single_quotes(guides_info) + ")")
}
// 保存参考线
var save_guides_js = function () {
    var cs = new CSInterface()
    // 保存完毕之后刷新列表
    cs.addEventListener(event_prefix + "save_guides_ready", function (event) {
        get_exit_guides_js()
    })

    var guide_name = window.prompt("输入名称...", "default")
    if (guide_name != null) {
        guide_name = add_single_quotes(guide_name)
        cs.evalScript("save_guides(" + guide_name + ")");
    }
}

// 选择文本框内的文本
var selectAllText_js = function (id) {
    document.getElementById(id).select()

}
/***********************************
 * 阵列
 ***********************************/

//阵列
var free_array_js = function (direction) {
    var quantity = document.getElementById("quantity").value
    var moveDistance = document.getElementById("moveDistance").value

    direction = add_single_quotes(direction)

    var funG = "free_array (" + direction + "," + String(quantity) + "," + String(moveDistance) + ")";
    var cs = new CSInterface()
    cs.evalScript(funG);
}



//阵列
var iteam_array_js = function () {
    //获取用户填写的值
    var rowNum = document.getElementById("rowNum").value
    var rowInterval = document.getElementById("rowInterval").value
    var colNum = document.getElementById("colNum").value
    var colInterval = document.getElementById("colInterval").value

    //传递参数到jsx文件中的 iteam_array 函数      
    var fun = "iteam_array (" + String(rowNum - 1) + "," + String(rowInterval) + "," + String(colNum - 1) + "," + String(colInterval) + ")"

    var cs = new CSInterface();
    cs.evalScript(fun);

}

// 撤销
var undo_iteam_array_js = function () {

    var rowInterval = document.getElementById("rowNum").value;
    var colInterval = document.getElementById("colNum").value;
    var cs = new CSInterface()
    var funG = "undo_iteam_array (" + String(rowInterval) + "," + String(colInterval) + ")";
    var cs = new CSInterface()

    cs.evalScript(funG);
}

// 重置
var resetValue_js = function () {
    document.getElementById("rowNum").value = 2
    document.getElementById("rowInterval").value = 5
    document.getElementById("colNum").value = 2
    document.getElementById("colInterval").value = 5
}

// 说明
var readme_js = function () {
    alert("不要随便按撤销按钮！")
}



/***********************************
 ***********************************
 * 配色
 ***********************************
 ***********************************/

//  获取颜色列表
var get_color_schemes_list_js = function () {


    var cs = new CSInterface();

    cs.addEventListener(event_prefix + "color_schemes_list_ready", function (event) {
        refresh_color_schemes_list(event.data)
    })

    cs.evalScript("get_color_schemes_list(" + add_single_quotes(temp_file) + ")");

    var refresh_color_schemes_list = function (all_color_schemes) {
        var color_schemes_list = all_color_schemes.split("-#-")

        // 获取select
        var obj = document.getElementById('color_schemes_list');
        // 清空select里面的所有option
        obj.options.length = 0

        for (i = 0; i < color_schemes_list.length; i++) {
            var single_color_schemes_list = color_schemes_list[i].split("$")
            var option = document.createElement("option")
            option.value = single_color_schemes_list[1]
            option.innerHTML = single_color_schemes_list[0]

            obj.appendChild(option)
        }
    }
}

// 打开配色文件
var open_color_schemes_psd_js = function () {
    var cs = new CSInterface()
    cs.evalScript("open_color_schemes_psd(" + add_single_quotes(color_schemes_psd_file) + ")")

}

// 插入文件
var insert_file_js = function () {
    var cs = new CSInterface()
    cs.evalScript("insert_file(" + add_single_quotes(color_schemes_psd_file) + ")")

}

// 载入当前配色方案
var use_current_color_schemes_js = function () {
    var myselect = document.getElementById("color_schemes_list");
    var index = myselect.selectedIndex;
    var color_schemes_info = myselect.options[index].value;

    // 更改当前显示的方案名
    document.getElementById("current_color_schemes_name").innerText = "当前方案：" + myselect.options[index].innerText

    // 单个长这样：C01@@rgb(127, 255, 212)
    var color_schemes_list = color_schemes_info.split("###")

    var div_list = document.getElementsByClassName("color_row")
    for (i = 0; i < div_list.length; i++) {
        single_color_info_list = color_schemes_list[i].split("@")
        if (div_list[i].getElementsByClassName("color_name")[0].innerText == single_color_info_list[0]) {
            div_list[i].getElementsByClassName("color_remark")[0].value = single_color_info_list[1]
            div_list[i].getElementsByClassName("show_color")[0].style.backgroundColor = single_color_info_list[2]
        }
    }

}

// 取色(从图层获取颜色：只支持文字图层)
var get_color_js = function (dom) {

    var cs = new CSInterface();
    var temp_file_name = path.join(DesignTools_dir, 'temp.txt')
    var t = temp_file_name
    temp_file_name = add_single_quotes(temp_file_name)

    cs.addEventListener(event_prefix + "get_color_ready", function (event) {
        get_color(event.data)
    })

    cs.evalScript("get_color(" + temp_file_name + ")")
    var get_color = function (rgb_text) {
        var rgb_list = rgb_text.toString().split(',')
        var temp_rgb = "rgb(" + parseInt(rgb_list[0]) + "," + parseInt(rgb_list[1]) + "," + parseInt(rgb_list[2]) + ")"

        // 找出父集的所有子集
        var sib_list = dom.parentNode.children

        // 从子集中找class为 show_color的元素，并获取颜色值
        for (i = 0; i < sib_list.length; i++) {
            // 
            if (sib_list[i].className == "show_color") {

                // 设置颜色
                sib_list[i].style.backgroundColor = temp_rgb;
            }
        }
    }
}
// 设置图层的颜色
var set_color_js = function (dom) {
    // dom是button
    var bg_color
    var color_name

    // 找出父集的所有子集
    var sib_list = dom.parentNode.children

    // 从子集中找class为 show_color的元素，并获取颜色值
    for (i = 0; i < sib_list.length; i++) {
        // 
        if (sib_list[i].className == "show_color") {

            // 获取颜色
            bg_color = window.getComputedStyle(sib_list[i], null).backgroundColor;


            // 设置颜色
            // sib_list[i].style.backgroundColor = bg_color

        }
        if (sib_list[i].className == "color_name") {
            color_name = sib_list[i].innerText
        }
    }

    var cs = new CSInterface();
    bg_color = add_single_quotes(bg_color)
    color_name = add_single_quotes(color_name)
    cs.evalScript("set_color(" + bg_color + "," + color_name + ")")
}

// 取消设置颜色
var unset_color_js = function (dom) {
    var cs = new CSInterface();
    cs.evalScript("unset_color()")

}
// 保存到图层
var save_color_schemes_js = function (dom) {
    // 配色方案
    var color_schemes = ''
    var bg_color
    var color_name
    var color_remark

    var div_list = document.getElementsByClassName("color_row")
    for (i = 0; i < div_list.length; i++) {
        color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
        color_remark = div_list[i].getElementsByClassName("color_remark")[0].value

        bg_color = window.getComputedStyle(div_list[i].getElementsByClassName("show_color")[0], null).backgroundColor
        color_schemes += color_name + "@" + color_remark + "@" + bg_color + "###"
    }


    var cs = new CSInterface()

    // 配色方案名称
    var layer_name = window.prompt("请输入配色方案的名称", "default")
    if (layer_name != null) {
        layer_name = add_single_quotes(layer_name)

        color_schemes = add_single_quotes(color_schemes)
        cs.evalScript("save_color_schemes(" + color_schemes + "," + layer_name + ")")
    }
}

// 更新图层的配色方案
var update_layer_color_schemes_js = function (dom) {
    // 配色方案
    var color_schemes = ''
    var bg_color
    var color_name
    var color_remark

    var div_list = document.getElementsByClassName("color_row")
    for (i = 0; i < div_list.length; i++) {
        color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
        color_remark = div_list[i].getElementsByClassName("color_remark")[0].value

        bg_color = window.getComputedStyle(div_list[i].getElementsByClassName("show_color")[0], null).backgroundColor
        color_schemes += color_name + "@" + color_remark + "@" + bg_color + "###"
    }


    var cs = new CSInterface()

    color_schemes = add_single_quotes(color_schemes)
    cs.evalScript("update_layer_color_schemes(" + color_schemes + ")")
}

// 从图层获取配色方案
var get_color_schemes_js = function () {

    var cs = new CSInterface()
    cs.addEventListener(event_prefix + "get_color_schemes_ready", function (event) {
        get_color_schemes(event.data)
    })

    cs.evalScript("get_color_schemes()")

    // data：rgb_text，图层名称
    var get_color_schemes = function (data) {
        var data_list = data.split("$$")
        var rgb_text = data_list[0]
        var rgb_list = rgb_text.toString().split('###')

        var div_list = document.getElementsByClassName("color_row")
        for (i = 0; i < div_list.length; i++) {
            color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
            for (j = 0; j < rgb_list.length; j++) {
                var color_row_list = rgb_list[i].split('@')
                if (color_name == color_row_list[0]) {
                    div_list[i].getElementsByClassName("color_remark")[0].value = color_row_list[1]
                    div_list[i].getElementsByClassName("show_color")[0].style.backgroundColor = color_row_list[2]
                }
            }
        }
        // 更改当前显示的方案名
        document.getElementById("current_color_schemes_name").innerText = "当前方案：" + data_list[1].split("-")[1]

    }
}

// 获取前景色
var get_foregroundColor_js = function (dom) {
    var cs = new CSInterface()
    cs.addEventListener(event_prefix + "get_foregroundColor_ready", function (event) {
        var color = event.data
        dom.style.backgroundColor = color
    })
    cs.evalScript("get_foregroundColor(" + add_single_quotes(temp_file) + ")")
}

var load_default_color_schemes_js = function () {
    var rgb_text = fs.readFileSync(path.join(DesignTools_dir, "default_color_schemes.txt"))
    // rgb_text = default_color_schemes

    var rgb_list = rgb_text.toString().split('###')

    var div_list = document.getElementsByClassName("color_row")
    for (i = 0; i < div_list.length; i++) {
        color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
        for (j = 0; j < rgb_list.length; j++) {
            var color_row_list = rgb_list[i].split('@')
            if (color_name == color_row_list[0]) {
                div_list[i].getElementsByClassName("color_remark")[0].value = color_row_list[1]
                div_list[i].getElementsByClassName("show_color")[0].style.backgroundColor = color_row_list[2]
            }
        }
    }
    // 更改当前显示的方案名
    document.getElementById("current_color_schemes_name").innerText = "当前方案：默认方案"

}


// 存为默认配色方案
var update_default_color_schemes_js = function () {

    var is_comfirm = window.confirm("确定要保存为默认配色方案吗？")
    if (is_comfirm) {
        // 配色方案
        var color_schemes = ''
        var bg_color
        var color_name
        var color_remark

        var div_list = document.getElementsByClassName("color_row")
        for (i = 0; i < div_list.length; i++) {
            color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
            color_remark = div_list[i].getElementsByClassName("color_remark")[0].value

            bg_color = window.getComputedStyle(div_list[i].getElementsByClassName("show_color")[0], null).backgroundColor
            color_schemes += color_name + "@" + color_remark + "@" + bg_color + "###"
        }
        fs.writeFileSync(path.join(DesignTools_dir, "default_color_schemes.txt"), color_schemes)
    }
}

// 更新所有图层
var update_all_layer_js = function () {
    // 配色方案
    var color_schemes = ''
    var bg_color
    var color_name
    var color_remark

    var div_list = document.getElementsByClassName("color_row")
    for (i = 0; i < div_list.length; i++) {
        color_name = div_list[i].getElementsByClassName("color_name")[0].innerText
        color_remark = div_list[i].getElementsByClassName("color_remark")[0].value

        bg_color = window.getComputedStyle(div_list[i].getElementsByClassName("show_color")[0], null).backgroundColor
        color_schemes += color_name + "$" + color_remark + "$" + bg_color + "###"
    }

    color_schemes = add_single_quotes(color_schemes)
    var cs = new CSInterface()
    cs.evalScript("update_all_layer(" + color_schemes + ")")

}

var change_color_schemes = function () {
    use_current_color_schemes_js()
}
/***********************************
 ***********************************
 * 其他
 ***********************************
 ***********************************/

var align_item_js = function (position) {
    var cs = new CSInterface()
    position = add_single_quotes(position)
    cs.evalScript("align_item(" + position + ")")
}

// 打散文字
var split_text_js = function () {
    var is_confirm = window.confirm("文字较多的情况下，需要的时间比较长且不能中断，确定要执行吗？")
    if (is_confirm) {
        var cs = new CSInterface()
        cs.evalScript("split_text()")
    }
}

// 设置字体
var set_font_js = function (font) {
    var cs = new CSInterface()
    cs.evalScript("set_font(" + add_single_quotes(font) + ")")
}

var set_font_size_js = function (size) {
    var cs = new CSInterface()
    cs.evalScript("set_font_size(" + String(size) + ")")
}

var test_js = function () {
    var div = document.createElement("div")
    div.innerHTML = "测试"
    div.className = "default_btn normal_btn_size"
    document.getElementById("create_panel").appendChild(div)
}


// 设置参考图层
var set_reference_layer_js = function (lay) {

    var label_text = ""
    if (lay == "doc") {
        label_text = "参考对象：当前文档"
    } else if (lay == "active_lay") {
        label_text = "参考对象：图层"
    } else if (lay == "current_selection") {
        label_text = "参考对象：选区"
    }

    document.getElementById("reference_info").innerText = label_text

    lay = add_single_quotes(lay)

    var cs = new CSInterface()
    cs.evalScript("set_reference_layer(" + lay + ")")
}


var resize_layer_js = function (type) {

    // 获取当前选中的radio的value
    var direction = ""
    var attitude = document.getElementsByName("w_or_h");
    for (var i = 0; i < attitude.length; i++) {
        if (attitude[i].checked == true) {
            direction = attitude[i].value;
        }
    }

    var is_reverse = document.getElementById("is_reverse").checked
    var is_proportionally = document.getElementById("is_proportionally").checked

    var cs = new CSInterface()
    cs.evalScript("resize_layer(" + add_single_quotes(type) + "," + add_single_quotes(direction) + "," + add_single_quotes(is_reverse) + "," + add_single_quotes(is_proportionally) + ")")
}

// 改变导出图片的信息
var change_export_info_js = function () {
    var info = fs.readFileSync(export_info_file)
    var ele_div = document.getElementById("modify_export_info")
    ele_div.style.display = "block"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    ele_info.value = info
}
// 重置导出图片大小列表
var reset_export_info_js = function () {
    var is_confirm = confirm("确定要重置导出图片大小列表吗？")
    if (is_confirm) {
        fs.writeFileSync(export_info_file, "0,80,,JPEG\n0,100,,JPEG\n750,80,,JPEG\n800,80,PIXELS,PNG")
        location.reload()
    }
}
var confirm_change_export_info = function () {
    var ele_div = document.getElementById("modify_export_info")
    ele_div.style.display = "none"
    var ele_info = ele_div.getElementsByTagName("textarea")[0]
    // var ele_info = ele_div.childNodes[1]
    var info = ele_info.value

    fs.writeFileSync(export_info_file, info)
    location.reload()
    switch_panel("other_btn")
}

var cancel_change_export_info = function () {
    var ele_div = document.getElementById("modify_export_info")
    ele_div.style.display = "none"
}


// 导出图片(img_size：宽度)
var export_img_js = function (img_size, quality, units, type, mode) {
    var cs = new CSInterface()
    cs.evalScript("export_img(" + String(img_size) + "," + String(quality) + "," + add_single_quotes(units) + "," + add_single_quotes(type) + "," + add_single_quotes(mode) + ")")
}
// 导出原尺寸
// var export_source_img_size_js = function () {
//     var cs = new CSInterface()
//     // cs.evalScript("export_source_img_size()")
//     img_size = 0
//     cs.evalScript("export_img(" + String(img_size) + "," + String(quality) + ")")
// }
var open_export_folder_js = function () {
    var cs = new CSInterface()
    cs.evalScript("open_export_folder()")
}
// 导出所有格式
var export_all_img_size_js = function () {
    var img_info_list = fs.readFileSync(export_info_file).toString().split('\n')
    for (i = 0; i < img_info_list.length; i++) {
        var img_info = img_info_list[i].split(",")
        var mode = "all"
        if (i == img_info_list.length - 1) {
            mode = "all_end"
        }
        export_img_js(img_info[0], img_info[1], img_info[2], img_info[3], mode)
    }
}
// 打开用户配置文件夹
var open_user_data_folder_js = function () {

    var exec = require('child_process').exec;
    exec('explorer.exe ' + DesignTools_dir)
}


// 替换文本
var replace_text_js = function () {

    var is_confirm = confirm("最好先保存一下文件哈，要继续执行吗？")
    if (is_confirm) {
        var oldText = document.getElementById("oldText").value;
        var newText = document.getElementById("newText").value;
        oldText = "'" + oldText + "'"
        newText = "'" + newText + "'"
        var fun = "replace_text(" + String(oldText) + "," + String(newText) + ")"
        var cs = new CSInterface();
        cs.evalScript(fun);
    }

}

// 在文本框内，按enter执行 replace_text_js
var excute_replace_text_js = function (event) {

    var e = event || window.event || arguments.callee.caller.arguments[0];

    //功能：  ；按键：ctrl+enter
    if (e && e.keyCode == 13) {
        replace_text_js()
    }
}

var exchang_text = function () {
    var oldText = document.getElementById("oldText").value;
    var newText = document.getElementById("newText").value;
    var temp = oldText;
    document.getElementById("oldText").value = String(newText);
    document.getElementById("newText").value = String(oldText);
}

var clear_text = function () {
    document.getElementById("oldText").value = "";
    document.getElementById("newText").value = "";
}

var readme = function () {
    readmetxt = "\
    1.用于批量替换psd上面的文本。\n\
    2.替换动作难以撤销，请谨慎操作！\n\
    ——假如替换了20个图层，就要撤销20步才能恢复。\n\
           "
    alert(readmetxt)
}

// 备份当前文件
var backup_current_file_js = function () {
    var cs = new CSInterface()
    cs.evalScript("backup_current_file()")

}
var open_backup_folder_js = function () {
    var cs = new CSInterface()
    cs.evalScript("open_backup_folder()")
}


var load_user_color_schemes_list_js = function () {
    var cs = new CSInterface()
    cs.evalScript("load_user_color_schemes_list(" + add_single_quotes(color_schemes_psd_file) + ")")
}

var do_action_js = function () {
    var cs = new CSInterface()
    cs.evalScript("do_action(" + add_single_quotes(DesignTools_dir) + ")")
}

/***********************************
 ***********************************
 * 后期
 ***********************************
 ***********************************/

//  新建中性灰图层
var new_neutral_gray_layer_js = function () {
    var cs = new CSInterface()
    cs.evalScript("new_neutral_gray_layer()")

}