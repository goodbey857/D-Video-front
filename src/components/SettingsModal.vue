<template>
  <v-dialog v-model="dialog" persistent transition="fab-transition" max-width="800" id="settings">
    <v-card tile>
      <div class="d-flex justify-space-between mb-5" id="modal-header">
        <v-card-title class="py-3">设置</v-card-title>

        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text>
        <v-row justify="center">
          <v-col order="last" order-sm="last" order-md="first" order-lg="first" order-xl="first" clos="12" sm="10"
            md="10" lg="10" class="pt-0" align-self="center">
            <!-- <v-card> -->
            <h3 class="mb-6 mt-0 pt-0">IPFS RPC</h3>
            <v-select :items="ipfsRpcList" :error-messages="errors" label="IPFS RPC" v-model="currentIpfsRPC">
              <template v-slot:append-item>
                <v-divider class="mb-2"></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field label="添加自定义ipfs RPC 节点" ref="ipfsRpcInput">
                      <v-btn slot="append" class="blue darken-3 flat white--text mt-4" @click="addNewIpfsRpc">添加</v-btn>
                    </v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- </v-card> -->
            <!-- <v-card> -->
            <h3 class="mb-6 mt-6">IPFS网关</h3>
            <v-select :items="ipfsGatewayList" :error-messages="errors" label="IPFS网关" v-model="currentIpfsGateway">
              <template v-slot:append-item>
                <v-divider class="mb-2"></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field label="添加自定义ipfs RPC 节点" ref="ipfsGatewayInput">
                      <v-btn slot="append" class="blue darken-3 flat white--text mt-4"
                        @click="addNewIpfsGateway">添加</v-btn>
                    </v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- </v-card> -->
          </v-col>
          <!-- <v-col order-sm="1" cols="12" sm="12" md="4" lg="4" class="text-center">
            <v-btn text @click="toggleShow">Upload Avatar</v-btn>
            <my-upload field="img" @crop-success="cropSuccess" v-model="show" :width="200" :height="200"
              :params="params" :headers="headers" img-format="jpg" langType="en"></my-upload>
            <v-responsive width="230" class="mx-auto" style="border-radius: 50%;">
              <div v-if="!imgDataUrl" class="px-12" id="settings-image-placeholder">
                <v-icon>mdi-image-plus</v-icon>
              </div>
              <v-img v-else height="220" :src="imgDataUrl"></v-img>
            </v-responsive>
          </v-col> -->
        </v-row>
      </v-card-text>
      <!-- <v-card-actions v-if="!uploaded">
        <p class="text-center grey--text caption px-12 px-xs-0">
          By submitting your videos to YouTube, you acknowledge that you agree
          to YouTube's Terms of Service and Community Guidelines. Please be sure
          not to violate others' copyright or privacy rights. Learn more
        </p>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SettingsModal',
  props: ['openDialog'],
  data: function () {
    return {
      currentIpfsRPC: this.ipfsRpc,
      currentIpfsGateway: this.ipfsGateway,
    
    }
  },
  computed: {
    dialog() {
      return this.openDialog
    },
    ...mapGetters(['ipfsRpc', 'ipfsRpcList', 'ipfsGateway', 'ipfsGatewayList']),
  },
  created() {
    this.currentIpfsRPC = this.ipfsRpc
    this.currentIpfsGateway = this.ipfsGateway
  },
  watch: {
    currentIpfsRPC(newVal) {
      this.$store.commit('setIpfsRpc', newVal)
    },
    currentIpfsGateway(newVal) {
      this.$store.commit('setIpfsGateway', newVal)
    }
  },
  methods: {
    submit() {
      // if (this.$route.name === 'Dashboard')
      //   return this.$router.push('/studio/videos')
      console.log('submittied')
      this.closeModal()
    },
    closeModal() {
      this.$emit('closeDialog')
    },

    toggleShow() {
      this.show = !this.show
    },
    addNewIpfsRpc() {
      var newIpfsRpc = this.$refs.ipfsRpcInput.$refs.input.value;
      this.$store.commit('addIpfsRpc', newIpfsRpc);
      this.$store.commit('setIpfsRpc', newIpfsRpc);
      this.$refs.ipfsRpcInput.reset();
    },
    addNewIpfsGateway() {
      var newIpfsGateway = this.$refs.ipfsGatewayInput.$refs.input.value;
      this.$store.commit('addIpfsGateway', newIpfsGateway);
      this.$store.commit('setIpfsGateway', newIpfsGateway);
      this.$refs.ipfsGatewayInput.reset();
    },
    
    
  },

}
</script>

<style lang="scss">
#modal-header {
  border-bottom: 1px solid rgb(238, 232, 232);
}

#settings-image-placeholder {
  padding-top: 7em;
  padding-bottom: 7em;
  border: 2px dashed rgb(209, 209, 209);
  border-radius: 50%;
}

@media (max-width: 700px) {
  .vue-image-crop-upload {
    .vicp-wrap {
      width: 95%;
      height: 550px;

      .vicp-step2 .vicp-crop {
        .vicp-crop-left {
          float: none;

          .vicp-range {
            margin: auto;
            margin-top: 30px;
          }

          & * {
            margin-left: auto;
            margin-right: auto;
          }
        }

        .vicp-crop-right {
          float: none;
          margin-top: 30px;

          .vicp-preview .vicp-preview-item {
            display: inline-block;
            float: none;
          }

        }
      }
    }
  }
}
</style>
