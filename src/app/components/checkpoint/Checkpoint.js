import BigNumber from "bignumber.js";
import { CLPublicKey } from "casper-js-sdk";
import { GAUGE_CONTROLLER_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { balanceOf } from "../JsClients/VOTINGESCROW/QueryHelper/functions";
import { UserCheckpointMakeDeploy } from "../MakeDeployFunctions/UserCheckpointMakeDeploy";
import * as gaugeControllerFunctions from "../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as LiquidityGaugeV3 from "../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";



let activePublicKey = localStorage.getItem("Address");

export async function checkpoint(doCheckpoint = false, setOpenSigning, enqueueSnackbar, gaugesQueryData) {


    console.log("gaugesQueryData", gaugesQueryData);
    let decodedGauges = []
    let _decodedGauges = []
    let n_gauges = await gaugeControllerFunctions.n_gauges(
        GAUGE_CONTROLLER_CONTRACT_HASH
    );
    console.log("n_gauges", parseFloat(n_gauges[1].data));
    for (let i = 0; i < n_gauges[1].data; i++) {
        let gauge = await gaugeControllerFunctions.gauges(
            GAUGE_CONTROLLER_CONTRACT_HASH,
            i.toString()
        );
        console.log("gauge", gauge);
        decodedGauges.push({ gauge })
        _decodedGauges.push(gauge)
    }

    console.log("decodedGauges", decodedGauges);
    let params = {
        packageHashes: _decodedGauges
    }
    let res = await axios.post("/getContractHashesAgainstPackageHashes", params)
    console.log("res", res);
    let gaugesContractHashes = res.data.contractHashes
    for (let i = 0; i < decodedGauges.length; i++) {
        decodedGauges[i].gaugeContractHash = gaugesContractHashes[i]
    }
    console.log("gaugesContractHashes", gaugesContractHashes);
    console.log("decodedGaugesdecodedGaugesdecodedGaugesdecodedGauges", decodedGauges);
    let gaugeBalances = []

    await Promise.all(decodedGauges.map(async (gauge, index) => {
        let gaugeBalance = await LiquidityGaugeV3.balanceOf(
            gauge.gaugeContractHash,
            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
        );
        console.log("gaugeBalance", parseFloat(gaugeBalance));
        gaugeBalances.push({ gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash, balance: parseFloat(gaugeBalance) })

    }));
    console.log("gaugeBalances", gaugeBalances);


    let gaugesNeedCheckpoint = {};
    gaugeBalances.forEach((gauge, i) => gaugesNeedCheckpoint[gauge.gauge.toLowerCase()] = gauge.balance);

    let lastCheckpointed = gaugesQueryData.gauges;
    if (lastCheckpointed.length) {
        lastCheckpointed.forEach(v => {
            console.log("GAUGE", v.gauge)
            console.log("BALANCE NOW", gaugesNeedCheckpoint[v.gauge.toLowerCase()].toString())
            console.log("ORIGINAL BALANCE", v.originalBalance.toString())
            gaugesNeedCheckpoint[v.gauge.toLowerCase()] = gaugesNeedCheckpoint[v.gauge.toLowerCase()] - (v.originalBalance)
        })
    }
    console.log("lastCheckpointed", lastCheckpointed);
    console.log("gaugesNeedCheckpoint", gaugesNeedCheckpoint);
    gaugesNeedCheckpoint = Object.keys(gaugesNeedCheckpoint).filter(k => gaugesNeedCheckpoint[k] > 0);



    if (doCheckpoint) {
        for (let gauge of gaugesNeedCheckpoint) {
            console.log("gauge:", gauge);
            await UserCheckpointMakeDeploy(gauge, activePublicKey, setOpenSigning, enqueueSnackbar);
        }
    }
}