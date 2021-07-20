<template>
<div>
  <div class="row g-5">
    <div class="col-12">
      <div class="text-center py-5">
        <h1 class="mb-3">Extractor data</h1>
      </div>
      <form class="needs-validation" novalidate="" @submit.prevent="startExtract">
          <div class="row g-3">
            <div class="col-12">
              <div class="form-floating mb-3">
                <input type="url" class="form-control" id="floatingInput" placeholder="Milanuncios item URL" v-model="targeturl" required>
                <label for="floatingInput">Milanuncios item URL</label>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <div class="row">
            <div class="col-9">
                <button class="w-100 btn btn-info btn-lg" type="submit" :disabled="bussy || targeturl.length < 10">
                  <div v-if="bussy" class="spinner-grow" role="status" style="width: 1.5rem; height: 1.5rem; vertical-align: -0.21em;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="bussy" class="ms-2"> Extracting ... </span>
                  <span v-else> Extract photos </span>
                </button>
            </div>
            <div class="col-3">
              <button class="w-100 btn btn-secondary btn-lg" type="reset" :disabled="bussy" @click="targeturl = ''">
                <span > Reset </span>
              </button>
            </div>
          </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import { api } from '@/modules/functions'
import { onMounted, ref, computed, reactive } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';



export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const store = useStore()
    const targeturl = ref('');

    const data = reactive({
      businesses: [],
    });
    
    const localServer = computed(() => store.getters.localServer)
    const bussy = computed(() => store.getters.bussy)
    const user = computed(() => store.getters.user)

    const response = ref('');
    const responsedata = ref(null)

    async function startExtract() {
      store.dispatch('setBussy', true);
      responsedata.value = await api(localServer.value + '/loop/' + btoa(targeturl.value))
      responsedata.value = await responsedata.value.data

      store.dispatch("setQueue", responsedata.value)
      setTimeout(() => {
        store.dispatch('setBussy', false);
        router.push({
          name: 'Businesses'
        }, 300)
      })
      
      
    }
    function refreshDB() {
      console.log('db refreshed')
    }

    onMounted(() => {
      refreshDB();
    });
    return {
      data,
      user,
      startExtract,
      bussy,
      targeturl
    }
  }
}
</script>
