
/***********************************
 * 通用
***********************************/
// 图片的导出目录
var export_folder = "undefined"

// 获取当前时间，格式："2021年3月13日3-23-20"
var get_time_now = function () {
    var date_now = new Date();

    var YY = date_now.getFullYear();    //获取当前年份(2位)
    var MM = date_now.getMonth();       //获取当前月份(0-11,0代表1月)
    var DD = date_now.getDate();        //获取当前日(1-31)

    var hh = date_now.getHours();       //获取当前小时数(0-23)
    var mm = date_now.getMinutes();     //获取当前分钟数(0-59)
    var ss = date_now.getSeconds();     //获取当前秒数(0-59)
    var mydate = YY + "年" + (MM + 1) + "月" + DD + "日" + hh + "_" + mm + "_" + ss
    return mydate
}

// 发送事件
var send_event = function (type, data) {
    /*
     在 ExtendScript 端，由于 ExtendScript 默认没有支持事件处理，
     需要手动载入一个库：new ExternalObject("lib:\PlugPlugExternalObject") ，
     载入后就可以通过创建 CSXSEvent() 对象来创建并发送事件了
    */
    try {
        var loadSuccess = new ExternalObject("lib:\PlugPlugExternalObject"); //载入所需对象，loadSuccess 记录是否成功载入
    } catch (e) {
        alert(e);// 如果载入失败，输出错误信息
    }

    // 发送事件
    if (loadSuccess) {
        var eventJAX = new CSXSEvent(); //创建事件对象
        // eventJAX.type = "com.nullice.event.test2"; //设定一个类型名称
        eventJAX.type = "com.neo.designTool." + type; //设定一个类型名称
        eventJAX.data = data; // 事件要传递的信息
        eventJAX.dispatch(); // GO ! 发送事件
    }
}


// 通过名称删除图层(name：名称中包含的文字)
var delete_layers_by_name = function (name) {

    // 记录当前选择的图层及其可见性，做完下面的操作之后，再恢复(因为下面的操作会改变选择的图层)
    var source_active_layer = app.activeDocument.activeLayer
    var source_active_layer_visible = source_active_layer.visible

    var count = 0

    var layers = app.activeDocument.layers

    for (var i = 0, len = layers.length; i < len; i++) {

        var lay = layers[i - count]
        var name_list = lay.name.split("-")
        if (name_list[2] == name) {
            lay.remove()
            count++
        }
    }

    app.activeDocument.activeLayer = source_active_layer
    source_active_layer.visible = source_active_layer_visible
}

// 参考图层的尺寸
// [width,height]
var reference_layer_size_list
// 参考图层
var reference_layer

// 获取尺寸
var get_layer_size = function (lay) {
    //获取边界点
    // var bnd = app.activeDocument.activeLayer.bounds
    var bnd = lay.bounds
    LTX = bnd[0] //左上x
    LTY = bnd[1] //左上y
    RBX = bnd[2] //右下x
    RBY = bnd[3] //右下y
    var width = RBX - LTX
    var height = RBY - LTY
    var size_list = []
    size_list.push(width)
    size_list.push(height)
    return size_list
}

/***********************************
 * 新建
***********************************/
var parse_text = function (text) {

    temp_list = text.split(',')
    temp_dict = {}
    for (i = 0; i < temp_list.length; i++) {
        temp = temp_list[i].split(':')
        temp_dict[temp[0]] = temp[1]
    }
    return temp_dict
}


var openData = function (file_name) {
    var file = new File(file_name);
    file.open("r", "TEXT", "????");

    dict = parse_text(file.read())
    // alert(dict.find("name"))
    // alert(dict.tostring())
    for (var key in dict) {
        alert(key + ":" + dict[key]);
    }

    file.close()
}

// 新建文件
var new_file = function (width, height, ppi, name, units) {

    // 记录单位
    // var originalUnit = app.preferences.rulerUnits

    // 切换单位，默认为PIXELS
    switch (units) {
        case "厘米":
            app.preferences.rulerUnits = Units.CM
            break;
        case "英寸":
            app.preferences.rulerUnits = Units.INCHES
            break;
        case "毫米":
            app.preferences.rulerUnits = Units.MM
            break;
        case "派卡":
            app.preferences.rulerUnits = Units.PICAS
            break;
        case "像素":
            app.preferences.rulerUnits = Units.PIXELS
            break;
        case "CM":
            app.preferences.rulerUnits = Units.CM
            break;
        case "INCHES":
            app.preferences.rulerUnits = Units.INCHES
            break;
        case "MM":
            app.preferences.rulerUnits = Units.MM
            break;
        case "PICAS":
            app.preferences.rulerUnits = Units.PICAS
            break;
        case "PIXELS":
            app.preferences.rulerUnits = Units.PIXELS
            break;
        default:
            app.preferences.rulerUnits = Units.PIXELS
            break
    }
    // 创建文件
    app.documents.add(width, height, ppi, name)
    // alert(app.preferences.rulerUnits)
    // 单位设置回原来的
    // app.preferences.rulerUnits = originalUnit
}

// 文字内部的对齐方式
// 值：Left、Cntr、Rght
var text_align = function (align) {
    var idsetd = charIDToTypeID("setd");
    var desc3325 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref227 = new ActionReference();
    var idPrpr = charIDToTypeID("Prpr");
    var idparagraphStyle = stringIDToTypeID("paragraphStyle");
    ref227.putProperty(idPrpr, idparagraphStyle);
    var idTxLr = charIDToTypeID("TxLr");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref227.putEnumerated(idTxLr, idOrdn, idTrgt);
    desc3325.putReference(idnull, ref227);
    var idT = charIDToTypeID("T   ");
    var desc3326 = new ActionDescriptor();
    var idtextOverrideFeatureName = stringIDToTypeID("textOverrideFeatureName");
    desc3326.putInteger(idtextOverrideFeatureName, 808464433);
    var idAlgn = charIDToTypeID("Algn");
    var idAlg = charIDToTypeID("Alg ");
    var idCntr = charIDToTypeID(align);
    desc3326.putEnumerated(idAlgn, idAlg, idCntr);
    var idparagraphStyle = stringIDToTypeID("paragraphStyle");
    desc3325.putObject(idT, idparagraphStyle, desc3326);
    executeAction(idsetd, desc3325, DialogModes.NO);
}

