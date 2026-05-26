<template>
  <div class="landing">
    <!-- 导航 -->
    <header class="nav">
      <div class="nav-inner">
        <span class="logo" @click="scrollTo('hero')">⚡ Admin Pro</span>
        <div class="nav-links">
          <a @click="scrollTo('features')">Features</a>
          <a @click="$router.push('/pricing')">Pricing</a>
          <a @click="$router.push('/faq')">FAQ</a>
          <a @click="$router.push('/contact')">Contact</a>
          <el-button type="primary" size="small" round @click="$router.push('/login')">
            Live Demo →
          </el-button>
          <a
            href="https://gao892947907.lemonsqueezy.com/checkout/buy/7af63e8e-bb13-4946-bf49-0a080797fc19"
            target="_blank"
            ><el-button size="small" round type="warning">Buy Now — $49</el-button></a
          >
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section id="hero" class="hero">
      <div class="hero-badge">🎉 Vue 3 + Element Plus • Production Ready</div>
      <h1>Ship Your <span class="gradient">Admin Dashboard</span><br />in Minutes, Not Weeks</h1>
      <p>
        A premium Vue 3 admin template with 30+ pages, 8 themes, RBAC, and full i18n — everything
        you need to launch fast.
      </p>
      <div class="hero-btns">
        <el-button
          type="primary"
          size="large"
          round
          class="btn-glow"
          @click="$router.push('/login')"
        >
          🚀 Try Live Demo
        </el-button>
        <a
          href="https://gao892947907.lemonsqueezy.com/checkout/buy/7af63e8e-bb13-4946-bf49-0a080797fc19"
          target="_blank"
          style="text-decoration:none"
          ><el-button size="large" round type="warning">🛒 Buy Now — $49</el-button></a
        >
        <el-button size="large" round @click="$router.push('/pricing')">
          View Pricing →
        </el-button>
      </div>
      <!-- 演示账号提示 -->
      <div class="demo-hint">
        <span>Demo accounts available — no registration needed</span>
      </div>
    </section>

    <!-- 演示账号卡片 -->
    <section class="demo-section">
      <div class="section-label">TRY IT NOW</div>
      <h2>Instant Demo Access</h2>
      <p class="section-sub">Click any account to auto-fill the login form. No sign-up required.</p>
      <div class="demo-cards">
        <div
          v-for="acc in demoAccounts"
          :key="acc.role"
          class="demo-card"
          @click="$router.push('/login')"
        >
          <div class="demo-role-icon">{{ acc.icon }}</div>
          <div class="demo-role-name">{{ acc.label }}</div>
          <div class="demo-role-desc">{{ acc.desc }}</div>
          <div class="demo-creds">
            <span>{{ acc.username }} / {{ acc.password }}</span>
          </div>
          <el-button type="primary" size="small" round plain>Login as {{ acc.label }}</el-button>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="section-label">FEATURES</div>
      <h2>Everything You Need</h2>
      <div class="feature-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <div class="f-icon">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat-item">
        <div class="stat-num">{{ s.num }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="tech-stack">
      <div class="section-label">TECH STACK</div>
      <h2>Modern & Reliable</h2>
      <div class="tech-grid">
        <div v-for="t in techs" :key="t.name" class="tech-item">
          <span class="tech-badge">{{ t.name }}</span>
          <span class="tech-ver">{{ t.ver }}</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Ready to Ship Faster?</h2>
      <p>
        Stop building boilerplate. Start with Admin Pro and focus on what makes your product unique.
      </p>
      <div class="cta-btns">
        <el-button size="large" round class="btn-white" @click="$router.push('/login')">
          🔥 Try Free Demo
        </el-button>
        <el-button size="large" round class="btn-outline" @click="$router.push('/pricing')">
          See Pricing
        </el-button>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-inner">
        <div>
          <span class="footer-logo">⚡ Admin Pro</span>
          <p class="footer-desc">
            Production-ready Vue 3 admin template.<br />Built by developers, for developers.
          </p>
        </div>
        <div class="footer-links">
          <strong>Product</strong>
          <a @click="$router.push('/pricing')">Pricing</a>
          <a @click="$router.push('/faq')">FAQ</a>
          <a @click="$router.push('/contact')">Contact</a>
        </div>
        <div class="footer-links">
          <strong>Demo</strong>
          <a @click="$router.push('/login')">Live Demo</a>
          <a @click="$router.push('/register')">Register</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Admin Pro. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const demoAccounts = [
  {
    role: 'admin',
    icon: '👑',
    label: 'Super Admin',
    desc: 'Full access to all features',
    username: 'admin',
    password: 'admin123',
  },
  {
    role: 'editor',
    icon: '✏️',
    label: 'Editor',
    desc: 'Content management access',
    username: 'editor',
    password: 'editor123',
  },
  {
    role: 'guest',
    icon: '👀',
    label: 'Guest',
    desc: 'Read-only view mode',
    username: 'guest',
    password: 'guest123',
  },
]

const features = [
  {
    icon: '🎨',
    title: '8 Color Themes',
    desc: 'Switch themes instantly. Includes dark & light modes, all persisted across sessions.',
  },
  {
    icon: '🌐',
    title: 'i18n Ready',
    desc: 'Built-in Chinese & English. Add any language by extending a single file.',
  },
  {
    icon: '📊',
    title: 'Data Visualization',
    desc: 'ECharts + 3D globe. Line, bar, pie, radar, gauge — all configurable.',
  },
  {
    icon: '🔐',
    title: 'RBAC Access Control',
    desc: '3 built-in roles (admin/editor/guest). Route & menu-level permission filtering.',
  },
  {
    icon: '📝',
    title: 'Rich Text Editor',
    desc: 'TipTap editor with image upload. Full toolbar for content creation.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Collapsible sidebar, adaptive tables, mobile-friendly layouts.',
  },
  {
    icon: '⚡',
    title: 'Vite 5 + TypeScript',
    desc: 'Lightning-fast HMR. Strict type checking. Modern tooling stack.',
  },
  {
    icon: '🔄',
    title: 'Dual Visual Styles',
    desc: 'Tech Blue & Minimal White. Switch between two complete visual designs.',
  },
  {
    icon: '📋',
    title: 'Advanced Table',
    desc: 'Search, filter, sort, CSV export, batch operations, column toggle.',
  },
]

const stats = [
  { num: '30+', label: 'Pages' },
  { num: '8', label: 'Color Themes' },
  { num: '2', label: 'Visual Styles' },
  { num: '99', label: 'Lighthouse' },
]

const techs = [
  { name: 'Vue', ver: '3.5' },
  { name: 'TypeScript', ver: '5.6' },
  { name: 'Vite', ver: '5.4' },
  { name: 'Element Plus', ver: '2.14' },
  { name: 'Pinia', ver: '3.0' },
  { name: 'Vue Router', ver: '4.6' },
  { name: 'ECharts', ver: '5.6' },
  { name: 'TipTap', ver: '3.x' },
  { name: 'SCSS', ver: '—' },
  { name: 'VueUse', ver: '14' },
]
</script>

<style scoped>
.landing {
  font-family: 'Inter', 'PingFang SC', sans-serif;
  color: #1a1a2e;
  scroll-behavior: smooth;
}

/* Nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #e5e7eb;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 22px;
}
.nav-links a {
  text-decoration: none;
  color: #555;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.nav-links a:hover {
  color: #409eff;
}

/* Section labels */
.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #409eff;
  text-align: center;
  margin-bottom: 12px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 80px 24px 60px;
  max-width: 860px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  padding: 6px 18px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}
