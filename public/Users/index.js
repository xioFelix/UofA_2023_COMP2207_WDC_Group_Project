new Vue({
    el: '.loginPw',
    data: {
        password: '',
        showPassword: false,
    },
    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password'
        },
    },
    methods: {
        switchVisibility() {
            this.showPassword = !this.showPassword;
        }
    }
})

new Vue({
    el: '.signUpPw',
    data: {
        password: '',
        showPassword: false,
    },
    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password'
        },
    },
    methods: {
        switchVisibility() {
            this.showPassword = !this.showPassword;
        }
    }
})

