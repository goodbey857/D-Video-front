<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">视频管理</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="通过视频标题或者作者地址搜索" single-line hide-details
                @keyup.enter="getVideoData"></v-text-field>
        </v-card-title>
        <v-data-table :items="videoData" :headers="itemsHeaders" :items-per-page.sync="size" :page.sync="page"
            :server-items-length="dataCount" :options.sync="options" loading=true loading-text="加载中..."
            @click:row="showDetail">
            <template v-slot:item.created_at="{ item }">
                {{ new Date(item.createAt).toLocaleString() }}
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent transition="fab-transition" max-width="1000" id="settings">
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

                            <v-row justify="space-between">
                                <v-col>
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
                                </v-col>
                                <v-spacer/>
                                <v-col align-self="center">
                                    <v-btn outlined color="red">下架视频</v-btn>
                                </v-col>

                            </v-row>

                            <v-row>
                                <v-col cols="8">
                                    <!-- <v-img :src="getIpfsURL(itemDetail.coverCid)" contain></v-img> -->
                                    <video controls style="width: 100%" ref="video" :src="videoUrl"
                                        :poster="getIpfsURL(itemDetail.coverCid)">
                                        <source type="video/mp4" />
                                    </video>
                                </v-col>
                                <v-col cols="4">
                                    <v-list-item three-line>
                                        <v-list-item-content class="align-self-auto">
                                            <v-list-item-title class="headline mb-1">
                                                视频描述
                                            </v-list-item-title>

                                            {{ itemDetail.description }}
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-list-item-title class="headline mb-1">{{ itemDetail.title }}</v-list-item-title>
                            </v-row>

                        </v-col>
                    </v-row>
                </v-card-text>

            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
import adminApi from '@/apis/adminAPI.js'
export default {
    name: 'UserData',
    data() {
        return {
            search: '',
            videoData: [
            ],
            itemsHeaders: [
                {
                    text: '视频标题',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                {
                    text: '作者地址',
                    value: 'authorAddress',
                },
                {
                    text: '作者名称',
                    value: 'authorName',
                },

                {
                    text: '点赞数',
                    value: 'likeNum',
                },
                {
                    text: '评论数',
                    value: 'commentNum',
                },
                {
                    text: '收藏数',
                    value: 'starNum',
                },
                {
                    text: '观看数',
                    value: 'viewNum',
                },
                {
                    text: '创建时间',
                    value: 'created_at',
                }],
            dataCount: 0,
            page: 1,
            size: 10,
            options: {},
            dialog: false,
            itemDetail: {}
        }
    },
    methods: {
        getIpfsURL(cid) {
            return this.$store.getters.currentIpfsGateway.concat(cid);
        },
        async getVideoData() {
            this.videoData = []
            try {
                let response = await adminApi.getAllVideoData(this.page, this.size, this.search, this.options.sortBy, this.options.sortDesc)
                this.videoData = response.data
                this.dataCount = response.total
            } catch (error) {
                console.log(error)
            }
        },
        async showDetail(arg1) {
            this.itemDetail = arg1;
            this.toggleDialog();
        },
        toggleDialog() {
            this.dialog = !this.dialog
        },
        closeDialog() {
            this.$refs.video.pause();
            this.dialog = false
        },




    },
    watch: {
        page() {
            this.getVideoData()
        },
        size() {
            this.getVideoData()
        },
        options() {
            this.getVideoData()
        }

    },
    mounted() {
        this.getVideoData()
    },
    computed: {
        videoUrl() {
            return this.$store.getters.currentIpfsGateway.concat(this.itemDetail.cid)
        }
    }
}
</script>