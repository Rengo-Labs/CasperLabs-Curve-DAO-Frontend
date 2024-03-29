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
  CLValueParsers, DeployUtil, Keys,
  RuntimeArgs
} from "casper-js-sdk";
import { IPendingDeploy } from "./types";
import * as utils from "./utils";
import { createRecipientAddress } from "./utils";

class VOTINGESCROWClient {
  private contractName: string = "votingescrow";
  private contractHash: string = "votingescrow";
  private contractPackageHash: string = "votingescrow";
  private namedKeys: {
    balances: string
    metadata: string;
    nonces: string;
    allowances: string;
    ownedTokens: string;
    owners: string;
    paused: string;
    minBalance: string;
    minAcceptQuorumPct: string;
    minTime: string;
    supportRequiredPct: string;
    voteTime: string;
    token: string;
    point_history: string;
    user_point_history: string;
    user_point_epoch: string;
    slope_changes: string;
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
      minBalance: "null",
      minAcceptQuorumPct: "null",
      minTime: "null",
      supportRequiredPct: "null",
      voteTime: "null",
      token: "null",
      point_history: "null",
      user_point_history: "null",
      user_point_epoch: "null",
      slope_changes: "null",
    };
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

  public async balanceOfContract(contractHash: string) {
    try {
      const _contractHash = new CLByteArray(
        Uint8Array.from(Buffer.from(contractHash, "hex"))
      );
      const key = createRecipientAddress(_contractHash);
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
      'minBalance',
      'minAcceptQuorumPct',
      'minTime',
      'supportRequiredPct',
      'voteTime',
      'token',
      'point_history',
      'user_point_history',
      'user_point_epoch',
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


  //VOTING_ESCROW FUNCTIONS

  public async token() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["token"]
    );
    return result.value();
  }

  public async supply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["supply"]
    );
    return result.value();
  }

  public async locked() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["locked"]
    );
    return result.value();
  }

  public async epoch() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["epoch"]
    );
    return result.value();
  }

  public async pointHistory(epoch: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        epoch,
        this.namedKeys.point_history
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async userPointHistory(user: string, userEpoch: string) {
    try {
      const _user = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(user, "hex"))));
      const user_epoch = CLValueBuilder.u256(userEpoch);
      const finalBytes = concat([CLValueParsers.toBytes(_user).unwrap(), CLValueParsers.toBytes(user_epoch).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.user_point_history
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }
  }

  public async userPointEpoch(user: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        user,
        this.namedKeys.user_point_epoch
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async slopeChanges(time: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        time,
        this.namedKeys.slope_changes
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async controller() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["controller"]
    );
    return result.value();
  }

  public async transfersEnabled() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["transfers_enabled"]
    );
    return result.value();
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

  public async version() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["version"]
    );
    return result.value();
  }

  public async decimals() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["decimals"]
    );
    return result.value();
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

export default VOTINGESCROWClient;
