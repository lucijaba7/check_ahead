import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../components/Auth/Signup.vue'

import SuiVue from 'semantic-ui-vue';
//import 'semantic-ui-css/semantic.min.css';

//import '../assets/main.css'

import '../../semantic/dist/semantic.min.css';
Vue.use(VueRouter)
Vue.use(SuiVue)


const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router