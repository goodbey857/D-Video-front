<template>
  <div id="search">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="12" md="10" lg="11">
          <div v-for="user of userList" :key="user.id" class="mb-5">
            <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line" :loading="loading" tile large>
              <v-card class="card mb-10" tile flat router :to="'/channels/' + user.address">
                <v-row no-gutters justify="center">
                  <v-col cols="10" sm="10" md="3" lg="3" class="d-flex">
                    <!-- <v-responsive max-height="100%"> -->
                    <v-avatar size="130" max-width="150" class="mx-auto">
                      <v-img class="align-center" :src="user.profilePhotoUrl">
                      </v-img>
                    </v-avatar>
                    <!-- </v-responsive> -->
                  </v-col>
                  <v-col cols="10" sm="10" md="6" lg="6" class="justify-center">
                    <!-- <div class="ml-2"> -->
                    <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold align-center">
                      {{ user.username }}
                    </v-card-title>

                    <v-card-subtitle class="pl-2 pt-2 pb-0" style="line-height: 1.2">
                      {{ user.address }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-2 pt-2 pb-0">
                      {{ user.bio }}
                    </v-card-subtitle>
                    <!-- </div> -->
                  </v-col>
                  <v-col cols="10" sm="10" md="3" lg="3">
                    <v-btn class="red white--text mt-6" tile depressed>关注</v-btn>
                  </v-col>
                </v-row>
              </v-card>

            </v-skeleton-loader>
          </div>
          <div v-for="video of videoList" :key="video.id" class="mb-5">
            <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line" :loading="loading" tile large>
              <v-card class="card mb-10" tile flat :to="'/watch/' + video.id">
                <v-row no-gutters>
                  <v-col cols=" 5" sm="3" md="3" lg="3">
                    <!-- <v-responsive max-height="100%"> -->
                    <v-img class="align-center" :src=video.coverUrl>
                    </v-img>
                    <!-- </v-responsive> -->
                  </v-col>
                  <v-col cols="7" sm="7" md="8" lg="8">
                    <div class="ml-2">
                      <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold">
                        {{ video.title }}
                      </v-card-title>

                      <v-card-subtitle class="pl-2 pt-2 pb-0" style="line-height: 1.2">
                        {{ video.authorName }}<br />
                        9.6k views<v-icon>mdi-circle-small</v-icon>6 hours ago
                      </v-card-subtitle>
                      <v-card-subtitle class="pl-2 pt-2 pb-0">
                        {{ video.description }}
                      </v-card-subtitle>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-skeleton-loader>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import userApi from "@/apis/userApi";
import videoApi from "@/apis/videoAPI";
import util from "@/apis/util";
import recordAPI from "@/apis/recordAPI";

export default {
  data: () => ({
    loading: true,
    userList: [],
    videoList: [],
  }),
  methods: {
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    async record(){
      var keyword = this.$route.query['search-query'];
      await recordAPI.postSearch(keyword)
    },
    async searchUser(){
      var keyword = this.$route.query['search-query'];
      var tempUser = await userApi.search(keyword);

      for(let user of tempUser){
        this.userList.push({
          ...user,
          profilePhotoUrl: this.getIpfsURL(user.profileImageCid),
        });
        
      }
    },
    async searchVideo(){
      var keyword = this.$route.query['search-query'];
      var tempVideo = await videoApi.search(keyword);

      for(let video of tempVideo){
        this.videoList.push({
          ...video,
          createdAt: util.formatDate(video.createAt),
          views: util.formatNum(video.viewNum),
          likes: util.formatNum(video.likeNum),
          stars: util.formatNum(video.starNum),
          comments: util.formatNum(video.commentNum),
          videoUrl: this.getIpfsURL(video.cid),
          coverUrl: this.getIpfsURL(video.coverCid),
          authorPhotoUrl: this.getIpfsURL(video.authorPhotoCid),
          title: video.title,
          description: video.description,
        });
        
      }
    }

  },
  watch:{
    '$route'() {
      location.reload();
    }
  },
  async mounted() {

    await this.searchUser();
    await this.searchVideo();
    this.loading = false;
    this.record();
  }
}
</script>

<style></style>