// 创建文字图层
var create_text_layer = function (font, type, align) {

    // 记录单位
    var originalUnit = app.preferences.rulerUnits
    // 单位设置成像素
    app.preferences.rulerUnits = Units.PIXELS

    // Create a new art layer containing text
    var doc = app.activeDocument

    // 活动图层的y位置
    var active_lay_BY = doc.activeLayer.bounds[3]

    // 添加图层
    var artLayerRef = doc.artLayers.add()
    artLayerRef.kind = LayerKind.TEXT

    text_align(align)
    // Set the contents of the text layer.
    var textItemRef = artLayerRef.textItem

    set_reference_layer("doc")

    switch (type) {
        case "title":
            textItemRef.contents = "眼里有光 心中有梦"
            resize_layer("golden_section", "width", "false", "true")
            break;
        case "subtitle":
            textItemRef.contents = "把目标降低一次之后，就会越来越低的。"
            // 文字间距
            textItemRef.tracking = 35
            resize_layer("golden_section", "width", "false", "true")
            break;
        case "paragraph":

            // 段落文本
            textItemRef.kind = TextType.PARAGRAPHTEXT
            // 宽度
            textItemRef.width = reference_layer_size_list[0] * 0.8
            // 高度
            textItemRef.height = 50
            // 字体大小
            textItemRef.size = 20

            // 行距
            textItemRef.autoLeadingAmount = 150

            // textItemRef.leading = 165
            // 文字间距
            textItemRef.tracking = 35

            textItemRef.contents = "知道吗？每一个对手都是值得尊敬的，无论他比你强还是比你弱，你都应该尊重人家，因为比你强的值得你学习，比你弱的值得你关怀。"
            break;

        default:
            break;
    }

    textItemRef.font = font
    textItemRef.color = solidColor(52, 52, 52)


    var new_lay = app.activeDocument.activeLayer

    if (active_lay_BY != doc.height) {
        // 新建的文字的左上角的y移动到 文档的y的0位置
        new_lay.translate(0, -new_lay.bounds[1])
        // 新建的文字的左上角的y移动到 当前图层的y的位置
        new_lay.translate(0, active_lay_BY + get_layer_size(new_lay)[1] * 0.618 * 0.618)
    }
    align_item("center")

    // 单位设置回原来的
    app.preferences.rulerUnits = originalUnit

}

// 从剪贴板新建文件
var new_file_from_clipboard = function () {
    var originalUnit = app.preferences.rulerUnits
    app.preferences.rulerUnits = Units.PIXELS
    // Create a new 990*1500 inch document and assign it to a variable
    var docRef = app.documents.add(800, 800, 72)
    // Create a new art layer containing text

    try {
        var lay = docRef.paste(false)

        lay_size = get_layer_size(lay)
        docRef.resizeCanvas(lay_size[0], lay_size[1])

        align_item("center")
    } catch (err) {
        docRef.close()
    }
    // Restore original ruler unit setting
    app.preferences.rulerUnits = originalUnit
}
/***********************************
 * 阵列
***********************************/

//自由阵列
var free_array = function (direction, quantity, moveDistance) {
    //记录原始的标尺单位
    var originalUnit = preferences.rulerUnits;
    //设定要使用的标尺单位
    preferences.rulerUnits = Units.PIXELS;

    //获取边界点
    var bnd = app.activeDocument.activeLayer.bounds
    LTX = bnd[0] //左上x
    LTY = bnd[1] //左上y
    RBX = bnd[2] //右下x
    RBY = bnd[3] //右下y
    var sourceLayer = app.activeDocument.activeLayer
    var sourceName = sourceLayer.name
    switch (direction) {
        case 'TL':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer
                // sourceLayer.duplicate(sourceLayer,ElementPlacement.PLACEAFTER)
                if (quantity == 0) {
                    sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                    sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                        sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                    }
                }
            }
            break;

        case 'TM':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer

                if (quantity == 0) {
                    sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                    }
                }
            }
            break;
        case 'TR':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer
                if (quantity == 0) {
                    sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                    sourceLayer.translate(RBX - LTX + moveDistance, 0)
                } else {
                    if (i != 0) {

                        sourceLayer.duplicate()
                        sourceLayer.translate(0, -(RBY - LTY) - moveDistance)
                        sourceLayer.translate(RBX - LTX + moveDistance, 0)
                    }
                }
            }
            break;


        case 'ML':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer

                if (quantity == 0) {
                    sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                    }
                }
            }
            break;

        case 'MR':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer
                if (quantity == 0) {
                    sourceLayer.translate(RBX - LTX + moveDistance, 0)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(RBX - LTX + moveDistance, 0)
                    }
                }
            }
            break;
        case 'BL':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer

                if (quantity == 0) {
                    sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                    sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                        sourceLayer.translate(-(RBX - LTX) - moveDistance, 0)
                    }
                }
            }
            break;
        case 'BM':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer
                if (quantity == 0) {
                    sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                    }
                }
            }
            break;
        case 'BR':
            for (i = 0; i <= quantity; i++) {
                var sourceLayer = app.activeDocument.activeLayer
                if (quantity == 0) {
                    sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                    sourceLayer.translate(RBX - LTX + moveDistance, 0)
                } else {
                    if (i != 0) {
                        sourceLayer.duplicate()
                        sourceLayer.translate(0, (RBY - LTY) + moveDistance)
                        sourceLayer.translate(RBX - LTX + moveDistance, 0)
                    }
                }
            }
            break;

        default:
            break;
    }
}


