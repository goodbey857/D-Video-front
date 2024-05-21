<template>
  <div id="seriesDetail" class="pa-4">
    <v-container fluid>
      <h3 class="headline font-weight-medium">Series</h3>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="i in videoListIsEmpty ? 10 : videoList"
          :key="i.id"
          class="mx-xs-auto"
        >
          <v-skeleton-loader type="card-avatar" :loading = "videoListIsEmpty">
            <video-card
              :card="{ maxWidth: 350 }"
              :video="i"
            ></video-card>

          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import videoCard from '@/components/VideoCard'
import videoAPI from '@/apis/videoAPI'

export default {
  name: 'Home',
  data: () => ({
    loading: true,
    page: 1,
    videoList: [],
  }),
  components: {
    videoCard
  },
  computed:{
    videoListIsEmpty: function(){
      return this.videoList.length == 0
    }
  },
  methods: {
    loadMore(){
      
      var id = this.$route.params.id;
      videoAPI.getSeriesVideoList(id).then(res => {
        this.videoList.push(...res.seriesVideoList)
        this.loading = false
      })
      this.page++
      
    }
  },
  mounted() {
    this.loadMore();

  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
