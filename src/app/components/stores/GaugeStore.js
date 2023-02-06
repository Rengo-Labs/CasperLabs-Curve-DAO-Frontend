import { CLPublicKey } from "casper-js-sdk";
import {
  ERC20_CRV_CONTRACT_HASH,
  LIQUIDITY_GAUGE_V3_CONTRACT_HASH,
  GAUGE_CONTROLLER_CONTRACT_HASH,
  MINTER_CONTRACT_HASH,
} from "../blockchain/Hashes/ContractHashes";
import {
  gauges,
  n_gauges,
  gaugeTypes,
  gauge_type_names,
} from "../JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import {
  inflationRate,
  lpToken,
  workingSupply,
} from "../JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { getMinted } from "../JsClients/MINTER/minterFunctionsForBackend/functions";
import {
  balanceOf,
  totalSupply,
} from "../JsClients/VOTINGESCROW/QueryHelper/functions";
import { UserCheckpointMakeDeploy } from "../MakeDeployFunctions/UserCheckpointMakeDeploy";
import * as liquidityGaugeV3Functions from "../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";

export let state = {
  gaugeController: null,
  n_gauges: 0,
  pools: [],
  mypools: [],

  // FOR CONTRACT INSTANCES
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

export async function getState(activePublicKey) {
  state.pools = {
    compound: {
      swap: "0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56",
      swap_token: "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
      name: "compound",
    },
    usdt: {
      swap: "0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C",
      swap_token: "0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23",
      name: "usdt",
    },
    y: {
      swap: "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51",
      swap_token: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
      name: "y",
    },
    busd: {
      swap: "0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27",
      swap_token: "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
      name: "busd",
    },
    susdv2: {
      swap: "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
      swap_token: "0xC25a3A3b969415c80451098fa907EC722572917F",
      name: "susdv2",
    },
    pax: {
      swap: "0x06364f10B501e868329afBc005b3492902d6C763",
      swap_token: "0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8",
      name: "pax",
    },
    ren: {
      swap: "0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
      swap_token: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
      name: "ren",
    },
    sbtc: {
      swap: "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
      swap_token: "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
      name: "sbtc",
    },
  };

  // state.gaugeController = new contract.web3.eth.Contract(daoabis.gaugecontroller_abi, '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB')
  // state.votingEscrow = new contract.web3.eth.Contract(daoabis.votingescrow_abi, '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2')
  // state.minter = new contract.web3.eth.Contract(daoabis.minter_abi, '0xd061D61a4d941c39E5453435B6345Dc261C2fcE0')

  // state.n_gauges = +(await state.gaugeController.methods.n_gauges().call()) //ask about this from contract developer
  state.n_gauges = +(await n_gauges(GAUGE_CONTROLLER_CONTRACT_HASH));

  // let swap_token = new contract.web3.eth.Contract(ERC20_abi, state.pools.susdv2.swap_token)

  // let calls = Array.from(Array(state.n_gauges), (_, i) => [state.gaugeController._address, state.gaugeController.methods.gauges(i).encodeABI()])
  // let decodedGauges = Array.from(Array(state.n_gauges), async (_, i) => [state.gaugeController._address, await gauges(GAUGE_CONTROLLER_CONTRACT_HASH, i)]) //implemented according to casper

  // calls = calls.concat(Object.values(state.pools).map(v => v.swap_token).map(v => [v, swap_token.methods.balanceOf(contract.default_account).encodeABI()]))

  //getting the balance of account key again each swap token address for erc20 abi contract (casper)
  // calls = calls.concat(Object.values(state.pools).map(v => v.swap_token).map(async v => [v, await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))]))

  // let aggcalls;
  // let aggcalls = await contract.multicall.methods.aggregate(calls).call()
  // let decodedGauges = aggcalls[1].slice(0, state.n_gauges).map(hex => web3.eth.abi.decodeParameter('address', hex))
  // let decodedBalances = aggcalls[1].slice(state.n_gauges).map((hex, i) => ({swap_token: calls[state.n_gauges + i][0], balance: web3.eth.abi.decodeParameter('uint256', hex)}))  //also ask about this

  let decodedBalances = Object.values(state.pools)
    .map((v) => v.swap_token)
    .map(async (pool) => {
      //confirm about values of n_gauges and swap_token
      return {
        swap_token: pool,
        balance: await balanceOf(
          ERC20_CRV_CONTRACT_HASH,
          Buffer.from(
            CLPublicKey.fromHex(activePublicKey).toAccountHash()
          ).toString("Hex")
        ),
      };
    });
  let decodedGauges = state.n_gauges.map(async (gauge) => {
    await gauges(state.gaugeController._address, gauge);
  });

  // let example_gauge = new contract.web3.eth.Contract(daoabis.liquiditygauge_abi, decodedGauges[0])

  // let calls1 = decodedGauges.flatMap(gauge => [
  // 	[gauge, example_gauge.methods.lp_token().encodeABI()],
  // 	[state.gaugeController._address, state.gaugeController.methods.gauge_types(gauge).encodeABI()],
  // 	[gauge, example_gauge.methods.balanceOf(contract.default_account).encodeABI()],
  // 	[gauge, example_gauge.methods.claimable_tokens(contract.default_account).encodeABI()],
  // 	[state.minter._address, state.minter.methods.minted(contract.default_account, gauge).encodeABI()],

  // ])

  //This will be remain as it is unless confirmed
  let aggcalls1;
  // try {
  // 	aggcalls1 = await contract.multicall.methods.aggregate(calls1).call()
  // }
  // catch(err) {
  // 	console.error(err)
  // 	state.synthsUnavailable = true

  // 	calls1[33] = calls[3]
  // 	calls1[38] = calls[3]
  // 	aggcalls1 = await contract.multicall.methods.aggregate(calls1).call()
  // 	aggcalls[1][33] = "0x0000000000000000000000000000000000000000000000000000000000000000"
  // 	aggcalls[1][38] = "0x0000000000000000000000000000000000000000000000000000000000000000"

  // }

  // let gaugeTypes = aggcalls1[1].filter((_, i) => i % 5 == 1).map(hex => +web3.eth.abi.decodeParameter('uint256', hex))
  // gaugeTypes = [...new Set(gaugeTypes)]

  let gaugeTypes = decodedGauges.flatMap(async (gauge) => [
    [await lpToken(LIQUIDITY_GAUGE_V3_CONTRACT_HASH)],
    [await gaugeTypes(GAUGE_CONTROLLER_CONTRACT_HASH, gauge)],
    [
      await balanceOf(
        gauge,
        Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex")
      ),
    ],
    // [await claimableTokens(gauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex"))],
    [
      await getMinted(
        MINTER_CONTRACT_HASH,
        Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex"),
        Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex")
      ),
    ],
  ]);

  // calls = gaugeTypes.map(type => [state.gaugeController._address, state.gaugeController.methods.gauge_type_names(type).encodeABI()])
  let calls = gaugeTypes.map(async (type) => [
    state.gaugeController._address,
    await gauge_type_names(GAUGE_CONTROLLER_CONTRACT_HASH, type),
  ]);
  // aggcalls = await contract.multicall.methods.aggregate(calls).call()
  // let gaugeTypesNames = aggcalls[1].map((hex, i) => ({type: gaugeTypes[i], name: web3.eth.abi.decodeParameter('string', hex)}))
  let gaugeTypesNames = gaugeTypes.map((hex, i) => ({
    type: gaugeTypes[i],
    name: gaugeTypes[i].name,
  })); //assuming name will be returned from blockchain

  // let decodedGaugeLP = aggcalls1[1].filter((_, i) => i % 5 == 0).map((hex, i) => ({
  // gauge: decodedGauges[i],
  // swap_token: web3.eth.abi.decodeParameter('address', hex),
  // type: web3.eth.abi.decodeParameter('uint256', aggcalls1[1][i*5+1]),
  // typeName: Object.values(gaugeTypesNames).find(v => v.type == +web3.eth.abi.decodeParameter('uint256', aggcalls1[1][i*5+1])).name,
  // claimable_tokens: web3.eth.abi.decodeParameter('uint256', aggcalls1[1][i*5+3]),
  // minted: web3.eth.abi.decodeParameter('uint256', aggcalls1[1][i*5+4]),
  // })) //discuss about this because all of this work is decodeing abis

  let decodedGaugeLP = decodedGauges.map(async (gauge, i) => ({
    gauge: gauge,
    swap_token: await liquidityGaugeV3Functions.lpToken(
      LIQUIDITY_GAUGE_V3_CONTRACT_HASH
    ),
    type: gaugeTypes[i],
    typeName: Object.values(gaugeTypesNames).find(
      (v) => v.type == +gaugeTypes[i]
    ).name,
    claimable_tokens: gaugeTypes[i],
    minted: gaugeTypes[i],
  }));

  Object.values(decodedGaugeLP).forEach((gauge, i) => {
    let poolgauge = Object.values(state.pools).find(
      (pool) => pool.swap_token.toLowerCase() == gauge.swap_token.toLowerCase()
    );
    poolgauge.gauge = gauge.gauge;
    poolgauge.type = gauge.type;
    poolgauge.typeName = gauge.typeName;
    poolgauge.claimable_tokens = gauge.claimable_tokens;
    poolgauge.minted = gauge.minted;
  });

  let gaugeBalances = decodedGauges.map(async (gauge, i) => ({
    gauge: gaugeTypes[i],
    balance: await liquidityGaugeV3Functions.balanceOf(gauge),
  }));

  state.mypools = decodedBalances.map((v) => {
    let poolInfo = Object.values(state.pools).find(
      (pool) => pool.swap_token.toLowerCase() == v.swap_token.toLowerCase()
    );
    return {
      ...poolInfo,
      balance: v.balance,
      origBalance: v.balance,
      gaugeBalance: gaugeBalances.find(
        (pool) => pool.gauge.toLowerCase() == poolInfo.gauge.toLowerCase()
      ).balance,
    };
  });

  //console.log(decodedGauges, "THE GAUGES")

  let pools = [
    "compound",
    "usdt",
    "iearn",
    "busd",
    "susdv2",
    "pax",
    "ren",
    "sbtc",
  ];

  // this prices work will remain as it is for now and will be updated afterwards
  let prices = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,curve-dao-token&vs_currencies=usd"
  );
  prices = await prices.json();
  let btcPrice = prices.bitcoin.usd;
  let CRVprice = prices["curve-dao-token"].usd;

  // let weightCalls = decodedGauges.map(gauge => [state.gaugeController._address, state.gaugeController.methods.gauge_relative_weight(gauge).encodeABI()])
  // let weightCalls = decodedGauges.map(gauge => [state.gaugeController._address, state.gaugeController.methods.gauge_relative_weight(gauge).encodeABI()]) //no function exists for this
  let weightCalls = [];
  //console.log(weightCalls, "WEIGHT CALLS")

  // let aggCallsWeights = await contract.multicall.methods.aggregate(weightCalls).call()
  // let decodedWeights = aggCallsWeights[1].map((hex, i) => [weightCalls[i][0], web3.eth.abi.decodeParameter('uint256', hex) / 1e18]) //will be replace after confirming function

  let aggCallsWeights = [];
  let decodeWeights = [];

  //console.log(decodedWeights, "DECODED WEIGHTS")

  // let ratesCalls = decodedGauges.map(gauge => [
  // 	[gauge, example_gauge.methods.inflation_rate().encodeABI()],
  // 	[gauge, example_gauge.methods.working_supply().encodeABI()],
  // 	[gauge, example_gauge.methods.totalSupply().encodeABI()],
  // 	[gauge, example_gauge.methods.working_balances(contract.default_account).encodeABI()],
  // ])

  let ratesCalls = decodedGauges.map(async (gauge) => [
    await inflationRate(gauge),
    await workingSupply(gauge),
    await totalSupply(gauge),
    await workingBalances(
      gauge,
      Buffer.from(
        CLPublicKey.fromHex(activePublicKey).toAccountHash()
      ).toString("hex")
    ),
  ]);

  console.log(ratesCalls, "RATES CALLS");

  // let aggRates = await contract.multicall.methods.aggregate(ratesCalls.flat()).call()
  // let decodedRate = aggRates[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
  // let gaugeRates = decodedRate.filter((_, i) => i % 4 == 0).map(v => v / 1e18)
  let gaugeRates = ratesCalls.filter((_, i) => i % 4 == 0).map((v) => v / 1e9);
  // let workingSupplies = decodedRate.filter((_, i) => i % 4 == 1).map(v => v / 1e18)
  let workingSupplies = ratesCalls
    .filter((_, i) => i % 4 == 1)
    .map((v) => v / 1e9);
  // let totalSupplies = decodedRate.filter((_, i) => i % 4 == 2).map(v => v / 1e18)
  let totalSupplies = ratesCalls
    .filter((_, i) => i % 4 == 2)
    .map((v) => v / 1e9);
  // let workingBalances = decodedRate.filter((_, i) => i % 4 == 3).map(v => v)
  let workingBalances = ratesCalls.filter((_, i) => i % 4 == 3).map((v) => v);

  // let example_pool = new web3.eth.Contract(swap_abi, '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD')

  // let virtualPriceCalls = Object.values(state.pools).map(v => [v.swap, example_pool.methods.get_virtual_price().encodeABI()]) //ask about this
  //console.log(virtualPriceCalls, "VIRTUAL PRICE CALLS")
  // let aggVirtualPrices = await contract.multicall.methods.aggregate(virtualPriceCalls).call()
  // let decodedVirtualPrices = aggVirtualPrices[1].map((hex, i) => [virtualPriceCalls[i][0], web3.eth.abi.decodeParameter('uint256', hex) / 1e18])

  //confirm these calls
  // let aggVirtualPrices = await contract.multicall.methods.aggregate(virtualPriceCalls).call()
  // let decodedVirtualPrices = aggVirtualPrices[1].map((hex, i) => [virtualPriceCalls[i][0], web3.eth.abi.decodeParameter('uint256', hex) / 1e18])

  let decodedWeights = [];
  let decodedVirtualPrices = [];

  window.gauges = {};
  let weightData = decodedWeights.map((w, i) => {
    let pool = state.mypools.find(
      (v) =>
        v.gauge.toLowerCase() ==
        "0x" + weightCalls[i][1].slice(34).toLowerCase()
    ).name;
    let swap_address = state.pools[pool].swap;
    let virtual_price = decodedVirtualPrices.find(
      (v) => v[0].toLowerCase() == swap_address.toLowerCase()
    )[1];
    let _working_supply = workingSupplies[i];
    let totalSupply = totalSupplies[i];
    if (["ren", "sbtc"].includes(pool)) {
      _working_supply *= btcPrice;
      totalSupply *= btcPrice;
    }
    state.mypools.find((v) => v.name == pool).working_supply = _working_supply;
    state.mypools.find((v) => v.name == pool).original_supply =
      totalSupplies[i];
    state.mypools.find((v) => v.name == pool).currentWorkingBalance =
      workingBalances[i];
    //console.log(pool, gaugeRates[i], w[1], 31536000, _working_supply, "RATE")
    let rate =
      (((gaugeRates[i] * w[1] * 31536000) / _working_supply) * 0.4) /
      virtual_price;
    let apy = rate * CRVprice * 100;
    if (isNaN(apy)) apy = 0;
    state.mypools.find((v) => v.name == pool).gauge_relative_weight = w[1];
    Object.values(state.pools).find(
      (v) => v.name == pool
    ).gauge_relative_weight = w[1];
    // Vue.set(state.APYs, pool, apy)
    // window.gauges[pool] = new web3.eth.Contract(daoabis.liquiditygauge_abi, '0x' + weightCalls[i][1].slice(34).toLowerCase())
  });

  //console.log(state.mypools, "STATE MY POOLS")

  state.totalBalance = state.mypools.reduce((a, b) => +a + +b.balance, 0);
  state.totalGaugeBalance = state.mypools.reduce(
    (a, b) => +a + +b.gaugeBalance,
    0
  );

  console.log(state.mypools, "STATE MY POOLS");

  /*let wrapper = new GraphQLWrapper('https://api.thegraph.com/subgraphs/name/pengiundev/curve-gauges-mainnet')

	let QUERY = gql`
		{
		  gauges(where: { user: "${contract.default_account.toLowerCase()}"}) {
		    id
		    user
		    gauge
		    originalBalance
		    originalSupply
		    workingBalance
		    workingSupply
		  }
		}
	`

	let results = await wrapper.performQuery(QUERY)
	results = results.data.gauges
	*/

  for (let pool of state.mypools) {
    if (+pool.gaugeBalanace == 0) continue;
    pool.previousWorkingBalance = pool.currentWorkingBalance;
    state.boosts[pool.name] =
      pool.currentWorkingBalance / (0.4 * pool.gaugeBalance);
  }
}