// 阵列
var iteam_array = function (rowNum, rowInterval, colNum, colInterval) {
    //记录原始的标尺单位
    var originalUnit = preferences.rulerUnits;
    //设定要使用的标尺单位
    preferences.rulerUnits = Units.PIXELS;

    //获取边界点
    var bnd = app.activeDocument.activeLayer.bounds
    LTX = bnd[0] //左上x
    LTY = bnd[1] //左上y
    RBX = bnd[2] //右下x
    RBY = bnd[3] //右下y
    var sourceLayer = app.activeDocument.activeLayer

    var sourceName = sourceLayer.name


    for (x = 0; x < colNum + 1; x++) {
        var sourceLayer = app.activeDocument.activeLayer

        for (i = 0; i < rowNum; i++) {
            var sourceLayer = app.activeDocument.activeLayer
            sourceLayer.duplicate()
            var t = RBX - LTX + rowInterval
            if (x % 2 == 0) {
                n = t
            } else {
                n = -t
            }
            sourceLayer.translate(n, 0)
        }
        if (x == colNum) {
            var abc = 1
        }
        else {
            sourceLayer.duplicate()
            sourceLayer.translate(0, RBY - LTY + colInterval)
        }
    }

}

// 撤销
var undo_iteam_array = function (rowNum, colNum) {
    var x = ((rowNum * colNum) - 1) * 2 + 1
    var doc = app.activeDocument;
    doc.activeHistoryState = doc.historyStates[doc.historyStates.length - x];
}


/***********************************
 * 参考线
***********************************/

//自由参考线模块
var free_guide_line = function (position) {
    //记录原始的标尺单位
    var originalUnit = preferences.rulerUnits;
    //设定要使用的标尺单位
    preferences.rulerUnits = Units.PIXELS;
    //修改图层名称，为了创建了参考线，但是需要撤回的时候不影响到原来的步骤
    var sourceLayer = app.activeDocument.activeLayer
    var sourceName = sourceLayer.name
    sourceLayer.name = sourceName + " "
    sourceLayer.name = sourceName

    //获取边界点
    var bnd = app.activeDocument.activeLayer.bounds
    LTX = bnd[0] //左上x
    LTY = bnd[1] //左上y
    RBX = bnd[2] //右下x
    RBY = bnd[3] //右下y

    switch (position) {

        case "HT":
            app.activeDocument.guides.add(Direction.HORIZONTAL, LTY)
            break;
        case "HM":
            app.activeDocument.guides.add(Direction.HORIZONTAL, (RBY - LTY) / 2 + LTY)//水平中间
            break;
        case "HB":
            app.activeDocument.guides.add(Direction.HORIZONTAL, RBY)
            break;

        case "VL":
            app.activeDocument.guides.add(Direction.VERTICAL, LTX)
            break;
        case "VM":
            app.activeDocument.guides.add(Direction.VERTICAL, (RBX - LTX) / 2 + LTX)//垂直中间   
            break;
        case "VR":

            app.activeDocument.guides.add(Direction.VERTICAL, RBX)
            break;


        case "VMHM":
            app.activeDocument.guides.add(Direction.HORIZONTAL, (RBY - LTY) / 2 + LTY)//水平中间
            app.activeDocument.guides.add(Direction.VERTICAL, (RBX - LTX) / 2 + LTX)//垂直中间         
            break;

        case "SIDE":
            app.activeDocument.guides.add(Direction.HORIZONTAL, LTY)//上
            app.activeDocument.guides.add(Direction.HORIZONTAL, RBY)//下
            app.activeDocument.guides.add(Direction.VERTICAL, LTX)//左
            app.activeDocument.guides.add(Direction.VERTICAL, RBX)//右
            break;

        case "VLHT":
            app.activeDocument.guides.add(Direction.HORIZONTAL, LTY)//上
            app.activeDocument.guides.add(Direction.VERTICAL, LTX)//左
            break;

        case "VLHB":
            app.activeDocument.guides.add(Direction.HORIZONTAL, RBY)
            app.activeDocument.guides.add(Direction.VERTICAL, LTX)
            break;

        case "VRHT":
            app.activeDocument.guides.add(Direction.HORIZONTAL, LTY)
            app.activeDocument.guides.add(Direction.VERTICAL, RBX)
            break;

        case "VRHB":
            app.activeDocument.guides.add(Direction.HORIZONTAL, RBY)
            app.activeDocument.guides.add(Direction.VERTICAL, RBX)
            break;


        case "RMCL":
            app.activeDocument.guides.add(Direction.HORIZONTAL, (RBY - LTY) / 2 + LTY)//水平中间
            app.activeDocument.guides.add(Direction.VERTICAL, LTX)
            break;

        case "VMHT":
            app.activeDocument.guides.add(Direction.HORIZONTAL, LTY)
            app.activeDocument.guides.add(Direction.VERTICAL, (RBX - LTX) / 2 + LTX)//垂直中间
            break;

    }
    preferences.rulerUnits = originalUnit;
}


//清除所有参考线
var clear_all_guides = function () {
    var idclearAllGuides = stringIDToTypeID("clearAllGuides");
    executeAction(idclearAllGuides, undefined, DialogModes.NO);
}

// 保存参考线
var save_guides = function (guide_name) {

    // 记录当前选择的图层及其可见性，做完下面的操作之后，再恢复(因为下面的操作会改变选择的图层)
    var source_active_layer = app.activeDocument.activeLayer
    var source_active_layer_visible = source_active_layer.visible

    // 新建文字图层
    var artLayerRef = app.activeDocument.artLayers.add()
    artLayerRef.kind = LayerKind.TEXT

    // 新建图层组 并把配色方案图层移入
    var lay_group
    try {
        lay_group = app.activeDocument.layerSets.getByName("参考线组-guides_groups-DesignTools");

    } catch (err) {
        var temp = app.activeDocument.layerSets.add("参考线组-guides_groups-DesignTools");
        temp.name = "参考线组-guides_groups-DesignTools"
        lay_group = temp

        // 移动到背景层上面
        lay_group.move(app.activeDocument.layers[app.activeDocument.layers.length - 2], ElementPlacement.PLACEAFTER)
        lay_group.visible = false
    }
    artLayerRef.move(lay_group, ElementPlacement.INSIDE)
    artLayerRef.visible = false



    var timestamp = Date.parse(new Date());
    // s3x1TVg7：参考线图层的标识
    artLayerRef.name = '参考线-' + guide_name + '-s3x1TVg7' + '-' + 'guides-' + timestamp
    var textItemRef = artLayerRef.textItem

    // 获取所有参考线的信息
    var all_text = ''
    var guides_list = app.activeDocument.guides
    for (i = 0; i < guides_list.length; i++) {
        all_text += guides_list[i].direction + "," + guides_list[i].coordinate + '#'
    }
    textItemRef.contents = all_text
    textItemRef.size = 1


    app.activeDocument.activeLayer = source_active_layer
    source_active_layer.visible = source_active_layer_visible

    send_event("save_guides_ready", "参考线保存完毕！")
}


