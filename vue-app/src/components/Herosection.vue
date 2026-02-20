<template>
    <div    class="heroSection"
            :style="{
                /* opacity:navOpacity, */
                backgroundColor: `rgba(24,24,24, ${bgOpacity})`,
                backdropFilter: `blur(${blurIntensity}px)`,
                boxShadow: scrollProgress > 0.1 ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
            }">
        <div class="logo">
            <router-link to="/" class="logo-link">
                <span class="logo-text">Ставки</span>
                <span class="logo-icon">
                    <img 
                        src="../assets/Logo-for-OddsBet 2.png" 
                        alt="Logo"
                        class="logo-img"
                    >
                </span>
                <span class="logo-text">Compare</span>
            </router-link>
        </div>
       
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

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

<style scoped>
    .heroSection{
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px 0;
        min-height: 200px;
    }
    
    .logo-link{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
        text-decoration: none;
    }
    
    .logo-text{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 700; 
        font-size: 84px;
        line-height: 1;
        color: whitesmoke;
    }
    
    .logo-img {
        width: 100px;
        height: auto;
    }
    
    
    
    .profileMenu:hover {
        transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
        .heroSection {
            flex-direction: column;
            gap: 30px;
            padding: 30px 0;
        }
        
        .logo-link {
            flex-direction: column;
            gap: 10px;
        }
        
        .logo-text {
            font-size: 48px;
            text-align: center;
        }
        
        .logo-img {
            width: 80px;
        }
        
        .profileMenu {
            width: 60px;
            height: 60px;
        }
    }
    
    @media (max-width: 480px) {
        .logo-text {
            font-size: 36px;
        }
        
        .logo-img {
            width: 60px;
        }
    }
</style>