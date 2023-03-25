import { ERC20CRVClient } from "../src";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";


const erc20Crv = new ERC20CRVClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!
);

export const balanceOf = async (contractHash: string, account: string) => {
  await erc20Crv.setContractHash(contractHash);

  const balance = await erc20Crv.balanceOf(account);
  console.log(contractHash + ` =... balanceof : ${balance}`);

  return balance;
};
