export default (_self, h) => {
  return [
    h("el-input", {
      props: {
        rows: _self.obj.maxRows || 5
      },
      attrs: {
        type: "textarea",
        placeholder: _self.obj.placeholder || "这是一个文本域",
        maxlength: parseInt(_self.obj.maxlength) || 20,
        value: _self.obj.value,
      },
      on: {
        "change": function(val) {
          //   if (!_self.obj.name) {
          //     return false;
          //   }
          _self.obj.value = event.currentTarget.value;
          _self.$emit('handleChangeVal', event.currentTarget.value)
        }
      }
    })
  ];
};


export let textareaConf = {
  // 对应数据库内类型
  type: 'textarea',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '文本',
  name: '',
  placeholder: '',
  // 最大长度
  maxlength: 20,
  value: '',
}
