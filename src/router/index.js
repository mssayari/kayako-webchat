import {createRouter, createWebHistory} from "vue-router";
import store from '../store/index'
import Panel from "../views/Panel.vue";
import Login from "../views/Login";

const routes = [
    {
        path: "/",
        name: "Panel",
        component: Panel,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    // {
    //   path: "/about",
    //   name: "About",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "../views/About.vue")
    // }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.loggedIn) {
            next()
            return
        }
        //next('/login')
        next({
            name: "Login",
        });
    } else {
        next()
    }
})

export default router;
