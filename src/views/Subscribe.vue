<template>
  <div id="subscribe" class="pa-4"  v-infinite-scroll="loadMore"  infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <v-container fluid>
      <h3 class="headline font-weight-medium">关 注</h3>
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
              :channel="channel"
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
  name: 'Subscribe',
  data: () => ({
    loading: true,
    page: 1,
    videoList: [],
    // video: {
    //   url: '/watch/12',
    //   thumb: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    //   title: 'Top western road trips',
    //   views: '9.6k',
    //   createdAt: '6 hours ago'
    // },
    channel: {
      url: '/channels/12',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
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
      this.loading = true
      var videoListCopy = this.videoList
      videoAPI.getFollowVideos(this.page,20).then(res => {
        videoListCopy.push(...res)
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