// 刷新参考线列表
var get_exit_guides = function (temp_file) {
    // 所有参考线信息 用 -#- 符号隔开
    var all_guides = ''
    try {
        // 获取参考线图层组里面的所有图层
        var layer_list = app.activeDocument.layerSets.getByName("参考线组-guides_groups-DesignTools").artLayers
        for (i = 0; i < layer_list.length; i++) {
            var name_list = layer_list[i].name.split('-')
            if (name_list[2] == 's3x1TVg7') {
                all_guides += name_list[1] + "$" + layer_list[i].textItem.contents + "-#-"
            }
        }
        all_guides = all_guides.slice(0, all_guides.length - 3)

        // write_to_temp_file(temp_file, all_guides)

        // 发送事件
        send_event("get_exit_guides_ready", all_guides)

    } catch (err) {
        send_event("get_exit_guides_ready", "无参考线组$none")
    }
}



// 应用当前选中的参考线组
var use_current_guides = function (guides_info) {
    var guide_list = guides_info.split("#")
    for (i = 0; i < guide_list.length; i++) {
        var guide = guide_list[i].split(",")
        app.activeDocument.guides.add(eval(guide[0]), guide[1])
    }

}


// 获取颜色列表
var get_color_schemes_list = function (temp_file) {

    // 所有参考线信息 用 -#- 符号隔开
    var color_schemes = ''
    try {
        // 获取参考线图层组里面的所有图层
        var layer_list = app.activeDocument.layerSets.getByName("配色方案-color_schemes-DesignTools").artLayers
        for (i = 0; i < layer_list.length; i++) {
            var name_list = layer_list[i].name.split('-')
            if (name_list[3] == 'color_schemes') {
                color_schemes += name_list[1] + "$" + layer_list[i].textItem.contents + "-#-"
            }
        }
        color_schemes = color_schemes.slice(0, color_schemes.length - 3)

        send_event("color_schemes_list_ready", color_schemes)
        // write_to_temp_file(temp_file, color_schemes)

    } catch (err) {
        send_event("color_schemes_list_ready", "无配色方案$none")
        // write_to_temp_file(temp_file, "无配色方案$none")
    }
}

// 获取前景色
var get_foregroundColor = function (temp_file) {
    // 记录前景色
    var f_color = app.foregroundColor.rgb
    var color = ''
    color = "rgb(" + parseInt(f_color.red.toString()) + "," + parseInt(f_color.green.toString()) + "," + parseInt(f_color.blue.toString()) + ")"
    send_event("get_foregroundColor_ready", color)
    // write_to_temp_file(temp_file, color)


}

// // 载入当前配色方案
// var use_current_color_schemes = function(color_schemes_info){
//     var color_list = color_schemes_info.split("#")
//     for (i = 0; i < color_list.length; i++) {
//         var guide = color_list[i].split(",")
//         app.activeDocument.guides.add(eval(guide[0]), guide[1])
//     }
// }

// 打开配色方案psd文件
var open_color_schemes_psd = function (psd_path) {
    app.open(new File(psd_path))

    // app.open("C:\\Program Files\\Adobe\\Adobe Photoshop CC 2017\\Required\\CEP\\extensions\\com.NeoCEP.DesignTools-1.0\\img\\color_schemes_file.psd",OpenDocumentType.PHOTOSHOP,false)
}

// 插入文件
var insert_file = function (file_path) {
    // 当前文件
    var current_doc = app.activeDocument
    // 打开要插入的文件
    var doc = app.open(new File(file_path));
    // 把doc的内容复制到current_doc
    var lay = doc.layers[0].duplicate(current_doc, ElementPlacement.PLACEATBEGINNING)
    // 关闭文件
    doc.close()
    align_item("center")
}

// 载入用户配色表
var load_user_color_schemes_list = function (color_schemes_psd_file) {
    // 当前文件
    var current_doc = app.activeDocument
    // 打开要插入的文件
    var doc = app.open(new File(color_schemes_psd_file));
    // 把doc的内容复制到current_doc
    var lay = doc.layers[0].duplicate(current_doc, ElementPlacement.PLACEATBEGINNING)
    // 关闭文件
    doc.close()
    // align_item("center")
}

// 新建颜色
var solidColor = function (R, G, B) {
    var mySolidColor = new SolidColor();

    mySolidColor.rgb.red = R;

    mySolidColor.rgb.green = G;

    mySolidColor.rgb.blue = B;

    return mySolidColor
}

var write_to_temp_file = function (temp_file, data) {

    //定义一个变量[fileOut]，表示硬盘上某个路径的文件。通道的文本信息将写入到这个文件。
    var fileOut = new File(temp_file);

    // 不加这句的话，读取的时候中文可能会乱码
    fileOut.encoding = 'UTF-8'

    //设置文件的操作模式为写入模式。
    fileOut.open("w", "TEXT", "????");

    fileOut.write(data);

    //文件写入成功后，关闭文件的输入流。
    fileOut.close();
}

// 通过颜色选择器设置前景色并且将rgb的值保存到临时文件
var get_color = function (temp_file_name) {

    var lay = app.activeDocument.activeLayer

    var temp_color = ''

    if (lay.kind == LayerKind.TEXT) {
        //获取文本图层
        var text_content = lay.textItem
        temp_color = text_content.color.rgb.red + "," + text_content.color.rgb.green + "," + text_content.color.rgb.blue
    }
    send_event("get_color_ready", temp_color)
}

