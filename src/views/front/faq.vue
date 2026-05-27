<template>
  <div class="faq-page">
    <header class="nav">
      <div class="nav-inner">
        <span class="logo">Admin Pro</span>
        <div class="nav-links">
          <a href="/">Home</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a
          ><el-button type="primary" size="small" @click="$router.push('/login')">
            Get Started
          </el-button>
        </div>
      </div>
    </header>

    <section class="faq-hero">
      <h1>Frequently Asked Questions</h1>
      <div class="search-box">
        <el-input
          v-model="search"
          placeholder="Search questions..."
          prefix-icon="Search"
          size="large"
        />
      </div>
    </section>

    <section class="faq-list">
      <div v-for="cat in filteredCats" :key="cat.title" class="cat-section">
        <h2>{{ cat.title }}</h2>
        <el-collapse>
          <el-collapse-item v-for="q in cat.items" :key="q.q" :title="q.q">
            <p>{{ q.a }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <footer class="footer"><span>© 2026 Admin Pro</span></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref('')
const categories = [
  {
    title: 'General',
    items: [
      {
        q: 'What is Admin Pro?',
        a: 'Admin Pro is a production-ready Vue 3 + Element Plus admin dashboard template with 30+ pages, dark mode, i18n, charts, and more.',
      },
      {
        q: 'What tech stack does it use?',
        a: 'Vue 3, TypeScript, Vite, Element Plus, Pinia, Vue Router, ECharts, and SCSS.',
      },
    ],
  },
  {
    title: 'License & Pricing',
    items: [
      { q: 'Is it a one-time payment?', a: 'Yes! No subscriptions. Pay once, use forever.' },
      {
        q: 'Can I use it for commercial projects?',
        a: 'Yes. All licenses allow commercial use. Professional and Enterprise licenses cover client projects.',
      },
    ],
  },
  {
    title: 'Technical',
    items: [
      { q: 'Does it support TypeScript?', a: 'Yes, the entire codebase is written in TypeScript.' },
      {
        q: 'Can I customize the theme?',
        a: 'Yes! 8 built-in themes plus easy CSS variable overrides. Dark mode included.',
      },
    ],
  },
]
const filteredCats = computed(() => {
  if (!search.value) return categories
  return categories
    .map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          i.q.toLowerCase().includes(search.value.toLowerCase()) ||
          i.a.toLowerCase().includes(search.value.toLowerCase()),
      ),
    }))
    .filter((c) => c.items.length > 0)
})
</script>

<style scoped>
.faq-page {
  font-family: 'Inter', 'PingFang SC', sans-serif;
  color: #1a1a2e;
}
.nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eee;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-links a {
  text-decoration: none;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}
.faq-hero {
  text-align: center;
  padding: 80px 24px 40px;
}
.faq-hero h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 24px;
}
.search-box {
  max-width: 500px;
  margin: 0 auto;
}
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
.cat-section {
  margin-bottom: 40px;
}
.cat-section h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
}
.cat-section p {
  color: #666;
  line-height: 1.7;
}
.footer {
  text-align: center;
  padding: 32px;
  color: #999;
  font-size: 13px;
}
</style>
