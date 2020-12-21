import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./assets/tailwind.css";

import Toast from "vue-toastification";
import "./assets/styles/toast.scss";

const options = {
    timeout: 5000,
    rtl: true,
    hideProgressBar: true,
    maxToasts: 10,
};

// Vue.directive('click-outside', {
//     beforeMount(el, binding, ) {
//         el.clickOutsideEvent = function(event) {
//             if (!(el === event.target || el.contains(event.target))) {
//                 binding.value(event, el);
//             }
//         };
//         document.body.addEventListener('click', el.clickOutsideEvent);
//     },
//     unmounted(el) {
//         document.body.removeEventListener('click', el.clickOutsideEvent);
//     }
// });

createApp(App)
    .use(store)
    .use(router)
    .use(Toast, options)
    .mount("#app");


