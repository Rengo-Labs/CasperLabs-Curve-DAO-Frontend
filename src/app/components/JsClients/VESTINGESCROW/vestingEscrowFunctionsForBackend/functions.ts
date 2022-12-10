import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { VESTINGESCROWClient } from "../src";

const vestingescrow = new VESTINGESCROWClient(
    NODE_ADDRESS,
    "casper-test"!,
    "http://44.208.234.65:9999/events/main"!,
);

export const balanceOf = async (contractHash:string, owner: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const balance = await vestingescrow.balanceOf(owner);
    console.log(contractHash +` =... balanceof : ${balance}`);
  
    return balance;
  
};


export const vestedOf = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const balance = await vestingescrow.vestedOf(account);
    console.log(contractHash +` =... balanceof : ${balance}`);
  
    return balance;
  
};

export const lockedOf = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const balance = await vestingescrow.lockedOf(account);
    console.log(contractHash +` =... balanceof : ${balance}`);
  
    return balance;
  
};

export const intialLocked = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const balance = await vestingescrow.intialLocked(account);
    console.log(contractHash +` =... balanceof : ${balance}`);
  
    return balance;
  
};

export const totalClaimed = async (contractHash:string,account: string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const balance = await vestingescrow.totalClaimed(account);
    console.log(contractHash +` =... balanceof : ${balance}`);
  
    return balance;
  
};


export const startTime = async (contractHash:string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const time = await vestingescrow.start_time();
    console.log(contractHash +` =... balanceof : ${time}`);
  
    return time;
  
};

export const endTime = async (contractHash:string) => {

    // We don't need hash- prefix so i'm removing it
    await vestingescrow.setContractHash(contractHash);
  
    //balanceof
    const time = await vestingescrow.end_time();
    console.log(contractHash +` =... balanceof : ${time}`);
  
    return time;
  
};

