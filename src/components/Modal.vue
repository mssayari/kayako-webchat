<template>
  <teleport to="#modal">
    <transition leave-active-class="duration-200">
      <div v-show="show"
           class="fixed top-0 inset-x-0 px-4 py-6 sm:px-0 sm:flex sm:items-top sm:justify-center z-20
                 max-h-full ">
        <transition enter-active-class="ease-out duration-300"
                    enter-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="ease-in duration-200"
                    leave-class="opacity-100"
                    leave-to-class="opacity-0">
          <div v-show="show" class="fixed inset-0 transform transition-all" @click="closeHandler">
            <div class="absolute inset-0 bg-gray-700 dark:bg-gray-800 opacity-75"></div>
          </div>
        </transition>

        <transition enter-active-class="ease-out duration-300"
                    enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-active-class="ease-in duration-200"
                    leave-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div v-show="show"
               class="rtl bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:w-full
               overflow-y-auto"
               :class="maxWidthClass">
            <div class="px-6 py-4">
              <div class="text-md dark:text-gray-300">
                <slot name="title">
                </slot>
              </div>

              <div class="mt-4 text-sm dark:text-gray-600">
                <slot name="content">
                </slot>
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-100 rounded-b-lg dark:bg-gray-700">
              <slot name="footer">
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  props: {
    closeHandler: Function,
    show: {
      default: false
    },
    maxWidth: {
      default: '2xl'
    },
    closeable: {
      default: true
    },
  },

  methods: {
    // close() {
    //   if (this.closeable) {
    //     this.$emit('close')
    //   }
    // }
  },

  watch: {
    show: {
      immediate: true,
      handler: function(show)  {
        if (show) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = null
        }
      }
    }
  },

  created() {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape' && this.show) {
        this.closeHandler()
      }
    }

    document.addEventListener('keydown', closeOnEscape)

    // this.$once('hook:destroyed', () => {
    //   document.removeEventListener('keydown', closeOnEscape)
    // })
  },

  computed: {
    maxWidthClass() {
      return {
        'sm': 'sm:max-w-sm',
        'md': 'sm:max-w-md',
        'lg': 'sm:max-w-lg',
        'xl': 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
      }[this.maxWidth]
    }
  }
}
</script>
