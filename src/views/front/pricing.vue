<template>
  <div class="pricing-page">
    <header class="nav"><div class="nav-inner"><span class="logo">Admin Pro</span><div class="nav-links"><a href="/">Home</a><a href="/faq">FAQ</a><a href="/contact">Contact</a><el-button type="primary" size="small" @click="$router.push('/login')">Get Started</el-button></div></div></header>

    <section class="pricing-hero">
      <h1>Simple, Transparent Pricing</h1>
      <p>One-time payment. Lifetime access. Free updates.</p>
    </section>

    <section class="plans">
      <div v-for="p in plans" :key="p.name" class="plan-card" :class="{ featured: p.featured }">
        <div v-if="p.featured" class="badge">Popular</div>
        <h3>{{ p.name }}</h3>
        <div class="price"><span class="currency">$</span>{{ p.price }}</div>
        <p class="desc">{{ p.desc }}</p>
        <ul>
          <li v-for="item in p.items" :key="item">✓ {{ item }}</li>
        </ul>
        <el-button :type="p.featured ? 'primary' : 'default'" size="large" class="buy-btn" round>{{ p.featured ? 'Buy Now' : 'Get Started' }}</el-button>
      </div>
    </section>

    <section class="faq-mini">
      <h2>Frequently Asked</h2>
      <div v-for="q in faqs" :key="q.q" class="faq-item"><h4>{{ q.q }}</h4><p>{{ q.a }}</p></div>
    </section>

    <footer class="footer"><span>© 2026 Admin Pro</span></footer>
  </div>
</template>

<script setup lang="ts">
const plans = [
  { name: 'Starter', price: 29, desc: 'Perfect for single projects', items: ['1 Project', 'Vue 3 + Element Plus', '10 Pages', 'Email Support'], featured: false },
  { name: 'Professional', price: 59, desc: 'Best for freelancers & agencies', items: ['Unlimited Projects', '30+ Pages', '8 Color Themes', 'Dark Mode', 'Charts & Dashboards', 'i18n Support', 'Priority Support'], featured: true },
  { name: 'Enterprise', price: 99, desc: 'For large teams', items: ['Everything in Pro', 'Source Code Access', 'Customization Service', 'Dedicated Support', 'Lifetime Updates'], featured: false },
]
const faqs = [
  { q: 'Is this a one-time payment?', a: 'Yes! No subscriptions, no recurring fees. Pay once, use forever.' },
  { q: 'Do I get future updates?', a: 'All updates within the same major version are free.' },
  { q: 'Can I use it for client projects?', a: 'Absolutely. Professional and Enterprise licenses cover client work.' },
]
</script>

<style scoped>
.pricing-page { font-family: 'Inter','PingFang SC',sans-serif; color: #1a1a2e; }
.nav { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #eee; }
.nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
.logo { font-size: 20px; font-weight: 700; color: #409eff; }
.nav-links { display: flex; align-items: center; gap: 24px; }
.nav-links a { text-decoration: none; color: #555; font-size: 14px; font-weight: 500; }
.pricing-hero { text-align: center; padding: 80px 24px 40px; }
.pricing-hero h1 { font-size: 40px; font-weight: 800; }
.pricing-hero p { color: #666; font-size: 16px; margin-top: 8px; }
.plans { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; padding: 0 24px 80px; }
.plan-card { position: relative; padding: 40px 32px; border: 2px solid #eee; border-radius: 16px; text-align: center; transition: all 0.3s; }
.plan-card.featured { border-color: #409eff; box-shadow: 0 8px 40px rgba(64,158,255,0.15); transform: scale(1.03); }
.plan-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
.badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #409eff; color: #fff; padding: 4px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.plan-card h3 { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
.price { font-size: 48px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
.currency { font-size: 24px; vertical-align: super; }
.desc { color: #888; font-size: 14px; margin-bottom: 24px; }
.plan-card ul { list-style: none; padding: 0; text-align: left; margin-bottom: 28px; }
.plan-card li { padding: 6px 0; font-size: 14px; color: #555; }
.buy-btn { width: 100%; }
.faq-mini { max-width: 700px; margin: 0 auto; padding: 0 24px 80px; }
.faq-mini h2 { text-align: center; font-size: 28px; margin-bottom: 32px; }
.faq-item { margin-bottom: 20px; }
.faq-item h4 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.faq-item p { color: #777; font-size: 14px; line-height: 1.6; }
.footer { text-align: center; padding: 32px; color: #999; font-size: 13px; }
</style>
