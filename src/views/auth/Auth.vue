<template>
<form @submit.prevent="formSubmit" class="form-signin mt-5">
    <div class="text-center">
        <img class="mb-4" src="@/assets/bootstrap-logo.svg" alt="" width="72" height="57" />
        <h1 class="h1 mb-3 ">Log <span v-text="page === 'login' ? 'in' : 'up'"></span></h1>
    </div>
    <p class="text-danger" v-if="message.length">
        {{ message }}
    </p>
    <div class="form-floating">
        <input type="text" v-model="username" class="form-control" id="floatingInputUsername" placeholder="Username" required :disabled="bussy" />
        <label for="floatingInputUsername">Username</label>
    </div>
    <div class="form-floating">
        <input type="password" v-model="password" class="form-control" id="floatingInputPassword" placeholder="Password" required :disabled="bussy" />
        <label for="floatingInputPassword">Password</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="bussy">Sign in</button>
</form>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
    setup () {
        const router = useRouter()
        const store = useStore()
        const logged = computed(() => store.getters.logged);
        const bussy = computed(() => store.getters.bussy);
        const username = ref('')
        const password = ref('')
        const page = ref('login');
        const message = ref('');

        const secret = {
            u: 'ionion',
            p: 'parolamea21',
        }
        async function formSubmit(event) {
            store.dispatch('setBussy', true)
            message.value = ""
            if(username.value === secret.u && password.value === secret.p) {
                store.dispatch('setLogged', true)
            } else {
                message.value = "Username or password is not valid"
            }
            store.dispatch('setBussy', false)
            
            
        }
        onMounted(() => {
            document.body.className = 'text-center'
            if(logged.value === true) {
                router.push({name: 'Home'})
            }
        })
        onUnmounted(() => {
            document.body.className = 'bg-light'
        })

        watch(logged, (value) => {
            if(value === true) {
                router.push({name: 'Home'})
            }
        })
        return {
            name,
            logged,
            message,
            bussy,
            page,
            formSubmit,
            username,
            password
        }
    }
}
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>