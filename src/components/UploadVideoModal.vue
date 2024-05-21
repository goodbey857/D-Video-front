<template>
  <v-dialog v-model="dialog" persistent transition="fab-transition" max-width="1000">
    <v-card>
      <div class="d-flex justify-space-between mb-5" id="modal-header">
        <v-card-title class="py-3" @click="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-card-title>
        <v-select :items="ipfsRpcList" :error-messages="errors" label="选择IPFS RPC地址" v-model="ipfs">
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
        <div class="mt-3 mr-2">
          <v-btn text @click="skipUpload">
            通过cid上传
          </v-btn>
          <v-btn icon text @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <v-card-text v-if="uploadState==1"
        class="d-flex flex-column align-center my-md-12 py-md-12 my-sm-8 py-sm-8 my-xs-0 py-xs-0 my-12 py-12">
        <div v-if="!uploading" class="text-center">
          <div>
            <v-btn icon class="grey lighten-2 mb-4" style="height: 104px;width: 104px;" @click="selectFile"><v-icon
                x-large class="grey--text text--darken-1">mdi-upload</v-icon></v-btn>
          </div>

          <ValidationProvider rules="required|size:500000" v-slot="{ errors }" name="file" ref="provider">
            <v-file-input @change="uploadVideo" accept="video/mp4" placeholder="选择视频"
              prepend-icon="mdi-video" :error-messages="errors" ref="fileInput"
              v-model="uploadData.video"></v-file-input>
          </ValidationProvider>
          <v-btn type="submit" depressed @click="$refs.fileInput.$refs.input.click()"
            class="blue darken-3 flat white--text mt-4">选择视频</v-btn>
        </div>

        <v-progress-circular v-else :rotate="360" :size="100" :width="15" :value="progress" color="teal">
          {{ progress }}
        </v-progress-circular>
      </v-card-text>
      <v-card-text v-else-if="uploadState==2">
        <h2 class="mb-6">视频信息</h2>
        <v-row>
          <v-col order="last" order-sm="last" order-md="first" order-lg="first" order-xl="first" cols="12" sm="12"
            md="8" lg="8">
            <ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
              <form @submit.prevent="handleSubmit(submit)" @reset.prevent="reset">
                <ValidationProvider v-slot="{ errors }" name="Title" rules="required|min:46">
                  <v-text-field v-model="uploadData.cid" :error-messages="errors" label="视频CID" class="mb-3" filled
                    dense counter="46" max-length="46"></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Title" rules="required|min:46">
                  <v-text-field v-model="uploadData.coverCid" :error-messages="errors" label="封面CID" class="mb-3" filled
                    dense counter="46" max-length="46"></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Title" rules="required|min:3">
                  <v-text-field v-model="uploadData.title" :error-messages="errors" label="标题" class="mb-3" filled dense
                    counter="100" max-length="100"></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Description" rules="required|min:3">
                  <v-textarea filled auto-grow :error-messages="errors" label="视频描述"
                    placeholder="Tell viewers about your video" rows="5" counter="5000" max-length="5000"
                    v-model="uploadData.description" row-height="20"></v-textarea>
                </ValidationProvider>
                <!-- <ValidationProvider v-slot="{ errors }" name="Visibilty" rules="required|min:3">
                  <v-select :items="visibilty" :error-messages="errors" filled label="Visibilty"
                    v-model="formData.visibilty"></v-select>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Cateogry" rules="required|min:3">
                  <v-select :items="categories" :error-messages="errors" filled label="Categories"
                    v-model="formData.category"></v-select>
                </ValidationProvider> -->

                <div class="mt-6 d-flex justify-space-between">
                  <v-btn type="submit" class="primary" depressed>提交</v-btn>
                </div>
              </form>
            </ValidationObserver>
          </v-col>
      
          <v-col order-sm="1" cols="12" sm="12" md="4" lg="4" class="text-center">
            <v-btn text @click="toggleShow">上传封面地址</v-btn>
            <my-upload v-model="show" :width="600" :height="360"
              :url="ipfsRpc +'/api/v0/add?stream-channels=true&pin=false&progress=false'"
              @crop-upload-success="cropUploadSuccess" img-format="jpg" langType="zh" noCircle>
            </my-upload>
            <v-responsive width="330" class="mx-auto">
              <div v-if="!imgDataUrl" class="px-12" id="image-placeholder">
                <v-icon>mdi-image-plus</v-icon>
              </div>
              <v-img v-else max-width="300" height="180" :src="imgDataUrl"></v-img>
            </v-responsive>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="uploadState==3">
        <v-row>
          <v-progress-linear indeterminate color="yellow darken-2"></v-progress-linear>
        </v-row>
        
        <v-row><p class="text-center grey--text caption px-12 px-xs-0">
          请在加密钱包中签名...
        </p></v-row>
        
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import myUpload from 'vue-image-crop-upload';
import { create } from 'kubo-rpc-client';
import { mapGetters } from 'vuex';
import { DVideoContract } from '@/apis/DVideoContract';

