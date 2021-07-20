<template>
  <div>
    <header>
      <div class="row">
        <div class="col">
          <div class="btn-group w-100 menutop" role="group" aria-label="Basic example">
            <router-link v-if="logged" :to="{name: 'Home'}" class="btn btn-dark btn-sm" id="home-link">
              <i class="bi bi-house"></i>
              <label for="home-link" class="ms-2">Home</label>
            </router-link>
            <router-link v-if="!logged" :to="{name: 'Auth'}" class="btn btn-dark btn-sm" id="auth-link">
              <i class="bi bi-person-plus"></i>
              <label for="auth-link" class="ms-2">Log in</label>
            </router-link>
            <a v-else class="btn btn-dark btn-sm" href="#" @click.prevent="logout" id="auth-link">
              <i class="bi bi-person-x"></i>
              <label for="auth-link" class="ms-2">Log out</label>
            </a>
          </div>
        </div>
      </div>
    </header>
    <layout-default>
      <router-view class="mt-3" />
    </layout-default>
    <footer>
      <div class="row">
        <div class="col-4 text-start text-muted text-small ms-2">
          <small v-if="!bussy">{{ appversion }} <a href="#" @click.prevent="checkUpdate">check update</a></small>
            <span v-if="bussy">
              <span class="spinner-grow" role="status" style="width: 1rem; height: 1rem; vertical-align: -0.21em;"></span>
              <code class="ms-2">Bussy</code>
            </span>
            <span v-else>
              <code class="ms-2">Ready</code>
            </span>
        </div>
        <div class="col-3 text-center text-small">
          <code>&copy; {{ year }} Business Inc.</code>
        </div>
        <div class="col-4 text-end text-small">
          <img src="./assets/php-logo.svg" alt="php" style="width: 24px; height auto;"><code class="ms-2">{{ localServer }}</code>
        </div>
      </div>
    </footer>
    <div class="toast-container position-absolute" style="bottom: 40px !important; left: 5px !important;">
      <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
        <div class="toast-header">
          <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
          <strong class="me-auto">Application updater</strong>
          <small>0 mins ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { api, storageClear } from '@/modules/functions'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, watch, onMounted, ref } from 'vue';
import { Toast } from 'bootstrap'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const logged = computed(() => store.getters.logged);
    const bussy = computed(() => store.getters.bussy);
    const localServer = computed(() => store.getters.localServer)
    const appversion = ref(1);

    watch(logged, (islogged) => {
      if(islogged === false) router.push({name: 'Auth'})
    })

    async function checkUpdate() {
      store.dispatch('setBussy', true);
      var response = await api('https://api.github.com/repos/SCMS-Vue/extractor-milanuncios/releases/latest')
      response = await response.data
      var toastBody = document.querySelector('.toast-body');
      if(response.tag_name === appversion.value) {
        toastBody.innerHTML = 'Your application is up to date ('+ response.tag_name +')'
      } else {
        toastBody.innerHTML = 'Your application is old. There\'s a new version ('+ response.tag_name +'). Download the new app below <br><code>' + response.assets[0].browser_download_url+'</code>'
      }

      const toast = new Toast(document.querySelector('.toast'), {
        animation: true,
        autohide: false,
        delay: 1000,
      })
      toast.show()

      store.dispatch('setBussy', false);
    }

    function logout() {
      storageClear();
      store.dispatch('setLogged', false)
    }
    onMounted(() => {
      window.ipcRenderer.send('ping');
      setInterval(() => {
        window.ipcRenderer.send('ping')
      }, 10000);
      window.ipcRenderer.receive('pong', ({host, port, appver}) => {
        appversion.value = appver;
        const localhost = `http://${host}:${port}`
        store.dispatch('setLocalHostUrl', localhost);
      })
    })
    return {
      checkUpdate,
      appversion,
      localServer,
      bussy,
      logged,
      logout,
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss">
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
</style>
