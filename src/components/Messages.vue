<template>
  <div class="clearfix" v-for="(msg,index) in chat.messages" v-bind:key="index">
    <div class="w-2/4 mx-4 my-2 p-2 rounded-lg rtl shadow-sm border-white"
         :class="{'user-msg':msg.from==='user',
         'staff-msg':msg.from==='staff' && msg.userId ===null,
         'co-staff-msg':msg.from==='staff' && msg.userId !==null}">
      <p v-if="msg.type === 'text' || msg.type === 'leave' || msg.type === 'enter' " v-html="nl2br(msg.content)"></p>
      <img v-if="msg.type==='image'" :src="msg.content" class=" mx-auto rounded">
      <span class="ltr float-left mt-2 text-gray-500">{{ timeFormat(msg.timestamp) }}</span>
      <span class="ltr float-right mt-2 text-gray-500">{{ msg.fullName }}</span>
    </div>
  </div>
  <div v-if="chat.warning" class="clearfix items-center justify-center flex w-full">
    <div class="w-3/4  mx-4 my-2 p-2 rounded-lg rtl shadow-sm border-white warning-msg">
      {{ chat.warning.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Messages",

  props: {
    chatObjectId: String,
  },
  data() {
    return {}
  },
  computed: {
    chat() {
      return this.$store.getters.getSelectedChatObject(this.chatObjectId);
    }
  },
  methods: {
    timeFormat(timestapm) {
      //return new Date(timestapm * 1e3).toISOString().slice(-13, -5);

      const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'medium',
        timeZone: 'Asia/Tehran'
      });
      if (timestapm === undefined) {
        return dtFormat.format(new Date());
      }
      return dtFormat.format(new Date(timestapm * 1e3));
    },
    nl2br (str, is_xhtml) {
      // http://kevin.vanzonneveld.net
      // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Philip Peterson
      // +   improved by: Onno Marsman
      // +   improved by: Atli Þór
      // +   bugfixed by: Onno Marsman
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +   improved by: Maximusya
      // *     example 1: nl2br('Kevin\nvan\nZonneveld');
      // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
      // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
      // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
      // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
      // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
  }
}
</script>

<style scoped>
.user-msg {
  @apply bg-gray-200 float-left;
}

.staff-msg {
  @apply bg-green-550 float-right;
}

.co-staff-msg {
  @apply bg-yellow-400 float-left;
}

.warning-msg {
  @apply bg-red-400 float-left;
}
</style>