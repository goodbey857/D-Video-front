

<template>
  <v-card class="position-relative mx-auto">
    <v-card-title>
      <h3>
        每日奖励! <span class="text-high-emphasis">🎉</span>
      </h3>
    </v-card-title>
    <v-card-subtitle>
      <div class="text-body-1">
        {{ haveWard ? '快来领取今天的奖励吧!' : ' 明天再来看看吧!' }}
      </div>
    </v-card-subtitle>
    <v-card-text>


      <h4 class="text-h4 text-primary green--text">
        $ {{reward}}
      </h4>
      <div class="text-body-1 mb-2">
        今天也要加油哦！ <span class="text-high-emphasis">🚀</span>
      </div>
      <v-btn color="success" size="x-large" :loading="loading" @click="claimFunction" :disabled="!haveWard">
        领取
      </v-btn>
    </v-card-text>

    <!-- Trophy -->
    <v-img src="../../assets/trophy.png" class="trophy" />
  </v-card>
</template>

<script>


export default{
  props: {
    reward: String,
    claimFunction: Function,
    loading: Boolean,
  },
  name: 'AnalyticsAward',
  computed: {
    haveWard() {
      return this.reward > 0
    }
  },
  
}

</script>

<style lang="scss">
.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>