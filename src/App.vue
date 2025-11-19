<template>
  <div class="container-fluid p-0">
 <!-- Header with Nav -->
 <header class="header sticky-top w-100 shadow-header">
 <div class="container-fluid py-3 px-4 d-flex justify-content-between align-items-center">
 <!-- Navigation -->
 <ul class="nav flex-wrap gap-2 mb-0">
 <li class="nav-item">
 <router-link class="nav-link" to="/">Home</router-link>
 </li>
 <li class="nav-item">
 <router-link class="nav-link" to="/news">News</router-link>
 </li>
 <li class="nav-item">
 <router-link class="nav-link" to="/about">About</router-link>
 </li>
 <li class="nav-item">
 <router-link class="nav-link" to="/MyList">MyList</router-link>
 </li>
 </ul>
 
 <!-- Sign In / Logout Button -->
 <button v-if="!isAuthenticated" @click="navigateToLogin" class="btn btn-warning fw-semibold shadow-sm">
  Sign In
 </button>
 <button v-if="isAuthenticated" @click="handleLogout" class="btn btn-warning fw-semibold shadow-sm">
  Logout
 </button>
 </div>
 </header>
 <section>
 <router-view />
 </section>
 </div>
 </template>
 
 <script>
 import { mapState, mapActions } from 'vuex';
 
 export default {
   computed: {
     ...mapState(['isAuthenticated'])
   },
   methods: {
     ...mapActions(['logout']),
     navigateToLogin() {
       this.$router.push('/login');
     },
     handleLogout() {
       
       this.logout();
     
       this.$router.push('/');
     }
   }
 };
 </script>
 
 <style scoped>
 .header {
 background-color: black;
 color: white;
 width: 100%;
 }
 .nav-link {
 color: white !important;
 font-weight: 500;
 transition: color 0.2s;
 }
 .nav-link.router-link-exact-active {
 color: #f39c12 !important;
 }
 .nav-link:hover {
 color: #f1c40f !important;
 }
 html {
 scroll-behavior: smooth;
 }
 </style>