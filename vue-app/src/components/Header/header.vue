<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute()
    
    const scrollProgress = ref(0);

    const handleWindowScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
   
    scrollProgress.value = Math.min(1, scrollY / 200)
    }
    const bgOpacity = computed(() => 0.7 * scrollProgress.value);

   
    const blurIntensity = computed(() => 12 * scrollProgress.value);
    onMounted(() => {
        window.addEventListener('scroll', handleWindowScroll)
    })
</script>
<template>
    <header class="header" 
            :style="{
                /* opacity:navOpacity, */
                backgroundColor: `rgba(24,24,24, ${bgOpacity})`,
                backdropFilter: `blur(${blurIntensity}px)`,
                boxShadow: scrollProgress > 0.1 ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
            }">
        
        <nav class="main-nav">
            <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
                <button class="nav-button">
                
                Главная
                <span v-if="route.path === '/'" class="nav-indicator"></span>
                </button>
            </router-link>
            <router-link to="/news" class="nav-link" :class="{ active: route.path === '/news' }">
                <button class="nav-button">
                
                Аналитика
                <span v-if="route.path === '/news'" class="nav-indicator"></span>
                </button>
            </router-link>
               
                <router-link to="/analis" class="nav-link" :class="{ active: route.path === '/analis' }">
                <button class="nav-button">
                
                AI-анализ
                <span v-if="route.path === '/analis'" class="nav-indicator"></span>
                </button>
                </router-link>
                 <router-link to="/profile" class="nav-link" :class="{ active: route.path === '/profile' }">
                 <div class="profileMenu">
                     <!-- Профильное меню -->
                </div>
                </router-link>
        </nav>
    </header>
</template>
<style scoped>
    .header{
        display: flex;
        flex-direction: column;   
    }
    .main-nav{
        display: flex;
        justify-content: center;
        gap: 32px;
        margin: 10px;
        align-items: center;
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
    }
    .nav-button:hover{
        background-color: rgb(90, 99, 113);

    }
    .nav-link{
        text-decoration: none;
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
    }
    .profileMenu:hover{
        border-color: var(--accent-font-color);
        box-shadow: 0 0 12px 2px #00ff2420;
    }
    

</style>