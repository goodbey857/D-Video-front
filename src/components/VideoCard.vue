<template>
  <v-card
    class="content-bg card mx-auto rounded-xl"
    :max-width="card.maxWidth"
    flat
    router
    :to="'/watch/'+video.id"
  >

      <v-img :src="getIpfsURL(video.coverCid)" height="200px"></v-img>
      <v-row no-gutters>
        <v-col cols="2" v-if="card.type != 'noAvatar'">
          <v-list-item class="pl-0 pt-3" router :to="'/channels/'+video.authorAddress">
            <v-list-item-avatar color="grey darken-3">
              <v-img class="elevation-6" :src="getIpfsURL(video.authorPhotoCid)"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-col>
        <v-col>
          <v-card-title class="pl-2 pt-3  subtitle-1 font-weight-bold d-inline-block text-truncate " style="max-width: 220px;">
            {{ video.title }}
          
          </v-card-title>

          <v-card-subtitle class="pl-2 pb-0">
            {{ video.authorName}}
          </v-card-subtitle>
          <v-card-subtitle class="pl-2 pt-0">
            {{ views }} 次观看<v-icon>mdi-circle-small</v-icon
            >{{ createDate }}
          </v-card-subtitle>
        </v-col>
      </v-row>

  </v-card>
</template>

<script>
import util from "@/apis/util";

export default {
  props: {
    video: {
      type: Object,
      required: true
    },
    channel: {
      type: Object,
      required: false
    },
    card: Object
  },
  methods:{
    getIpfsURL(cid){
      return this.$store.getters.currentIpfsGateway.concat(cid);
    },

  },
  computed:{
    createDate(){
      return util.formatDate(this.video.createAt)
    },
    views(){
      return util.formatNum(this.video.viewNum)
    }
  }

}
</script>

<style></style>
