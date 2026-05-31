<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useAuth } from '../../stores/auth';
    const route = useRoute()
    const { state, isAuthenticated, logout } = useAuth()
    const showDropdown = ref(false)
    
    const scrollProgress = ref(0);
    const navRef = ref<HTMLElement | null>(null)
    const indicatorStyle = ref({ width: '0px', left: '0px' })

    const handleWindowScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      scrollProgress.value = Math.min(1, scrollY / 200)
    }
    const bgOpacity = computed(() => 0.7 * scrollProgress.value);
    const blurIntensity = computed(() => 12 * scrollProgress.value);

    const updateIndicator = () => {
      if (!navRef.value) return
      const activeLink = navRef.value.querySelector('.nav-link.active') as HTMLElement | null
      if (activeLink) {
        const navRect = navRef.value.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        indicatorStyle.value = {
          width: `${linkRect.width}px`,
          left: `${linkRect.left - navRect.left}px`
        }
      }
    }

    onMounted(() => {
        window.addEventListener('scroll', handleWindowScroll)
        updateIndicator()
        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          if (!target.closest('.header')) showDropdown.value = false
        })
    })

    watch(() => route.path, () => {
      setTimeout(updateIndicator, 50)
    })
</script>
<template>
    <header class="header" 
            :style="{
                backgroundColor: `rgba(24,24,24, ${bgOpacity})`,
                backdropFilter: `blur(${blurIntensity}px)`,
                boxShadow: scrollProgress > 0.1 ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
            }">
        
        <nav ref="navRef" class="main-nav">
            <div class="nav-indicator-slider" :style="indicatorStyle"></div>

            <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
                <button class="nav-button">
                  Главная
                </button>
            </router-link>
            <router-link to="/news" class="nav-link" :class="{ active: route.path === '/news' }">
                <button class="nav-button">
                  Аналитика
                </button>
            </router-link>
                
            <router-link to="/analis" class="nav-link" :class="{ active: route.path === '/analis' }">
                <button class="nav-button">
                  AI-анализ
                </button>
            </router-link>
            <div v-if="isAuthenticated" class="profile-wrapper">
              <div class="nav-link" :class="{ active: route.path === '/profile' }">
                    <button class="profileMenu nav-button" @click.stop="showDropdown = !showDropdown">
                    <svg class="profile-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    </button>
                </div>
              <div v-if="showDropdown" class="profile-dropdown" @click="showDropdown = false">
                <div class="dropdown-user">{{ state.user?.name }}</div>
                <router-link to="/profile" class="dropdown-item">Профиль</router-link>
                <button class="dropdown-item logout-item" @click="logout">Выйти</button>
              </div>
            </div>
            <router-link v-else to="/login" class="nav-link">
              <button class="nav-button login-btn">Войти</button>
            </router-link>
        </nav>
    </header>
</template>
<style scoped>
    .header{
        display: flex;
        flex-direction: column;   
        position: relative;
    }
    .main-nav{
        display: flex;
        justify-content: center;
        gap: 32px;
        margin: 10px;
        align-items: center;
        position: relative;
    }
    .nav-button{
        font-size: 24px;
        background: transparent;
        border: transparent;
        border-radius: 12px;
        font-weight: 600;
        color: var(--main-font-color);
        padding: 6px 8px;
        opacity: 1;
        cursor: pointer;
        transition: color 0.3s ease, text-shadow 0.3s ease;
    }
    .nav-button:hover{
        color: var(--accent-font-color);
        text-shadow: 0 0 12px rgba(0, 255, 36, 0.5);
    }
    .nav-link{
        text-decoration: none;
    }
    .nav-link.active .nav-button{
        color: var(--accent-font-color);
        text-shadow: 0 0 12px rgba(0, 255, 36, 0.6);
    }
    
    /* Sliding underline indicator */
    .nav-indicator-slider {
        position: absolute;
        bottom: -4px;
        height: 3px;
        background: var(--accent-font-color);
        border-radius: 2px;
        transition: left 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 0 10px rgba(0, 255, 36, 0.6);
    }

    .nav-link.active .profileMenu{
        border-color: var(--accent-font-color);
        background: rgba(0, 255, 36, 0.15);
        box-shadow: 0 0 12px 2px #00ff2430;
    }
    .profileMenu{
        height: 50px;
        width: 50px;
        border-radius: 50px;
        border: 1px solid var(--main-border);
        cursor: pointer;
        transition: all 0.2s ease;
        background: linear-gradient(135deg, rgba(0, 255, 36, 0.1), rgba(0, 255, 36, 0.05));
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .profileMenu:hover{
        border-color: var(--accent-font-color);
        box-shadow: 0 0 12px 2px #00ff2420;
    }

    .profile-icon {
        color: var(--secondary-font-color);
        transition: color 0.2s;
    }

    .profileMenu:hover .profile-icon {
        color: var(--accent-font-color);
    }

    .profile-wrapper {
        position: relative;
        display: flex;
    }

    .login-btn {
        font-size: 16px !important;
        padding: 4px 16px !important;
        border: 1px solid var(--accent-font-color) !important;
        border-radius: 20px !important;
        color: var(--accent-font-color) !important;
        background: transparent !important;
    }

    .profile-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: var(--card-back-color);
        border: var(--main-border);
        border-radius: 10px;
        padding: 8px 0;
        min-width: 180px;
        z-index: 1001;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .dropdown-user {
        padding: 8px 16px;
        font-weight: 600;
        font-size: 14px;
        color: var(--main-font-color);
        border-bottom: var(--main-border);
        margin-bottom: 4px;
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 8px 16px;
        font-size: 14px;
        color: var(--secondary-font-color);
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s;
        text-decoration: none;
    }

    .dropdown-item:hover {
        background: var(--elem-back-color);
        color: var(--main-font-color);
    }

    .logout-item {
        color: #ff3b30;
    }

    .logout-item:hover {
        color: #ff3b30;
        background: rgba(255, 59, 48, 0.1);
    }
    

</style>
