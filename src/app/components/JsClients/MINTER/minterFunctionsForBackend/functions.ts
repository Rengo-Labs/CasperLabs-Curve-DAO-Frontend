import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { MINTERClient} from "../src";

// const {
//   NODE_ADDRESS,
//   EVENT_STREAM_ADDRESS,
//   CHAIN_NAME,
//   MINTER_CONTRACT
// } = process.env;

const minter = new MINTERClient(
  NODE_ADDRESS,
  "casper-test"!,
  "http://44.208.234.65:9999/events/main"!,
);

  export const allowed_to_mint_for = async (contractHash: string, owner:string, spender : string) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //allowed_to_mint_for
    const result = await minter.allowed_to_mint_for(owner, spender);
    console.log(contractHash +` =... allowed to mint for : ${result}`);
  
    return result;
  };

  export const getMinted = async (contractHash: string, owner:string, spender : string) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //minted
    const result = await minter.minted(owner, spender);
    console.log(contractHash +` =... minted : ${result}`);
  
    return result;
  };


  export const getToken = async (contractHash: string) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //token
    const result = await minter.token();
    console.log(contractHash +` =... token : ${result}`);
  
    return result;
  };


  export const getController = async (contractHash: string, ) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //controller
    const result = await minter.controller();
    console.log(contractHash +` =... controller : ${result}`);
  
    return result;
  };
