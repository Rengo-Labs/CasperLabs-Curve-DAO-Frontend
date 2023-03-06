import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { LIQUIDITYGAUGEV3Client } from "../src";

const liquiditygaugev3 = new LIQUIDITYGAUGEV3Client(
    NODE_ADDRESS,
    "casper-test"!,
    "http://44.208.234.65:9999/events/main"!,
);

export const periodTimestamp = async (contractHash: string, owner: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const balance = await liquiditygaugev3.periodTimestamp(owner);
    console.log(contractHash + ` =... periodTimestamp : ${balance}`);

    return balance;
};


export const workingBalances = async (contractHash: string, account: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const balance = await liquiditygaugev3.workingBalances(account);
    console.log(contractHash + ` =... workingBalances : ${balance}`);

    return balance;

};

export const balanceOf = async (contractHash: string, account: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const balance = await liquiditygaugev3.balanceOf(account);
    console.log(contractHash + ` =... balanceof : ${balance}`);

    return balance;

};


export const workingSupply = async (contractHash: string) => {
    try
    // We don't need hash- prefix so i'm removing it
    {
        await liquiditygaugev3.setContractHash(contractHash);

        //balanceof
        const balance = await liquiditygaugev3.workingSupply();
        console.log(contractHash + ` =... workingSupply : ${balance}`);

        return balance;
    }
    catch {
        return 0
    }
};


export const totalSupplyGauge = async (contractHash: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const totalSupply = await liquiditygaugev3.totalSupply();
    console.log(contractHash + ` =... totalSupplyGauge : ${totalSupply}`);

    return totalSupply;

};

export const lpToken = async (contractHash: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const lpToken = await liquiditygaugev3.lpToken();
    console.log(contractHash + ` =... lpToken : ${lpToken}`);

    return lpToken;

};

export const inflationRate = async (contractHash: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //balanceof
    const inflationRate = await liquiditygaugev3.inflationRate();
    console.log(contractHash + ` =... inflationRate : ${inflationRate}`);

    return inflationRate;

};

export const name = async (contractHash: string) => {

    // We don't need hash- prefix so i'm removing it
    await liquiditygaugev3.setContractHash(contractHash);

    //name
    const name = await liquiditygaugev3.name();
    console.log(contractHash + ` =... name : ${name}`);

    return name;

};
