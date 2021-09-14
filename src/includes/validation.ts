import { defineRule, ErrorMessage,configure,Form as VeeForm,Field as VeeField } from 'vee-validate';
import { email, required, min, max, confirmed, alpha_spaces, numeric, min_value, max_value ,is} from "@vee-validate/rules"
import { App } from '@vue/runtime-core';
export default {
  install(app: App) {
    app.component('ErrorMessage', ErrorMessage)
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    defineRule('email', email)
    defineRule('required', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule("alpha_spaces", alpha_spaces);
    defineRule("numeric", numeric);
    defineRule("age_min_value", min_value);
    defineRule("age_max_value", max_value);
    defineRule("confirmed", confirmed);
    defineRule("is", is)
    
    configure({
      generateMessage:(ctx)=>{
        const fieldName = ctx.field.charAt(0).toUpperCase()+ctx.field.slice(1)
        const messages = {
          required:`${fieldName} is required`,
          min:`${fieldName} can't be shorter than ${ctx.rule!.params} characters`,
          max:`${fieldName} can't be greater than ${ctx.rule!.params} characters`,
          age_min_value:`You must be ${ctx.rule?.params}+ to signup`,
          age_max_value:`${fieldName} cant't be greater than ${ctx.rule?.params}`
        } as any
        return messages[ctx.rule!.name]?messages[ctx.rule!.name]:`${fieldName} is not valid`
      },
      
    })
  }
}
