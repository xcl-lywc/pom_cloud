export default (_self, h) => {
  return [
    h("el-time-picker", {
      props: {
        value: _self.obj.value,  
        isRange: _self.obj.isRange,
      },
      attrs: {  
      },
      on: {
        "input": function(val) {   
          _self.obj.value = val;
          _self.$emit('handleChangeVal', val)
        }
      }
    })
  ];
};


export let timePickerConf = {
  // 对应数据库内类型
  type: 'timePicker',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '时间选择器',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: false,
  // 绑定的值
  value: new Date(),
  // 表单name
  name: '',  
  isRange: false,
  // 是否显示行内元素
  inlineBlock: false,
  //默认提示信息
  placeholder: '请选择', 
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
