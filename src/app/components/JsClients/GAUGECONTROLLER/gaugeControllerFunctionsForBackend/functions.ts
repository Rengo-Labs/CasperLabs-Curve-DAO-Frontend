import { GaugeControllerClient } from "../src";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { parseJsonBody } from "@apollo/client/link/http/parseAndCheckHttpResponse";


const gaugeController = new GaugeControllerClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!,
);

export const points_type_weight = async (contractHash: string, owner: string, spender: string) => {

  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //pointsTypeWeight
  const pointsTypeWeight = await gaugeController.points_type_weight(owner, spender);
  //  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsTypeWeight}`);

  return pointsTypeWeight;
}

export const points_weight = async (contractHash: string, owner: string, spender: string) => {

  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //pointsWeight
  const pointsWeight = await gaugeController.points_type_weight(owner, spender);
  //  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsWeight}`);

  return pointsWeight;
}

export const time_weight = async (contractHash: string, owner: string) => {

  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //timeWeight
  const timeWeight = await gaugeController.time_weight(owner);
  //  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsWeight}`);

  return timeWeight;
}

export const changes_sum = async (contractHash: string, owner: string, spender: string) => {

  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //timeWeight
  const changesSum = await gaugeController.changes_sum(owner, spender);
  //  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsWeight}`);

  return changesSum;
}

export const points_total = async (contractHash: string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //pointsTotal
  const pointsTotal = await gaugeController.points_total(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${pointsTotal}`);

  return pointsTotal;
}

export const gauge_type_names = async (contractHash: string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gaugeTypeNames = await gaugeController.gauge_type_names(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);

  return gaugeTypeNames;
}

export const n_gauges = async (contractHash: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const nGauges = await gaugeController.n_gauges();
  // console.log(` =... nGauges: ${JSON.parse(JSON.stringify(nGauges))}`);

  return nGauges;
}

export const working_supply = async (contractHash: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const workingSupply = await gaugeController.working_supply();
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);

  return workingSupply;
}

export const inflation_rate = async (contractHash: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const inflationRate = await gaugeController.inflation_rate();
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);

  return inflationRate;
}

export const gauges = async (contractHash: string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gauges = await gaugeController.gauges(owner);
  // console.log(` =... gauges: ${gauges}`);

  return gauges;
}

export const vote_user_power = async (contractHash: string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const voteUserPower = await gaugeController.vote_user_power(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);

  return voteUserPower;
}

export const last_user_vote = async (contractHash: string, owner: string, spender: string) => {

  console.log("contractHash:",contractHash);
  console.log("owner",owner);
  console.log("spender",spender);

  
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //timeWeight
  const lastUserVote = await gaugeController.last_user_vote(owner, spender);
  console.log(contractHash + ` =... lastUserVote: ${lastUserVote}`);

  return lastUserVote;
}
export const vote_user_slopes = async (contractHash: string, owner: string, spender: string) => {

  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //timeWeight
  const voteUserSlopes = await gaugeController.vote_user_slopes(owner, spender);
  console.log(contractHash + ` =... voteUserSlopes: ${voteUserSlopes}`);

  return voteUserSlopes;
}

export const gaugeTypes = async (contractHash: string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gaugeTypes = await gaugeController.gauge_types_(owner);
  // console.log( ` =... gaugeTypes: ${gaugeTypes}`);

  return gaugeTypes;
}
