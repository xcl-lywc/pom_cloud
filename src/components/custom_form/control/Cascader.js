export default (_self, h) => {
  return [
    h("el-cascader", {
      props: {
        value: _self.obj.value,
        options: _self.obj.items,
        multiple: _self.obj.multiple
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


export let cascaderConf = {
  // 对应数据库内类型
  type: 'cascader',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '级联',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 绑定的值
  value: [],
  // 表单name
  name: '',
  // 多选
  multiple: true,
  // 选项内数据
  items: [{ "value": "1", "label": "下拉框1" , children: [{ "value": "1-1", "label": "下拉框1-1"}]}, { "value": "2", "label": "下拉框2" ,children: []}],
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
