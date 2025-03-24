/* 
   脚本说明：
   1. 为控制器(Controller)层添加四个滑块控制器：
       - 种子控制
       - 每颗星间隔多少（默认值 0.5，并附加 clamp(value, 0, 1) 表达式）
       - 每秒闪多少次（默认值 1，并附加 Math.floor(value) 表达式）
       - 放大倍数（默认值 1，通过Controller的Y轴高度控制）
   2. 对选中图层同时为缩放和不透明度属性添加表达式：
       - 缩放表达式根据放大倍数控制最大值
       - 不透明度表达式最大值固定为100
   3. 为控制器随机种子添加位置绑定表达式修改位置即可改变种子：
       - 种子控制的滑块表达式为 effect("种子控制")(1).value + transform.position[0]
   4. 为位置随机添加一个滑块控制器，并添加一个复选框控制器控制是否开启位置随机：
       - 为位置随机幅度添加滑块控制器，控制随机的幅度（通过Controller的X轴宽度控制）
   5. 为旋转添加一个滑块控制器，并添加一个复选框控制器控制是否开启旋转：
       - 为旋转速度添加滑块控制器，控制每秒旋转的速度
       - 修复了旋转表达式中的语法错误，确保开启旋转复选框能够正确控制旋转效果
*/

if (app.project.activeItem && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedLayers.length > 0) {
    var selectedLayers = app.project.activeItem.selectedLayers;
    // 为缩放添加表达式，并将不透明度绑定到缩放
    var expr = "var sl = thisComp.layer(\"Controller\").effect(\"种子控制\")(\"滑块\") * 1000;\n" +
               "seedRandom(sl, 1);\n" +
               "var off = thisComp.layer(\"Controller\").effect(\"每颗星间隔多少\")(\"滑块\") * 10;\n" +
               "var rd = Math.floor(random(0, off));\n" +
               "var n = thisComp.layer(\"Controller\").effect(\"放大倍数\")(\"滑块\");\n" +
               "var fre = thisComp.layer(\"Controller\").effect(\"每秒闪多少次\")(\"滑块\");\n" +
               "var phase = time * Math.PI * 2 * fre + index * rd;\n" +
               "var s = Math.sin(phase) * 100 * n;\n" +
               "var a = clamp(s, 0, 100 * n);\n" +
               "[a, a];";
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        layer.transform.scale.expression = expr;
        layer.transform.opacity.expression = "transform.scale[0];";
        
        // 添加位置随机表达式
        var posExpr = "var enable = thisComp.layer(\"Controller\").effect(\"开启位置随机\")(\"复选框\");\n" +
                     "if (!enable) value;\n" +
                     "else {\n" +
                     "  var sl = thisComp.layer(\"Controller\").effect(\"种子控制\")(\"滑块\") * 1000;\n" +
                     "  var amp = thisComp.layer(\"Controller\").effect(\"位置随机幅度\")(\"滑块\");\n" +
                     "  seedRandom(sl + index, true);\n" +
                     "  var w = sourceRectAtTime().width * amp;\n" +
                     "  var h = sourceRectAtTime().height * amp;\n" +
                     "  [value[0] + random(-w/2, w/2),\n" +
                     "   value[1] + random(-h/2, h/2)]\n" +
                     "}";
        layer.transform.position.expression = posExpr;
        
        // 添加旋转表达式
        var rotExpr = "var enable = thisComp.layer(\"Controller\").effect(\"开启旋转\")(\"复选框\");\n" +
                     "if (enable == 0) {\n" +
                     "  value;\n" +
                     "} else {\n" +
                     "  var speed = thisComp.layer(\"Controller\").effect(\"旋转速度\")(\"滑块\");\n" +
                     "  var sl = thisComp.layer(\"Controller\").effect(\"种子控制\")(\"滑块\") * 1000;\n" +
                     "  seedRandom(sl + index, true);\n" +
                     "  var direction = random(0, 1) > 0.5 ? 1 : -1;\n" +
                     "  var offset = random(0, 360);\n" +
                     "  value + time * speed * direction + offset;\n" +
                     "}";
        layer.transform.rotation.expression = rotExpr;
    }
}

