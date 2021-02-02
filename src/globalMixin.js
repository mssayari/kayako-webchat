export default {
    data() {
        return {
            theme: null,
        }
    },
    created() {
        this.darkMode()

        //load app config
        this.getMessageSoundConfig()
    },
    methods: {
        darkMode() {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('html').classList.add('dark')
                this.theme = 'dark'
            } else {
                document.querySelector('html').classList.remove('dark')
                this.theme = 'light'
            }

            // Whenever the user explicitly chooses light mode
            //localStorage.theme = 'light'

            // Whenever the user explicitly chooses dark mode
            //localStorage.theme = 'dark'
        },
        toggleTheme() {
            if (this.theme === 'dark') {
                this.theme = 'light'
                localStorage.theme = 'light'
                document.querySelector('html').classList.remove('dark')
            } else {
                this.theme = 'dark'
                localStorage.theme = 'dark'
                document.querySelector('html').classList.add('dark')
            }
        },
        getMessageSoundConfig() {
            if (('message_sound' in localStorage) && localStorage.message_sound === 'true') {
                this.messageSoundActive = true
            }
        },
        toggleMessageSound() {
            this.messageSoundActive = !this.messageSoundActive;
            localStorage.message_sound = this.messageSoundActive
        },
    }
};