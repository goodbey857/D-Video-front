<template>
  <nav id="navbar">
    <v-app-bar class="white" flat app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold"><router-link to="/" class="black--text"
          style="text-decoration: none">VueTube</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field flat hide-details append-icon="mdi-magnify" placeholder="Search" outlined dense v-model="searchText"
        @click:append="search" class="hidden-sm-and-down"></v-text-field>

      <v-spacer></v-spacer>
      <v-menu offsetY>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-on="{ ...tooltip, ...menu }"><v-icon size="25">mdi-video-plus</v-icon></v-btn>
            </template>
            <span>Create a video and more</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item router to="/studio">
            <v-list-item-icon class="mr-3"><v-icon>mdi-play-box-outline</v-icon></v-list-item-icon>
            <v-list-item-title>Upload video</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon class="mr-3"><v-icon>mdi-access-point</v-icon></v-list-item-icon>
            <v-list-item-title>Go live</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on"> <v-icon size="25">mdi-apps</v-icon></v-btn>
        </template>
        <span>VueTube apps</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="mr-7">
            <v-icon size="25">mdi-bell</v-icon></v-btn>
        </template>
        <span>Notifications</span>
      </v-tooltip>

      <v-menu offset-y left open-on-hover>
        <template v-slot:activator="{ on }">
          <v-btn variant="tonal"  depressed  v-on="on"  @click="signin" :value="loginText" > 
            <v-icon left>mdi-wallet-outline</v-icon>
            {{loginText}}
            
          </v-btn>
        </template>

        <v-card v-if="isAuthenticated">
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="$store.getters.currentIpfsGateway+currentUser.profileImageCid"/>
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
              <v-list-item-title>Your channel</v-list-item-title>
            </v-list-item>
            <v-list-item router to="/studio">
              <v-list-item-icon>
                <v-icon>mdi-youtube-studio</v-icon>
              </v-list-item-icon>
              <v-list-item-title>VueTube Studio</v-list-item-title>
            </v-list-item>
            <v-list-item router to="/" @click="signout">
              <v-list-item-icon>
                <v-icon>mdi-login-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app :clipped="$route.name !== 'Watch'" :temporary="$route.name === 'Watch'"
      id="nav">
      <div tag="div" class="v-navigation-drawer__content" v-bar>
        <v-list dense nav class="py-0" tag="div">
          <v-list-item :class="{
            'hidden-lg-and-up': $route.name === 'Watch' ? false : true,
          }">
            <v-app-bar-nav-icon @click="drawer = !drawer" class="mr-5"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">VueTube</v-toolbar-title>
          </v-list-item>
          <v-divider class="hidden-lg-and-up"></v-divider>
          <div v-for="parentItem in items" :key="parentItem.header">
            <v-subheader v-if="parentItem.header" class="pl-3 py-4 subtitle-1 font-weight-bold text-uppercase">{{
              parentItem.header }}</v-subheader>
            <v-list-item v-for="(item, i) in parentItem.pages" :key="item.title" link class="mb-0" router :to="item.link"
              exact active-class="active-item">
              <v-list-item-icon v-if="parentItem.header !== 'Subscriptions'">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-avatar v-else class="mr-5">
                <img :src="`https://randomuser.me/api/portraits/men/${i}.jpg`" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class=" font-weight-medium subtitle-2">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2 mb-2"></v-divider>
          </div>

          <span v-for="link in links" :key="link.text">
            <span v-if="link.text === 'Terms'" class="mb-2 d-block"> </span>
            <v-btn href router :to="link.link" text class="text-capitalize px-1" small>{{ link.text }}</v-btn>
          </span>
        </v-list>
      </div>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import authAPI from '@/apis/authAPI';



