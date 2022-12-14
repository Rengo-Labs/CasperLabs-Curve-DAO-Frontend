import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { VESTINGESCROWClient } from "../src";

const vestingescrow = new VESTINGESCROWClient(
    NODE_ADDRESS,
    "casper-test"!,
    "http://44.208.234.65:9999/events/main"!,
);

export const intialLocked = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //intitialLocked
    const initialLocked = await vestingescrow.intialLocked(account);
    console.log(contractHash +` =... intital Locked : ${intialLocked}`);
  
    return intialLocked;
  
};

export const totalClaimed = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //totalClaimed
    const totalClaimed = await vestingescrow.totalClaimed(account);
    console.log(contractHash +` =... totalClaimed : ${totalClaimed}`);
  
    return totalClaimed;
  
};


export const startTime = async (contractHash:string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const time = await vestingescrow.start_time();
    console.log(contractHash +` =... time : ${time}`);
  
    return time;
  
};

export const endTime = async (contractHash:string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const time = await vestingescrow.end_time();
    console.log(contractHash +` =... time : ${time}`);
  
    return time;
  
};

