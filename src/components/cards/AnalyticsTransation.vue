
<template>
    <v-card style="height: auto;">
        <v-card-title>
            <h3>基本数据</h3>
        </v-card-title>
        <v-card-subtitle>
            <p class="text-body-1 mb-0">
                <!-- <span class="d-inline-block font-weight-medium text-high-emphasis">Total 48.5% Growth</span> <span
                    class="text-high-emphasis">😎</span> this month -->
                <span class="d-inline-block font-weight-medium text-high-emphasis"> </span>
            </p>
        </v-card-subtitle>


        <v-card-text class="pt-10" style="padding-bottom: 20px;">
            <v-row>
                <v-col v-for="item in statistics" :key="item.title" cols="12" sm="6" md="3">
                    <div class="d-flex align-lg-center">
                        <v-avatar :color="item.color" rounded size="45" class="elevation-2" style="margin: 8px;">
                            <v-icon size="35" color="white">{{ item.icon }}</v-icon>
                        </v-avatar>

                        <div class="d-flex flex-column">
                            <div class="text-body-1">
                                {{ item.title }}
                            </div>
                            <h5 class="text-h5">
                                {{ item.stats }}
                            </h5>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default{
    props: {
        statistics: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
       
    })
}

</script>