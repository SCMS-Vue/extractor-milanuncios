<template>
  <div class="container">
    <div class="row" v-if="images.length">
      <div class="col-12 mb-3">
        <h4>Milanuncios {{ item }}</h4>
        <swiper :loop="true" :slidesPerView="3" :spaceBetween="30" :centeredSlides="true" class="mySwiper">
          <swiper-slide v-for="(image, index) in images" :key="index">
            <img :src="image" alt="Image">
          </swiper-slide>
        </swiper>
      </div>
      <div class="col-3 mt-2">
        <div class="d-grid gap-2">
          <button @click="download" class="btn btn-dark" :disabled="status.length" type="button">
            <span v-if="status">{{ status }}</span>
            <span v-else>Download images</span>
          </button>
        </div>
        
      </div>
      <div class="col-9 mt-4">
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="{width: progress + '%'}" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">{{ progress }}%</div>
        </div>
      </div>
      
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Oh snap!</h4>
          <p>It looks like the category or the city location is not set. You must have refreshed the page or something bad happened.</p>
          <hr>
          <p class="mb-0">Click <router-link to="/">here to go back</router-link> and try again.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Swiper, SwiperSlide } from 'swiper/vue';
import SwiperCore, { Pagination } from 'swiper/core';
SwiperCore.use([Pagination]);
import 'swiper/swiper.scss';
import "swiper/components/pagination/pagination.min.css";

import { useStore } from 'vuex';
import { computed, onMounted, reactive, ref } from 'vue'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup ({category, city}) {
    const store = useStore()
    const item = computed(() => store.getters.queue.item)
    const images = computed(() => store.getters.queue.images)
    const archive = computed(() => store.getters.queue.archive)
    const progress = ref(0)
    const status = ref('')
    const datares = ref(null)
    const pagination = reactive({
      clickable: true
    })

    function download() {
      window.ipcRenderer.send('download', archive.value);
    }
    onMounted(() => {
      window.ipcRenderer.receive('progress', (pg) => {
        progress.value = pg.percent * 100;
        console.log(progress.value)
        console.log(pg)
      })

      window.ipcRenderer.receive('archive', ({ msg, data }) => {
        status.value = msg
        if(data !== null) {
          datares.value = data
          console.log(datares.value)
        }
      })
    })
    return {
      status,
      download,
      pagination,
      item,
      images,
      archive,
      progress,
    }
  }
}
</script>

<style lang="scss" scoped>

.swiper-container {
  width: 100%;
  height: 400px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
