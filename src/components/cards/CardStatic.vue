<template>
    <v-card>
        <v-card-text class="d-flex align-center">
            <v-avatar v-if="icon">
                <v-icon size="45" :color="color" depressed>{{ icon }}</v-icon>
            </v-avatar>

            <v-spacer />

        </v-card-text>

        <v-card-text>
            <h6 class="text-h6 mb-1">
                {{ title }}
            </h6>

            <div class="d-flex align-center mb-1 flex-wrap">
                <h4 class="text-h4 black--text">
                    {{ stats }}
                </h4>
                <!-- <div :class="isPositive ? 'green--text' : 'red--text'" class="text-body-1">
                    {{ isPositive ? `+${change}` : change }}
                </div> -->
            </div>
            <div class="text-body-2">
                {{ subtitle }}
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: false,
            default: 'primary',
        },
        icon: {
            type: String,
            required: true,
        },
        stats: {
            type: String || Number,
            required: true,
        },
        change: {
            type: Number,
            required: false,
        },
        subtitle: {
            type: String,
            required: true,
        },
    },
    computed: {
        // isPositive() {
        //     return Math.sign(this.change) === 1;
        // },
    },
};
</script>
