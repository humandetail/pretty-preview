<template>
  <div class="wrapper">
    <img src="https://img-squad-prod.humandetail.com/cover/20220925QErvmqBy.jpg" alt="" />
    <img src="https://img-squad-prod.humandetail.com/inner/20220601rQeMejlR.png" alt="">
    <img src="https://img-squad-prod.humandetail.com/cover/20220808an1p7Wd9.jpg" alt="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { PrettyPreview } from '../../packages/index'
import '../../packages/pretty-preview/assets/styles/index.scss'

onMounted(() => {
  const pp = new PrettyPreview({
    root: '.wrapper',
    lazy: false
  })
})
</script>

<style scoped>
</style>
