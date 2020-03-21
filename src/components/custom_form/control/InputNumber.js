export default (_self, h) => {
  return [
    h("el-input-number", {
      props: {
        value: _self.obj.value || 0,
        min: _self.obj.min,
        max: _self.obj.max 
      },
      attrs: { 
        placeholder: _self.obj.placeholder,
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


export let inputNumberConf = {
  // 对应数据库内类型
  type: 'inputNumber',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '计数器',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 绑定的值
  value: 1,
  // 表单name
  name: '',
  // 是否显示行内元素
  inlineBlock: false,
  //默认提示信息
  placeholder: '',
  // 最小数字
  min: 1,
  // 最大数字
  max: 3,
  // 验证错误提示信息
  ruleError: '请输入正确的数字',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true  
}
