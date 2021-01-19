<template>
  <li>
    <div @click="isFolder? toggle() : clickHandler(item)"
         class="flex justify-between flex-row-reverse py-2 px-1 hover:text-green-500"
         :class="{'font-medium': isFolder,' cursor-pointer': !isFolder,'text-green-500':isFolder && isOpen}">
      <svg class="feature-icon w-3 h-3">
        <use v-if="indent" xlink:href="fonts/feather-sprite.svg#corner-down-left"/>
      </svg>

      {{ item.title }}
      <svg class="feature-icon w-5 h-5">
        <use v-if="isFolder && !isOpen" xlink:href="fonts/feather-sprite.svg#chevron-down"/>
        <use v-if="isFolder && isOpen" xlink:href="fonts/feather-sprite.svg#chevron-up"/>
        <use v-if="!isFolder" xlink:href="fonts/feather-sprite.svg#chevrons-left"/>
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