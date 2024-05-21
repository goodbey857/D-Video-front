<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">视频转移数据</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="通过地址搜索" single-line hide-details
                @keyup.enter="getVideoTransferData"></v-text-field>
        </v-card-title>


        <v-data-table :headers="videoTransferDataHeaders" :items="videoTransferData"
            :items-per-page.sync="videoTransferDataItemsPerPage" :page.sync="videoTransferDataPage"
            :server-items-length.sync="videoTransferDataServerItemsLength">

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
                {{ new Date(item.createdAt).toLocaleString() }}
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
    </v-card>
</template>

<script>
import adminAPI from '@/apis/adminAPI';
export default {
    name: 'VideoTransferData',
    data() {
        return {
            search: '',
            videoTransferDataHeaders: [
                {
                    text: '标题',
                    value: 'title',
                },
                {
                    text: '发送方',
                    value: 'source',
                },
                {
                    text: '类型',
                    value: 'type',
                },
                {
                    text: '接收方',
                    value: 'destination',
                },
                {
                    text: '时间',
                    value: 'createAt',
                },
                {
                    text: '交易',
                    value: 'tx',
                },
            ],
            videoTransferData: [],
            videoTransferDataServerItemsLength: 0,
            videoTransferDataPage: 1,
            videoTransferDataItemsPerPage: 10,
        }
    },
    mounted() {
        this.getVideoTransferData();
    },
    methods: {
        async getVideoTransferData() {
            var resp = await adminAPI.getVideoTransferData(this.search,this.videoTransferDataPage,this.videoTransferDataItemsPerPage);
            this.videoTransferData = resp.data
            this.videoTransferDataServerItemsLength = resp.total;
        },
    },
    watch:{
        videoTransferDataPage: function(){
            this.getVideoTransferData();
        },
        videoTransferDataItemsPerPage: function(){
            this.getVideoTransferData();
        },

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