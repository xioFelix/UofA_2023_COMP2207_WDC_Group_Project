class Vue {
    // eslint-disable-next-line no-useless-constructor,no-empty-function
    constructor(param) {

    }

}

// eslint-disable-next-line no-new,no-undef
new Vue({
    el: '.managerLoginPw',
    data: {
        password: '',
        showPassword: false
    },
    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password';
        }
    },
    methods: {
        switchVisibility() {
            this.showPassword = !this.showPassword;
        }
    }
});

// eslint-disable-next-line no-new,no-undef
new Vue({
    el: '.managerSignUpPw',
    data: {
        password: '',
        showPassword: false
    },
    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password';
        }
    },
    methods: {
        switchVisibility() {
            this.showPassword = !this.showPassword;
        }
    }
});
