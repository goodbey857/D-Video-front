<template>
    <v-card class="mx-1 mb-1" :loading="loading">
        <template slot="progress">
            <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
        </template>
        <v-card-title class="pa-6 pb-0">
            <v-row no-gutters>
                <v-col cols="7" sm="4" md="4" lg="5" class="d-flex align-center">
                    <p>浏览量统计</p>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="d-none d-sm-flex align-center">
                    <v-icon size="18" color="warning">mdi-circle-medium</v-icon><span
                        class="card-dark-grey font-weight-regular mr-3" style="font-size: 18px">总量</span>
                    <v-icon size="18" color="primary">mdi-circle-medium</v-icon><span
                        class="card-dark-grey font-weight-regular mr-3" style="font-size: 18px">增长量</span>
                </v-col>
                <v-col cols="5" sm="2" md="2" lg="1" offset-lg="1">
                    <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                            <v-select class="main-chart-select" v-model="mainApexAreaSelect" v-bind="attrs" v-on="on"
                                dense flat single-line :items="mock.select" outlined></v-select>
                        </template>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="pa-6">
            <v-row>
                <v-col>

                    <ApexChart height="300" type="line" :options="mock.mainApexArea.options" :series="series">
                    </ApexChart>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import ApexChart from 'vue-apexcharts';
export default {
    name: "viewAnalytics",
    components: {
        ApexChart,
    },
    props:{
        fetchData: Function
    },
    data() {
        return {
            mock:{
                select: ["day", "week", "month"],
                mainApexArea: {
                    options: {
                        chart: {
                            width: '100%',
                            toolbar: {
                                show: false
                            },
                        },
                        dataLabels: {
                            enabled: false
                        },
                        grid: {
                            xaxis: {
                                lines: {
                                    show: false,
                                }
                            },
                            yaxis: {
                                lines: {
                                    show: false,
                                },
                            }
                        },
                        markers: {
                            size: [5, 0, 0]
                        },
                        stroke: {
                            width: [3, 0],
                            curve: ['smooth', "smooth"]
                        },
                        fill: {
                            type: 'linear',
                        },
                        legend: {
                            show: false

                        },
                        colors: ['#FFC260','#deccff'],
                        yaxis: [
                            {
                                axisBorder: {
                                    show: true,
                                  
                                },
                                axisTicks: {
                                    show: true
                                },
                                labels: {
                                    style: {
                                        fontSize: '12px',
                                    },
                                },
                                tickAmount: 5,
                                title: {
                                    text: "总量",
                                }
                            }, {
                                seriesName: "Income",
                                opposite: true,
                                axisTicks: {
                                    show: true
                                },
                                axisBorder: {
                                    show: true,
                                },
                                labels: {
                                    style: {
                                        color: "#00E396"
                                    }
                                },
                                title: {
                                    text: "增长量",

                                }
                            }]
                            ,
                        xaxis: {
                            labels: {
                                style: {
                                    fontSize: '12px',
                                    colors: ['#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980', '#B9B9B980'],
                                }
                            },
                            tickAmount: 10,
                        }
                    },
                }

            },
                    
            series: [],
            apexLoading: true,

            mainApexAreaSelect: null,
        };
    }, 
    computed: {
        loading: function(){
            return this.series.length == 0;
        }
    },

    methods: {

    },
    watch:{
        mainApexAreaSelect: function(val){
            this.fetchData(val).then(resp =>{
                var x = [];
                var y = [];
                var total = [];
                var sum = 0;
                if(resp.code == 0){
                    for( let i of resp.data){

                        x.push(i.x);
                        y.push(i.y);
                        sum+=i.y;
                        total.push(sum);
                    }
                }

                this.series = [
                    {
                        name: '总量',
                        type: 'line',
                        data: total
                    },
                    {
                        name: '增长量',
                        type: 'bar',
                        data: y
                    },
                ];
                
            });


        }
    },
    mounted() {
        this.mainApexAreaSelect = 'day';
    }
}
</script>
