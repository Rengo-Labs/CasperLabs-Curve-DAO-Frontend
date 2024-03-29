import { Keys } from "casper-js-sdk";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { MINTERClient} from "../src";


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

  export const mint = async (contractHash: string, keys: Keys.AsymmetricKey, gauge_addr : string, paymentAmount: string) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //minted
    const result = await minter.mint(keys, gauge_addr, paymentAmount);
    console.log(contractHash +` =... mint : ${result}`);
  
    return result;
  };

  export const minted = async (contractHash: string, owner: string, spender: string) => {
  
    // We don't need hash- prefix so i'm removing it
    await minter.setContractHash(contractHash);
  
    //minted
    const result = await minter.minted(owner, spender);
    console.log(contractHash +` =... mint : ${result}`);
  
    return result;
  };
