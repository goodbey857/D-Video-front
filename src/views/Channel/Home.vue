<template>
  <div id="channel-home">
    <v-parallax height="230" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-parallax>
    <div class="nav-bgcolor">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="6" md="6" lg="6" offset-md="1">
              <v-card class="transparent" flat>
                <v-list-item three-line>
                  <v-list-item-avatar size="80">
                    <v-img :src="userInfo.profilePhotoUrl" @click="toggleUploadStatus"></v-img>
                    <div >
                      <my-upload v-model="uploadStatus" :width="512" :height="512"
                        :url="ipfsRpc + '/api/v0/add?stream-channels=true&pin=false&progress=false'"
                        @crop-upload-success="cropUploadSuccess" img-format="jpg" langType="zh" noSquare>
                      </my-upload>
                    </div>

                  </v-list-item-avatar>
                  <v-list-item-content class="align-self-auto">
                    <v-list-item-title class="headline mb-1">
                      <v-text-field v-model="username" :class="editable ? 'text-h5' : 'text-h5 disabled-input'"
                        type="text" @blur="recoverUsername" :readonly="!editable" hide-details>
                        <template v-slot:append v-if="editable && usernameChange">
                          <v-btn icon class="green--text" @click="changeUsername"><v-icon>mdi-check</v-icon></v-btn>
                        </template>
                      </v-text-field>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ userInfo.address }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="3">


              <v-btn class="grey--text text--darken-2 mt-6" disabled text>
                关注 {{ userInfo.followers }}
              </v-btn>
              <v-btn class="grey--text text--darken-2 mt-6" disabled text>
                粉丝 {{ userInfo.fans }}
              </v-btn>

              <v-btn :class="followStatus == -1 ? 'red white--text mt-6' : 'grey black--text mt-6'" depressed outlined
                @click="toggleFollow" :loading="followStatus == 0 ? true : false">{{ followStatus == -1 ? "关 注"
                :"已关注"}}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-card flat class="transparent">
        <v-tabs v-model="tab" background-color="transparent" show-arrows centered center-active>
          <v-tab v-for="(item, i) in items" :key="i">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-container fluid>
          <v-tabs-items v-model="tab" class="transparent">
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>热门视频</v-card-title>
                <!-- <v-sheet class="mx-auto"> -->
                <v-slide-group class="pa-4" multiple show-arrows>
                  <v-slide-item v-for="video in loading ? tempVideos : videos" :key="video.id">
                    <v-skeleton-loader type="card-avatar" :loading="loading" width="250px" class="mr-1">
                      <video-card :card="{ maxWidth: 250, type: 'noAvatar' }" :video="video"></video-card>
                    </v-skeleton-loader>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
            </v-tab-item>
            <v-tab-item>
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
              <series :seriesList="seriesList" :loading="false"></series>
            </v-tab-item>
          </v-tabs-items>
          <v-tab-item>
            {{ userInfo.bio }}
          </v-tab-item>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload';
import VideoCard from "@/components/VideoCard";
import userApi from "@/apis/userApi";
import videoApi from "@/apis/videoAPI";
import util from "@/apis/util";
import VideoCardList from "@/components/VideoCardList.vue";
import Series from "@/components/Series.vue";
import { mapGetters } from 'vuex';
export default {
  data: () => ({
    tab: null,
    loading: true,
    items: ["热门", "视频", "合集","关于"],

    channel: {
      url: "/channels/12",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    userInfo: {},
    videos: [],
    page: 1,
    seriesList: [],
    tempVideos: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    followStatus: -1,
    editable:false,
    username: "",
    profilePhotoCid: '',
    uploadStatus: false,
  }),
  components: {
    VideoCard,
    VideoCardList,
    Series,
    myUpload

  },
  methods: {
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    toggleUploadStatus() {
      if(this.editable)
        this.uploadStatus = !this.uploadStatus;
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
        this.username = this.userInfo.username;
        this.followStatus = res.followStatus?1:-1;
      });
    },
    recoverUsername(){
      this.username = this.userInfo.username;
    },
    cropUploadSuccess(jsonData) {

      console.log(jsonData);
      this.profilePhotoCid = jsonData.Hash;
      userApi.changeAvatar(this.profilePhotoCid).then((res) => {
        if (res.code == 0) {
          this.userInfo.profileImageCid = this.profilePhotoCid;
          this.userInfo.profilePhotoUrl = this.getIpfsURL(this.profilePhotoCid);
          this.$store.commit('SET_USER_DATA',this.userInfo);
        }
      })
      

    },

    loadMore() {
      var userAddress = this.$route.params.id;
      videoApi.getSomeBodyVideos(userAddress, this.page, 20).then((res) => {
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
        this.loading = false;
      });
      this.page++;
    },

    getSeriesList() {
      var userAddress = this.$route.params.id;
      videoApi.getSeriesList(userAddress).then((res) => {
        res.seriesList.forEach((series) => {
          series.coverUrl = this.getIpfsURL(series.coverCid);
        });
        this.seriesList = res.seriesList;
      });
    },

    async changeUsername(){
      var resp = await userApi.changeUsername(this.username);
      if(resp.code == 0){
        this.userInfo.username = this.username;
        this.$store.commit('SET_USER_DATA', this.userInfo);
      }
    },

    toggleFollow() {
      var userAddress = this.$route.params.id;
      if (this.followStatus == -1) {
        this.followStatus = 0;
        userApi.follow(userAddress).then((res) => {
          if (res.code == 0) {
            this.followStatus = 1;
          }
        })
      } else if (this.followStatus == 1) {
        this.followStatus = 0;
        userApi.unfollow(userAddress).then((res) => {
          if (res.code == 0) {
            this.followStatus = -1;
          }
        })
      }

    }
  },
  watch: {
    '$route.params': {
      handler(newParams, oldParams) {
        if (newParams != oldParams) {
          this.page = 1;
          this.videos = [];
          this.getUserInfo();
          this.loadMore();
          this.getSeriesList();
          var address = this.$route.params.id;
          this.editable = address == "@me" ? true : false;
        }
      },
      deep: true // 可以监听对象内部属性的变化
    }
  },
  computed:{
    usernameChange(){
      return this.username == this.userInfo.username?false:true;
    },
    ...mapGetters(['ipfsRpc', 'ipfsRpcList']),

  },

  mounted() {
    this.getUserInfo();
    this.loadMore();
    this.getSeriesList();
    var address = this.$route.params.id;
    this.editable = address == "@me" ? true : false;
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
.disabled-input {
  pointer-events: none;
}
</style>
