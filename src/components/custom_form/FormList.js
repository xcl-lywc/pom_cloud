import { inputConf } from "./control/Input";
import { radioConf } from "./control/Radio";
import { checkBoxConf } from "./control/CheckBox";
import { textareaConf } from "./control/Textarea";
import { inputNumberConf } from "./control/InputNumber";
import { cascaderConf } from './control/Cascader';
import { colorPickerConf } from './control/ColorPicker';
import { datePickerConf } from './control/DatePicker'; 
import { rateConf } from './control/Rate';
import { selectConf } from './control/Select';
import { sliderConf } from './control/Slider';
import { switchConf } from './control/Switch'; 
import { timePickerConf } from './control/TimePicker';
import { uploadsConf } from './control/Uploads';


const formList = {
  input: 		inputConf,
  radio: 		radioConf,
  checkbox: 	checkBoxConf,
  textarea: 	textareaConf,
  inputNumber:  inputNumberConf,
  cascader:     cascaderConf,
  colorPicker:  colorPickerConf,
  datePicker:   datePickerConf,
  rate: 		rateConf,
  // select: 		selectConf,
  slider: 		sliderConf,
  switchcom: 		switchConf,
  timePicker: 	timePickerConf,
  uploads: 		uploadsConf
};
let list_arr = [];
for (let i in formList) {  
  list_arr.push({
    ele: i,
    obj: formList[i]
  });
}
export default list_arr;
