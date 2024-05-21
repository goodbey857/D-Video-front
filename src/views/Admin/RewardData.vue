<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">奖励中心</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="地址搜索" single-line hide-details
                @keyup.enter="getRewardData"></v-text-field>
        </v-card-title>
        <v-data-table :items="rewardData" :headers="itemsHeaders" :items-per-page.sync="size" :page.sync="page"
            :server-items-length="dataCount" :options.sync="options" loading=true loading-text="加载中...">
            <template v-slot:item.user="{item}">
                <v-list-item three-line>
                    <v-list-item-avatar size="60">
                        <v-img :src="getIpfsURL(item.profileImageCid)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content class="align-self-auto">
                        <v-list-item-title class="headline mb-1">
                            {{ item.username }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ item.address }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-slot:item.createdAt="{ item }">
                {{ new Date(item.createdAt).toLocaleString() }}
            </template>
        </v-data-table>

    </v-card>
</template>
<script>
import adminApi from '@/apis/adminAPI.js'
export default {
    name: 'UserData',
    data() {
        return {
            search: '',
            rewardData: [
            ],

            itemsHeaders: [
                {
                    text: '用户',
                    align: 'start',
                    sortable: false,
                    value: 'user',
                    width: 200,
                },
                {
                    text: '视频',
                    value: 'title',
                },
                {
                    text: '奖励',
                    value: 'reward',
                },
                {
                    text: '创建时间',
                    value: 'createdAt',
                },
                
            ],
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
        async getRewardData() {
            this.videoData = []
            try {
                let response = await adminApi.getRewardData( this.search,this.page, this.size)
                this.rewardData = response.data
                this.dataCount = response.total
            } catch (error) {
                console.log(error)
            }
        },
       




    },
    watch: {
        page() {
            this.getRewardData()
        },
        size() {
            this.getRewardData()
        },

    },
    mounted() {
        this.getRewardData()
    },
}
</script>