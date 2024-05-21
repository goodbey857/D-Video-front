<template>
    <div>
        <!-- 待claim的奖励 -->
        <v-row>
            <v-col cols="4"><analytics-award style="padding:20px" :reward="reward" :claimFunction="claim" :loading="loading"/></v-col>
            <v-col cols="8">
                <analytics-transation style="padding:20px" :statistics="statistics" /></v-col>
        </v-row>

        <!-- 粉丝数，关注数，视频数，代币数 -->
        <v-row class="match-height">
            <v-col cols="7"><line-chart :fetchData="getAnalyze" style="padding:20px" /></v-col>
            <v-col cols="5">
                <v-row>
                    <v-col cols="6"><card-static v-bind="totalView" style="padding:10px" /></v-col>
                    <v-col cols="6"><card-static v-bind="totalLike" style="padding:10px" /></v-col>
                </v-row>
                <v-row>
                    <v-col cols="6"><card-static v-bind="totalStar" style="padding:10px" /></v-col>
                    <v-col cols="6"><card-static v-bind="totalComment" style="padding:10px" /></v-col>
                </v-row>
            </v-col>




        </v-row>
    </div>
    <!-- 粉丝量，浏览量，喜欢，评论，收藏，收益 -->

</template>

<script>
import CardStatic from '@/components/cards/CardStatic.vue';
import LineChart from '@/components/cards/LineChart.vue';
import AnalyticsAward from '@/components/cards/AnalyticsAward.vue';
import AnalyticsTransation from '@/components/cards/AnalyticsTransation.vue';
import analyze from '@/apis/analyze.js'
import util from '@/apis/util.js'
import { ERC20Contract, waitForTransaction } from '@/apis/DVideoContract';
export default {
    components: {
        CardStatic,
        LineChart,
        AnalyticsAward,
        AnalyticsTransation
    },
    data: () => ({
        statistics: [
            {
                title: '关注',
                stats: '0',
                icon: 'mdi-eye-plus-outline',
                color: 'primary',
            },
            {
                title: '粉丝',
                stats: '0',
                icon: 'mdi-account-group',
                color: 'success',
            },
            {
                title: '视频',
                stats: '0',
                icon: 'mdi-youtube',
                color: 'warning',
            },
            {
                title: '余额',
                stats: '$0',
                icon: 'mdi-currency-usd',
                color: 'info',
            },
        ],
        totalView: {
            title: '浏览',
            color: 'green',
            icon: 'mdi-eye',
            stats: '25.6k',

            subtitle: '收获浏览量',
        },
        totalLike: {
            title: '喜欢',
            color: 'red',
            icon: 'mdi-heart',
            stats: '25.6k',
     
            subtitle: '收获喜欢量',
        },
        totalStar: {
            title: '收藏',
            color: 'yellow',
            icon: 'mdi-star',
            stats: '25.6k',

            subtitle: '收获收藏量',
        },
        totalComment: {
            title: '评论',
            color: 'blue',
            icon: 'mdi-comment',
            stats: '25.6k',

            subtitle: '收获评论量',
        },
        reward: '0.00',
        loading: false,
        contract: null,


    }),
    methods: {
        async getAnalyze(duration){
            return await analyze.analyzeDurationView(duration)
        },
       
        async getTotalView(address){
            var totalView = await analyze.analyzeTotalView(address)
            this.totalView.stats = util.formatNum(totalView.count)
        },
        async getTotalLike(address){
            var totalLike = await analyze.analyzeTotalLikeCount(address)
            this.totalLike.stats = util.formatNum(totalLike.count)
        },
        async getTotalStar(address){
            var totalStar = await analyze.analyzeTotalStarCount(address)
            this.totalStar.stats = util.formatNum(totalStar.count)
        },
        async getTotalComment(address){
            var totalComment = await analyze.analyzeTotalCommentCount(address)
            this.totalComment.stats = util.formatNum(totalComment.count)
        },
        async getFollowerCount(address){
            var followerCount = await analyze.analyzeFollowerCount(address)
            this.statistics[0].stats = util.formatNum(followerCount.count)
        },
        async getFanCount(address){
            var fanCount = await analyze.analyzeFanCount(address)
            this.statistics[1].stats = util.formatNum(fanCount.count)
        },
        async getVideoCount(address){
            var videoCount = await analyze.analyzeVideoCount(address)
            this.statistics[2].stats = util.formatNum(videoCount.count)
        },
        async getBalance() {
            var balance = await this.contract.balanceOf(this.$store.getters.userAddress);
            this.statistics[3].stats = (Number.parseInt(balance) / 1e18).toFixed(2);
        },
        async rewards() {
            var reward = await this.contract.rewards(this.$store.getters.userAddress);
            this.reward = (Number.parseInt(reward) / 1e18).toFixed(2);
            console.log(this.reward);
        },

        async claim() {
            this.loading = true;
            try{
                var tx = await this.contract.claimReward();
                waitForTransaction(tx.hash).then(()=>{
                    this.loading = false;
                    this.rewards()
                    this.getBalance()
                    console.log(tx);
                });

            }catch(err){
                this.loading = false;
                console.log(err);
            }

        }


    },

    created() {
        this.getTotalView("@me")
        this.getTotalLike("@me")
        this.getTotalStar("@me")
        this.getTotalComment("@me")
        this.getFanCount("@me")
        this.getFollowerCount("@me")
        this.getVideoCount("@me")
        ERC20Contract().then((contract) => {
            this.contract = contract;
            this.rewards()
            this.getBalance()
        })

    },
    watch: {

    }
}

</script>
