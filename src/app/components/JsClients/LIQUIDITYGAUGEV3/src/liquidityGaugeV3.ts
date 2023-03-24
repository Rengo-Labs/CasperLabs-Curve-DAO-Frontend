import { concat } from "@ethersproject/bytes";
import * as blake from "blakejs";
import {
  CasperClient, CLAccountHash,
  CLByteArray,
  CLKey,
  CLString,
  CLTypeBuilder,
  CLValue,
  CLValueBuilder,
  CLValueParsers, DeployUtil, encodeBase16, Keys,
  RuntimeArgs
} from "casper-js-sdk";
import { IPendingDeploy } from "./types";
import * as utils from "./utils";
import { createRecipientAddress } from "./utils";

class LIQUIDITYGAUGEV3Client {
  private contractName: string = "liquiditygaugev3";
  private contractHash: string = "liquiditygaugev3";
  private contractPackageHash: string = "liquiditygaugev3";
  private namedKeys: {
    balances: string
    metadata: string;
    nonces: string;
    allowances: string;
    ownedTokens: string;
    owners: string;
    paused: string;
    workingBalances: string;
    periodTimestamp: string;
    integrateInvSupply: string;
    integrateCheckpointOf: string;
    integrateInvSupplyOf: string;
    integrateFraction: string;
    rewardTokens: string;
    rewardsReceiver: string;
    rewardIntegral: string;
    rewardIntegralFor: string;

  };

  private isListening = false;
  private pendingDeploys: IPendingDeploy[] = [];

  constructor(

    private nodeAddress: string,
    private chainName: string,
    private eventStreamAddress?: string,

  ) {
    this.namedKeys = {
      balances: "null",
      metadata: "null",
      nonces: "null",
      allowances: "null",
      ownedTokens: "null",
      owners: "null",
      paused: "null",
      workingBalances: "null",
      periodTimestamp: "null",
      integrateInvSupply: "null",
      integrateCheckpointOf: "null",
      integrateInvSupplyOf: "null",
      integrateFraction: "null",
      rewardTokens: "null",
      rewardsReceiver: "null",
      rewardIntegral: "null",
      rewardIntegralFor: "null",
    };
  }

  public async setContractHash(hash: string) {
    const stateRootHash = await utils.getStateRootHash(this.nodeAddress);
    const contractData = await utils.getContractData(
      this.nodeAddress,
      stateRootHash,
      hash
    );

    const { contractPackageHash, namedKeys } = contractData.Contract!;
    this.contractHash = hash;
    this.contractPackageHash = contractPackageHash.replace(
      "contract-package-wasm",
      ""
    );
    const LIST_OF_NAMED_KEYS = [
      'balances',
      'nonces',
      'allowances',
      'working_balances',
      'period_timestamp',
      'integrate_inv_supply',
      'integrate_checkpoint_of',
      'integrate_inv_supply_of',
      'integrate_fraction',
      'reward_tokens',
      'rewards_receiver',
      'reward_integral',
      'reward_integral_for',
      `${this.contractName}_package_hash`,
      `${this.contractName}_package_hash_wrapped`,
      `${this.contractName}_contract_hash`,
      `${this.contractName}_contract_hash_wrapped`,
      `${this.contractName}_package_access_token`,
    ];
    // @ts-ignore
    this.namedKeys = namedKeys.reduce((acc, val) => {
      if (LIST_OF_NAMED_KEYS.includes(val.name)) {
        return { ...acc, [utils.camelCased(val.name)]: val.key };
      }
      return acc;
    }, {});
  }