var set_color = function (color, color_name) {
    var originalUnit = app.preferences.rulerUnits
    app.preferences.rulerUnits = Units.PIXELS

    // color处理成r,g,b三个变量
    color = color.replace("rgb(", "").replace(")", "")
    var rgb = color.split(",")
    var r = rgb[0]
    var g = rgb[1]
    var b = rgb[2]

    var lay = app.activeDocument.activeLayer

    if (lay.kind == LayerKind.TEXT) {

        //获取文本图层
        var text_content = lay.textItem
        text_content.color = solidColor(r, g, b)

        // 改图层名称
        lay.name = lay.name.split("-#-")[0] + "-#-DesignTools-color-#-" + color_name


    }
    else if (lay.kind == LayerKind.SOLIDFILL) {

        var idsetd = charIDToTypeID("setd");
        var desc1547 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref157 = new ActionReference();
        var idcontentLayer = stringIDToTypeID("contentLayer");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref157.putEnumerated(idcontentLayer, idOrdn, idTrgt);
        desc1547.putReference(idnull, ref157);
        var idT = charIDToTypeID("T   ");
        var desc1548 = new ActionDescriptor();
        var idClr = charIDToTypeID("Clr ");
        var desc1549 = new ActionDescriptor();
        // 重点是这几行，设置颜色的，r、g、b都是自己设置的变量(其他代码是由 ScriptingListener 这个插件生成的)
        var idRd = charIDToTypeID("Rd  ");
        desc1549.putDouble(idRd, r);
        var idGrn = charIDToTypeID("Grn ");
        desc1549.putDouble(idGrn, g);
        var idBl = charIDToTypeID("Bl  ");
        desc1549.putDouble(idBl, b);
        var idRGBC = charIDToTypeID("RGBC");
        desc1548.putObject(idClr, idRGBC, desc1549);
        var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
        desc1547.putObject(idT, idsolidColorLayer, desc1548);
        executeAction(idsetd, desc1547, DialogModes.NO);

        // 改图层名称
        lay.name = lay.name.split("-#-")[0] + "-#-DesignTools-color-#-" + color_name

    }
    else if (lay.kind == LayerKind.NORMAL) {
        try {
            // 这行是用来测试当前是否有选区的，没有选区的话，就会执行 catch里面的内容
            app.activeDocument.selection.bounds
            app.activeDocument.selection.fill(solidColor(r, g, b))
            // app.activeDocument.selection.fill(solidColor(r, g, b), ColorBlendMode.NORMAL, 100, true)
        } catch (error) {

            // select_visible_pixels()
            // 锁定透明像素
            lay.transparentPixelsLocked = true

            app.activeDocument.selection.selectAll()
            // app.activeDocument.selection.fill(solidColor(r, g, b))
            // fill的参数不填满的话，会弹出 填充 的弹框
            app.activeDocument.selection.fill(solidColor(r, g, b), ColorBlendMode.NORMAL, 100, true)
            app.activeDocument.selection.deselect()
            // 取消锁定透明像素
            lay.transparentPixelsLocked = false

            // app.activeDocument.selection.selectAll()
            // app.activeDocument.selection.fill(solidColor(r, g, b))
            // app.activeDocument.selection.deselect()

        }

        // 改图层名称
        lay.name = lay.name.split("-#-")[0] + "-#-DesignTools-color-#-" + color_name
    }
    // else {
    //     continue
    // }
    app.preferences.rulerUnits = originalUnit
    // app.preferences.typeUnits = originalTypeUnits
}


// 取消关联颜色方案
var unset_color = function () {
    var lay = app.activeDocument.activeLayer
    lay.name = lay.name.split("-#-")[0]
}

// 保存配色方案到图层
var save_color_schemes = function (color_schemes, layer_name) {

    // 记录当前选择的图层及其可见性，做完下面的操作之后，再恢复(因为下面的操作会改变选择的图层)
    var source_active_layer = app.activeDocument.activeLayer
    var source_active_layer_visible = source_active_layer.visible

    // 新建文字图层
    var artLayerRef = app.activeDocument.artLayers.add()
    artLayerRef.kind = LayerKind.TEXT
    artLayerRef.visible = false
    var timestamp = Date.parse(new Date());
    artLayerRef.name = "配色方案-" + layer_name + '-DesignTools-' + 'color_schemes-' + timestamp
    var textItemRef = artLayerRef.textItem

    textItemRef.contents = color_schemes
    textItemRef.size = 1

    // 新建图层组 并把配色方案图层移入
    var lay_group
    try {
        lay_group = app.activeDocument.layerSets.getByName("配色方案-color_schemes-DesignTools");

    } catch (err) {
        var temp = app.activeDocument.layerSets.add("配色方案-color_schemes-DesignTools");
        temp.name = "配色方案-color_schemes-DesignTools"
        lay_group = temp

        // var lay_list = app.activeDocument.artLayers
        // lay_group.move(lay_lists[lay_list.length - 3],ElementPlacement.PLACEAFTER)

        // 移动到背景层上面
        lay_group.move(app.activeDocument.layers[app.activeDocument.layers.length - 2], ElementPlacement.PLACEAFTER)
        lay_group.visible = false
    }
    artLayerRef.move(lay_group, ElementPlacement.INSIDE)

    app.activeDocument.activeLayer = source_active_layer
    source_active_layer.visible = source_active_layer_visible
}

// 从图层获取配色方案
var update_layer_color_schemes = function (color_schemes, layer_name) {


}

// 从图层获取配色方案
var get_color_schemes = function () {

    var lay = app.activeDocument.activeLayer

    var temp_color_schemes = ''

    if (lay.kind == LayerKind.TEXT) {
        //获取文本图层
        var text_content = lay.textItem
        temp_color_schemes = text_content.contents

    }

    send_event("get_color_schemes_ready", temp_color_schemes + "$$" + lay.name)
}

var deal_color_schemes = function (color_schemes) {
    var color_list = []
    var temp_color_row = color_schemes.split("###")
    for (i = 0; i < temp_color_row.length; i++) {
        var temp = temp_color_row[i].split("$")
        color_list.push(temp)
    }
    return color_list
}

// 选择可见像素
var select_visible_pixels = function () {

    var bounds = app.activeDocument.activeLayer.bounds

    var LTX = parseInt(bounds[0]) //左上x
    var LTY = parseInt(bounds[1])  //左上y
    var RBX = parseInt(bounds[2])  //右下x
    var RBY = parseInt(bounds[3])  //右下y
    var LT = [LTX, LTY]
    var RT = [RBX, LTY]
    var LB = [LTX, RBY]
    var RB = [RBX, RBY]

    app.activeDocument.selection.select([LT, LB, RB, RT])
}

