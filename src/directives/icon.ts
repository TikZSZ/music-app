import {ObjectDirective} from "vue";


export const iconDirective: ObjectDirective<HTMLElement,string> = {
  beforeMount (el,binding) {
    let iconClass = `fa fa-${binding.value} text-xl`

    if(binding.arg === 'full'){
      iconClass = `fa fa-${binding.value} float-right text-green-400 text-5xl`
    }
    if(binding.modifiers.right){
      iconClass += ` float-right`
    }else{
      iconClass += ` float-left`
    }
    if(binding.modifiers.yellow){
      iconClass += ` text-yellow-400`
    }else{
      iconClass += ` text-green-400`
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
};

export const iconSecondary: ObjectDirective<HTMLElement,{icon:string,right:boolean}> = {
  beforeMount (el,binding) {
    let iconClass = `fa fa-${binding.value.icon}  text-green-400 text-xl`

    if(binding.arg === 'full'){
      iconClass = `fa fa-${binding.value} float-right text-green-400 text-5xl`
    }

    if(binding.value.right){
      iconClass += ` float-right`
    }else{
      iconClass += ` float-left`
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
};
