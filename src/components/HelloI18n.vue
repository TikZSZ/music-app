<template>
  <p>{{ $t('hello') }}</p>
</template>

<script lang="ts">
import { defineComponent} from 'vue'

export default defineComponent({
  name: 'HelloI18n',
  setup(){
    const num = 0
    return {num}
  }
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  }
}
</i18n>
