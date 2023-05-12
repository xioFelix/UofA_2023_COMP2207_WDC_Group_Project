new Vue({
    el: '.managerLoginPw',
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
    el: '.managerSignUpPw',
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