  public async decimals() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["decimals"]
    );
    return result.value();
  }

  public async integrateCheckpoint() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["period_timestamp"]
    );
    return result.value();
  }

  public async minter() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["minter"]
    );
    return result.value();
  }

  public async crvToken() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["crv_token"]
    );
    return result.value();
  }

  public async lpToken() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["lp_token"]
    );
    console.log("encodeBase16(result.value())", encodeBase16(result.value().data));

    return encodeBase16(result.value().data);
  }

  public async controller() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["controller"]
    );
    return result.value();
  }

  public async votingEscrow() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["voting_escrow"]
    );
    return result.value();
  }

  public async futureEpochTime() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["future_epoch_time"]
    );
    return result.value();
  }

  public async balanceOf(account: string) {
    try {
      const key = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(account, "hex"))));
      const keyBytes = CLValueParsers.toBytes(key).unwrap();
      const itemKey = Buffer.from(keyBytes).toString("base64");
      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        itemKey,
        this.namedKeys!.balances
      );
      return result.value();

    } catch (error) {
      return "0";
    }

  }

  public async totalSupply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["total_supply"]
    );
    return result.value();
  }

  public async allowances(owner: string, spender: string) {
    try {
      const _spender = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );

      const _owner = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
      const key_spender = createRecipientAddress(_spender);
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(key_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.allowances
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }
  }

  public async name() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["name"]
    );
    return result.value();
  }

  public async symbol() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["symbol"]
    );
    return result.value();
  }

  public async workingBalances(account: string) {
    try {
      const key = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(account, "hex"))));
      const keyBytes = CLValueParsers.toBytes(key).unwrap();
      const itemKey = Buffer.from(keyBytes).toString("base64");
      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        itemKey,
        this.namedKeys!.workingBalances
      );
      return result.value();

    } catch (error) {
      return "0";
    }
  }

  public async workingSupply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["working_supply"]
    );
    return result.value();
  }

  public async period() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["period"]
    );
    return result.value();
  }

  public async periodTimestamp(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.periodTimestamp
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async integrateInvSupply(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.integrateInvSupply
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async integrateInvSupplyOf(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.integrateInvSupplyOf
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async integrateCheckpointOf(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.integrateCheckpointOf
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async integrateFraction(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.integrateFraction
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async inflationRate() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["inflation_rate"]
    );
    return result.value();
  }

  public async rewardTokens(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.rewardTokens
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async rewardsReceiver(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.rewardsReceiver
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async rewardIntegral(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.rewardIntegral
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async rewardIntegralFor(owner: string, spender: string) {
    try {
      const _spender = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );

      const _owner = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
      const key_spender = createRecipientAddress(_spender);
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(key_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.rewardIntegralFor
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }
  }

  public async admin() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["admin"]
    );
    return result.value();
  }

  public async futureAdmin() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["future_admin"]
    );
    return result.value();
  }

  public async isKilled() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["is_killed"]
    );
    return result.value();
  }

}

interface IInstallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  pathToContract: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
}


interface IContractCallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
  contractHash: string;
}

const contractCall = async ({
  nodeAddress,
  keys,
  chainName,
  contractHash,
  entryPoint,
  runtimeArgs,
  paymentAmount,
}: IContractCallParams) => {
  const client = new CasperClient(nodeAddress);
  const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(keys.publicKey, chainName),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashAsByteArray,
      entryPoint,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy.
  deploy = client.signDeploy(deploy, keys);

  // Dispatch deploy to node.
  const deployHash = await client.putDeploy(deploy);

  return deployHash;
};

const contractSimpleGetter = async (
  nodeAddress: string,
  contractHash: string,
  key: string[]
) => {
  const stateRootHash = await utils.getStateRootHash(nodeAddress);
  const clValue = await utils.getContractData(
    nodeAddress,
    stateRootHash,
    contractHash,
    key
  );

  if (clValue && clValue.CLValue instanceof CLValue) {
    return clValue.CLValue!;
  } else {
    throw Error("Invalid stored value");
  }
};

const toCLMap = (map: Map<string, string>) => {
  const clMap = CLValueBuilder.map([
    CLTypeBuilder.string(),
    CLTypeBuilder.string(),
  ]);
  for (const [key, value] of Array.from(map.entries())) {
    clMap.set(CLValueBuilder.string(key), CLValueBuilder.string(value));
  }
  return clMap;
};

const fromCLMap = (map: Map<CLString, CLString>) => {
  const jsMap = new Map();
  for (const [key, value] of Array.from(map.entries())) {
    jsMap.set(key.value(), value.value());
  }
  return jsMap;
};

export default LIQUIDITYGAUGEV3Client;
