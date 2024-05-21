<template>
  <div id="history" class="fill-height">
    <v-container fluid class="pt-0 pb-0 fill-height">
      <v-row class="fill-height">
        <v-col cols="12" sm="12" order="2" order-sm="2" order-md="1" order-lg="1" md="7" lg="7" class="pt-8 pl-8">
          <h1 class="title font-weight-medium pb-5">{{ historyType }}</h1>
          <template v-if="historyType == '观看记录'">
            <div v-for="record of records" :key="record.id" class="mb-5">
              <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line" :loading="loading" tile large>
                <v-card class="card" tile flat @click="navigateToWatch(record.videoId)">
                  <v-row no-gutters>
                    <v-col class="mx-auto" cols="3" sm="3" md="5" lg="5">
                      <!-- <v-responsive max-height="100%"> -->
                      <v-img class="align-center" :src="record.coverUrl">
                      </v-img>
                      <!-- </v-responsive> -->
                    </v-col>
                    <v-col cols="7" lg="7">
                      <div class="ml-2">

                        <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold d-flex justify-space-between "
                          style="line-height: 1">
                          <v-col cols="10" class="text-no-wrap text-truncate">
                            {{ record.title }}
                          </v-col>
                          <v-col cols="2" @click.stop="deleteRecord(record.videoId)">
                            <v-btn text>
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-col>


                        </v-card-title>

                        <v-card-subtitle class="pl-2 pt-2 pb-0" style="line-height: 1">
                          {{ record.createdAt }}
                        </v-card-subtitle>
                        <v-card-subtitle class="pl-2 pt-2 pb-0 text-no-wrap text-truncate">
                          {{ record.description }}
                        </v-card-subtitle>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-skeleton-loader>
            </div>
          </template>
          <template v-else-if="historyType == '搜索记录'">
            <div v-for="record of records" :key="record.id">
              <v-skeleton-loader class="mx-auto" type="list-item-two-line" :loading="loading" tile large>
                <v-card class="card d-flex pl-0" flat>
                  <v-card-text class="pl-0 py-0">
                    <v-card-title class="pl-0 black--text text--lighten-5 subtitle-1 font-weight-medium">{{
                      record.content }}</v-card-title>
                    <v-card-subtitle class="pl-0 pb-0">{{ record.createdAt }}</v-card-subtitle>
                  </v-card-text>
                  <v-card-actions><v-btn text class="grey--text" fab @click="deleteRecord(record.keyword)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-card-actions>
                </v-card>
              </v-skeleton-loader>
            </div>
          </template>
          <template v-else-if="historyType == '评论'">
            <div v-for="record of records" :key="record.id">
              <v-skeleton-loader class="mx-auto" type="list-item-two-line" :loading="loading" tile large>
                <v-card class="card d-flex pl-0" flat>
                  <v-card-text class="pl-0 py-0">
                    <v-card-title class="pl-0 black--text text--lighten-5 subtitle-1 font-weight-medium">{{
            record.content }}</v-card-title>
                    <v-card-subtitle class="pl-0 pb-0">{{ record.createdAt }}</v-card-subtitle>
                  </v-card-text>
                  <v-card-actions><v-btn text class="grey--text" fab @click="deleteRecord(record.id)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-card-actions>
                </v-card>
              </v-skeleton-loader>
            </div>
          </template>
        </v-col>
        <v-col cols="12" sm="12" order="1" order-sm="1" order-md="2" order-lg="2" md="5" lg="5" :class="[
            'pa-0',
            { 'fill-height': $vuetify.breakpoint.name.smAndDown ? true : false }
          ]">
          <v-card flat id="card-radiobox" class="fill-height grey lighten-4 pa-10">
            <v-radio-group v-model="historyType">
              <p class="title font-weight-regular pl-5 mb-2">历史记录类别</p>
              <v-list class=" grey lighten-4">
                <v-list-item-group>
                  <template v-for="(item, i) in items">
                    <v-divider :key="i"></v-divider>
                    <v-list-item active-class="grey lighten-4" :key="`item-${i}`" class="py-2" @click="clickItem(item)">
                      <v-list-item-content>
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-radio :key="item" :value="item"></v-radio>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import recordAPI from '@/apis/recordAPI'
import util from "@/apis/util";
export default {
  data: () => ({
    loading: true,
    searchTextsLoading: true,
    items: [
      '观看记录',
      '搜索记录',
      '评论',
    ],
    historyType: '观看记录',
    records: [],
  }),

  methods: {
    getIpfsURL(cid) {
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    navigateToWatch(videoId) {
      // 导航到观看页面
      this.$router.push('/watch/' + videoId);
    },
    async getSearchRecord() {
      var searchRecord = await recordAPI.getSearch();
      for (let record of searchRecord.record) {
        record.content = record.keyword;
        record.createdAt = util.formatDate(record.createdAt);
        
      }

      this.records = searchRecord.record;
    },
    async deleteSearchRecord(keyword) {
      await recordAPI.deleteSearch(keyword);
    },

    async getCommentRecord() {
      var commentRecord = await recordAPI.getComment();
      for (let record of commentRecord.record) {
        record.createdAt = util.formatDate(record.createdAt);
      }
      this.records = commentRecord.record;
      
    },
    async deleteCommentRecord(id) {
      await recordAPI.deleteComment(id);
    },

    async getVideoRecord() {
      var videoRecord = await recordAPI.getVideo();
      for (let record of videoRecord.record) {
        record.createdAt = util.formatDate(record.createdAt);
        // record.views = util.formatNum(record.viewNum);
        // record.likes = util.formatNum(record.likeNum)
        // record.stars = util.formatNum(record.starNum)
        // record.comments = util.formatNum(record.commentNum)
        record.videoUrl = this.getIpfsURL(record.cid)
        record.coverUrl = this.getIpfsURL(record.coverCid)
 

      }
      this.records = videoRecord.record;
    },
    async deleteVideoRecord(id) {
      await recordAPI.deleteVideo(id);
    },
    async loadData(dataType){
      this.loading = true;
      if (dataType == '评论') {
        await this.getCommentRecord()
      } else if (dataType == '观看记录') {
        await this.getVideoRecord()
      } else if (dataType == '搜索记录') {
        await this.getSearchRecord()
      }
      this.loading = false;
    },

    deleteRecord(id){
      if (this.historyType == '评论') {
        this.deleteCommentRecord(id);
        this.records = this.records.filter(item => item.id !== id);
      } else if (this.historyType == '观看记录') {
        this.deleteVideoRecord(id);
        this.records = this.records.filter(item => item.videoId !== id);
      } else if (this.historyType == '搜索记录') {
        this.deleteSearchRecord(id);
        this.records = this.records.filter(item => item.keyword !== id);

      }
      
    },


    clickItem(item) {
      console.log(item)
      this.historyType = item
    }
  },
  watch: {
    historyType(val) {
      this.loadData(val)
      
    }
  },

  mounted() {
    this.loadData(this.historyType);

  }
}
</script>

<style lang="scss" scoped></style>
