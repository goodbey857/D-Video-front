import { ethers, BrowserProvider } from "ethers"

const ABI = process.env.VUE_APP_D_VIDEO_ABI
const address = process.env.VUE_APP_D_VIDEO_ADDRESS
const Provider = new BrowserProvider(window.ethereum)

const DVideoContract = async () => {
    // 导入签名
    const signer = await Provider.getSigner()
    // 获取合约，参数：contractAddress、contractABI、signer
    const Contract = new ethers.Contract(address, JSON.parse(ABI), signer)
    return Contract;
}


const ERC20_ABI = process.env.VUE_APP_ERC20_ABI
const ERC20_ADDRESS = process.env.VUE_APP_ERC20_ADDRESS
const ERC20Contract = async () => {
    // 导入签名
    const signer = await Provider.getSigner()
    // 获取合约，参数：contractAddress、contractABI、signer
    const Contract = new ethers.Contract(ERC20_ADDRESS, JSON.parse(ERC20_ABI), signer)
    return Contract;
}
const waitForTransaction = async (txHash) => {
    return await Provider.waitForTransaction(txHash)
}

export {DVideoContract,ERC20Contract, waitForTransaction}


