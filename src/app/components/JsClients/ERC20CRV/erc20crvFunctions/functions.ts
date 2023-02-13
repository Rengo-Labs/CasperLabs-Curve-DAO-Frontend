import { ERC20CRVClient } from "../src";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";

// const {
//   NODE_ADDRESS,
//   EVENT_STREAM_ADDRESS,
//   CHAIN_NAME,
//   GAUGE_CONTROLLER_CONTRACT
// } = process.env;

const erc20Crv = new ERC20CRVClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!
);

export const balanceOf = async (contractHash: string, account: string) => {
  // We don't need hash- prefix so i'm removing it
  console.log("contractHashcontractHashcontractHash", contractHash);

  await erc20Crv.setContractHash(contractHash);

  //balanceof
  const balance = await erc20Crv.balanceOf(account);
  console.log(contractHash + ` =... balanceof : ${balance}`);

  return balance;
};
