export default (_self, h) => {
  return [
    h("el-date-picker", {
      props: {
        type: _self.obj.fotmatType,
        format: _self.obj.format,
        valueFormat: _self.obj.format,
        value: _self.obj.value, // 处理默认显示的,
      },  
      on: { 
        // 可省略此方法
        change: (val)=> { 
          _self.obj.value = val;
          _self.$emit('handleChangeVal', val)
        },  
        input(val){
          _self.obj.value = val;
        }
      }, 
    })
  ];
};


export let datePickerConf = {
  // 对应数据库内类型
  type: 'datePicker',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '日期选择器',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: false,
  // 绑定的值
  value: new Date(),
  // 表单name
  name: '',   
  // 显示类型
  format: 'yyyy-MM-dd',
  // 时间类型
  fotmatType: 'date',
  // 是否显示行内元素
  inlineBlock: false,
  //默认提示信息
  placeholder: '请选择日期', 
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
