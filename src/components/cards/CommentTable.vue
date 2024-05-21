<template>
    <v-card>
        <v-data-table :headers="headers" :items="commentList" 
        :items-per-page.sync="itemsPerPage" :page.sync="page" :server-items-length="serverItemsLength" item-key="id">
            <!-- User -->
            <template v-slot:item.username="{ item }" >
                <div class="d-flex align-center gap-x-4" >
                    <v-avatar size="48" style="margin:8px" :tile="!item.profilePhotoUrl">
                        <v-img v-if="item.profilePhotoUrl" :src="item.profilePhotoUrl" />
                    </v-avatar>


                    <div class="d-flex flex-column">
                        <h6 class="text-h6 font-weight-medium user-list-name">
                            {{ item.username }}
                        </h6>

                        <span class="text-sm text-medium-emphasis">{{ item.userAddress }}</span>
                    </div>
                </div>
            </template>

            <template v-slot:no-data>
                <p>No data available.</p>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>
import commentAPI from '@/apis/commentAPI'
import util from '@/apis/util'
import analyze from '@/apis/analyze.js'

export default {
    data: () => ({
        headers :[
                {
                 
                    text: '用户',
                    key: 'username',
                    value: 'username',
                    width: '18%'
                },
                {
                    text: '视频id',
                    key: 'videoId',
                    value: 'videoId',
                    with: '8%'
                },
                {
                    text: '内容',
                    key: 'content',
                    value: 'content',
                    width: '50%'
          
                },
                {
                    text: '回复给',
                    key: 'reply',
                    value: 'replayTo',
                    width: '8%'
         
                },
                {
                    text: '发布于',
                    key: 'createAt',
                    value: 'createdDate',

                },
        ],
        itemsPerPage: 10,
        page: 0,
        serverItemsLength: 0,

        commentList: [],
    }),
    methods:{
        async getCommentCount(){
            var data = await analyze.analyzeTotalCommentCount("@me");
            this.serverItemsLength = data.count;
        },
        getIpfsURL(cid) {
            return this.$store.getters.currentIpfsGateway.concat(cid);
        },
        async getAllComment(){
            var resp = await commentAPI.getCommentByAddress('@me',this.page,this.itemsPerPage);
            this.commentList = [];
            resp.commentList.forEach(element => {
                
                this.commentList.push({
                    ...element,
                    profilePhotoUrl: this.getIpfsURL(element.profilePhotoCid),
                    createdDate: util.formatDate(element.createdAt),
                })
            });
            

        }
    },
    created(){
        this.page = 1;
        this.getCommentCount();
    },
    watch:{
        page: function(){
            this.getAllComment();
        },
        itemsPerPage: function(){
            this.getAllComment();
        }
    }
}
</script>

