<template>
  <div class="wrapper">
    <img src="https://img-squad-prod.humandetail.com/cover/20220925QErvmqBy.jpg" alt="" />
    <img src="https://img-squad-prod.humandetail.com/inner/20220601rQeMejlR.png" alt="">
    <img src="https://img-squad-prod.humandetail.com/cover/20220808an1p7Wd9.jpg" alt="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PrettyPreview from 'pretty-preview'
import 'pretty-preview/index.css'

onMounted(() => {
  const pp = new PrettyPreview({
    root: '.wrapper'
  })
})
</script>

<style scoped>
.wrapper {
  display: flex;
}

img {
  width: 200px;
  margin: 20px;
  box-shadow: 0 0 4px #888;
  cursor: zoom-in;
}
</style>
