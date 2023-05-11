import { CLPublicKey } from "casper-js-sdk";
import {
  GAUGE_CONTROLLER_CONTRACT_HASH, MINTER_CONTRACT_HASH
} from "../blockchain/Hashes/ContractHashes";

import axios from "axios";
import * as gaugeControllerFunctions from "../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as LiquidityGaugeV3 from "../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import * as Minter from "../../components/JsClients/MINTER/minterFunctionsForBackend/functions";
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

// this will set all the values got form blockchain and backend after formatting
export async function getState(activePublicKey, setNGauges, setTotalBalance, setTotalGaugeBalance, setMyPools, setPools, setBoosts) {
  let decodedGauges = []
  let _decodedGauges = []
  // will retun n number of gauges from contract
  let n_gauges = await gaugeControllerFunctions.n_gauges(
    GAUGE_CONTROLLER_CONTRACT_HASH
  );
  console.log("n_gauges", parseFloat(n_gauges[1].data));
  setNGauges(parseFloat(n_gauges[1].data));

  // will get contract package hashes of gauges from contract 
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
  // will get contract hashes of gauges from backend 
  let res = await axios.post("/getContractHashesAgainstPackageHashes", params)
  console.log("res", res);
  let gaugesContractHashes = res.data.contractHashes
  // add contract hash in the list
  for (let i = 0; i < decodedGauges.length; i++) {
    decodedGauges[i].gaugeContractHash = gaugesContractHashes[i]
  }
  console.log("gaugesContractHashes", gaugesContractHashes);
  console.log("decodedGaugesdecodedGaugesdecodedGaugesdecodedGauges", decodedGauges);
  let pools = []
  let poolsPackageHash = []
  let gaugeBalances = []
  let claimableTokens = []
  let allMinted = []

  await Promise.all(decodedGauges.map(async (gauge, index) => {
    // get lp token of the gauge and set it in the pools array of objects
    let pool = await LiquidityGaugeV3.lpToken(
      gauge.gaugeContractHash
    );
    console.log("pool", pool);
    pools.push({ swap_token: pool, gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash })
    poolsPackageHash.push(pool)
    // get balance of the use in the gauge and set it in the gauge balances array of objects

    let gaugeBalance = await LiquidityGaugeV3.balanceOf(
      gauge.gaugeContractHash,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    );
    console.log("gaugeBalance", parseFloat(gaugeBalance));
    gaugeBalances.push({ gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash, balance: parseFloat(gaugeBalance) })
    // get minted value from contract minter against the gauge and set it in the minted array of objects

    let minted = await Minter.minted(
      MINTER_CONTRACT_HASH,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
      gauge.gauge
    );
    console.log("minted", minted);
    allMinted.push({ minted: minted, gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash })
    // get claimable tokens from backend againg the gauge
    let claimableToken = await axios.post(`/liquidityGaugeV3/claimableTokens/${gauge.gaugeContractHash}`, {
      address: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    })

    console.log("claimableToken", claimableToken);
    claimableTokens.push({ gauge: gauge.gauge, gaugeContractHash: gauge.gaugeContractHash, claimableToken: claimableToken.data.claimableTokens })


  }));
  console.log("pools", pools);
  console.log("gaugeBalances", gaugeBalances);

  console.log("claimableTokens", claimableTokens);
  console.log("allMinted", allMinted);

  let params1 = {
    packageHashes: poolsPackageHash
  }
  // get pool contract hashes from backend
  let res1 = await axios.post("/getContractHashesAgainstPackageHashes", params1)
  console.log("res1", res1);
  let poolsContractHashes = res1.data.contractHashes
  let decodedBalances = []
  await Promise.all(pools.map(async (pool, i) => {
    // get balance of  user in pool
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
    // get gauge types from contract
    let gaugeType = await gaugeControllerFunctions.gaugeTypes(
      GAUGE_CONTROLLER_CONTRACT_HASH,
      pool.gauge
    );
    pool.type = gaugeType - 1
    gaugeTypes.push(gaugeType - 1)

    // get gauge type name against the gauge type 
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
  // set all values in an array
  pools.map((pool, i) => {
    decodedGaugeLP.push({
      gauge: pool.gauge,
      gaugeContractHash: pool.gaugeContractHash,
      swap_token: pool.swap_token,
      swapTokenContractHash: pool.swapTokenContractHash,
      type: pool.type,
      typeName: pool.typeNames,
      claimable_tokens: 0,
      claimableToken: claimableTokens.find(poolInfo => pool.gauge == poolInfo.gauge).claimableToken,
      minted: 0,
    })
    pool.claimable_tokens = 0;
    pool.claimableToken = claimableTokens.find(poolInfo => pool.gauge == poolInfo.gauge).claimableToken;
    pool.minted = 0;
  })
  console.log("decodedGaugeLP", decodedGaugeLP);
  // filter my pools 
  let mypools = decodedBalances.map((v, i) => {
    let poolInfo = Object.values(pools).find(pool => pool.swap_token == v.swap_token && pool.gauge == v.gauge)
    console.log("gaugeBalancesgaugeBalancesgaugeBalances", gaugeBalances);
    console.log("poolInfopoolInfopoolInfo", poolInfo);
    return {
      ...poolInfo,
      balance: v.balance,
      origBalance: v.balance,
      gaugeBalance: gaugeBalances.find(pool => pool.gauge == poolInfo.gauge).balance,
      claimableToken: claimableTokens.find(pool => pool.gauge == poolInfo.gauge).claimableToken
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
      timestamps: ["1678924800000"],
    }
    console.log("gaugeParams", gaugeParams);
    // get gauge relative weight from backend
    let res2 = await axios.post(`/gaugeController/gaugeRelativeWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`, gaugeParams)
    console.log("res2", res2);
    // add gauge relative weight in pools array
    Object.values(pools).find(pool => pool.gauge == gauge.gauge).gaugeRelativeWeight = res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    // add gauge relative weight in my pools array
    Object.values(mypools).find(pool => pool.gauge == gauge.gauge).gaugeRelativeWeight = res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    gauge.gaugeRelativeWeight = res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0;
    // add gauge relative weight in decoded Weights array
    decodedWeights.push({ ...gauge, gaugeRelativeWeight: res2.data.gaugeRelativeWeights[0] ? res2.data.gaugeRelativeWeights[0] : 0 })
  }));
  console.log("decodedWeights,", decodedWeights);
  let gaugeRates = []
  let workingSupplies = []
  let totalSupplies = []
  let workingBalances = []
  let names = []
  await Promise.all(mypools.map(async (pool) => {
    // get inflation rate from contract
    let inflationRate = await LiquidityGaugeV3.inflationRate(
      pool.gaugeContractHash
    );
    console.log("inflationRate", parseFloat(inflationRate) / 1e9);
    pool.gaugeRate = parseFloat(parseFloat(inflationRate) / 1e9)
    gaugeRates.push({ ...pool, gaugeRate: parseFloat(inflationRate) })

    // get working supply from contract

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
    // get name of gauge from contract

    let name = await LiquidityGaugeV3.name(
      pool.gaugeContractHash
    );
    console.log("name", name);
    pool.name = name;
    names.push({ ...pool, name: name })

    // get working balances gauge from contract

    let workingBalance = await LiquidityGaugeV3.workingBalances(
      pool.gaugeContractHash,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    );
    console.log("workingBalances", parseFloat(workingBalance));
    pool.currentWorkingBalance = workingBalance;
    workingBalances.push(parseFloat(workingBalance))


  }));
  // await Promise.all(pools.map(async (pool) => {
  //   let inflationRate = await LiquidityGaugeV3.inflationRate(
  //     pool.gaugeContractHash
  //   );
  //   console.log("poolsinflationRate", parseFloat(inflationRate) / 1e9);
  //   pool.gaugeRate = parseFloat(parseFloat(inflationRate) / 1e9)
  //   gaugeRates.push({ ...pool, gaugeRate: parseFloat(inflationRate) })

  //   let workingSupply = await LiquidityGaugeV3.workingSupply(
  //     pool.gaugeContractHash
  //   );
  //   console.log("pools workingSupply", parseFloat(workingSupply) / 1e9);
  //   pool.workingSupply = parseFloat(workingSupply) / 1e9;
  //   workingSupplies.push({ ...pool, workingSupply: parseFloat(workingSupply) / 1e9 })
  //   let totalSupplyGauge = await LiquidityGaugeV3.totalSupplyGauge(
  //     pool.gaugeContractHash
  //   );
  //   console.log("pools totalSupplyGauge", parseFloat(totalSupplyGauge));
  //   pool.originalSupply = parseFloat(totalSupplyGauge) / 1e9;
  //   totalSupplies.push({ ...pool, totalSupply: parseFloat(totalSupplyGauge) / 1e9 })

  //   let name = await LiquidityGaugeV3.name(
  //     pool.gaugeContractHash
  //   );
  //   console.log("name", name);
  //   pool.name = name;
  //   names.push({ ...pool, name: name })


  // }));
  console.log("workingBalances", workingBalances);
  console.log("names", names);
  console.log("totalSupplies", totalSupplies);
  console.log("workingSupplies", workingSupplies);
  console.log("mypoolsmypools", mypools);
  // total balance in my pools
  let _totalBalance = mypools.reduce((a, b) => +a + +b.balance, 0)
  setTotalBalance(_totalBalance)
  // total gauge balance in my pools
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
