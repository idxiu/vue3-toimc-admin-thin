<template>
  <div class="p-4 h-full">
    <t-card header="拖拽指令示例" class="text-lg font-bold">
      <span class="flex items-center justify-center mt-10 mb-10">拖拽下面的元素</span>
    </t-card>

    <div v-draggable class="box">我可以拖拽哦~</div>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    position: relative;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    font-size: 24px;
    line-height: 300px;
    color: #000;
    text-align: center;
    background: #dfe6e9;
    background-image: url('@/assets/images/brian.jpg');
    background-size: 100% 100%;
    border-radius: 50%;
    transform: translate(-50%, -40%);
    user-select: none;
  }
</style>
