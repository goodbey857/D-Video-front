<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">用户管理</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="通过地址搜索" single-line hide-details
                @keyup.enter="getUserData"></v-text-field>
        </v-card-title>
        <v-data-table :items="users" :headers="itemsHeaders" :items-per-page.sync="size" :page.sync="page"
            :server-items-length="dataCount" :options.sync="options" loading=true loading-text="加载中...">
            <template v-slot:item.operation="{ item }">
                <v-btn text outlined :color="item.inBlacklist ? 'grey':'red'" @click="toggleBlackList(item)">
                    {{ item.inBlacklist ? '移出黑名单' : '加入黑名单'}}
                </v-btn>

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
            users: [
                ],
            itemsHeaders:[
                {
                    text: '用户地址',
                    align: 'start',
                    sortable: false,
                    value: 'userAddress',
                },
                {
                    text: '用户名',
                    align: 'start',
                    sortable: false,
                    value: 'username',
                },
                {
                    text: '首次登录时间',
                    align: 'start',
                    value: 'firstLoginTime',
                },
                {
                    text: '访问次数',
                    align: 'start',
                    value: 'visitTimes',
                },
                {
                    text: '视频数量',
                    align: 'start',
                    value: 'videoCount',
                },
                {
                    text: '粉丝数量',
                    align: 'start',
                    value: 'fansCount',
                },
                {
                    text: '最后登录时间',
                    align: 'start',
                    value: 'lastLoginTime',
                },
                {
                    text: '操作',
                    align: 'start',
                    sortable: false,
                    value: 'operation',
                }

            ],
            dataCount: 0,
            page:1,
            size:10,
            options: {},
        }
    },
    methods:{
        async getUserData(){
            this.users = []
            try {
                let response = await adminApi.getUserData(this.search,this.page,this.size,this.options.sortBy,this.options.sortDesc)
                this.users = response.userData
                this.dataCount = response.total
            } catch (error) {
                console.log(error)
            }
        },
        toggleBlackList(item){
            
            if(item.inBlacklist){
                adminApi.removeFromBlockList(item.userAddress)
            }else{
                
                adminApi.addToBlockList(item.userAddress)
            }
            item.inBlacklist = !item.inBlacklist
        }
    

    },
    watch:{
        
        page(){
            this.getUserData()
        },
        size(){
            this.getUserData()
        },
        options(){
            this.getUserData()
        }

    },
    mounted() {
        this.getUserData()
    }
}
</script>