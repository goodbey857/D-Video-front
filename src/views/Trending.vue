<template>
  <div id="trending" class="pt-7 px-sm-10" v-infinite-scroll="loadMore"  infinite-scroll-disabled="loading" infinite-scroll-distance="50">
    <v-container fluid>
      <v-row>
        <v-col
          cols="8"
          sm="7"
          md="10"
          lg="10"
          v-for="video of videoList"
          :key="video.id"
          class="mx-lg-0 mx-md-0 mx-sm-auto mx-auto"
        >
          <!-- <v-container> -->
          <v-skeleton-loader
            class="mx-auto"
            type="list-item-avatar-three-line"
            :loading="loading"
            
            large
          >
            <v-card class="card"  flat router :to="'/watch/'+video.id">
              <v-row no-gutters>
                <v-col class="mx-auto" cols="12" sm="8" md="5" lg="4">
                  <!-- <v-responsive max-height="100%"> -->
                  <v-img
                    class="align-center"
                    :src="video.coverUrl"
                    lazy-src = "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                    height="200px"
                  
                  >
                  </v-img>
                  <!-- </v-responsive> -->
                </v-col>
                <v-col class="hidden-sm-and-down">
                  <div class="ml-4 ">
                    <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold">
                      {{ video.title }}
                    </v-card-title>

                    <v-card-subtitle class="pl-2 pb-0">
                      {{ video.views }}
                      次观看<v-icon>mdi-circle-small</v-icon>
                      {{ video.likes }}次喜欢<v-icon>mdi-circle-small</v-icon>
                      {{  video.createdAt }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-2 pt-0">
                      {{ video.description }}
                    </v-card-subtitle>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-skeleton-loader>
          <!-- </v-container> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import videoAPI from "@/apis/videoAPI";
import util from "@/apis/util";

export default {
  name: "Home",
  data: () => ({
    loading: true,
    page: 1,
    videoList: [],
  }),
  methods: {
    loadMore() {
      var videoListCopy = this.videoList;
      videoAPI.getNewVideos(this.page, 20).then((res) => {
        for (let videoMetadata of res) {
          let video = {
            ...videoMetadata,
            createdAt: util.formatDate(videoMetadata.createAt),
            views: util.formatNum(videoMetadata.viewNum),
            likes: util.formatNum(videoMetadata.likeNum),
            stars: util.formatNum(videoMetadata.starNum),
            comments: util.formatNum(videoMetadata.commentNum),
            videoUrl: this.getIpfsURL(videoMetadata.cid),
            authorPhotoUrl: this.getIpfsURL(videoMetadata.authorPhotoCid),
            coverUrl: this.getIpfsURL(videoMetadata.coverCid),
            title: videoMetadata.title,
            description: videoMetadata.description,
          };
          videoListCopy.push(video);
        }
        this.loading = false;
      });
      this.page++;
    },
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
  },
  mounted() {
    this.loadMore();
  },
};
</script>

<style lang="scss">
.v-skeleton-loader__list-item-avatar-three-line {
  height: 250px;
  .v-skeleton-loader__paragraph.v-skeleton-loader__bone {
    margin-top: -125px;
    @media (max-width: 700px) {
      display: none;
      margin-top: inherit;
    }
  }
  .v-skeleton-loader__avatar {
    height: 200px !important;
    width: 300px !important;
  }
  .v-skeleton-loader__text {
    height: 20px;
  }
}
</style>
