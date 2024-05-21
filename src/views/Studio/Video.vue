<template>
  <div id="video" class="pa-4 pl-0">
    <!-- <v-container fluid> -->
    <h2>视频中心</h2>

    <!-- <v-row> -->
    <v-tabs v-model="tab" id="tab" class="mt-5">
      <v-tab>
        我的视频
      </v-tab>
      <v-tab>
        转移记录
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <template>
          <v-card flat>
            <v-data-table no-data-text="你还没有上传过视频呢..." :headers="headers" :items="videoList"
              :loading="loading" loading-text="正在加载..." :items-per-page.sync="itemsPerPage" :page.sync="page"
              :server-items-length="serverItemsLength">
              <template v-slot:top>
                <v-dialog v-model="dialogTransfer" persistent max-width="500px">
                  <v-card v-if="!transferProcessing">
                    <v-card-title>
                      <span class="headline">你想把这条视频送给谁？</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-card class="card" tile flat>
                          <v-row no-gutters>
                            <v-col cols="3" sm="2" md="5" lg="5">
                              <v-img class="align-center"
                                :src="$store.getters.currentIpfsGateway.concat(transferItem.coverCid)">
                              </v-img>

                            </v-col>
                            <v-col>
                              <div class="ml-2">
                                <v-card-title class="pl-2 subtitle-1 font-weight-bold" style="line-height: 1">
                                  {{ transferItem.title }}
                                </v-card-title>

                                <v-card-subtitle class="pl-2 pt-2 pb-0" style="line-height: 1">
                                  发布于: {{ transferItem.dateString }} <br />
                                </v-card-subtitle>
                              </div>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-text-field outlined placeholder="接收人" counter="42" max-length="42"
                              v-model="transferTo"></v-text-field>
                          </v-row>
                        </v-card>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialogTransfer = !dialogTransfer">取消</v-btn>

                      <v-btn color="blue darken-1" text @click="doTransfer">确认</v-btn>
                    </v-card-actions>
                  </v-card>
                  <v-card v-else>
                    <v-card-title>
                      <span class="headline">请在钱包中确认...</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-progress-linear color="primary" indeterminate rounded height="6">
                            </v-progress-linear>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon href text class="mr-2">
                  <v-icon @click="toggleDialog(item)">
                    mdi-swap-horizontal
                  </v-icon>
                </v-btn>
                <v-btn icon href text class="mr-2" router :to="'/watch/'+item.id">
                  <v-icon>
                    mdi-youtube
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </v-tab-item>
      <v-tab-item>
        <v-data-table :headers="videoTransferDataHeaders" :items="videoTransferData"
          :items-per-page.sync="videoTransferDataItemsPerPage" :page.sync="videoTransferDataPage"
          :server-items-length="videoTransferDataServerItemsLength">

            <template v-slot:item.title="{ item }">
              <span class="overflow-text" style="width: 200px;">
                {{ item.title }}
              </span>

            </template>

          <template v-slot:item.source="{ item }">
            <span class="overflow-text" style="width: 150px;">
              {{ item.source }}
            </span>

          </template>
          <template v-slot:item.category="{ item }">
            <v-chip small :color="item.source == $store.getters.userAddress ? 'red' : 'blue'" dark>
              {{ item.source == $store.getters.userAddress ? '转出 >' : '接收 >' }}
            </v-chip>
          </template>

          <template v-slot:item.destination="{ item }">
            <span class="overflow-text" style="width: 150px;">
              {{ item.destination }}

            </span>
          </template>

          <template v-slot:item.createAt="{ item }">
            {{ item.createAt }}
          </template>
          <template v-slot:item.tx="{ item }">
            <span class="overflow-text" style="width: 150px;">
              <a :href="$store.getters.currentEtherscanGateway.concat(item.tx)" target="_blank">{{ item.tx }}</a>
            </span>
          </template>
          <template v-slot:item.type="{ item }">
            <v-chip small :color="item.source == '0x0000000000000000000000000000000000000000' ? 'green' : 'orange'"
              dark>
              {{ item.source == '0x0000000000000000000000000000000000000000' ? '发布' : '转移' }}
            </v-chip>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
    <!-- </v-row> -->
    <!-- </v-container> -->
  </div>
