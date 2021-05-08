<template>
  <header class="fixed bg-kayako-purple w-full shadow">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-6">
      <div class="flex flex-row-reverse items-center justify-between h-12">
        <div class="flex items-center flex-row-reverse">
          <div class="flex-shrink-0 hidden sm:block">
            <img class="h-8" src="../assets/images/logo_dark.svg" alt="Workflow">
          </div>
          <div class="mr-2 flex">
            <!-- Mobile menu button -->
            <button @click="toggleSideMenu()"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-0">
              <span class="sr-only">Open main menu</span>
              <svg class="feature-icon block h-6 w-6">
                <use xlink:href="fonts/feather-sprite.svg#menu"/>
              </svg>
            </button>
          </div>
          <div class="">
            <div class="mr-5 flex flex-row-reverse items-baseline space-x-4">
              <!--<a href="#" class="px-3 py-2 rounded-md text-sm text-white">پنل گفتگو</a>-->
              <!--<a href="#" class="px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white">آمار</a>-->
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="mr-4 flex items-center md:mr-6">

            <!-- Profile dropdown -->
            <div class="mr-3 relative z-10" v-click-outside="closeUserMenu">
              <button @click.stop="userDropDownMenu = !userDropDownMenu"
                      class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-0"
                      id="user-menu" aria-haspopup="true">
                <svg class="text-white hidden sm:block mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"/>
                </svg>
                <span class="text-white mr-1 hidden sm:block">{{ currentUser.fullName }}</span>
                <span class="sr-only">Open user menu</span>
                <span class="h-8 w-8 rounded-full border overflow-hidden bg-gray-100 border-gray-100 shadow-sm">
                    <svg class="h-full w-full text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </span>
                <div :class="'status-'+currentUser.status"></div>
              </button>
              <div v-if="userDropDownMenu"
                   class="origin-top-right z-20 absolute left-0 text-right mt-2 w-48 rounded-md shadow-lg py-1
                     bg-white dark:bg-gray-700 ring-0 "
                   role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <a @click="updateStatus(1)"
                   class="flex hand flex-row-reverse items-center justify-between px-4 py-2 text-sm
                     dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                   role="menuitem">
                  <span>آنلاین</span>
                  <div
                      class="top-0 right-0 h-3 w-3 border-1 border-white rounded-full bg-green-400 z-2"></div>
                </a>
                <a @click="updateStatus(5)"
                   class="flex flex-row-reverse items-center justify-between px-4 py-2 text-sm
                          dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                   role="menuitem">
                  <span>مشغول</span>
                  <div
                      class="top-0 right-0 h-3 w-3 border-1 border-white rounded-full bg-red-400 z-2"></div>
                </a>
                <a @click="updateStatus(7)"
                   class="flex flex-row-reverse items-center justify-between px-4 py-2 text-sm
                          dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                   role="menuitem">
                  <span>مخفی</span>
                  <div
                      class="top-0 right-0 h-3 w-3 border-1 border-white rounded-full bg-gray-400 z-2"></div>
                </a>
                <hr class="dark:border-gray-600"/>
                <a class="flex flex-row-reverse items-center justify-between px-4 py-2 text-sm
                          dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                   @click="openSettingsModal"
                   role="menuitem">
                  <span>تنظیمات</span>
                  <svg class="feature-icon hidden sm:block mr-1 h-4 w-4">
                    <use xlink:href="fonts/feather-sprite.svg#settings"/>
                  </svg>
                </a>
                <a @click="logout" class="flex flex-row-reverse items-center justify-between px-4 py-2 text-sm  hover:bg-gray-100
                  dark:hover:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                   role="menuitem">
                  <span>خروج</span>
                  <svg class="feature-icon hidden sm:block mr-1 h-4 w-4">
                    <use xlink:href="fonts/feather-sprite.svg#power"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <button v-if="!notification" @click="requestNotificationPermission"
                  class="flex justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50">
            <svg class="feature-icon hidden sm:block mr-1 h-4 w-4">
              <use xlink:href="fonts/feather-sprite.svg#bell"/>
            </svg>
            <span class="text-sm">فعال سازی اعلان ها</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <div class="mx-auto w-full items-center h-screen font-normal bg-gray-50 dark:bg-gray-900">
    <div class="pt-14 h-full flex py-4">
      <!-- chat area -->
      <div
          class="flex flex-col w-full flex-grow mx-2 bg-gray-100 border dark:border-gray-600 dark:bg-gray-800 h-full text-sm rounded-lg">
        <ul class="list-reset w-full flex border-b flex-row-reverse border-gray-300 dark:border-gray-600 text-gray-500
        bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <li v-for="(item, index) in activeChats" v-bind:key="index">
            <a class="py-1 px-4 flex items-center rtl hover:text-gray-700 dark:hover:text-gray-300"
               :class="{'chat-tab-active':item.chatObjectId === selectedChat,'rounded-tr-lg':index===0}"
               @click="selectChat(item.chatObjectId)">
              <span class="cursor-pointer text-right">
                {{ item.userFullName }} <br/>
                {{ item.userEmail }}
              </span>
              <span class="flex h-3 w-3 relative mr-2">
                <span v-if="item.newMessagesCount > 0"
                      class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-100"
                      :class="{'bg-green-550':item.active && !item.warning,'bg-gray-500':!item.active && !item.warning,'bg-red-400':item.warning}"></span>
                <span class="relative inline-flex rounded-full h-3 w-3"
                      :class="{'bg-green-400':item.active && !item.warning,'bg-gray-500':!item.active && !item.warning,'bg-red-400':item.warning}"></span>
              </span>
            </a>
          </li>
        </ul>
        <div class="tools flex flex-row-reverse justify-start py-1 space-x-3 mr-3"
             v-if="selectedChat">
          <div class="relative inline-block text-right pl-2" v-click-outside="closeCannedMenu">
            <button type="button" :disabled="!isSelectedChatActive" @click.prevent="toggleCannedMenu"
                    class="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-400
                    rounded-md shadow-sm text-sm
                    text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                    hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-0">

              <svg class="feature-icon w-5 h-5 -ml-1 mr-2">
                <use xlink:href="fonts/feather-sprite.svg#message-square"/>
              </svg>
              پیغام های آماده
            </button>
            <div v-if="isCannedMenuOpen"
                 class="origin-top-right absolute right-0 w-72 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1
                 ring-black
                 ring-opacity-5 overflow-y-auto max-h-72">
              <ul class="text-gray-500 dark:text-gray-400 pr-1">
                <canned-item v-for="(canned, index) in cannedMessages.children" :key="index"
                             :item="canned" :clickHandler="sendCanned"></canned-item>

              </ul>
            </div>
          </div>
          <div class="relative inline-block text-right" v-click-outside="closeTransferMenu">
            <button type="button" @click="toggleTransferMenu"
                    class="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-400 rounded-md
                    shadow-sm text-sm
                    text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                    hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-0">
              <svg class="feature-icon -ml-1 mr-2 h-5 w-5">
                <use xlink:href="fonts/feather-sprite.svg#corner-down-right"/>
              </svg>
              انتقال گفتگو
            </button>
            <div v-if="isTransferMenuOpen"
                 class="origin-top-right absolute right-0 w-72 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1
                 ring-black ring-opacity-5">
              <ul class="text-gray-500 dark:text-gray-400">
                <li class="">
                  <button @click="toggleTransferSubMenu('dep')"
                          class="inline-flex items-center flex-row-reverse justify-between w-full focus:outline-none
                          text-sm hover:text-gray-800 dark:hover:text-gray-300 px-2 py-2"
                          aria-haspopup="true">
                    <span class="ms-4">دپارتمان ها</span>
                    <svg class="feature-icon hidden sm:block mr-1 h-4 w-4">
                      <use xlink:href="fonts/feather-sprite.svg#chevron-down"/>
                    </svg>
                  </button>
                  <ul v-if="isTransferDepMenuOpen"
                      class="m-1 space-y-2 text-sm text-gray-500 dark:text-gray-400 rounded-md shadow-inner bg-gray-50
                      dark:bg-gray-800 overflow-y-auto max-h-64"
                      aria-label="submenu">
                    <li v-for="(department, index) in departments" :key="index"
                        class="px-2 pb-1 hover:text-kblue-300">
                      <span class="cursor-pointer"
                            @click="transfer(selectedChat,'department',department.id)">{{ department.title }}</span>
                    </li>
                  </ul>
                </li>
                <li class="">
                  <button @click="toggleTransferSubMenu('team')"
                          class="inline-flex items-center flex-row-reverse justify-between w-full focus:outline-none text-sm
                          hover:text-gray-800 dark:hover:text-gray-300 px-2 py-2"
                          aria-haspopup="true">
                    <span class="ms-4">تیم ها</span>
                    <svg class="feature-icon hidden sm:block mr-1 h-4 w-4">
                      <use xlink:href="fonts/feather-sprite.svg#chevron-down"/>
                    </svg>
                  </button>
                  <ul v-if="isTransferTeamMenuOpen"
                      class="m-1 space-y-2 text-sm text-gray-500 dark:text-gray-400 rounded-md shadow-inner bg-gray-50
                       dark:bg-gray-800 overflow-y-auto max-h-64"
                      aria-label="submenu">
                    <li v-for="(team, index) in teams" :key="index"
                        class="px-2 pb-1 hover:text-kblue-300">
                      <span class="cursor-pointer" @click="transfer(selectedChat,'staffgroup',team.id)">
                        {{ team.title }}
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <button type="button" @click="endChat()"
                  class="text-white inline-flex items-center px-2 py-1  rounded-md
                        shadow-sm text-sm bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500
                        focus:outline-none focus:ring-0 px-2 py-1 rounded-md shadow-sm text-sm
                        focus:outline-none focus:ring-0">
            <svg class="feature-icon -ml-1 mr-2 h-4 w-4">
              <use xlink:href="fonts/feather-sprite.svg#x"/>
            </svg>
            اتمام گفتگو
          </button>
        </div>
        <div class="h-full bg-white dark:bg-gray-900 text-gray-800 text-sm overflow-y-auto font-normal"
             ref="chatContainer">
          <div class="h-full flex p-8 items-center justify-center" v-if="!selectedChat">
            <img v-if="theme === 'dark'" src="../assets/images/logo_dark.svg" class="w-1/2">
            <img v-if="theme === 'light'" src="../assets/images/logo.svg" class="w-1/2">
          </div>

          <div v-if="selectedChat">
            <messages :chat="SelectedChatObject" @loaded="scrollToEnd"></messages>
          </div>
        </div>
        <footer class="bg-gray-100 dark:bg-gray-700 p-2 rounded-b-md">
          <div class="flex items-center">
            <button type="button" class="focus:outline-none pr-1" :disabled="!isSelectedChatActive"
                    @click="selectAttachment()">
              <svg class="mx-auto h-10 w-10 text-gray-400"
                   :stroke="isSelectedChatActive? '#4eafcb':'#6c757d'" fill="none" viewBox="0 0 48 48"
                   aria-hidden="true">
                <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <textarea :disabled="!isSelectedChatActive" v-model="message" @keydown.enter.prevent="sendMessageHandler"
                      class="w-full px-2 dark:bg-gray-800 rounded-md resize-none focus:border-gray-300
                      dark:text-gray-300 border-gray-300 dark:border-gray-600  focus:ring-2 focus:ring-gray-200
                      focus:ring-opacity-50 dark:focus:ring-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      ref="msg" dir="auto"></textarea>
            <input ref="attachment" accept="image/*" name="attachment" type="file" class="hidden"
                   @change="sendAttachment">
          </div>
        </footer>
      </div>
      <!-- side menu -->
      <div v-if="isSideMenuOpen"
           class="flex flex-col min-w-1/4 h-full overflow-y-hidden mx-2
      dark:bg-gray-800 bg-white border dark:border-gray-600 rounded-lg">
        <div class="w-full">
          <nav class="flex flex-row-reverse bg-gray-100 dark:bg-gray-800">
            <button @click="changeSideMenuTab('chats')" :class="{'side-tab-active':sideMenuSelectedTab=== 'chats'}"
                    class="side-tab block focus:outline-none">
              درخواست های گفتگو
            </button>
            <button @click="changeSideMenuTab('agents')" :class="{'side-tab-active':sideMenuSelectedTab=== 'agents'}"
                    class="side-tab block focus:outline-none">
              کارشناسان
            </button>
          </nav>
        </div>
        <!-- chat requests -->
        <div v-if="sideMenuSelectedTab==='chats'" class="px-2 overflow-y-auto h-full">
          <ul class="divide-y divide-gray-100 dark:divide-gray-600">
            <li v-for="(user, index) in PendingChatList" v-bind:key="index"
                class="flex flex-col mt-3 flex-row-reverse bg-gray-100 dark:bg-gray-700 py-2 rounded-md
                hover:text-gray-800 dark:hover:text-gray-400">
              <div class="flex items-center flex-row-reverse px-1">
                <div class="flex-shrink-0 h-8 w-8">
                <span class="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600">
                  <svg class="h-full w-full text-gray-300 dark:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </span>
                </div>
                <div class="mr-3">
                  <div class="text-sm dark:text-gray-300">
                    {{ user.userFullName }}
                  </div>
                </div>
              </div>
              <div class="text-sm px-1 py-1 text-right dark:text-gray-300 pr-10">{{ user.departmentTitle }}</div>
              <div class="text-sm px-1 py-1 text-right text-gray-500 dark:text-gray-400 pr-10">{{ user.subject }}</div>
              <div class="flex flex-row-reverse actions px-1 justify-center">
                <button type="button" @click="accept(user.chatObjectId,index,)" :disabled="processing"
                        class="text-white bg-green-550 ml-1 inline-flex items-center px-2 py-1 rounded-md
                        shadow-sm text-sm dark:bg-green-650 hover:bg-green-650 dark:hover:bg-green-550
                        focus:outline-none focus:ring-0 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed
                        border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-0">
                  <svg class="feature-icon h-4 w-4">
                    <use xlink:href="fonts/feather-sprite.svg#check"/>
                  </svg>
                  <span class="text-sm pl-1">شروع گفتگو</span>
                </button>
                <button type="button" @click="reject(user.chatObjectId,index)" :disabled="processing"
                        class="text-white inline-flex items-center px-2 py-1  rounded-md
                        shadow-sm text-sm bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500
                        focus:outline-none focus:ring-0 px-2 py-1 rounded-md shadow-sm text-sm disabled:opacity-50
                        focus:outline-none focus:ring-0 disabled:cursor-not-allowed">
                  <svg class="feature-icon w-4 h-4">
                    <use xlink:href="fonts/feather-sprite.svg#x"/>
                  </svg>
                  <span class="text-sm pl-1">رد درخواست</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <!-- staffs -->
        <div v-if="sideMenuSelectedTab==='agents'" class=" dark:bg-gray-800 text-right overflow-y-auto h-full px-1
        text-gray-500 dark:text-gray-400 text-sm">
          <template v-for="(team, index) in staffList" v-bind:key="index">
            <div class="pt-2 pr-4 flex justify-between flex-row-reverse items-center"
                 @click="team.display = !team.display">
              <h3 class="text-kblue-300 font-medium">{{ team.title }}</h3>

              <svg class="feature-icon w-4 h-4">
                <use v-if="!team.display && team.staff" xlink:href="fonts/feather-sprite.svg#minus"/>
                <use v-else xlink:href="fonts/feather-sprite.svg#plus"/>
              </svg>
            </div>
            <ul v-if="team.display && team.staff"
                class="divide-y divide-gray-200 dark:divide-gray-600 shadow-inner bg-gray-50 dark:bg-gray-900
                rounded-md px-1 pb-1">
              <li v-for="(staff, index) in team.staff" v-bind:key="index"
                  class="flex items-center pt-1 mt-3 flex-row-reverse hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
                <div class="flex-shrink-0 h-7 w-7 relative">
                  <span class="inline-block h-7 w-7 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <svg class="h-full w-full text-gray-300 dark:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path
                          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </span>
                  <div :class="'side-status-'+staff.status"></div>
                </div>
                <div class="mr-3">
                  <div class="text-sm">
                    {{ staff.fullName }}
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <!-- settings -->
    <modal :show="isSettingModalOpen" :close-handler="closeSettingModal">
      <template #title>
        تنظیمات
      </template>

      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500 dark:text-gray-400">
          <div>پوسته</div>
          <div>
            <button
                class="rounded-md focus:outline-none"
                @click="toggleTheme"
                aria-label="Toggle color mode">
              <svg class="feature-icon w-5 h-5">
                <use v-if="theme === 'dark'" xlink:href="fonts/feather-sprite.svg#sun"/>
                <use v-if="theme === 'light'" xlink:href="fonts/feather-sprite.svg#moon"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500 dark:text-gray-400 mt-2">
          <div>پخش صدا هنگام دریافت پیغام</div>
          <div>
            <button class="w-10 h-6 bg-gray-300 rounded-full flex-shrink-0 p-1 duration-300 ease-in-out
                           focus:outline-none"
                    @click="toggleMessageSound()"
                    :class="{ 'bg-kblue-300': messageSoundActive}">
              <div class="bg-white w-4 h-4 rounded-full shadow-md duration-300 ease-in-out transform"
                   :class="{ '-translate-x-4': messageSoundActive}"></div>
            </button>
          </div>
        </div>
      </template>

      <template #footer>
        <button @click="closeSettingModal"
                class="inline-flex items-center px-4 py-2 bg-kblue-300 border border-transparent
    rounded-md text-xs text-white uppercase ltr:tracking-widest hover:bg-kblue-400
    dark:hover:bg-kblue-400 active:bg-green-550 focus:outline-none focus:border-gray-900
    transition ease-in-out duration-150">ذخیره
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
// @ is an alias to /src
import {useToast} from "vue-toastification";
import {POSITION} from "vue-toastification";