var update_all_layer = function (color_schemes) {


    // 颜色列表
    var color_list = deal_color_schemes(color_schemes)

    var rgb_list = []

    // 记录当前选择的图层及其可见性，做完下面的操作之后，再恢复(因为下面的操作会改变选择的图层)
    var source_active_layer = app.activeDocument.activeLayer
    var source_active_layer_visible = source_active_layer.visible


    var update_color = function (layers) {
        for (var i = 0, len = layers.length; i < len; i++) {
            if (layers[i].typename == "LayerSet") {
                update_color(layers[i].layers);
            }
            else {
                //得到文本图层 
                var txt = layers[i]
                var name_list = txt.name.split("-#-")
                if (name_list[1] == "DesignTools-color") {
                    // alert(name_list[2])
                    ;

                    for (j = 0; j < color_list.length; j++) {
                        if (color_list[j][0] == name_list[2]) {
                            // 把rgb(45, 185, 206) 转换成 [45,185,206]
                            rgb_list = color_list[j][2].replace('rgb(', '').replace(')', '').split(',')
                            // alert(rgb_list)
                            var r = rgb_list[0]
                            var g = rgb_list[1]
                            var b = rgb_list[2]

                            if (layers[i].kind == LayerKind.TEXT) {

                                var is_visible = layers[i].visible

                                layers[i].textItem.color = solidColor(r, g, b)

                                layers[i].visible = is_visible
                            }
                            else if (layers[i].kind == LayerKind.SOLIDFILL) {
                                // alert("SOLIDFILL")
                                var is_visible = layers[i].visible

                                app.activeDocument.activeLayer = layers[i]

                                var idsetd = charIDToTypeID("setd");
                                var desc2036 = new ActionDescriptor();
                                var idnull = charIDToTypeID("null");
                                var ref150 = new ActionReference();
                                var idcontentLayer = stringIDToTypeID("contentLayer");
                                var idOrdn = charIDToTypeID("Ordn");
                                var idTrgt = charIDToTypeID("Trgt");
                                ref150.putEnumerated(idcontentLayer, idOrdn, idTrgt);
                                desc2036.putReference(idnull, ref150);
                                var idT = charIDToTypeID("T   ");
                                var desc2037 = new ActionDescriptor();
                                var idFlCn = charIDToTypeID("FlCn");
                                var desc2038 = new ActionDescriptor();
                                var idClr = charIDToTypeID("Clr ");
                                var desc2039 = new ActionDescriptor();
                                var idRd = charIDToTypeID("Rd  ");
                                desc2039.putDouble(idRd, r);
                                var idGrn = charIDToTypeID("Grn ");
                                desc2039.putDouble(idGrn, g);
                                var idBl = charIDToTypeID("Bl  ");
                                desc2039.putDouble(idBl, b);
                                var idRGBC = charIDToTypeID("RGBC");
                                desc2038.putObject(idClr, idRGBC, desc2039);
                                var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
                                desc2037.putObject(idFlCn, idsolidColorLayer, desc2038);
                                var idstrokeStyle = stringIDToTypeID("strokeStyle");
                                var desc2040 = new ActionDescriptor();
                                var idstrokeStyleVersion = stringIDToTypeID("strokeStyleVersion");
                                desc2040.putInteger(idstrokeStyleVersion, 2);
                                var idfillEnabled = stringIDToTypeID("fillEnabled");
                                desc2040.putBoolean(idfillEnabled, true);
                                var idstrokeStyle = stringIDToTypeID("strokeStyle");
                                desc2037.putObject(idstrokeStyle, idstrokeStyle, desc2040);
                                var idshapeStyle = stringIDToTypeID("shapeStyle");
                                desc2036.putObject(idT, idshapeStyle, desc2037);
                                executeAction(idsetd, desc2036, DialogModes.NO);

                                layers[i].visible = is_visible
                            }
                            else if (layers[i].kind == LayerKind.NORMAL) {
                                var is_visible = layers[i].visible
                                // alert("NORMAL")
                                // alert(layers[i].name)
                                app.activeDocument.activeLayer = layers[i]
                                try {

                                    // 锁定透明像素
                                    layers[i].transparentPixelsLocked = true

                                    // 锁定透明像素之后填充会弹出填充弹框，可以直接点确定，因为填充的不是弹框那里选的颜色，而是设计面板里面的颜色
                                    // app.activeDocument.selection.bounds
                                    app.activeDocument.selection.selectAll()
                                    // select_visible_pixels()
                                    app.activeDocument.selection.fill(solidColor(r, g, b), ColorBlendMode.NORMAL, 100, true)
                                    app.activeDocument.selection.deselect()

                                    // 锁定透明像素
                                    layers[i].transparentPixelsLocked = false
                                } catch (error) {

                                    app.activeDocument.selection.selectAll()
                                    app.activeDocument.selection.fill(solidColor(r, g, b), ColorBlendMode.NORMAL, 100, true)
                                    // app.activeDocument.selection.fill(solidColor(r, g, b))
                                    app.activeDocument.selection.deselect()

                                }

                                layers[i].visible = is_visible
                            }
                        }


                    }
                }

            }
        }

    }

    update_color(app.activeDocument.layers);

    app.activeDocument.activeLayer = source_active_layer
    source_active_layer.visible = source_active_layer_visible

}


/***********************************
 ***********************************
 * 其他
 ***********************************
 ***********************************/
var align_item = function (position) {
    //记录原始的标尺单位
    var originalUnit = app.preferences.rulerUnits;
    //设定要使用的标尺单位
    app.preferences.rulerUnits = Units.PIXELS;

    //获取边界点
    var bnd = app.activeDocument.activeLayer.bounds
    LTX = bnd[0] //左上x
    LTY = bnd[1] //左上y
    RBX = bnd[2] //右下x
    RBY = bnd[3] //右下

    var doc = app.activeDocument
    var source_layer = doc.activeLayer

    switch (position) {
        case "left":
            source_layer.translate(-LTX, 0)
            // source_layer.translate(doc.width / 2, 0)
            break;
        case "center":
            source_layer.translate(-(LTX + RBX) / 2, 0)
            source_layer.translate(doc.width / 2, 0)
            break;
        case "right":
            source_layer.translate(doc.width - RBX, 0)
            // source_layer.translate(doc.width / 2, 0)
            break;
        case "symmetry":
            source_layer.translate(doc.width - RBX, 0)
            source_layer.translate(-reference_layer.bounds[0], 0)
            break;
    }

    app.preferences.rulerUnits = originalUnit
}

