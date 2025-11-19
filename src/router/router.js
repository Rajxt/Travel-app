import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../components/Home.vue'; 
import News from '../components/News.vue'; 
import About from '../components/About.vue'; 
import Login from '../components/login.vue';
import signup from '../components/signup.vue';
import NewsCard from '../components/NewsCard.vue';
import MyList from '../components/MyList.vue';

const routes = [
  { path: '/', component: Home },    
  { path: '/news', component: News },     
  { path: '/about', component: About },  
  { path: '/login', component: Login },
  { path: '/signup', component: signup },
  { path: '/NewsCard', component: NewsCard },
  { path: '/MyList', component: MyList },

 



    
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;