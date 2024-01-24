import "@nomiclabs/hardhat-ethers";
import {ethers} from "hardhat";

async function main() {
    const counterContract = await ethers.getContractFactory('Counter')
    const gasPrise = await counterContract.signer.getGasPrice()
    console.info(`Current gas prise: ${gasPrise}`)

    const estimatedGas = await counterContract.signer.estimateGas(
        counterContract.getDeployTransaction()
    )
    console.info(`Estimated gas: ${estimatedGas}`)

    const deploymentPrice = gasPrise.mul(estimatedGas)
    const deployerBalance = await counterContract.signer.getBalance()

    console.info(`Deployer balance: ${ethers.utils.formatEther(deployerBalance)}`)
    console.info(`Deployment price: ${ethers.utils.formatEther(deploymentPrice)}`)

    if (Number(deploymentPrice) > Number(deployerBalance)) {
        throw new Error("You dont have enough balance to deploy")
    }

    const deployContract = await counterContract.deploy()
    await deployContract.deployed()

    console.info(`Contract deployed to ${deployContract.address}`)
}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err)
    process.exit(1)
})