import BigNumber from "bignumber.js";
import { CLPublicKey } from "casper-js-sdk";
import { balanceOf } from "../JsClients/VOTINGESCROW/votingEscrowFunctionsForBackend/functions";
import { UserCheckpointMakeDeploy } from "../MakeDeployFunctions/UserCheckpointMakeDeploy";
export async function checkpoint(doCheckpoint = false, setOpenSigning, enqueueSnackbar, setGaugesNeedCheckpoint) {
    let activePublicKey = localStorage.getItem("Address");

    //gauges are having temporary hashes which will be replaced by the original one
    let gaugesNames = {
        "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9": 'compound',
        "d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef": 'usdt',
        "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a": 'y',
        "3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735": 'busd',
        "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0": 'pax',
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38": 'ren',
        "adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c": 'susdv2',
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38": 'sbtc',
    }

    let gauges = [
        "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9",
        "d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef",
        "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a",
        "3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735",
        "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0",
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38",
        "adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c",
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
    ]

    let decodedBalances = [];
    gauges.forEach(async (gauge, i) => decodedBalances.push(await balanceOf(gauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))));

    let gaugesNeedCheckpoint = {};
    decodedBalances.forEach((balance, i) => gaugesNeedCheckpoint[gauges[i].toLowerCase()] = BigNumber(balance));

    //Query for Grapghql
    //code for query here

    let lastCheckpointed = [12, 12, 12];
    
    if(lastCheckpointed.length) {
        lastCheckpointed.forEach((v) => {
            gaugesNeedCheckpoint[v.gauge.toLowerCase()] = gaugesNeedCheckpoint[v.gauges.toLowerCase()].minus(BigNumber(v.originalBalance));
        })
    }

    gaugesNeedCheckpoint = Object.keys(gaugesNeedCheckpoint).filter(k => gaugesNeedCheckpoint[k].gt(0));
 
    setGaugesNeedCheckpoint(gaugesNeedCheckpoint);

    if(doCheckpoint) {
        for(let gauge of gaugesNeedCheckpoint) {
            let gaugeAddress = Object.keys(gaugesNames).find(address => address.toLowerCase() == gauge.toLowerCase()); //this gauge address is used for notification only
            //notification

            // await new Promise (async (resolve, reject) => {
            //     //blockchain call
            //     await UserCheckpointMakeDeploy();
            // })
            await UserCheckpointMakeDeploy(Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"), setOpenSigning, enqueueSnackbar);
        }
    }
}