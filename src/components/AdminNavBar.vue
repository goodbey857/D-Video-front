<template>
    <nav id="adminNavBar">
        <v-app-bar class="white" flat app clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold"><router-link to="/" class="black--text"
                    style="text-decoration: none">管理员后台</router-link></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" app clipped>
            <div tag="div" class="v-navigation-drawer__content" v-bar>
                <v-list dense nav class="py-0" tag="div">
                    <!-- 用户管理，视频管理，评论管理, 视频转移，奖励管理 -->
                    <!-- 分析面板，日活量，视频发布量， -->

                    <v-divider class="hidden-lg-and-up"></v-divider>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router to="/admin">
                        <v-list-item-icon
                            class="v-list-item__icon"><v-icon>mdi-home-analytics</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                分析面板
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router
                        to="/admin/userData">
                        <v-list-item-icon class="v-list-item__icon"><v-icon>
                                mdi-clipboard-account</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                用户管理
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router
                        to="/admin/videoData">
                        <v-list-item-icon class="v-list-item__icon"><v-icon>mdi-youtube</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                视频管理
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router
                        to="/admin/commentData">
                        <v-list-item-icon
                            class="v-list-item__icon"><v-icon>mdi-comment-multiple</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                评论管理
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router
                        to="/admin/videoTransferData">
                        <v-list-item-icon
                            class="v-list-item__icon"><v-icon>mdi-swap-horizontal</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                视频转移
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router
                        to="/admin/rewardData">
                        <v-list-item-icon class="v-list-item__icon"><v-icon> mdi-gift</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                奖励中心
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item exact active-class="active-item" link href tile class="mb-0" router to="/admin/judge">
                        <v-list-item-icon class="v-list-item__icon"><v-icon> mdi-security</v-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium subtitle-2">
                                举报审核
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </v-navigation-drawer>
    </nav>

</template>

<script>


export default{
    data(){
        return{
            drawer:true
        }
    }   

}
</script>

<style lang="scss">
#adminNavBar{
    .active-item {
        border-left: 3px solid #cc0202;
        .v-list-item__icon,
        .subtitle-2 {
            color: #cc0202 !important;
        }
    }
    .v-navigation-drawer__content:hover .vb>.vb-dragger>.vb-dragger-styler {
        width: 10px;
        background-color: #8d8a8a;
    }
}
    

</style>
