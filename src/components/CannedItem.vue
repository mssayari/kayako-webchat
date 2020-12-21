<template>
  <li>
    <div @click="isFolder? toggle() : clickHandler(item)"
         class="flex justify-between flex-row-reverse py-2 px-1 hover:text-gray-800"
         :class="{'font-medium': isFolder,' cursor-pointer': !isFolder,'text-gray-800':isFolder && isOpen}">
      <svg v-if="indent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="feather feather-corner-down-left w-3 h-3">
        <polyline points="9 10 4 15 9 20"></polyline>
        <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
      </svg>
      {{ item.title }}
      <svg v-if="isFolder && !isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="w-5 h-5">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      <svg v-if="isFolder && isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="feather feather-chevron-up w-5 h-5">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <svg v-if="!isFolder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="#43be80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="feather feather-chevrons-left w-5 h-5">
        <polyline points="11 17 6 12 11 7"></polyline>
        <polyline points="18 17 13 12 18 7"></polyline>
      </svg>
    </div>
    <ul v-show="isOpen" v-if="isFolder" class="pr-1">
      <canned-item v-for="(child, index) in item.children" :key="index" :item="child"
                   :indent="true" :clickHandler="clickHandler"></canned-item>
    </ul>
  </li>
</template>

<script>
export default {
  name: "CannedItem",
  props: {
    item: Object,
    clickHandler: Function,
    indent: {
      type: Boolean,
      default: false
    },
  },
  data: function () {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder: function () {
      return this.item.children && this.item.children.length;
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder: function () {
      if (!this.isFolder) {
        this.$emit("make-folder", this.item);
        this.isOpen = true;
      }
    }
  }
}
</script>

<style scoped>

</style>