// 打散文字
var split_text = function () {
    var source_layer = app.activeDocument.activeLayer

    // var size = source_layer.textItem.font.size

    var source_text = source_layer.textItem.contents
    var text_list = source_text.split("")
    // 反转数组————让打散后文字从上到下排列
    // text_list = text_list.reverse()

    // 新建组，用来存放打散后的文字
    var temp = app.activeDocument.layerSets.add(source_text);
    temp.name = source_text
    lay_group = temp

    // 移动到背景层上面
    lay_group.move(source_layer, ElementPlacement.PLACEAFTER)

    // 移动的距离
    var move_distance = 0
    for (i = 0; i < text_list.length; i++) {

        var artLayerRef = source_layer.duplicate(source_layer, ElementPlacement.PLACEAFTER);
        artLayerRef.name = text_list[i]

        artLayerRef.textItem.contents = text_list[i].toString()

        // 根据【第一个字】的宽度来移动图层
        if (i == 0) {
            move_distance = get_layer_size(artLayerRef)[0]
        }
        // move_distance += get_layer_size(artLayerRef)[0]
        artLayerRef.translate(move_distance * i, 0)


        artLayerRef.move(lay_group, ElementPlacement.INSIDE)
        //artLayerRef.textItem.size = size
    }

}

// 设置字体
var set_font = function (font) {
    app.activeDocument.activeLayer.textItem.font = font

}

// 获取字体名称
var get_font_name = function () {
    var active_lay = app.activeDocument.activeLayer
    if (active_lay.kind == LayerKind.TEXT) {
        var font = active_lay.textItem.font
        prompt("当前图层的字体名称为：", String(font))
    } else {
        alert("当前所选的图层不是文字图层。")
    }

}

var set_font_size = function (size) {
    app.activeDocument.activeLayer.textItem.size = size
}


// 设置参考图层
var set_reference_layer = function (layer) {
    switch (layer) {
        case "doc":
            doc = app.activeDocument
            reference_layer = doc
            reference_layer_size_list = []
            reference_layer_size_list.push(doc.width)
            reference_layer_size_list.push(doc.height)
            break;

        case "active_lay":
            var lay = app.activeDocument.activeLayer
            reference_layer = lay
            reference_layer_size_list = get_layer_size(lay)
            break;
        case "current_selection":
            var lay = app.activeDocument.selection
            reference_layer = lay
            reference_layer_size_list = get_layer_size(lay)
            break;

        default:
            break;
    }
}

// 图层缩放
var resize_layer = function (type, direction, is_reverse, is_proportionally) {
    // 当前图层
    var lay = app.activeDocument.activeLayer

    // 当前图层的尺寸
    var size_list = get_layer_size(lay)

    // 当前尺寸
    var current_size = ""
    // 最终的尺寸
    var final_size = ""
    // 缩放的百分比
    var persent = 0
    // 参考尺寸
    var reference_layer_size

    // 比例
    var scale1 = 0
    // if (type == "golden_section") {
    //     scale1 = 0.618
    // }
    switch (type) {
        case "golden_section":
            scale1 = 0.618
            break;
        case "same":
            scale1 = 1
            break;
    }

    if (direction == "width") {
        current_size = size_list[0]
        reference_layer_size = reference_layer_size_list[0]
    } else {
        current_size = size_list[1]
        reference_layer_size = reference_layer_size_list[1]

    }

    if (is_reverse == "true") {
        final_size = reference_layer_size / scale1
    } else {
        final_size = reference_layer_size * scale1
    }

    // 计算百分比
    persent = final_size / current_size * 100

    // 向上取整,有小数就整数部分加1
    persent = Math.ceil(persent)

    // 缩放
    // lay.resize(persent, persent_height)
    if (is_proportionally == "true") {
        lay.resize(persent, persent)
    } else {
        if (direction == "width") {
            lay.resize(persent, 100)
        } else {
            lay.resize(100, persent)
        }

    }
}


