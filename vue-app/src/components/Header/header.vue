<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute()
    
    const scrollProgress = ref(0);

    const handleWindowScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    // Плавное изменение прозрачности от 0 до 1 при скролле от 0 до 300px
    scrollProgress.value = Math.min(1, scrollY / 200)
    }
    const bgOpacity = computed(() => 0.7 * scrollProgress.value);

    // Вычисляем интенсивность размытия (от 0 до 15px)
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
                <button class="nav-button">
                
                Онлайн трансляции
                <span v-if="route.path === '/'" class="nav-indicator"></span>
                </button>
                <button class="nav-button">
                
                Предстоящие события
                <span v-if="route.path === '/'" class="nav-indicator"></span>
                </button>
                <button class="nav-button">
                
                AI-анализ
                <span v-if="route.path === '/'" class="nav-indicator"></span>
                </button>
                 <div class="profileMenu">
                     <!-- Профильное меню -->
                </div>
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
        margin: 40px;
        align-items: center;
    }
    .nav-button{
        font-size: 24px;
        background: transparent;
        border: transparent;
        border-radius: 12px;
        font-weight: 600;
        color: white;
        padding: 6px 8px;
        opacity: 1;
    }
    .nav-button:hover{
        background-color: rgb(90, 99, 113);

    }
    .profileMenu{
        height: 75px;
        width: 75px;
        border-radius: 50px;
        border: 1px solid;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    

</style>