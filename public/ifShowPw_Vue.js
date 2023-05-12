const Pw1 = new Vue({
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

const Pw2 = new Vue({
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

Pw1.$mount('#ifShowPw1');
Pw2.$mount('#ifShowPw2');