import custom from "@/custom";
import CannedItem from "@/components/CannedItem";
import Messages from "@/components/Messages";
import Modal from "@/components/Modal";

export default {
  name: "Panel",
  components: {Messages, CannedItem, Modal},
  data() {
    return {
      userDropDownMenu: false,
      isMobileDevice: false,
      isSideMenuOpen: false,
      isCannedMenuOpen: false,
      isTransferMenuOpen: false,
      isTransferDepMenuOpen: false,
      isTransferTeamMenuOpen: false,
      isSettingModalOpen: false,
      pendingChatActionButtons: true,
      processing: false,
      cron: null,
      cronInterval: 10000,
      isCronRunning: false,
      sideMenuSelectedTab: 'chats', //agents
      currentUser: null,
      staffList: [],
      cannedMessages: {},
      departments: [],
      teams: [],
      PendingChatList: [],
      activeChats: [],
      selectedChat: null,
      message: "",
      notification: false,
      messageSoundActive: false,
      requestSound: null,
    }
  },
  setup() {
    // Get toast interface
    const toast = useToast();

    // Make it available inside methods
    return {toast}
  },
  created: function () {
    this.isSideMenuOpen = !custom.detectMobileDevice();
    this.isMobileDevice = custom.detectMobileDevice();

    this.currentUser = this.$store.getters["currentUser"];
    this.cannedMessages = this.$store.getters['canned'];
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding,) {
        el.eventSetDrag = function () {
          el.setAttribute('data-dragging', 'yes');
        }
        el.eventClearDrag = function () {
          el.removeAttribute('data-dragging');
        }
        el.eventOnClick = function (event) {
          var dragging = el.getAttribute('data-dragging');
          // Check that the click was outside the el and its children, and wasn't a drag
          if (!(el == event.target || el.contains(event.target)) && !dragging) {
            // call method provided in attribute value
            //vnode.context[binding.expression](event);
            binding.value(event, el);
          }
        };
        document.addEventListener('touchstart', el.eventClearDrag);
        document.addEventListener('touchmove', el.eventSetDrag);
        document.addEventListener('click', el.eventOnClick);
        document.addEventListener('touchend', el.eventOnClick);
      }, unmounted(el) {
        document.removeEventListener('touchstart', el.eventClearDrag);
        document.removeEventListener('touchmove', el.eventSetDrag);
        document.removeEventListener('click', el.eventOnClick);
        document.removeEventListener('touchend', el.eventOnClick);
        el.removeAttribute('data-dragging');
      },
    }
  },
  mounted() {
    this.activeChats = this.$store.getters["getActiveChats"];
    this.departments = this.$store.state.departments;
    this.teams = this.$store.state.teams;

    if (Notification.permission === 'denied' || Notification.permission === 'default') {
      this.notification = false
    } else {
      this.notification = true
    }

    this.requestSound = new Audio(require('@/assets/sound/tone1.mp3'))

    this.cronTask();
  },
  watch: {
    PendingChatList(val, oldVal) {
      if (val.length > oldVal.length) {
        // this.toast.info('درخواست جدید گفتگو', {
        //   position: POSITION.BOTTOM_RIGHT
        // });
        // this.createNotification();
        this.playSound();
        this.sideMenuSelectedTab = 'chats';
        this.isSideMenuOpen = true;
      }
    }
  },
  computed: {
    config() {
      return this.$store.getters["config"];
    },
    now() {
      return Math.round(new Date().getTime() / 1000);
    },
    SelectedChatObject() {
      return this.$store.getters.getSelectedChatObject(this.selectedChat);
    },
    isSelectedChatActive() {
      if (!this.selectedChat) {
        return false;
      }
      let obj = this.$store.state.activeChats.find(x => x.chatObjectId === this.selectedChat);
      let index = this.$store.state.activeChats.indexOf(obj);

      if (index > -1 && this.$store.state.activeChats[index].active) {
        return true;
      }
      return false;
    },
  },
  methods: {
    requestNotificationPermission() {
      let img = 'img/notification.png';
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        new Notification("اعلان ها فعال میباشد", {
          icon: img,
          dir: 'rtl',
        });
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            new Notification("اعلان ها فعال شد", {
              icon: img,
              dir: 'rtl',
            });
            this.notification = true
          }
        });
      }
    },
    createNotification() {
      // Create and show the notification

      //let text = 'از طرف ' + name + ' با شماره ' + mobile + ' از دپارتمان ' + department;
      let text = 'شما درخواست گفتگوی جدیدی دارید'
      let img = 'img/notification.png';
      new Notification('درخواست گفتگو', {
        body: text,
        icon: img,
        dir: 'rtl',
      });
    },
    logout() {
      this.selectedChat = null
      this.$store
          .dispatch("logout")
          .then(() => {
            this.$router.push({name: "Login"});
          })
          .catch((error) => {
            console.log(error);
          });
    },
    scrollToEnd() {
      var messageDisplay = this.$refs.chatContainer;
      messageDisplay.scrollTop = messageDisplay.scrollHeight;
    },
    windowsResized() {
      this.isMobileDevice = window.innerWidth < 600;
    },
    openSettingsModal() {
      this.isSettingModalOpen = true
      this.userDropDownMenu = false;
    },
    closeSettingModal() {
      this.isSettingModalOpen = false
    },
    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen
    },
    changeSideMenuTab(tab) {
      this.sideMenuSelectedTab = tab;
    },
    toggleCannedMenu() {
      this.isCannedMenuOpen = !this.isCannedMenuOpen
    },
    closeCannedMenu() {
      this.isCannedMenuOpen = false
    },
    closeUserMenu() {
      this.userDropDownMenu = false
    },
    toggleTransferMenu() {
      this.isTransferMenuOpen = !this.isTransferMenuOpen
    },
    closeTransferMenu() {
      this.isTransferMenuOpen = false
    },
    toggleTransferSubMenu(type) {
      if (type === 'team') {
        this.isTransferDepMenuOpen = false;
        this.isTransferTeamMenuOpen = !this.isTransferTeamMenuOpen
      } else if (type === 'dep') {
        this.isTransferTeamMenuOpen = false;
        this.isTransferDepMenuOpen = !this.isTransferDepMenuOpen
      }
    },
    updateStatus: function (status) {
      this.$store.commit('updateCurrentUserStatus', status);
      this.currentUser = this.$store.getters["currentUser"];
      this.userDropDownMenu = false;
    },
    playSound() {
      //this.requestSound = new Audio(require('@/assets/sound/tone1.mp3'));
      //let audio = new Audio(require('@/assets/sound/tone1.mp3'));
      this.requestSound.play();
    },
    playMessageSound() {
      let audio = new Audio(require('@/assets/sound/message.wav'));
      audio.play();
    },
    transfer(chatObjectId, type, data) {
      this.$store
          .dispatch("transfer", {chatObjectId, type, data})
          .then(() => {
            this.isTransferMenuOpen = false;
            this.toast.success('در حال انتقال گفتگو', {
              position: POSITION.TOP_RIGHT
            });
            this.createNotification();
          })
          .catch((error) => {
            this.toast.error('مشکل در انتقال گفتگو', {
              position: POSITION.TOP_RIGHT
            });
            this.createNotification();
            console.log(error);
          });
    },
    reject(chatObjectId, index) {
      this.$store
          .dispatch("reject", chatObjectId)
          .then(() => {
          })
          .catch((error) => {

            console.log(error);
          });
      this.PendingChatList.splice(index, 1);
    },
    accept(chatObjectId, index) {
      this.processing = true
      let object = this.PendingChatList[index]
      this.$store
          .dispatch("accept", chatObjectId)
          .then(() => {
            this.$store.commit('accept', object);
            if (this.currentUser.greeting !== undefined) {
              // let unsubscribe = null
              // unsubscribe = this.$store.subscribe(({type}) => {
              //   if (type === 'parseEvents') {
              this.$store
                  .dispatch("sendMessage", {
                    chatObjectId: chatObjectId,
                    type: "text",
                    message: this.currentUser.greeting
                  }).catch((error) => {
                console.log(error);
              });
              //     unsubscribe() // it only reacts once.
              //   }
              // })
            }
            this.PendingChatList.splice(index, 1);
            this.processing = false
          })
          .catch((error) => {
            console.log(error);
          });
      //this.PendingChatList.splice(index, 1);
    },
    selectChat(chatObjectId) {
      //save message

      if (this.selectedChat) {
        let activeChatObject = this.$store.state.activeChats.find(x => x.chatObjectId === this.selectedChat);
        //let activeChatIndex = context.state.activeChats.indexOf(activeChatObject);
        activeChatObject.message = this.message;
      }

      this.selectedChat = chatObjectId
      let selectedChatObject = this.$store.state.activeChats.find(x => x.chatObjectId === chatObjectId);
      this.message = selectedChatObject.message

      this.$store.commit('resetNewMessageCount', chatObjectId)
    },
    selectAttachment() {
      this.$refs.attachment.click();
    },
    sendMessageHandler(e) {
      if (!e.shiftKey) {
        this.sendMessage();
      } else {
        if (this.message) {
          this.message = `${this.message}\n`
        } else {
          this.message = '\n'
        }
      }
    },
    /**
     * @todo check if chat is enable
     */
    sendMessage() {
      if (this.message !== '' && !this.processing) {
        this.processing = true
        this.$store
            .dispatch("sendMessage", {
              chatObjectId: this.selectedChat,
              type: "text",
              message: this.message,
            })
            .then(() => {
              this.message = '';
              this.scrollToEnd();
            })
            .catch((error) => {
              this.toast.error('مشکل اتصال به سرور', {
                position: POSITION.TOP_RIGHT
              });
              this.createNotification();
              console.log(error);

            })
            .finally(() => {
              this.processing = false;
            });
      }
    },
    // cannot read property type from undefined
    sendAttachment() {
      let file = this.$refs.attachment.files[0];
      const allowedExtension = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'];
      if (!allowedExtension.includes(file.type)) {
        this.toast.error('نوع فایل مجاز نیست.', {
          position: POSITION.BOTTOM_RIGHT
        });
        return;
      }

      if (file.size > this.config.variables.max_upload_size) {
        this.toast.error('سایز فایل مجاز نیست.', {
          position: POSITION.BOTTOM_RIGHT
        });
        return;
      }

      let data = new FormData();
      data.append('name', 'imagecontainer');
      data.append('file', file);

      this.$store
          .dispatch("sendAttachment", {
            chatObjectId: this.selectedChat,
            type: 'image',
            attachment: file,
            message: file.name,
          })
          .then(() => {
            this.scrollToEnd();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    sendCanned(canned) {
      let message = ''
      if (canned.image) {
        this.processing = true
        this.$store
            .dispatch("sendMessage", {
              chatObjectId: this.selectedChat,
              type: "image",
              message: canned.image,
            })
            .then(() => {
              this.scrollToEnd();
            })
            .catch((error) => {
              this.toast.error('مشکل اتصال به سرور', {
                position: POSITION.TOP_RIGHT
              });
              this.createNotification();
              console.log(error);
            })
            .finally(() => {
              this.processing = false;
            });
      }
      if (canned.message) {
        message += canned.message;
      }
      if (canned.url) {
        message += '\n\n' + canned.url;
      }
      this.message = message
      this.$refs.msg.focus()
      this.isCannedMenuOpen = false;
    },
    endChat() {
      if (this.selectedChat) {

        let obj = this.$store.state.activeChats.find(x => x.chatObjectId === this.selectedChat);
        let index = this.$store.state.activeChats.indexOf(obj);

        if (this.$store.state.activeChats[index].active) {
          this.$store
              .dispatch("leave", this.selectedChat)
              .then(() => {

              })
              .catch((error) => {
                console.log(error);
              });
        }
        this.selectedChat = null;
        this.$store.state.activeChats.splice(index, 1);
      }
    },
    cronTask() {
      this.cron = setInterval(() => {
        if (this.isCronRunning) {
          return;
        }
        this.isCronRunning = true;
        this.$store
            .dispatch("fetchVisitors")
            .then(() => {
              //this.queueList = this.$store.getters["getQueue"];
              this.staffList = this.$store.getters["getStaffList"];
              //console.log(this.staffList)
              this.PendingChatList = this.$store.getters["getPendingChats"];
              this.activeChats = this.$store.getters["getActiveChats"];
              this.detectNewMessage()
              this.isCronRunning = false;
            })
            .catch((error) => {
              console.log(error);
              this.isCronRunning = false;
            });
        if (this.activeChats.length > 0) {
          this.isCronRunning = true;
          this.$store.dispatch("sendConfirmations")
              .then(() => {
                this.isCronRunning = false;
              })
              .catch((error) => {
                this.isCronRunning = false;
                console.log(error);
              });
        }
      }, this.cronInterval);
    },
    detectNewMessage() {
      let play_sound = false
      for (const item of this.activeChats) {
        if (item.playSound) {
          if (this.messageSoundActive) {
            play_sound = true
          }
          this.$store.commit('turnOffMessageSound', item.chatObjectId)
        }
      }
      if (play_sound) {
        this.playMessageSound()
      }
    }
  },
  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.windowsResized, {passive: true})
    }
    clearInterval(this.cron)
  }
};
</script>
<style>
.top-20 {
  top:10px;
  position:relative;
}

