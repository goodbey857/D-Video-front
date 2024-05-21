<template>
  <div id="Series" class="pt-7 px-sm-10" >
    <v-container fluid>
      <v-row>
        <v-col
          cols="8"
          sm="7"
          md="10"
          lg="10"
          v-for="series of seriesList"
          :key="series.id"
          class="mx-lg-0 mx-md-0 mx-sm-auto mx-auto"
        >
          <!-- <v-container> -->
          <v-skeleton-loader
            class="mx-auto"
            type="list-item-avatar-three-line"
            :loading="loading"
            
            large
          >
            <v-card class="card"  flat router :to="'/series/'+series.id">
              <v-row no-gutters>
                <v-col class="mx-auto" cols="12" sm="8" md="5" lg="4">
                  <!-- <v-responsive max-height="100%"> -->
                  <v-img
                    class="align-end"
                    :src="series.coverUrl"
                    lazy-src = "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                    style="height: 200px;"
                  >
                 
                    <v-row  justify="end" no-gutters> 
                        <v-icon >mdi-collapse-all-outline</v-icon>
                    </v-row>
                  </v-img>
                  
                  <!-- </v-responsive> -->
                </v-col>
                <v-col class="hidden-sm-and-down">
                  <div class="ml-4 ">
                    <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold">
                      {{ series.title }}
                    </v-card-title>

                    <!-- <v-card-subtitle class="pl-2 pb-0">
                      {{ video.views }}
                      views<v-icon>mdi-circle-small</v-icon>
                      {{ video.likes }}likes<v-icon>mdi-circle-small</v-icon>
                      {{  video.createdAt }}
                    </v-card-subtitle> -->
                    <v-card-subtitle class="pl-2 pt-0">
                      {{ series.description }}
                    </v-card-subtitle>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-skeleton-loader>
          <!-- </v-container> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
    props:{
        seriesList: Array,
        loading: Boolean
    }
}

</script>

<style lang="scss">
.v-skeleton-loader__list-item-avatar-three-line {
  height: 250px;
  .v-skeleton-loader__paragraph.v-skeleton-loader__bone {
    margin-top: -125px;
    @media (max-width: 700px) {
      display: none;
      margin-top: inherit;
    }
  }
  .v-skeleton-loader__avatar {
    height: 200px !important;
    width: 300px !important;
  }
  .v-skeleton-loader__text {
    height: 20px;
  }
  .bar-bg{
    background-color: rgba(248, 88, 88, 0.5);
  }
}
</style>
