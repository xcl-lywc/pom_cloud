export default (_self, h) => {
  return [
    h("el-select", {
      props: {
        placeholder: _self.obj.placeholder || "这是一个下拉选项框",
        value: _self.obj.value,
      }, 
      on: {
        "change": function(val) {   
          _self.obj.value = val;
          _self.$emit('handleChangeVal', val)
        }
      }
    }, _self.obj.items.map(v => {
      return h("el-option", {
        props: {
          label: "" + v.label_value
        },
      }, v.label_name)
    }))
  ];
};


export let selectConf = {
  // 对应数据库内类型
  type: 'select',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '下拉框',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 绑定的值
  value: "",
  // 表单name
  name: '',
  // 选项内数据
  items: [{ "label_value": "1", "label_name": "下拉框1" }, { "label_value": "2", "label_name": "下拉框2" }],
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
