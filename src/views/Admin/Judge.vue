<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">举报审核</span>
        </v-card-title>
        <v-data-table :items="judgeData" :headers="itemsHeaders" :server-items-length="dataCount"
            :options.sync="options" loading=true loading-text="加载中..." @click:row="showDetail">
            <template v-slot:item.user="{ item }">
                <v-list-item three-line>
                    <v-list-item-avatar size="60">
                        <v-img :src="getIpfsURL(item.profileImageCid)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content class="align-self-auto">
                        <v-list-item-title class="headline mb-1">
                            {{ item.username }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ item.userAddress }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-slot:item.createdAt="{ item }">
                {{ new Date(item.createdAt).toLocaleString() }}
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent transition="fab-transition" max-width="1000">
            <v-card tile>
                <div class="d-flex justify-space-between mb-5" id="modal-header">
                    <v-card-title class="py-3">视频详情</v-card-title>

                    <v-btn icon text @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>

                <v-card-text>
                    <v-row justify="center">
                        <v-col order="last" order-sm="last" order-md="first" order-lg="first" order-xl="first" clos="12"
                            sm="10" md="10" lg="10" class="pt-0" align-self="center">

                            <v-row>
                                <v-list-item three-line>
                                    <v-list-item-avatar size="60">
                                        <v-img :src="getIpfsURL(itemDetail.authorPhotoCid)"></v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content class="align-self-auto">
                                        <v-list-item-title class="headline mb-1">
                                            {{ itemDetail.authorName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>{{ itemDetail.authorAddress }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-row>

                            <v-row>
                                <v-col cols="8">
                                    <video controls style="width: 100%" ref="video" :src="videoUrl"
                                        :poster="getIpfsURL(itemDetail.coverCid)">
                                        <source type="video/mp4" />
                                    </video>
                                </v-col>
                                <v-col cols="4">
                                    <v-list-item three-line>
                                        <v-list-item-content class="align-self-auto">
                                            <v-row>
                                                <v-col>
                                                    <v-list-item-title class="headline mb-1">
                                                        <v-radio-group v-model="itemDetail.reason" column>
                                                            <v-radio label="色情低俗" value="色情低俗"></v-radio>
                                                            <v-radio label="血腥暴力" value="血腥暴力"></v-radio>
                                                            <v-radio label="政治敏感" value="政治敏感"></v-radio>
                                                            <v-radio label="广告欺诈" value="广告欺诈"></v-radio>
                                                            <v-radio label="版权投诉" value="版权投诉"></v-radio>
                                                            <v-radio label="其他" value="其他"></v-radio>
                                                        </v-radio-group>
                                                    </v-list-item-title>
                                                </v-col>
                                                
                                            </v-row>
                                            
                                            <v-row justify="space-between">
                                                <v-col><v-btn outlined @click="back">驳回</v-btn></v-col>
                                                <v-col><v-btn outlined color="red" @click="pass">通过</v-btn></v-col>
                                            </v-row>



                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-list-item-title class="headline mb-1">{{ itemDetail.title }}</v-list-item-title>
                            </v-row>
                            <v-row>
                                {{ itemDetail.description }}
                            </v-row>

                        </v-col>
                    </v-row>
                </v-card-text>

            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import judgeAPI from '../../apis/judgeAPI';
import videoAPI from '../../apis/videoAPI';


export default {
    name: "Judge",
    data: () => ({
        judgeData: [],
        dialog: false,
        itemDetail: {},
        itemsHeaders: [
            {
                text: '举报人',
                align: 'start',
                sortable: false,
                value: 'user',
            },
            {
                text: '被举报视频',
                value: 'videoId',
            },
            {
                text: '举报状态',
                value: 'status',
            },
            {
                text: '举报原因',
                value: 'reason',
            },
            {
                text: '举报时间',
                value: 'createdAt',
            },
        ],
        dataCount: 0,
        options: {},
        
    }),
    methods: {
        getData() {
            judgeAPI.all(this.options.page, this.options.itemsPerPage).then(res => {
                this.judgeData = res.data;
                this.dataCount = res.total;
            })
        },
        getIpfsURL(cid) {
            return this.$store.getters.currentIpfsGateway.concat(cid);
        },
        async showDetail(arg1) {
            var videoId = arg1.videoId;
            var resp = await videoAPI.getVideoDetail(videoId);
            this.itemDetail = resp.videoMetadata;
            this.itemDetail = Object.assign(this.itemDetail, arg1)
            this.toggleDialog();
        },
        toggleDialog() {
            this.dialog = !this.dialog
        },
        closeDialog() {
            this.$refs.video.pause();
            this.dialog = false
        },
        back(){
            judgeAPI.judge(this.itemDetail.id, "已退回").then((resp)=>{
                if(resp.code == 0){
                    this.itemDetail.status = "已退回";   
                }
                this.closeDialog();
            })
        },
        pass(){
            judgeAPI.judge(this.itemDetail.id, "已处理").then((resp)=>{
                if(resp.code == 0){
                    this.itemDetail.status = "已处理";
                }
                this.closeDialog();
            })

        }
    
    },
    watch: {
        options: {
            handler() {
                this.page = this.options.page;
                this.size = this.options.itemsPerPage;
                this.getData();
            },
            deep: true,
        },
    },
    created(){
        this.getData();
    },
    computed: {
        videoUrl() {
            return this.$store.getters.currentIpfsGateway.concat(this.itemDetail.cid)
        }
    }
}
</script>