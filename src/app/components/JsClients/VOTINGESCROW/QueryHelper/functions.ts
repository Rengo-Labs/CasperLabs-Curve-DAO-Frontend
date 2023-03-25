import { VOTINGESCROWClient} from "../src";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";


const votingEscrow = new VOTINGESCROWClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!,
);

export const balanceOf = async (contractHash:string,account:string) => {

  // We don't need hash- prefix so i'm removing it
  console.log("contractHashcontractHashcontractHash",contractHash);
  
  await votingEscrow.setContractHash(contractHash);

  //balanceof
  const balance = await votingEscrow.balanceOf(account);
  console.log(contractHash +` =... balanceof : ${balance}`);

  return balance;

};
export const totalSupply = async (contractHash:string) => {

// We don't need hash- prefix so i'm removing it
await votingEscrow.setContractHash(contractHash);

//totalSupply
const totalSupply = await votingEscrow.totalSupply();
console.log(contractHash +` =... totalSupply : ${totalSupply}`);

return totalSupply;

};