// 创建控制器空对象并添加滑块控制器及其表达式
function createController() {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("请选中一个合成。");
        return;
    }
    
    app.beginUndoGroup("创建控制器并添加滑块控制器及表达式");
    
    // 检查是否已经存在名为"Controller"的空对象
    var existingController = null;
    for (var i = 1; i <= comp.layers.length; i++) {
        var layer = comp.layers[i];
        if (layer.name === "Controller" && layer instanceof AVLayer && layer.nullLayer) {
            existingController = layer;
            break;
        }
    }
    
    // 如果不存在，则创建一个新的空对象
    if (!existingController) {
        existingController = comp.layers.addNull();
        existingController.name = "Controller";
    }
    
    var effects = existingController.property("Effects");
    // 添加滑块名称（不包含开启位置随机）
    var sliderNames = ["种子控制", "每颗星间隔多少", "每秒闪多少次", "放大倍数", "位置随机幅度", "旋转速度"];
    
    // 添加滑块控制器
    for (var j = 0; j < sliderNames.length; j++) {
        var sliderName = sliderNames[j];
        var sliderEffect = effects.property(sliderName);
        if (!sliderEffect) {
            sliderEffect = effects.addProperty("ADBE Slider Control");
            sliderEffect.name = sliderName;
        }
    }
    
    // 添加复选框控制器
    var checkboxName = "开启位置随机";
    var checkboxEffect = effects.property(checkboxName);
    if (!checkboxEffect) {
        checkboxEffect = effects.addProperty("ADBE Checkbox Control");
        checkboxEffect.name = checkboxName;
    }
    // 在复选框控制器部分添加旋转控制
    var checkboxNames = ["开启位置随机", "开启旋转"];
    for (var i = 0; i < checkboxNames.length; i++) {
        var checkboxName = checkboxNames[i];
        var checkboxEffect = effects.property(checkboxName);
        if (!checkboxEffect) {
            checkboxEffect = effects.addProperty("ADBE Checkbox Control");
            checkboxEffect.name = checkboxName;
        }
    }
    // 修改默认值设置
    var defaultValues = {
        "每颗星间隔多少": 0.5,
        "每秒闪多少次": 1,
        "放大倍数": 1,
        "位置随机幅度": 5,
        "旋转速度": 360
    };
    
    // 设置滑块默认值
    for (var name in defaultValues) {
        var effect = effects.property(name);
        if (effect && effect.property("滑块")) {
            effect.property("滑块").setValue(defaultValues[name]);
        }
    }
    
    // 设置复选框默认值
    var checkboxNames = ["开启位置随机", "开启旋转"];
    for (var i = 0; i < checkboxNames.length; i++) {
        var checkboxName = checkboxNames[i];
        var checkboxEffect = effects.property(checkboxName);
        if (checkboxEffect && checkboxEffect.property("复选框")) {
            checkboxEffect.property("复选框").setValue(1); // 1表示选中，0表示未选中
        }
    }
    
    try {
        // 为"种子控制"添加位置绑定表达式
        var seedEffect = effects.property("种子控制");
        if (seedEffect && seedEffect.property("滑块")) {
            seedEffect.property("滑块").expression = "effect(\"种子控制\")(1).value + transform.position[0];";
        }
        
        // 为"位置随机幅度"添加缩放绑定表达式
        var ampEffect = effects.property("位置随机幅度");
        if (ampEffect && ampEffect.property("滑块")) {
            ampEffect.property("滑块").expression = "// 通过Controller的缩放宽度控制位置随机幅度\n" +
                                                  "var defaultValue = 5; // 默认值\n" +
                                                  "var scaleX = transform.scale[0] / 100; // 获取X轴缩放比例\n" +
                                                  "defaultValue * scaleX; // 根据缩放比例调整幅度值";
        }
        
        // 为"放大倍数"添加Y轴高度绑定表达式
        var scaleEffect = effects.property("放大倍数");
        if (scaleEffect && scaleEffect.property("滑块")) {
            scaleEffect.property("滑块").expression = "// 通过Controller的Y轴缩放高度控制放大倍数\n" +
                                                  "var defaultValue = 1; // 默认值\n" +
                                                  "var scaleY = transform.scale[1] / 100; // 获取Y轴缩放比例\n" +
                                                  "defaultValue * scaleY; // 根据Y轴缩放比例调整放大倍数";
        }
    } catch (e) {
        // 出错时仅输出日志，不弹出提示框
        $.writeln("设置表达式时出错：" + e.toString());
    }
    
    app.endUndoGroup();
    // 去掉成功后的弹窗提示
}

// 应用表达式到选中的图层缩放、位置和旋转属性
function applyExpressionToSelectedLayers() {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("请选中一个合成。");
        return;
    }
    
    if (comp.selectedLayers.length === 0) {
        alert("请选中至少一个图层。");
        return;
    }
    
    // 确保 Controller 已经存在
    var controller = null;
    for (var i = 1; i <= comp.layers.length; i++) {
        var layer = comp.layers[i];
        if (layer.name === "Controller" && layer instanceof AVLayer && layer.nullLayer) {
            controller = layer;
            break;
        }
    }
    
    if (!controller) {
        alert("未找到名为 'Controller' 的空对象。请先运行创建控制器的脚本。");
        return;
    }
    
    app.beginUndoGroup("应用表达式到选中的图层");
    
    // 如有其他自定义操作，可在此处添加代码
       
    app.endUndoGroup();
    // 去掉成功后的弹窗提示
}

// 调用创建控制器的函数
createController();

// 调用应用表达式到选中的图层
applyExpressionToSelectedLayers();