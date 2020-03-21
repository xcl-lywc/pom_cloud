export default (_self, h) => {
  return [
    h("el-color-picker", {
      props: { 
        value: _self.obj.value,    
      },
      attrs: {  
      },
      on: {
        "change": function(val) {   
          _self.obj.value = val;
          _self.$emit('handleChangeVal', val)
        }
      }
    })
  ];
};


export let colorPickerConf = {
  // 对应数据库内类型
  type: 'colorPicker',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '颜色选择器',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: false,
  // 绑定的值
  value: "#409EFF",
  // 表单name
  name: '',      
  // 是否显示行内元素
  inlineBlock: false, 
  // 验证错误提示信息
  ruleError: '必填',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true  
}
