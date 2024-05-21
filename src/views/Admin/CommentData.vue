<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">评论管理</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="通过地址搜索" single-line hide-details
                @keyup.enter="getCommentData"></v-text-field>
        </v-card-title>
        <v-data-table :items="commentData" :headers="itemsHeaders" :items-per-page.sync="size" :page.sync="page"
            :server-items-length="dataCount" :options.sync="options" loading=true loading-text="加载中...">
            <template v-slot:item.user="{ item }">
                <v-list-item three-line>
                    <v-list-item-avatar size="60">
                        <v-img :src="getIpfsURL(item.profilePhotoCid)"></v-img>
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
            <template v-slot:item.created_at="{ item }">
                {{ new Date(item.createdAt).toLocaleString() }}
            </template>
            <template v-slot:item.action="{ item }">
                <v-btn color="red" @click="deleteComment(item.id)" icon><v-icon>mdi-close</v-icon></v-btn>
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
            commentData: [
                ],
            itemsHeaders:[
                { text: '用户', value: 'user', align: 'start', width: '20%', sortable: false},
                { text: '评论内容', value: 'content', sortable: false, width: '40%' },
                { text: '回复', value: 'replayTo', sortable: false },
                { text: '视频标题', value: 'title', sortable: false },
                {text:'评论时间',value:'created_at'},
                {text:'操作',value:'action',sortable:false}
            ],
            dataCount: 0,
            page:1,
            size:10,
            options: {},
        }
    },
    methods:{
        getIpfsURL(cid) {
            return this.$store.getters.currentIpfsGateway.concat(cid);
        },
        async getCommentData(){
            this.commentData = []
            try {
                let response = await adminApi.getAllCommentData(this.page,this.size,this.search,this.options.sortBy,this.options.sortDesc)
                this.commentData = response.data
                this.dataCount = response.total
            } catch (error) {
                console.log(error)
            }
        },
    

    },
    watch:{
        
        page(){
            this.getCommentData()
        },
        size(){
            this.getCommentData()
        },
        options(){
            this.getCommentData()
        }

    },
    mounted() {
        this.getCommentData()
    }
}
</script>