export default { 
  name: 'UploadModal',
  props: ['openDialog'],
  data: function() {
    return {
      // dialog: this.openDialog ? this.openDialog : false,
      errors: "",
      valid: false,
      uploaded: false,
      uploading: false,
      pending: true,
      uploadState: 1,
      ipfs: null,
      // ipfsRpc : "http://192.168.1.111:5001",
      uploadData:{
        cid: '',
        video: null,
        description: '',
        cover: null,
        coverCid: '',
        title: ''
      },
      interval: {},
      progress: 0,
      value: 0,
      show: false,
      rules: [
        (value) =>
          !value ||
          value.size < 500000000 ||
          'Video size should be less than 500 MB!'
      ],

      formData: {
        title: '',
        description: '',
        category: '',
        visibilty: ''
      },
      imgDataUrl: '',

    }
  },
  computed: {
    dialog() {
      return this.openDialog
    },
    ...mapGetters(['ipfsRpc','ipfsRpcList']),
  },
  mounted(){
    console.log(this.ipfsRpc)
    this.ipfs = this.ipfsRpc
  },
  watch:{
    uploadData:{
      handler: function(newVal,oldVal){
        console.log(newVal,oldVal)
        this.imgDataUrl = this.getIpfsURL(newVal.coverCid);

      },
      deep: true
    },
    ipfs(newVal){
      this.$store.commit('setIpfsRpc', newVal)
    }
  },

  methods: {
    async submitUpload() {
      var accounts = await window.ethereum.request({
        "method": "eth_accounts",
        "params": []
      });
      if(accounts.length<1){
        accounts = await window.ethereum.request({
          "method": "eth_requestAccounts",
          "params": []
        });
      }
      var currentAccount = accounts[0];
      try{
        
        var constract = await DVideoContract();
        var resp = await constract.mint(currentAccount, this.uploadData.cid, this.uploadData.title, this.uploadData.description, this.uploadData.coverCid, '', '', '')
        
        console.log(resp)
        return resp.hash
        
      }catch(err){
        console.log(err)
      }
      return -1;
      
      
    },

    getIpfsURL(cid) {
      if(cid) return this.$store.getters.currentIpfsGateway.concat(cid);
    },
    addNewIpfsRpc(){
      var newIpfsRpc = this.$refs.ipfsRpcInput.$refs.input.value;
      this.$store.commit('addIpfsRpc',newIpfsRpc);
      this.$store.commit('setIpfsRpc',newIpfsRpc);
      this.$refs.ipfsRpcInput.reset();
    },
    cropUploadSuccess(jsonData) {

      console.log(jsonData);
      this.uploadData.coverCid = jsonData.Hash;

    },
    async uploadVideo() {
      console.log(this.uploadData.video);
      if (!this.uploadData.video) return
      this.uploading = true;
      // 读取文件内容
      try{
        var ipfsNode = create(new URL(this.ipfsRpc))
        // 上传文件到IPFS网络
        
        var { cid } = await ipfsNode.add(this.uploadData.video,{
          pin: false,
          progress: (bytesUploaded) => {
            // 计算上传进度
            this.progress = Math.round((bytesUploaded / this.uploadData.video.size) * 100)
          }
        });
        console.log(cid.toString());
        this.uploadData.cid = cid.toString();
        // 清空文件选择
        this.uploadData.video = null
        
      } catch (error) {
        console.error('Error uploading file to IPFS:', error)
      } finally {
        this.uploadState +=1;
        this.uploading = false
        this.progress = 0
      }
      
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
        reader.readAsArrayBuffer(file)
      })
    },
    back(){
      if(this.uploadState >1)
      this.uploadState = this.uploadState -1;
    },
    skipUpload(){
      this.uploadState = 2;
    },
    submit() {
      // if (this.$route.name === 'Dashboard')
      //   return this.$router.push('/studio/videos')
      this.uploadState = this.uploadState + 1;
      this.pending = true;
      this.submitUpload().then((hash) =>{
        if(hash == -1){
          this.closeModal();
          return;
        }
        this.checkTxn(hash).then((receipt) =>{
          if(receipt){
            this.pending = false;
          }
          this.uploadState = 1;
          this.closeModal();
        })
      })
      console.log('submittied')
      
    },
    async checkTxn(hash){
      for(let i=0;i<10;i++){
        var resp = await window.ethereum.request({
          "method": "eth_getTransactionReceipt",
          "params": [
            hash
          ]
        })
        if(resp != null){
          return true
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      return false
      
    },
    closeModal() {
      this.$emit('closeDialog')
    },
    selectFile() {
      this.$refs.fileInput.$refs.input.click()
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      console.log(field)
      this.imgDataUrl = imgDataUrl
    }
  },
  components: {
    myUpload
  }
}
</script>

<style lang="scss">
#modal-header {
  border-bottom: 1px solid rgb(238, 232, 232);
}

#image-placeholder {
  padding-top: 8em;
  padding-bottom: 8em;
  border: 2px dashed rgb(209, 209, 209);
}
</style>
