<template>
  <div class="contact-page">
    <header class="nav"><div class="nav-inner"><span class="logo">Admin Pro</span><div class="nav-links"><a href="/">Home</a><a href="/pricing">Pricing</a><a href="/faq">FAQ</a><el-button type="primary" size="small" @click="$router.push('/login')">Get Started</el-button></div></div></header>

    <section class="contact-hero">
      <h1>Get in Touch</h1>
      <p>Have a question or need help? We'd love to hear from you.</p>
    </section>

    <section class="contact-body">
      <div class="contact-form">
        <el-form :model="form" label-position="top">
          <el-row :gutter="16">
            <el-col :span="12"><el-form-item label="Name"><el-input v-model="form.name" size="large" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="Email"><el-input v-model="form.email" size="large" /></el-form-item></el-col>
          </el-row>
          <el-form-item label="Subject"><el-input v-model="form.subject" size="large" /></el-form-item>
          <el-form-item label="Message"><el-input v-model="form.message" type="textarea" :rows="5" /></el-form-item>
          <el-button type="primary" size="large" round @click="handleSend">Send Message</el-button>
        </el-form>
      </div>
      <div class="contact-info">
        <div class="info-card"><div class="info-icon">📧</div><h4>Email</h4><p>hello@adminpro.com</p></div>
        <div class="info-card"><div class="info-icon">💬</div><h4>Live Chat</h4><p>Available 9am-6pm CST</p></div>
        <div class="info-card"><div class="info-icon">📍</div><h4>Location</h4><p>Shanghai, China</p></div>
      </div>
    </section>

    <footer class="footer"><span>© 2026 Admin Pro</span></footer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
const form = reactive({ name: '', email: '', subject: '', message: '' })
function handleSend() { ElMessage.success('Message sent! We\'ll get back to you soon.') }
</script>

<style scoped>
.contact-page { font-family: 'Inter','PingFang SC',sans-serif; color: #1a1a2e; }
.nav { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #eee; }
.nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
.logo { font-size: 20px; font-weight: 700; color: #409eff; }
.nav-links { display: flex; align-items: center; gap: 24px; }
.nav-links a { text-decoration: none; color: #555; font-size: 14px; font-weight: 500; }
.contact-hero { text-align: center; padding: 80px 24px 40px; }
.contact-hero h1 { font-size: 36px; font-weight: 800; }
.contact-hero p { color: #666; font-size: 16px; margin-top: 8px; }
.contact-body { max-width: 1000px; margin: 0 auto; padding: 0 24px 80px; display: grid; grid-template-columns: 1fr 320px; gap: 40px; }
.contact-form { background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #eee; }
.contact-info { display: flex; flex-direction: column; gap: 16px; }
.info-card { padding: 24px; background: #f8fafc; border-radius: 12px; }
.info-icon { font-size: 28px; margin-bottom: 8px; }
.info-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.info-card p { color: #888; font-size: 14px; }
.footer { text-align: center; padding: 32px; color: #999; font-size: 13px; }
@media (max-width: 768px) { .contact-body { grid-template-columns: 1fr; } }
</style>
