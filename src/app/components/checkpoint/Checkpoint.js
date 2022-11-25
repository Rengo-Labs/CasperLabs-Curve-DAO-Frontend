import BigNumber from "bignumber.js";
import { CLPublicKey } from "casper-js-sdk";
import { balanceOf } from "../JsClients/VOTINGESCROW/votingEscrowFunctionsForBackend/functions";
import { UserCheckpointMakeDeploy } from "../MakeDeployFunctions/UserCheckpointMakeDeploy";

export async function checkpoint(doCheckpoint = false, setOpenSigning, enqueueSnackbar, setGaugesNeedCheckpoint) {
    let activePublicKey = localStorage.getItem("Address");

    let gaugesNames = {
        "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575": 'compound',
        "0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53": 'usdt',
        "0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1": 'y',
        "0x69Fb7c45726cfE2baDeE8317005d3F94bE838840": 'busd',
        "0x64E3C23bfc40722d3B649844055F1D51c1ac041d": 'pax',
        "0xB1F2cdeC61db658F091671F5f199635aEF202CAC": 'ren',
        "0xA90996896660DEcC6E997655E065b23788857849": 'susdv2',
        "0x705350c4BcD35c9441419DdD5d2f097d7a55410F": 'sbtc',
    }

    let gauges = [
        "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575",
        "0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53",
        "0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1",
        "0x69Fb7c45726cfE2baDeE8317005d3F94bE838840",
        "0x64E3C23bfc40722d3B649844055F1D51c1ac041d",
        "0xB1F2cdeC61db658F091671F5f199635aEF202CAC",
        "0xA90996896660DEcC6E997655E065b23788857849",
        "0x705350c4BcD35c9441419DdD5d2f097d7a55410F"
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