var export_img = function (img_size, quality, units, type, mode) {

    var originalUnit = app.preferences.rulerUnits
    // app.preferences.rulerUnits = Units.PIXELS

    // alert(units =="")
    // 切换单位，默认为PIXELS
    switch (units) {
        case "厘米":
            app.preferences.rulerUnits = Units.CM
            break;
        case "英寸":
            app.preferences.rulerUnits = Units.INCHES
            break;
        case "毫米":
            app.preferences.rulerUnits = Units.MM
            break;
        case "派卡":
            app.preferences.rulerUnits = Units.PICAS
            break;
        case "像素":
            app.preferences.rulerUnits = Units.PIXELS
            break;
        case "CM":
            app.preferences.rulerUnits = Units.CM
            break;
        case "INCHES":
            app.preferences.rulerUnits = Units.INCHES
            break;
        case "MM":
            app.preferences.rulerUnits = Units.MM
            break;
        case "PICAS":
            app.preferences.rulerUnits = Units.PICAS
            break;
        case "PIXELS":
            app.preferences.rulerUnits = Units.PIXELS
            break;
        default:
            app.preferences.rulerUnits = Units.PIXELS
            break
    }

    //export different kind of  images
    function exp(img_width)//Change size and export
    {
        try {
            if(!activeDocument.saved){
                alert(123)

            }
            // 创建文件夹，存放导出的图片
            export_folder = new Folder(app.activeDocument.path + "/export")
            if (!export_folder.exists) {
                export_folder.create()
            }
            var img_name = ""
            if (img_size == 0) {
                img_name = "原尺寸"
            } else {
                var img_name = String(img_width)
            }

            var subfix = "jpg"

            //导出图片的设置，格式、图片质量之类的
            var expOpt = new ExportOptionsSaveForWeb();
            switch (type) {
                case "JPEG":
                    expOpt.format = SaveDocumentType.JPEG;
                    break;
                case "PNG8":
                    expOpt.format = SaveDocumentType.PNG;
                    expOpt.PNG8 = true;
                    expOpt.transparency = true;
                    subfix = "png"
                    break;
                case "PNG24":
                    expOpt.format = SaveDocumentType.PNG;
                    expOpt.PNG8 = false;
                    expOpt.transparency = true;
                    subfix = "png"
                    break;
                default:
                    // expOpt.format = SaveDocumentType.JPEG;
                    break;
            }

            // img_size 为 0 的时候，按原尺寸导出
            if (img_size != 0) {
                // 只指定高度或者宽度的话，就是等比缩放   
                app.activeDocument.resizeImage(img_width,);
            }


            expOpt.quality = quality;

            //路径参数不能直接给路径，要用  new file()语句来声明 
            var expPath = new File(export_folder.fullName + "/" + app.activeDocument.name.split(".", 1)[0] + "-" + img_name + "-" + String(quality) + "." + subfix);
            // alert(expPath)
            // alert(expOpt.format)

            app.activeDocument.exportDocument(expPath, ExportType.SAVEFORWEB, expOpt);

        } catch (error) {

            var doc = app.activeDocument;
            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
            alert(error)
            // alert("请先保存一次文件，脚本才能确定图片保存到哪里。")

        }

    }
    function undo()// 撤销1步，exp()函数改变的大小，这里撤销1步，让文档变回原来的状态。
    {
        var doc = app.activeDocument;
        doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
    }
    function tempText()//临时的中介。如果文档是刚打开或者已经执行过本程序一次的话，因为最后一步是小尺寸的，执行了大小设置，再返回一步之后，文档的大小会出问题。所以加了这个函数。
    {
        var docRef = app.activeDocument
        var artLayerRef = docRef.artLayers.add()
        artLayerRef.kind = LayerKind.TEXT
        artLayerRef.name = "正在导出中~~~"
        artLayerRef.visible = false
        // Set the contents of the text layer.
        var textItemRef = artLayerRef.textItem
        textItemRef.contents = " "
    }
    function main() {
        tempText()
        exp(img_size)
        var myLayer = app.activeDocument.layers.getByName("正在导出中~~~")
        myLayer.remove()

    }

    if (type == "JPEG") {
        // 合并所有图层，缩放的时候不用等那么久
        app.activeDocument.flatten()
    } else {
        // 包含透明像素的图片不能用 faltten()函数，不然透明的像素会变成不透明的白色像素
        // 下面用的是合并可见图层
        app.activeDocument.mergeVisibleLayers()
    }

    // 停止记录历史并执行main函数
    app.activeDocument.suspendHistory("Export_img", "main()");

    var doc = app.activeDocument;
    doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];

    app.preferences.rulerUnits = originalUnit

    if (mode == "single" || mode == "all_end") {
        alert("已导出！")
    }
}


// 打开导出的文件夹
var open_export_folder = function () {
    try {
        if (export_folder == "undefined") {
            export_folder = new Folder(app.activeDocument.path)
            export_folder.execute()
            export_folder = "undefined"
        } else {
            export_folder.execute()
        }
    } catch (error) {
        alert(error)
    }
}


// 替换文本

var replace_text = function (oldText, newText) {
    var replace_text_cc = function (layers, oldText, newText) {
        for (var i = 0, len = layers.length; i < len; i++) {
            if (layers[i].typename == "LayerSet") {
                replace_text_cc(layers[i].layers, oldText, newText);
            }
            else {
                if (layers[i].kind == LayerKind.TEXT) {
                    //得到文本图层 
                    var txtCt = layers[i].textItem.contents;
                    var reg = new RegExp(oldText, 'g')
                    t = txtCt.replace(reg, newText);
                    layers[i].textItem.contents = String(t);
                }
            }
        }

    }

    replace_text_cc(app.activeDocument.layers, oldText, newText);
}


// 备份的文件夹

// 备份当前文件
var backup_current_file = function () {
    try {
        // 创建文件夹，存放导出的图片
        var backup_folder = new Folder(app.activeDocument.path + "\\backup")

        if (!backup_folder.exists) {
            backup_folder.create()
        }

        // var timestamp = Date.parse(new Date());
        var backup_name = "backup-" + get_time_now()

        // 当前活动文档的名称列表：["详情页","psd"]
        var psd_name_list = app.activeDocument.name.split(".")

        // 文件要备份到的路径(包含文件名称) --- 这里是在活动文件所在的目录下创建名为backup的文件夹，然后把备份文件复制进去
        var backup_full_path = new File(backup_folder.fullName + "\\" + psd_name_list[0] + "-" + String(backup_name) + "." + psd_name_list[1]);

        // 当前活动文档
        var fill_obj = new File(app.activeDocument.fullName)
        // 复制当前活动文档到backup_path
        fill_obj.copy(backup_full_path)
        alert("备份完毕！")

    } catch (error) {
        alert(error)
    }

}

// 打开备份文件夹
var open_backup_folder = function () {
    try {
        // 创建文件夹，存放导出的图片
        var backup_folder = new Folder(app.activeDocument.path + "\\backup")
        if (backup_folder.exists) {
            backup_folder.execute()
        } else {
            alert("没有备份文件夹")
        }
    } catch (error) {
        alert(error)
    }
}


var do_action = function (cep_path) {
    var atn_path = cep_path + "\\atn\\Portrait.atn"
    alert(atn_path)

    app.doAction("主图正反打", "常用")
}


/***********************************
 ***********************************
 * 后期
 ***********************************
 ***********************************/
var new_neutral_gray_layer = function () {

    // Create a new art layer containing text
    var doc = app.activeDocument

    // 添加图层
    var artLayerRef = doc.artLayers.add()
    // 叠加模式--柔光
    artLayerRef.blendMode = BlendMode.SOFTLIGHT

    // 全选
    doc.selection.selectAll()
    doc.selection.fill(solidColor(128, 128, 128))
    doc.selection.deselect()
}