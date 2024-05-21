<template>
    <div id="tokenRecord" class="pa-4 pl-0">
        <h2>代币转移记录</h2>
        <v-data-table :headers="tableHeader" :items="tableData" :items-per-page.sync="itemsPerPage"
            :server-items-length="serverItemsLength" :page.sync="page">
            <template v-slot:item.source="{ item }">
                <span class="overflow-text" style="width: 180px;">
                    {{ item.source }}
                </span>
            </template>
            <template v-slot:item.category="{ item }">
                <v-chip small :color="item.source == $store.getters.userAddress ? 'red' : 'blue'" dark>
                    {{ item.source == $store.getters.userAddress ? '转出 >' : '接收 >' }}
                </v-chip>
            </template>
            <template v-slot:item.destination="{ item }">
                <span class="overflow-text" style="width: 180px;">
                    {{ item.destination }}
                </span>
            </template>
            <template v-slot:item.value="{ item }">
                <span class="overflow-text" style="width: 130px;">
                    {{ (item.value/1e18).toFixed(2) }}
                </span>
            </template>
            <template v-slot:item.createdAt="{ item }">
                <span class="overflow-text" style="width: 150px;">
                    {{ new Date(item.createdAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) }}
                </span>
            </template>
            <template v-slot:item.tx="{ item }">
                <span class="overflow-text" style="width: 180px;">
                    <a :href="$store.getters.currentEtherscanGateway.concat(item.tx)" target="_blank">{{ item.tx }}</a>
                </span>
            </template>
            <template v-slot:item.type="{ item }">
                <v-chip small :color="item.source == '0x93E519BF6B9A0D0FD239DD02ED8C678D26E3979E' ? 'green' : 'orange'"
                    dark>
                    {{ item.source == '0x93E519BF6B9A0D0FD239DD02ED8C678D26E3979E' ? '奖励' : '打赏' }}
                </v-chip>
            </template>
        </v-data-table>


    </div>

</template>

<script>
import recordAPI from '@/apis/recordAPI';
import { mapGetters } from 'vuex';
export default {
    name: 'TokenRecord',
    data() {
        return {
            tableData:[],
            tableHeader:[
                {
                    text: '发送方',
                    value: 'source'
                },
                {
                    text: '类别',
                    value: 'category'
                },
                {
                    text: '接收方',
                    value: 'destination'
                },
                {
                    text: '数量',
                    value: 'value'
                },
                {
                    text: '时间',
                    value: 'createdAt'
                },
                
                {
                    text: '交易哈希',
                    value: 'tx'
                },
                {
                    text: '来源',
                    value: 'type',
                }
            ],
            itemsPerPage: 10,
            page: 1,
            serverItemsLength: 0
        }
    },
    methods: {
        async getTokenTransferRecord(){
            var resp = await recordAPI.tokenTransferRecord(this.page,this.itemsPerPage);
            this.serverItemsLength = resp.count;
            this.tableData = resp.record;
        }
    },
    mounted() {
        this.getTokenTransferRecord();
    },
    computed:{
        ...mapGetters([
            'userAddress'
        ]),
    },
    watch:{
        page(){
            this.getTokenTransferRecord();
        },
        itemsPerPage(){
            this.getTokenTransferRecord();
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