export async function applyBoostAll(
  activePublicKey,
  setOpenSigning,
  enqueueSnackbar
) {
  for (let gauge of state.gaugesNeedApply) {
    // let gaugeContract = new contract.web3.eth.Contract(daoabis.liquiditygauge_abi, gauge)
    // let gas = 600000
    // try {
    // 	gas = await gaugeContract.methods.user_checkpoint(contract.default_account).estimateGas()
    // }
    // catch(err) {
    // 	console.error(err)
    // } we are not suppose to estimate gas in casper

    let poolName = state.mypools.find((pool) => pool.gauge == gauge).name;
    // var { dismiss } = notifyNotification(`Please confirm applying boost for gauge ${poolName}`) //use enqueue snackbar here

    // await new Promise((resolve, reject) => {
    // 	gaugeContract.methods.user_checkpoint(contract.default_account).send({
    // 		from: contract.default_account,
    // 		gasPrice: gasPriceStore.state.gasPriceWei,
    // 		gas: gas,
    // 	})
    // 	.once('transactionHash', hash => {
    // 		dismiss()
    // 		notifyHandler(hash)
    // 		resolve()
    // 	})
    // 	.on('error', err => {
    // 		console.error(err)
    // 		reject(err)
    // 	})
    // })

    UserCheckpointMakeDeploy(activePublicKey, setOpenSigning, enqueueSnackbar);
  }
}
