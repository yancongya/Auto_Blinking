# 🎆 Auto Blinking - AE表达式自动闪烁控制器

[![AE Version](https://img.shields.io/badge/After%20Effects-2023%2B-blue)](https://www.adobe.com/products/aftereffects.html)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

👉 专为After Effects设计的自动闪烁控制系统，通过智能表达式实现粒子/元素的随机闪烁动画效果

## 🚀 快速开始
1. 选中目标合成和图层
2. 运行脚本自动创建控制器
3. 通过滑块实时调节参数
4. 表达式自动应用至选中图层

## 🎛️ 控制器功能
| 控件类型 | 名称 | 默认值 | 功能说明 |
|---------|------|-------|---------|
| 🔘 滑块 | 种子控制 | - | 通过位置变化改变随机模式 |
| 🎚️ 滑块 | 每颗星间隔 | 0.5 | 元素间动画间隔（0-1范围） |
| ⏩ 滑块 | 闪烁频率 | 1 | 每秒闪烁次数（整数） |
| 🔍 滑块 | 放大倍数 | 1 | 缩放幅度倍数 |
| 🌟 滑块 | 随机幅度 | 5 | 位置随机变化强度 |
| 🌀 滑块 | 旋转速度 | 360 | 每秒旋转度数 |
| ✅ 复选框 | 位置随机 | 开启 | 启用/禁用位置随机 |
| ✅ 复选框 | 旋转 | 开启 | 启用/禁用自动旋转 |

## 💻 使用示例
```javascript
// 典型参数设置
try {
    effect("放大倍数").setValue(1.5);
    effect("旋转速度").setValue(180);
} catch(e) {
    $.writeln("参数设置错误: " + e);
}
```

## 🛠 技术特性
- 🧩 智能表达式系统
- ⚡ 实时参数响应
- 🔄 非破坏性动画
- 📊 可视化参数控制

## 📌 注意事项
1. 需保持Controller层存在
2. 建议在应用表达式前保存工程
3. 旋转速度参数需配合复选框使用

## 🔗 相关资源
- [表达式开发文档](https://ae-expressions.docs)
- [AE脚本开发指南](https://aescripts.com/learn/)
```
