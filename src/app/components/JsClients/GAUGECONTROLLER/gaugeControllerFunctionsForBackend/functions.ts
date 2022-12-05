import { GaugeControllerClient} from "../src";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";

// const {
//   NODE_ADDRESS,
//   EVENT_STREAM_ADDRESS,
//   CHAIN_NAME,
//   GAUGE_CONTROLLER_CONTRACT
// } = process.env;

const gaugeController = new GaugeControllerClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!,
);

export const points_type_weight = async (contractHash : string ,owner : string, spender : string) => {
 
  // We don't need hash- prefix so i'm removing it
 await gaugeController.setContractHash(contractHash);

 //pointsTypeWeight
 const pointsTypeWeight = await gaugeController.points_type_weight(owner ,  spender);
//  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsTypeWeight}`);

 return pointsTypeWeight;
}

export const points_weight = async (contractHash : string ,owner : string, spender : string) => {
 
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

 //pointsWeight
 const pointsWeight = await gaugeController.points_type_weight(owner ,  spender);
//  console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points type weight: ${pointsWeight}`);

 return pointsWeight;
}

export const points_total = async (contractHash : string, owner : string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //pointsTotal
  const pointsTotal = await gaugeController.points_total(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${pointsTotal}`);
 
  return pointsTotal;
}

export const gauge_type_names = async (contractHash : string,owner : string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gaugeTypeNames = await gaugeController.gauge_type_names(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);
 
  return gaugeTypeNames;
}

export const n_gauges = async (contractHash : string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const nGauges = await gaugeController.n_gauges();
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);
 
  return nGauges;
}

export const gauges = async (contractHash : string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gauges = await gaugeController.gauges(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);
 
  return gauges;
}

export const gaugeTypes = async (contractHash : string, owner: string) => {
  // We don't need hash- prefix so i'm removing it
  await gaugeController.setContractHash(contractHash);

  //gaugeTypeNames
  const gaugeTypes = await gaugeController.gauge_types_(owner);
  // console.log(GAUGE_CONTROLLER_CONTRACT +` =... Points total: ${gaugeTypeNames}`);
 
  return gaugeTypes;
}
