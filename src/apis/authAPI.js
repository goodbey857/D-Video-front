import Api from "@/apis/Api";

import { BrowserProvider } from "ethers";

const provider = new BrowserProvider(window.ethereum);

export default {
  async getSignMessage(address) {
    var messageResp = await Api().get("/auth/message/".concat(address));
    var message = messageResp.data;
    return message;
  },

  async connectWallet() {
    var accounts = provider.send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
    var address = await accounts
    return address[0];
  },

  async signInWithEthereum() {
    const signer = await provider.getSigner();
    const message = await this.getSignMessage(signer.address);
    var signedMessage = await signer.signMessage(message);
    // 发给后端验证，后端验证通过后，返回一个token，前端保存
    var signResult = await Api().post(
      "/auth/signin",
      {
        signature: signedMessage,
        address: signer.address,
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return signResult;
  },

  async signout(){
    return await Api().delete("/auth/signout");
  }
};
