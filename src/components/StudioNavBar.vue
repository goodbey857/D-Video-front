<template>
  <nav id="studioBar">
    <v-app-bar class="white" app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold"><router-link to="/studio" class="black--text"
          style="text-decoration: none">创作者后台</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field flat hide-details append-icon="mdi-magnify" placeholder="Search" outlined dense
        @click:append="search" class="hidden-sm-and-down"></v-text-field>
      <!-- <v-toolbar-title>Page title</v-toolbar-title> -->

      <v-spacer></v-spacer>
      <v-menu offsetY>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn class="mr-8 createVideoBtn" outlined v-on="{ ...tooltip, ...menu }" @click="modal"><v-icon
                  size="25" class="red--text small">mdi-video-plus</v-icon>
                发布视频</v-btn>
            </template>
            <span>点击立即发布真正属于你的去中心化视频</span>
          </v-tooltip>
        </template>
      </v-menu>

      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <!-- <v-btn small color="red" depressed fab v-on="on" class="white--text">
            T
          </v-btn> -->
          <v-avatar>
            <img v-on="on" :src="$store.getters.currentIpfsGateway + currentUser.profileImageCid" />
          </v-avatar>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="$store.getters.currentIpfsGateway + currentUser.profileImageCid" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ this.currentUser.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ this.currentUser.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item router to="/channels/@me">
              <v-list-item-icon>
                <v-icon>mdi-account-box</v-icon>
              </v-list-item-icon>
              <v-list-item-title>我的主页</v-list-item-title>
            </v-list-item>
            <v-list-item router to="/studio">
              <v-list-item-icon>
                <v-icon>mdi-youtube-studio</v-icon>
              </v-list-item-icon>
              <v-list-item-title>我的后台</v-list-item-title>
            </v-list-item>
            <v-list-item router to="/signin">
              <v-list-item-icon>
                <v-icon>mdi-login-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>退出登录</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" clipped app id="nav">
      <div tag="div" class="v-navigation-drawer__content" v-bar>
        <v-list tile class="py-0">
          <v-list-item v-for="item in items[0].pages" :key="item.title" href tile class="mb-0" router :to="item.link"
            exact active-class="active-item">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium subtitle-2">{{
                item.title
                }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <template v-slot:append>
        <div class="pa-2">
          <v-divider></v-divider>
          <v-list>
            <v-list-item v-for="item in items[1].pages" :key="item.title" link class="mb-0"
              :to="item.link === '' ? '' : item.link" @click="settingsMoal(item.title)" exact
              active-class="active-item">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class=" font-weight-medium subtitle-2">{{
                  item.title
                  }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </template>
      <template v-slot:prepend>
        <div class="pa-2 text-center">
          <v-list class="text-center">
            <v-list-item class="px-2">
              <!-- <v-btn height="95" width="95" href x-large color="red" depressed fab to="/channels/222"
                class="white--text mx-auto">
                <h1 class="display-1">T</h1>
              </v-btn> -->

              <v-avatar size="95" class="white--text mx-auto" to="/channels/@me">
                <img :src="$store.getters.currentIpfsGateway + currentUser.profileImageCid" />
              </v-avatar>
            </v-list-item>

            <v-list-item link to="/channels/@me">
              <v-list-item-content>
                <v-list-item-title class="title">{{ currentUser.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <upload-video-modal :open-dialog="dialog" v-on:closeDialog="dialog = false" />
    <settings-modal :open-dialog="settingsDialog" v-on:closeDialog="settingsDialog = false" />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import UploadVideoModal from '@/components/UploadVideoModal'
import SettingsModal from '@/components/SettingsModal'
export default {
  name: 'StudioNavBar',
  data: () => ({
    drawer: false,
    items: [
      {
        header: 'scroll',
        pages: [
          // { title: 'Dashboard', link: '/studio', icon: 'mdi-view-dashboard' },
          {
            title: '数据面板',
            link: '/studio/analytics',
            icon: 'mdi-home-analytics'
          },
          {
            title: '视频管理',
            link: '/studio/videos',
            icon: 'mdi-play-box-multiple'
          },
          // {
          //   title: 'Playlists',
          //   link: '#p',
          //   icon: 'mdi-playlist-play'
          // },
          
          {
            title: '评论管理',
            link: '/studio/comments',
            icon: 'mdi-message-reply-text'
          },

          {
            title: '代币转账记录',
            link: '/studio/tokenRecord',
            icon: 'mdi-subtitles'
          },
          // {
          //   title: 'Monetization',
          //   link: '#m',
          //   icon: 'mdi-currency-usd'
          // },
          // {
          //   title: 'Audio library',
          //   link: '#al',
          //   icon: 'mdi-music-box-multiple'
          // }
        ]
      },
      {
        header: 'fixed',
        pages: [
          {
            title: '设置',
            link: '',
            icon: 'mdi-cog'
          },
          {
            title: '用户反馈',
            link: '#sf',
            icon: 'mdi-history'
          }

        ]
      }
    ],
    dialog: false,
    settingsDialog: false
  }),
  methods: {
    search() {
      console.log('hello')
    },
    modal() {
      this.dialog = true
    },
    settingsMoal(title) {
      if (title !== '设置') return
      this.settingsDialog = true
    }
  },
  components: {
    UploadVideoModal,
    SettingsModal
  },
  mounted() {
    this.drawer = this.$vuetify.breakpoint.mdAndDown ? false : true
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'getToken',
      'isAuthenticated',
      'userAddress'
    ]),
  }
}
</script>

<style lang="scss">
#studioBar {
  .active-item {
    // border-radius: 0 !important;
    border-left: 3px solid #cc0202;
    .v-list-item__icon,
    .subtitle-2 {
      color: #cc0202 !important;
    }
  }
  .createVideoBtn {
    border-color: rgb(185, 181, 181);
  }
  // .v-navigation-drawer__border {
  //   width: 0 !important;
  // }

  .vuebar-element {
    height: 250px;
    width: 100%;
    max-width: 500px;
    background-color: #8d8a8a !important;
  }

  .vb > .vb-dragger {
    z-index: 5;
    width: 10px;
    right: 0;
  }

  .vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: margin 100ms ease-out, height 100ms ease-out;
    transition: margin 100ms ease-out, height 100ms ease-out;

    margin: 5px 5px 5px 0;

    height: calc(100% - 10px);
    display: block;
    width: 10px;
    background-color: #8d8a8a;
  }
  .v-navigation-drawer__content:hover .vb > .vb-dragger > .vb-dragger-styler {
    width: 10px;
    background-color: #8d8a8a;
  }
  .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: #8d8a8a;
  }

  .vb > .vb-dragger:hover > .vb-dragger-styler {
    // margin: 0px;
    // width: 10px;
    background-color: #8d8a8a;
  }

  .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: #8d8a8a;
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: #8d8a8a;
  }
}
</style>
