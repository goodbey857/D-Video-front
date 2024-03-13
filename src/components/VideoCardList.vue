<template >
    <div v-infinite-scroll="loadMore"  infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <v-card class="transparent" flat>
            <v-card-title>Uploads</v-card-title>
            <v-row>
                <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="video in loading ? tempVideos : videos" :key="video.id"
                class="mx-xs-auto"
                >
                <v-skeleton-loader type="card-avatar" :loading="loading">
                    <video-card
                    :card="{ maxWidth: 350 }"
                    :video="video"
                    ></video-card>
                </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import VideoCard from "@/components/VideoCard";
export default {
    props: {
    videos: Array,
    loading: Boolean,
    loadMore: Function
    },  
    data() {
        return {
            tempVideos: [[{id:1},{id:2},{id:3},{id:4},{id:5}]]
        }
    },
    components: {
        VideoCard
    },
 
}


</script>
<style>
.card {
    background: #f9f9f9 !important;
    }
</style>
