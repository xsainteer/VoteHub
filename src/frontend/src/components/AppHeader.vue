<template>
  <n-layout-header class="header">
    <div class="container">
      <div class="logo">MyApp</div>
      <div class="nav">
        <n-button text @click="navigate('home')">Home</n-button>
        <n-button text @click="navigate('about')">About</n-button>
        <n-button text @click="navigate('contact')">Contact</n-button>
      </div>
      <div class="actions">
        <n-button type="primary" ghost @click="login">Login</n-button>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup>
import { NLayoutHeader, NButton } from "naive-ui";

const navigate = (page) => {
  console.log(`Navigate to ${page}`);
};
const login = () => {
  console.log("Login clicked");
};
</script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 64px;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #18a058;
}

.nav > * {
  margin: 0 12px;
  font-weight: 500;
  color: #333;
}

.actions > * {
  margin-left: 12px;
}
</style>