export default {
  data: () => ({
    drawer: false,
    items: [
      {
        header: null,
        pages: [
          { title: "最热", link: "/", icon: "mdi-home" },
          { title: "最新", link: "/trending", icon: "mdi-fire" },
          {
            title: "关注",
            link: "/subscribe",
            icon: "mdi-youtube-subscription",
          },
        ],
      },
      {
        header: null,
        pages: [
          {
            title: "Library",
            link: "#l",
            icon: "mdi-play-box-multiple",
          },
          {
            title: "History",
            link: "/history",
            icon: "mdi-history",
          },
          {
            title: "Your videos",
            link: "/channels/ddd",
            icon: "mdi-play-box-outline",
          },

          {
            title: "Watch later",
            link: "#wl",
            icon: "mdi-clock",
          },

          {
            title: "Liked videos",
            link: "#lw",
            icon: "mdi-thumb-up",
          },
        ],
      },
      {
        header: "Subscriptions",
        pages: [
          {
            title: "Traversy Media",
            link: "#tm",
            icon: "mdi-badge-account",
          },
          {
            title: "The New Boston",
            link: "#tn",
            icon: "mdi-badge-account",
          },
          {
            title: "Net Ninija",
            link: "#nn",
            icon: "mdi-badge-account",
          },
          {
            title: "Chris Hawks",
            link: "#ch",
            icon: "mdi-badge-account",
          },
        ],
      },
      {
        header: "MORE FROM VUETUBE",
        pages: [
          {
            title: "VueTube Premium",
            link: "#vp",
            icon: "mdi-youtube",
          },
          {
            title: "Gaming",
            link: "#g",
            icon: "mdi-youtube-gaming",
          },
          {
            title: "Live",
            link: "#li",
            icon: "mdi-access-point",
          },
        ],
      },
      {
        header: null,
        pages: [
          {
            title: "Setting",
            link: "#sg",
            icon: "mdi-cog",
          },
          {
            title: "Report history",
            link: "#rh",
            icon: "mdi-flag",
          },
          {
            title: "Help",
            link: "#hp",
            icon: "mdi-help-circle",
          },
          {
            title: "Send feedback",
            link: "#f",
            icon: "mdi-message-alert",
          },
        ],
      },
    ],
    links: [
      { text: "About", link: "#" },
      { text: "Press", link: "#" },
      { text: "Copyrignt", link: "#" },
      { text: "Contact us", link: "#" },
      { text: "Creators", link: "#" },
      { text: "Advertise", link: "#" },
      { text: "Developers", link: "#" },
      { text: "Terms", link: "#" },
      { text: "Privacy", link: "#" },
      { text: "Policy & Safety", link: "#" },
      { text: "Test new features", link: "#" },
    ],
    searchText: "",
    chainId: null,
  }),
  methods: {
    search() {
      if (!this.searchText) return;
      this.$router.push({
        name: "Search",
        query: { "search-query": this.searchText },
      });
    },
    signin (){
      if(!this.isAuthenticated){
        this.$store.dispatch('signIn');
      }
    },

    signout(){
      authAPI.signout();
      this.$store.commit('CLEAR_AUTH');
      
    }
  },

    // async getSiweMessage (address) {
    //   var messageResp = await fetch('/api/auth/message/'.concat(address),{
    //     method: 'GET'
    //   });

    //   var message = await messageResp.text();
    //   console.log(message);
    //   return message;
    // },

    // connectWallet () {
    //   provider.send('eth_requestAccounts', [])
    //     .catch(() => console.log('user rejected request'));
    //     this.userAddress = provider.selectedAddress;
    // },

    // async signInWithEthereum () {
    //   if (this.userAddress){
    //     return;
    //   }
    //   const signer = await provider.getSigner();
    //   const message = await this.getSiweMessage(
    //       signer.address
    //     );
    //   var signedMessage = await signer.signMessage(message)
    //   // 发给后端验证，后端验证通过后，返回一个token，前端保存
    //   fetch('/api/auth/signin',{
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //         },
    //     body: JSON.stringify({
    //       signature: signedMessage,
    //       address: signer.address,
    //       message: message,
         
    //     })
    //   } )

    //   console.log(signedMessage);
    //   this.userAddress = signer.address;
    // },


  computed:{
    ...mapGetters([
      'currentUser',
      'getToken',
      'isAuthenticated',
      'userAddress'
  ]),
    loginText: function(){
      
      return  this.isAuthenticated ? this.userAddress.slice(0, 6) + '...' + this.userAddress.slice(-4) : 'Connect Wallet';
    }
  },
  mounted() {
    this.drawer = this.$vuetify.breakpoint.mdAndDown ? false : true;
    this.drawer = this.$route.name === "Watch" ? false : this.drawer;

    window.ethereum.on('connect', (info) => this.chainId = info.chainId);
    console.log(this.currentUser)
    // window.ethereum.on('accountsChanged', (accounts) => {
    //   if(accounts.length != 0){
    //     this.userAddress = accounts[0];
    //   }else{
    //     this.userAddress = null;
    //   }
      
    // });
  },
};
</script>

<style lang="scss">
#navbar {
  .active-item {
    .v-list-item__icon {
      color: red !important;
    }
  }

  .v-navigation-drawer__border {
    width: 0 !important;
  }

  .vuebar-element {
    height: 250px;
    width: 100%;
    max-width: 500px;
    background: #dfe9fe;
  }

  .vb>.vb-dragger {
    z-index: 5;
    width: 10px;
    right: 0;
  }

  .vb>.vb-dragger>.vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;
    transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;

    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }

  .v-navigation-drawer__content:hover .vb>.vb-dragger>.vb-dragger-styler {
    width: 10px;
    background-color: #e0e0e0;
  }

  .vb.vb-scrolling-phantom>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.3);
    background-color: rgba(255, 255, 255, 0.3);
  }

  .vb>.vb-dragger:hover>.vb-dragger-styler {
    margin: 0px;
    width: 10px;
  }

  .vb.vb-dragging>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging-phantom>.vb-dragger>.vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
  }
}
</style>
