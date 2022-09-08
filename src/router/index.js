import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import ProcessDetailView from "../views/ProcessDetailView"

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    }
    // },
    // {
    //     path: '/detail',
    //     name: 'detail',
    //     component: ProcessDetailView
    // }
]

const router = createRouter({
    history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
    routes
})

export default router