</template>

<script>
import videoAPI from '@/apis/videoAPI.js'
import analyze from '@/apis/analyze.js'
import { DVideoContract, waitForTransaction } from '@/apis/DVideoContract.js'
import { mapGetters } from 'vuex';
import recordAPI from '@/apis/recordAPI';

export default {
  data: () => ({
    loading: false,
    dialogTransfer: false,
    tab: null,
    search: '',
    transferTo: '',
    itemsPerPage: 10,
    page: 0,
    serverItemsLength: 0,
    transferItem: {},
    headers:[{
      text: '视频',
      align: 'start',
      filterable: true,
      value: 'title'
    },
    { text: '喜欢',value: 'likeNum'},
    { text: '收藏', value: 'starNum'},
    { text: '评论', value: 'commentNum'},
    { text: '观看', value: 'viewNum'},
    { text: '发布于', value: "dateString"},
    { text: '操作', value: 'actions'}
  ],
    videos: [],
    videoList: [],
    itemToDelete: {},
    transferProcessing: false,

    videoTransferData: [],
    videoTransferDataHeaders:[
      {text: '视频', value: 'title'},
      {text: '发送人', value: 'source'},
      {text: '类别', value: 'category'},
      {text: '接收人', value: 'destination'},
      {text: '发送时间', value: 'createAt'},
      {text: '交易哈希', value: 'tx'},
      {text: '来源', value: 'type'}
    ],
    videoTransferDataPage: 1,
    videoTransferDataItemsPerPage: 10,
    videoTransferDataServerItemsLength: 0,
    

  }),

  methods: {
    async getVideoTransferData(){

      var resp = await recordAPI.videoTransferRecord(this.videoTransferDataPage,this.videoTransferDataItemsPerPage);
      resp.record.forEach(element => {
        element.createAt = new Date(element.createdAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    })
      this.videoTransferData = resp.record;
      this.videoTransferDataServerItemsLength = resp.count;
    },
    async getVideos() {
      this.loading = true;
      var resp = await videoAPI.getSomeBodyVideos('@me',this.page,this.itemsPerPage);
      resp.data .forEach(element => {
        element.dateString = new Date(element.createAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      });
      this.videoList = resp.data;
      this.loading = false;
    },
    async getVideoCount(){
      var data = await analyze.analyzeVideoCount('@me');
      this.serverItemsLength = data.count;
    },
    toggleDialog(item) {
      this.transferItem = item;
      this.dialogTransfer = !this.dialogTransfer;
      console.log(this.transferItem)
      
    },
    async doTransfer(){
      this.transferProcessing = true;
      try{
        var contract = await DVideoContract();
        var tx = await contract.transferFrom(this.userAddress,this.transferTo,this.transferItem.id);
        await waitForTransaction(tx.hash);
      }catch(err){
        console.log(err);
      }
      this.transferTo = '';
      this.transferProcessing = false;
      this.dialogTransfer = !this.dialogTransfer;
      this.getVideos();
    }
    
  },
  computed: {
    ...mapGetters([
      'userAddress'
    ]),
  },
  created() {
    this.page=1;
    this.getVideoCount();
    console.log(this.$store.getters.userAddress)
  },
  watch:{
    page(){
        this.getVideos();
    },
    itemsPerPage(){
      this.getVideos();

    },
    tab(newValue){
      console.log(newValue);
      if(newValue == 1 && this.videoTransferData.length == 0){
        this.getVideoTransferData();
      }
    },
    videoTransferDataPage(){
      this.getVideoTransferData();
    },
    videoTransferDataItemsPerPage(){
      this.getVideoTransferData();
    }

  }

}
</script>

<style lang="scss">
.overflow-text {
  align-items: center;
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏溢出的文本 */
  text-overflow: ellipsis;

  display: inline-block;
  /* 设置为行内元素 */
  /* 使用省略号代替溢出的文本 */
}
</style>
