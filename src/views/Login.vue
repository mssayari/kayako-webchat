<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

    <div class="max-w-md w-full space-y-8 bg-white shadow px-4 py-5 rounded-lg mb-6">
      <div>
        <img class="mx-auto h-12 w-auto" src="../assets/images/logo.svg" alt="Workflow">
        <h3 class="mt-6 text-center text-3xl font-medium text-gray-900">
          سیستم گفتگوی آنلاین
        </h3>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">نام کاربری</label>
            <input id="username" name="username" type="text" required
                   class="rounded-none relative block w-full px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500
                   focus:border-gray-500 focus:z-10 sm:text-sm placeholder-right"
                   placeholder="نام کاربری" v-model="username">
          </div>
          <div>
            <label for="password" class="sr-only">رمز عبور</label>
            <input id="password" name="password" type="password" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500
                   focus:border-gray-500 focus:z-10 sm:text-sm placeholder-right"
                   placeholder="رمز عبور" v-model="password">
          </div>
        </div>
        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm
                  font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2
                  focus:ring-offset-2 focus:ring-gray-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: lock-closed -->
            <svg class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
            ورود
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import {useToast} from "vue-toastification";
import {POSITION} from "vue-toastification";

export default {
  name: "Login",
  data() {
    return {
      serverSideError: false,
      username: "",
      password: "",
      errorMessage: "نام کاربری یا رمز عبور صحیح نمیباشد",
    }
  },
  setup() {
    localStorage.removeItem("chats");
    // Get toast interface
    const toast = useToast();

    // Make it available inside methods
    return {toast}
  },
  methods: {
    login() {
      this.serverSideError = false;
      let username = this.username
      let password = this.password
      this.$store.dispatch("login", {username, password})
          .then(() => {
            this.$router.push('/');
          })
          .catch((error) => {
            this.serverSideError = true;
            if (error) {
              this.errorMessage = error.message;
              this.toast.error(error.message, {
                position: POSITION.BOTTOM_CENTER
              });
            }
          });
    },
  },
}
</script>

<style scoped>

</style>