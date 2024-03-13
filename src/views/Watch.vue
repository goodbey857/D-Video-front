<template>
  <div id="watch">
    <v-container fluid>
      <v-row>
        <v-col cols="11" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="8">
              <v-skeleton-loader type="card-avatar, article, actions" :loading="videoLoading" tile large>
                <v-responsive>
                  <video controls autoplay="autoplay">
                    <source :src="video.videoUrl" type="video/mp4" />
                  </video>
                </v-responsive>
                <v-card flat tile class="card">
                  <v-card-title class="pl-0 pb-0">{{
                    video.title
                  }}</v-card-title>
                  <div class="d-flex flex-wrap justify-space-between" id="btns">
                    <v-card-subtitle class="pl-0 pt-0 pb-0 subtitle-1" style="line-height: 2.4em">
                      {{ video.views }} views<v-icon>mdi-circle-small</v-icon>{{ video.createdAt }}
                    </v-card-subtitle>
                    <v-card-actions class="pt-0 pl-0 grey--text">
                      <v-btn icon :color="likeStatus == 1 ? 'pink' : 'grey'" @click="toggleLike" :loading = "likeStatus == 0 ? true: false"><v-icon >mdi-cards-heart</v-icon></v-btn>
                      {{ video.likes }}
                      <v-btn icon :color="starStatus == 1 ? 'yellow darken-2' : 'grey'" @click="toggleStar"><v-icon >mdi-star</v-icon></v-btn>{{ video.stars }}
                      <v-btn icon><v-icon>mdi-comment</v-icon></v-btn>
                      {{ video.comments }}
                      <!-- <v-btn text
                        ><v-icon>mdi-playlist-plus</v-icon> Save</v-btn
                      > -->
                    </v-card-actions>
                  </div>
                </v-card>

                <v-row class="justify-space-between">
                  <v-col cols="6" sm="6" md="5" lg="5">
                    <v-card class="transparent" flat>
                      <v-list-item three-line router :to="'/channels/'+video.authorAddress">
                        <v-list-item-avatar size="50"><v-img :src="video.authorPhotoUrl"></v-img></v-list-item-avatar>
                        <v-list-item-content class="align-self-auto">
                          <v-list-item-title class="font-weight-medium mb-1">{{
                            video.authorName
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{ video.subscribers }} subscribers
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="6" md="4" lg="4">
                    <div class="d-flex justify-end align-center">
                      <v-btn :class="followStatus==-1?'red white--text mt-6':'grey black--text mt-6'" depressed outlined @click="toggleFollow" :loading="followStatus==0?true:false" >{{ followStatus==-1?"关 注":"已关注"}}</v-btn>
                    </div>
                  </v-col>
                  <v-col class="pl-11" offset="1" cols="11" md="11">
                    <p>
                      {{
                        truncate
                        ? truncateText(video.description, 150)
                        : video.description
                      }}
                    </p>
                    <v-btn text @click="show" class="remove-hover-bg">Show More</v-btn>
                  </v-col>
                  <v-col>
                    <p class="mb-0">{{ commentList.length }} Comments</p>
                    <input type="text" ref="hello" />
                    <v-card class="transparent" flat>
                      <v-list-item three-line class="pl-0">
                        <v-list-item-avatar size="50"><v-img
                            :src="this.getIpfsURL(currentUser.profileImageCid)"></v-img></v-list-item-avatar>
                        <v-list-item-content class="align-self-auto">
                          <v-text-field v-model="comment" placeholder="Add a public comment..."
                            @click="showCommentBtns = true">
                          </v-text-field>
                          <div v-if="showCommentBtns" class="d-inline-block text-right">
                            <v-btn text @click="showCommentBtns = !showCommentBtns">Cancel</v-btn>
                            <v-btn class="blue darken-3 white--text" depressed tile @click="doComment"
                              :disabled="comment === ''">Comment</v-btn>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>

                    <v-card class="transparent" flat v-for="(comment, id ) in commentList" :key="comment.id">
                      <v-list-item three-line class="pl-0 mt-2">
                        <v-list-item-avatar size="50"><v-img
                            :src="comment.profilePhotoUrl" ></v-img></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium caption mb-1">{{ comment.username}}
                            <span class="font-weight-light grey--text">
                              {{ comment.createAt }}</span></v-list-item-title>
                          <v-list-item-subtitle class="black--text text--darken-4 caption">
                          {{ comment.content }}
                          </v-list-item-subtitle>
                          <!-- <v-list-item-action> -->
                          <div>
                            <!-- <button
                              class="caption font-weight-bold d-inline-block pa-2 grey--text text--darken-3"
                              style="cursor: pointer; outline: none"
                              @click.stop.prevent="showReply"
                            >
                              REPLY
                            </button> -->
                            <v-btn text small :ripple="false" @click.stop="showReply(`${'reply' + id}`)">Reply</v-btn>
                          </div>
                          <div class="d-none" :ref="`${'reply' + id}`">
                            <v-list-item three-line class="pl-0">
                              <v-list-item-avatar class="mt-0" size="40"><v-img
                                  :src="getIpfsURL(currentUser.profileImageCid)"></v-img></v-list-item-avatar>
                              <v-list-item-content class="align-self-auto mt-0 pt-0">
                                <v-form :ref="`form${id}`">
                                  <v-text-field :ref="`${'input' + id}`" class="pt-0 mt-0 body-2"
                                    placeholder="Add a public comment..." :value="repliesInput[`input${id}`]">
                                  </v-text-field>
                                </v-form>
                                <div :ref="id + 'btns'" class="d-inline-block text-right">
                                  <v-btn text @click="hideReply(id)" small>Cancel</v-btn>
                                  <v-btn class="blue darken-3 white--text" depressed tile small
                                    @click="addReply(id)">Reply</v-btn>
                                </div>
                              </v-list-item-content>
                            </v-list-item>
                            <!-- </v-list-item-action> -->
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-skeleton-loader>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4">
              
              <h4 class="mb-3 mt-3">精彩推荐</h4>
              <hr class="grey--text" />
              <div v-for="video in hotVideoList" :key="video.id" class="mb-5">
                <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line" :loading="loading" tile large>
                  <v-card class="card" tile flat :to="'/watch/'+video.id">
                    <v-row no-gutters>
                      <v-col class="mx-auto" cols="3" sm="3" md="5" lg="5">
                        <!-- <v-responsive max-height="100%"> -->
                        <v-img class="align-center" :src="video.coverUrl">
                        </v-img>
                        <!-- </v-responsive> -->
                      </v-col>
                      <v-col>
                        <div class="ml-2">
                          <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold" style="line-height: 1">
                            {{ video.title }}
                          </v-card-title>

                          <v-card-subtitle class="pl-2 pt-2 pb-0" style="line-height: 1">
                            {{ video.authorName }}<br />
                            {{ video.views }} views<v-icon>mdi-circle-small</v-icon>
                            {{ video.createdAt }}
                          </v-card-subtitle>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-skeleton-loader>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import videoAPI from "@/apis/videoAPI";
import commentAPI from "@/apis/commentAPI";
import util from "@/apis/util";
import userApi from "../apis/userApi";

export default {
  data: () => ({
    videoDetail: {},
    loading: true,
    videoLoading: true,
    video: {},
    truncate: true,
    comment: "",
    showCommentBtns: false,
    repliesInput: {},
    likeStatus: -1,
    starStatus: -1,
    commentList:[],
    hotVideoList:[],
    followStatus: -1,
  }),
  computed: {
    ...mapGetters([
      "currentUser",
      "getToken",
      "isAuthenticated",
      "userAddress",
    ]),
  },
  watch: {
      '$route' () {
        // 对路由变化作出响应...
        location.reload();
      }
    },
  methods: {
    toggleFollow(){
      if(this.followStatus == -1){
        this.followStatus = 0;
        userApi.follow(this.video.authorAddress).then((res) =>{
          if(res.code == 0){
              this.followStatus = 1;
          }
        })
      }else if(this.followStatus == 1){
        this.followStatus = 0;
        userApi.unfollow(this.video.authorAddress).then((res) =>{
          if(res.code == 0){
              this.followStatus = -1;
          }
        })
      }
      
    },
    doComment(){
 
      commentAPI.comment(this.video.id, this.comment, null).then((res) =>{
        var comment = res.comment;
        comment.username = this.currentUser.username;
        comment.profilePhotoCid = this.currentUser.profileImageCid;
        this.commentList.unshift(this.formatComment(comment));
        this.comment = "";
      });
    },
    getComment(){
      commentAPI.getComments(this.video.id).then((res) => {

        for(let comment of res.commentList){
          this.commentList.push(this.formatComment(comment));
        }
      })
    },
    getVideo(videoDetail) {
      var videoMetadata = videoDetail.videoMetadata;
      this.video = {
        // channelName: 'Tech Reagan',
        // subscribers: '10k',
        ...videoMetadata,
        createdAt: util.formatDate(videoMetadata.createAt),
        views: util.formatNum(videoMetadata.viewNum),
        likes: util.formatNum(videoMetadata.likeNum),
        stars: util.formatNum(videoMetadata.starNum),
        comments: util.formatNum(videoMetadata.commentNum),
        videoUrl: this.getIpfsURL(videoMetadata.cid),
        authorPhotoUrl: this.getIpfsURL(videoMetadata.authorPhotoCid),
        title: videoMetadata.title,
        description: videoMetadata.description,

      };
      this.likeStatus = videoDetail.likeStatus ? 1:-1;
      this.starStatus = videoDetail.starStatus ? 1:-1;
      this.followStatus = videoDetail.followStatus ? 1:-1;
    },
    formatComment(comment){
      var newComment = {
        ...comment,
        createdAt: util.formatDate(comment.createAt),
        profilePhotoUrl: 
          this.getIpfsURL(comment.profilePhotoCid),
      }
      return newComment;
    },
    showReply(id) {
      this.$refs[id][0].classList.toggle("d-none");
    },
    hideReply(id) {
      this.$refs[`form${id}`][0].reset();
      this.$refs["reply" + id][0].classList.toggle("d-none");
    },
    addReply(id) {
      var comtent = this.$refs[`input${id}`][0].$refs.input.value;
      if (comtent == '') return
      console.log(comtent)
      commentAPI.comment(this.video.id, comtent, id);
      this.$refs[`form${id}`][0].reset();
    },
    show(event) {
      if (event.target.innerText === "SHOW MORE") {
        this.truncate = false;
        event.target.innerText = "SHOW LESS";
      } else {
        this.truncate = true;
        event.target.innerText = "SHOW MORE";
      }
    },
    truncateText(string = "", num) {
      if (string.length <= num) {
        return string;
      }
      return string.slice(0, num);
    },
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    toggleLike(){
      var _this = this
      if(this.likeStatus >0){
        this.likeStatus = 0;
        
          videoAPI.unlike(this.video.id).then((resp)=>{
            if(resp.code == 0 ){
              _this.likeStatus = -1;
              if(this.videoDetail.videoMetadata.likeNum < 1000){
                this.video.likes = this.video.likes - 1;
              }
            }else{
              _this.likeStatus = 1;
            }
          })
      }else if(this.likeStatus < 0){        
        this.likeStatus = 0;

        videoAPI.like(this.video.id).then((resp)=>{
            if(resp.code == 0 ){
              _this.likeStatus = 1;
              if(this.videoDetail.videoMetadata.likeNum < 1000){
                this.video.likes = this.video.likes + 1;
              }
            }else{
              _this.likeStatus = -1;
            }
        })

      }
    },
    toggleStar(){
      var _this = this
      if(this.starStatus >0){
        this.starStatus = 0;

          videoAPI.unstar(this.video.id).then((resp)=>{
            if(resp.code == 0 ){
              _this.starStatus = -1;
              if(this.videoDetail.videoMetadata.starNum < 1000){
                this.video.stars = this.video.stars - 1;
              }
            }else{
              _this.starStatus = 1;
              
            }
          })
      }else if(this.starStatus < 0){        
        this.starStatus = 0;

        videoAPI.star(this.video.id).then((resp)=>{
            if(resp.code == 0 ){
              _this.starStatus = 1;
              if(this.videoDetail.videoMetadata.starNum < 1000){
                this.video.stars = this.video.stars + 1;
              }
            }else{
              _this.starStatus = -1;
            }
        })
      }
    }
  },

  async mounted() {
    this.videoDetail = await videoAPI.getVideoDetail(this.$route.params.id);
    this.getVideo(this.videoDetail);
    this.loading = false;
    this.videoLoading = false;
    this.getComment();
    var _this = this;
    videoAPI.getHotVideos(1, 10).then((resp) => {
      for (let v of resp){
        v.title =  v.title.length > 11 ? v.title.substring(0, 11) + "..." : v.title;
        v.createdAt = util.formatDate(v.createAt);
        v.views =  util.formatNum(v.viewNum);
        v.coverUrl = _this.getIpfsURL(v.coverCid);
        _this.hotVideoList.push(v);
      }
      _this.loading = false;
    })

  },
};
</script>

<style lang="scss">
video {
  max-width: 100%;
  /* min-height: 360px; */
  /* width: 640px;
  height: 360px; */
}

#btns {
  border-bottom: 1px solid #e0d8d8;

  button {
    color: #7f7f7f;
  }
}

button.v-btn.remove-hover-bg {
  background-color: initial !important;

  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
