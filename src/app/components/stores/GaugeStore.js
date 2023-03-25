import { CLPublicKey } from "casper-js-sdk";
import {
  GAUGE_CONTROLLER_CONTRACT_HASH
} from "../blockchain/Hashes/ContractHashes";

import axios from "axios";
import * as gaugeControllerFunctions from "../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as LiquidityGaugeV3 from "../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { UserCheckpointMakeDeploy } from "../MakeDeployFunctions/UserCheckpointMakeDeploy";

export let state = {
  gaugeController: null,
  n_gauges: 0,
  pools: [],
  mypools: [],
  votingEscrow: null,
  minter: null,

  totalClaimableCRV: null,
  totalMintedCRV: null,

  totalBalance: null,
  totalGaugeBalance: null,

  APYs: {},

  boosts: {},

  gaugesNeedApply: [],

  synthsUnavailable: false,
};

export async function getState(activePublicKey, setNGauges, setTotalBalance, setTotalGaugeBalance, setMyPools, setPools, setBoosts) {
  let decodedGauges = []
  let _decodedGauges = []
  let n_gauges = await gaugeControllerFunctions.n_gauges(
    GAUGE_CONTROLLER_CONTRACT_HASH
  );
  console.log("n_gauges", parseFloat(n_gauges[1].data));
  setNGauges(parseFloat(n_gauges[1].data));
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
  let pools = []
  let poolsPackageHash = []
  let gaugeBalances = []
  // //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
  // // let claimableTokens = []
  await Promise.all(decodedGauges.map(async (gauge, index) => {
    let pool = await LiquidityGaugeV3.lpToken(
      gauge.gaugeContractHash
    );
    console.log("pool", pool);
    pools.push({ swap_token: pool, gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash })
    poolsPackageHash.push(pool)
    let gaugeBalance = await LiquidityGaugeV3.balanceOf(
      gauge.gaugeContractHash,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    );
    console.log("gaugeBalance", parseFloat(gaugeBalance));
    gaugeBalances.push({ gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash, balance: parseFloat(gaugeBalance) })
    // //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
    // // let claimableToken = await LiquidityGaugeV3.claimableTokens(
    // //   gauge,
    // //   Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    // // );
    // // console.log("claimableToken", claimableToken);
    // // claimableTokens.push(claimableToken)

  }));
  console.log("pools", pools);
  console.log("gaugeBalances", gaugeBalances);

  // // //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
  // // // console.log("claimableTokens", claimableTokens);

  let params1 = {
    packageHashes: poolsPackageHash
  }
  let res1 = await axios.post("/getContractHashesAgainstPackageHashes", params1)
  console.log("res1", res1);
  let poolsContractHashes = res1.data.contractHashes
  let decodedBalances = []
  await Promise.all(pools.map(async (pool, i) => {
    let poolBalance = await LiquidityGaugeV3.balanceOf(
      poolsContractHashes[i],
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    );
    console.log("poolBalance", parseFloat(poolBalance));
    decodedBalances.push({ gauge: pool.gauge, gaugeContractHash: pool.gaugeContractHash, swap_token: pool.swap_token, swapTokenContractHash: poolsContractHashes[i], balance: parseFloat(poolBalance) })
    pool.swapTokenContractHash = poolsContractHashes[i];
  }));
  console.log("decodedBalances", decodedBalances);
  console.log("poolsss", pools);

  let gaugeTypes = []
  let typeNames = []
  await Promise.all(pools.map(async (pool) => {
    let gaugeType = await gaugeControllerFunctions.gaugeTypes(
      GAUGE_CONTROLLER_CONTRACT_HASH,
      pool.gauge
    );
    pool.type = gaugeType - 1
    gaugeTypes.push(gaugeType - 1)


    let typeName = await gaugeControllerFunctions.gauge_type_names(
      GAUGE_CONTROLLER_CONTRACT_HASH,
      pool.type.toString()
    );
    pool.typeName = typeName;
    typeNames.push(typeName)
  }));
  console.log("gaugeTypes", gaugeTypes);
  console.log("typeNames", typeNames);
  console.log("pollsss", pools);
  let decodedGaugeLP = []
  pools.map((pool, i) => {
    decodedGaugeLP.push({
      gauge: pool.gauge,
      gaugeContractHash: pool.gaugeContractHash,
      swap_token: pool.swap_token,
      swapTokenContractHash: pool.swapTokenContractHash,
      type: pool.type,
      typeName: pool.typeNames,
      claimable_tokens: 0,
      minted: 0,
    })
    pool.claimable_tokens = 0;
    pool.minted = 0;
  })
  console.log("decodedGaugeLP", decodedGaugeLP);
  let mypools = decodedBalances.map((v, i) => {
    let poolInfo = Object.values(pools).find(pool => pool.swap_token == v.swap_token && pool.gauge == v.gauge)
    console.log("gaugeBalancesgaugeBalancesgaugeBalances", gaugeBalances);
    console.log("poolInfopoolInfopoolInfo", poolInfo);
    return {
      ...poolInfo,
      balance: v.balance,
      origBalance: v.balance,
      gaugeBalance: gaugeBalances.find(pool => pool.gauge == poolInfo.gauge).balance
    }
  })
  console.log("mypools", mypools);
  console.log("poolspoolspoolspoolspools", pools);
  let prices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,curve-dao-token&vs_currencies=usd')
  prices = await prices.json()
  let btcPrice = prices.bitcoin.usd
  let CRVprice = prices['curve-dao-token'].usd
  console.log("CRVprice", CRVprice);

  let decodedWeights = [];

  await Promise.all(decodedGauges.map(async (gauge) => {
    let gaugeParams = {
      address: gauge.gauge,
      timestamps:["1678924800000"],
    }
    console.log("gaugeParams", gaugeParams);
    let res2 = await axios.post(`/gaugeController/gaugeRelativeWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`, gaugeParams)
    console.log("res2", res2);
    Object.values(pools).find(pool => pool.gauge == gauge.gauge).gaugeRelativeWeight=res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    Object.values(mypools).find(pool => pool.gauge == gauge.gauge).gaugeRelativeWeight=res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    gauge.gaugeRelativeWeight = res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    decodedWeights.push({ ...gauge, gaugeRelativeWeight: res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0 })
  }));
  console.log("decodedWeights,", decodedWeights);
  let gaugeRates = []
  let workingSupplies = []
  let totalSupplies = []
  let workingBalances = []
  let names = []
  await Promise.all(mypools.map(async (pool) => {
    let inflationRate = await LiquidityGaugeV3.inflationRate(
      pool.gaugeContractHash
    );
    console.log("inflationRate", parseFloat(inflationRate) / 1e9);
    pool.gaugeRate = parseFloat(parseFloat(inflationRate) / 1e9)
    gaugeRates.push({ ...pool, gaugeRate: parseFloat(inflationRate) })

    let workingSupply = await LiquidityGaugeV3.workingSupply(
      pool.gaugeContractHash
    );
    console.log("workingSupply", parseFloat(workingSupply) / 1e9);
    pool.workingSupply = parseFloat(workingSupply) / 1e9;
    workingSupplies.push({ ...pool, workingSupply: parseFloat(workingSupply) / 1e9 })
    let totalSupplyGauge = await LiquidityGaugeV3.totalSupplyGauge(
      pool.gaugeContractHash
    );
    console.log("totalSupplyGauge", parseFloat(totalSupplyGauge));
    pool.originalSupply = parseFloat(totalSupplyGauge) / 1e9;
    totalSupplies.push({ ...pool, totalSupply: parseFloat(totalSupplyGauge) / 1e9 })

    let name = await LiquidityGaugeV3.name(
      pool.gaugeContractHash
    );
    console.log("name", name);
    pool.name = name;
    names.push({ ...pool, name: name })


    let workingBalance = await LiquidityGaugeV3.workingBalances(
      pool.gaugeContractHash,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    );
    console.log("workingBalances", parseFloat(workingBalance));
    pool.currentWorkingBalance = workingBalance;
    workingBalances.push(parseFloat(workingBalance))


  }));
  await Promise.all(pools.map(async (pool) => {
    let inflationRate = await LiquidityGaugeV3.inflationRate(
      pool.gaugeContractHash
    );
    console.log("poolsinflationRate", parseFloat(inflationRate) / 1e9);
    pool.gaugeRate = parseFloat(parseFloat(inflationRate) / 1e9)
    gaugeRates.push({ ...pool, gaugeRate: parseFloat(inflationRate) })

    let workingSupply = await LiquidityGaugeV3.workingSupply(
      pool.gaugeContractHash
    );
    console.log("pools workingSupply", parseFloat(workingSupply) / 1e9);
    pool.workingSupply = parseFloat(workingSupply) / 1e9;
    workingSupplies.push({ ...pool, workingSupply: parseFloat(workingSupply) / 1e9 })
    let totalSupplyGauge = await LiquidityGaugeV3.totalSupplyGauge(
      pool.gaugeContractHash
    );
    console.log("pools totalSupplyGauge", parseFloat(totalSupplyGauge));
    pool.originalSupply = parseFloat(totalSupplyGauge) / 1e9;
    totalSupplies.push({ ...pool, totalSupply: parseFloat(totalSupplyGauge) / 1e9 })

    let name = await LiquidityGaugeV3.name(
      pool.gaugeContractHash
    );
    console.log("name", name);
    pool.name = name;
    names.push({ ...pool, name: name })


  }));
  console.log("workingBalances", workingBalances);
  console.log("names", names);
  console.log("totalSupplies", totalSupplies);
  console.log("workingSupplies", workingSupplies);
  console.log("mypoolsmypools", mypools);
  let _totalBalance = mypools.reduce((a, b) => +a + +b.balance, 0)
  setTotalBalance(_totalBalance)
  let _totalGaugeBalance = mypools.reduce((a, b) => +a + +b.gaugeBalance, 0)
  setTotalGaugeBalance(_totalGaugeBalance)
  let _boosts = []
  for (let pool of mypools) {
    if (+pool.gaugeBalanace == 0) continue
    pool.previousWorkingBalance = pool.currentWorkingBalance
    _boosts[pool.name] = pool.currentWorkingBalance / (0.4 * pool.gaugeBalance)
  }
  setMyPools(mypools);
  setPools(pools);
  setBoosts(_boosts);
}

export async function applyBoostAll(
  activePublicKey,
  setOpenSigning,
  enqueueSnackbar
) {
  for (let gauge of state.gaugesNeedApply) {
    let poolName = state.mypools.find((pool) => pool.gauge == gauge).name;


    UserCheckpointMakeDeploy(activePublicKey, setOpenSigning, enqueueSnackbar);
  }
}