.hh {
  height:calc(100vh - 5rem);
}

.status-1 {
  @apply absolute top-0 right-0 h-3 w-3 border-2 border-white rounded-full bg-green-400;
}

.status-2 {
  @apply absolute top-0 right-0 h-3 w-3 border-2 border-white rounded-full bg-gray-400;
}

.status-5 {
  @apply absolute top-0 right-0 h-3 w-3 border-2 border-white rounded-full bg-red-400;
}

.status-7 {
  @apply absolute top-0 right-0 h-3 w-3 border-2 border-white rounded-full bg-gray-400;
}

.side-status-1 {
  @apply absolute top-0 right-0 h-2 w-2 border border-white dark:border-green-550 rounded-full bg-green-550;
}

.side-status-2 {
  @apply absolute top-0 right-0 h-2 w-2 border border-white dark:border-gray-400 rounded-full bg-gray-400;
}

.side-status-5 {
  @apply absolute top-0 right-0 h-2 w-2 border border-white dark:border-red-400 rounded-full bg-red-400;
}

.side-status-7 {
  @apply absolute top-0 right-0 h-2 w-2 border border-white rounded-full bg-gray-400;
}

.chat-tab-active {
  @apply bg-gray-200 dark:bg-gray-800 border-b-2 text-gray-700 border-green-550 dark:text-gray-300;
}

.side-tab {
  @apply text-gray-600 dark:text-gray-400 py-3 px-4 text-sm w-full border-b dark:border-gray-600
}

.side-tab-active {
  @apply text-gray-800 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 font-medium
  border-kblue-300 dark:border-gray-400 dark:bg-gray-800
}

</style>