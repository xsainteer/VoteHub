<template>
  <n-layout class="home-layout">
    <n-layout-content class="home-content">
      <n-space vertical :size="24" style="width: 100%">
        <n-typography-title
          size="huge"
          style="font-weight: 800; text-align: center; max-width: 700px"
        >
          VoteHub
        </n-typography-title>
        <n-typography-text
          style="
            font-size: 1.25rem;
            max-width: 700px;
            text-align: center;
            color: var(--n-text-3);
          "
        >
          Простая и быстрая платформа для создания и проведения голосований
        </n-typography-text>
        <n-space :size="24">
          <n-button size="large" type="primary" @click="goToCreate">
            Создать голосование
          </n-button>
          <n-button size="large" tertiary @click="goToDocs">
            Документация
          </n-button>
        </n-space>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace } from "naive-ui";

const goToCreate = () => {
  // Логика перехода на страницу создания голосования
  window.location.href = "/create"; // например
};

const goToDocs = () => {
  // Логика перехода на документацию
  window.location.href = "/docs";
};
</script>

<style scoped>
.home-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #4a90e2 0%, #9013fe 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-content {
  padding: 0 24px;
  width: 100%;
  max-width: 900px;
}
</style>