.hero h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -1px;
}
.gradient {
  background: linear-gradient(135deg, #409eff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.7;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}
.hero-btns {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 20px;
}
.btn-glow {
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.35);
}
.demo-hint {
  font-size: 13px;
  color: #94a3b8;
}

/* Demo accounts */
.demo-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  text-align: center;
}
.demo-section h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}
.section-sub {
  color: #94a3b8;
  font-size: 15px;
  margin-bottom: 36px;
}
.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.demo-card {
  padding: 28px 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}
.demo-card:hover {
  border-color: #409eff;
  box-shadow: 0 8px 30px rgba(64, 158, 255, 0.12);
  transform: translateY(-3px);
}
.demo-role-icon {
  font-size: 36px;
  margin-bottom: 8px;
}
.demo-role-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}
.demo-role-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
}
.demo-creds {
  margin-bottom: 14px;
}
.demo-creds span {
  font-size: 12px;
  background: #f1f5f9;
  padding: 3px 10px;
  border-radius: 12px;
  color: #475569;
  font-family: monospace;
}

/* Features */
.features {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}
.features h2 {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 48px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.feature-card {
  padding: 30px 22px;
  border-radius: 14px;
  border: 1px solid #eee;
  transition: all 0.3s;
}
.feature-card:hover {
  border-color: #409eff;
  box-shadow: 0 6px 24px rgba(64, 158, 255, 0.08);
  transform: translateY(-2px);
}
.f-icon {
  font-size: 34px;
  margin-bottom: 14px;
}
.feature-card h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 6px;
}
.feature-card p {
  color: #777;
  font-size: 14px;
  line-height: 1.7;
}

/* Stats */
.stats {
  display: flex;
  justify-content: center;
  gap: 64px;
  padding: 60px 24px;
  background: #f8fafc;
  flex-wrap: wrap;
}
.stat-item {
  text-align: center;
}
.stat-num {
  font-size: 42px;
  font-weight: 800;
  color: #409eff;
}
.stat-label {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}

/* Tech stack */
.tech-stack {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px 40px;
  text-align: center;
}
.tech-stack h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
}
.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.tech-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #f1f5f9;
  border-radius: 8px;
}
.tech-badge {
  font-size: 14px;
  font-weight: 600;
}
.tech-ver {
  font-size: 12px;
  color: #94a3b8;
}

/* CTA */
.cta {
  text-align: center;
  padding: 80px 24px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: #fff;
}
.cta h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}
.cta p {
  font-size: 16px;
  opacity: 0.85;
  margin-bottom: 28px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.cta-btns {
  display: flex;
  gap: 14px;
  justify-content: center;
}
.btn-white {
  background: #fff;
  color: #1e293b;
  font-weight: 600;
  border: none;
}
.btn-white:hover {
  background: #f1f5f9;
}
.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  background: transparent;
}
.btn-outline:hover {
  border-color: #fff;
}

/* Footer */
.footer {
  padding: 60px 24px 30px;
  background: #f8fafc;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}
.footer-logo {
  font-size: 18px;
  font-weight: 700;
}
.footer-desc {
  color: #777;
  font-size: 13px;
  margin-top: 8px;
  line-height: 1.6;
}
.footer-links strong {
  display: block;
  font-size: 13px;
  margin-bottom: 10px;
  color: #333;
}
.footer-links a {
  display: block;
  font-size: 13px;
  color: #777;
  text-decoration: none;
  margin-bottom: 6px;
  cursor: pointer;
}
.footer-links a:hover {
  color: #409eff;
}
.footer-bottom {
  max-width: 1100px;
  margin: 32px auto 0;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 30px;
  }
  .nav-links {
    gap: 10px;
  }
  .stats {
    gap: 30px;
  }
  .footer-inner {
    grid-template-columns: 1fr;
  }
}
</style>
