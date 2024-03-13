<template>
  <div id="channel-home">
    <v-parallax
      height="230"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-parallax>
    <div class="nav-bgcolor">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
              <v-card class="transparent" flat>
                <v-list-item three-line>
                  <v-list-item-avatar size="80"
                    ><v-img :src="userInfo.profilePhotoUrl"></v-img
                  ></v-list-item-avatar>
                  <v-list-item-content class="align-self-auto">
                    <v-list-item-title class="headline mb-1">{{
                      userInfo.username
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ userInfo.address }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="5" md="3" lg="3">
              <v-btn class="grey--text text--darken-2 mt-6" disabled text>
                关注 {{ userInfo.followers }}
              </v-btn>
              <v-btn class="grey--text text--darken-2 mt-6" disabled text>
                粉丝 {{ userInfo.fans }}
              </v-btn>

              <v-btn class="red white--text mt-6" tile large depressed
                >关 注</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-card flat class="transparent">
        <v-tabs
          v-model="tab"
          background-color="transparent"
          show-arrows
          centered
          center-active
        >
          <v-tab v-for="(item, i) in items" :key="i">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-container fluid>
          <v-tabs-items v-model="tab" class="transparent">
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <!-- <v-sheet class="mx-auto"> -->
                <v-slide-group class="pa-4" multiple show-arrows>
                  <v-slide-item v-for="video in loading ? tempVideos : videos" :key="video.id">
                    <v-skeleton-loader
                      type="card-avatar"
                      :loading="loading"
                      width="250px"
                      class="mr-1"
                    >
                      <video-card
                        :card="{ maxWidth: 250, type: 'noAvatar' }"
                        :video="video"

                      ></video-card>
                    </v-skeleton-loader>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
            </v-tab-item>
            <v-tab-item >
              <!-- <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    v-for="video in loading ? tempVideos : videos" :key="video.id"
                    class="mx-xs-auto"
                  >
                    <v-skeleton-loader type="card-avatar" :loading="loading">
                      <video-card
                        :card="{ maxWidth: 350 }"
                        :video="video"

                      ></video-card>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-card> -->
              <video-card-list :videos="videos" :loading="loading" :loadMore="loadMore">
              </video-card-list>
            </v-tab-item>
            <v-tab-item>
              <series :seriesList = "seriesList" :loading="false"></series>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import VideoCard from "@/components/VideoCard";
import userApi from "@/apis/userApi";
import videoApi from "@/apis/videoAPI";
import util from "@/apis/util";
import VideoCardList from "@/components/VideoCardList.vue";
import Series from "@/components/Series.vue";

export default {
  data: () => ({
    tab: null,
    loading: true,
    items: ["Home", "Videos", "Playlists", "Community", "Channels", "about"],

    channel: {
      url: "/channels/12",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    userInfo: {},
    videos: [],
    page: 1,
    seriesList: [],
    tempVideos: [{id:1},{id:2},{id:3},{id:4},{id:5}]
  }),
  components: {
    VideoCard,
    VideoCardList,
    Series
  },
  methods: {
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    getUserInfo() {
      var userAddress = this.$route.params.id;
      userApi.getInfo(userAddress).then((res) => {
        this.userInfo = {
          ...res.user,
          profilePhotoUrl: this.getIpfsURL(res.user.profileImageCid),
          followers: util.formatNum(res.user.followerNum),
          fans: util.formatNum(res.user.fanNum),
        };
      });
    },

    loadMore(){
      var userAddress = this.$route.params.id;
      videoApi.getSomeBodyVideos(userAddress, this.page, 20).then(res => {
        for (var video of res.data) {
          this.videos.push({
            ...video,
            createdAt: util.formatDate(video.createAt),
            views: util.formatNum(video.viewNum),
            likes: util.formatNum(video.likeNum),
            stars: util.formatNum(video.starNum),
            comments: util.formatNum(video.commentNum),
            videoUrl: this.getIpfsURL(video.cid),
            authorPhotoUrl: this.getIpfsURL(video.authorPhotoCid),
            title: video.title,
            description: video.description,
          });
        }
        this.loading = false
      })
      this.page++
      
    },

    getSeriesList(){
      var userAddress = this.$route.params.id;
      videoApi.getSeriesList(userAddress).then(res => {
        res.seriesList.forEach(series => {
          series.coverUrl = this.getIpfsURL(series.coverCid);
        })
        this.seriesList = res.seriesList;
      })

    }
  },
  mounted() {
    this.getUserInfo();
    this.loadMore();
    this,this.getSeriesList();

  },
};
</script>

<style>
.nav-bgcolor {
  background: #f9f9f9;
}

.card {
  background: #f9f9f9 !important;
}

.v-tab {
  margin-right: 4em;
}

#channel-home .v-list-item--link:before {
  background-color: transparent;
}
</style>
