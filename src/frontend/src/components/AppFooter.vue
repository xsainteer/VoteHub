<template>
  <n-el tag="footer" class="footer">
    <div class="container">
      <n-text depth="3"
        >&copy; {{ currentYear }} Your Company Name. All rights
        reserved.</n-text
      >
      <n-space justify="center" class="footer-links" wrap>
        <n-button text tag="a" href="/about">About Us</n-button>
        <n-button text tag="a" href="/contact">Contact</n-button>
        <n-button text tag="a" href="/privacy">Privacy Policy</n-button>
        <n-button text tag="a" href="/terms">Terms of Service</n-button>
      </n-space>
    </div>
  </n-el>
</template>

<script setup lang="ts">
import { NEl, NButton, NSpace, NText } from "naive-ui";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  padding: 20px 0;
  background-color: #1f2937; /* dark neutral */
  text-align: center;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links :deep(a) {
  color: #93c5fd;
  text-decoration: none;
  transition: color 0.3s ease-in-out;
}

.footer-links :deep(a:hover) {
  color: #ffffff;
}
</style>
