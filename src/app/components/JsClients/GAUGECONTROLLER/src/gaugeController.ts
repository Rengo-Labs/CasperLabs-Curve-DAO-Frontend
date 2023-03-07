import {
  CasperClient,
  CLPublicKey,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLString,
  CLTypeBuilder,
  CLValue,
  CLValueBuilder,
  CLValueParsers,
  CLMap,
  DeployUtil,
  EventName,
  EventStream,
  Keys,
  RuntimeArgs,
  CLOption,
  encodeBase16,
  decodeBase16
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import * as blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import { GAUGECONTROLLEREVENTS } from "./constants";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import { createRecipientAddress } from "./utils";

class GaugeControllerClient {
  private contractName: string = "erc20";
  private contractHash: string = "erc20";
  private contractPackageHash: string = "erc20";
  private namedKeys: {
    gaugeTypes_: string,
    gaugeTypeNames: string,
    vote_user_slopes: string,
    vote_user_power: string,
    last_user_vote: string,
    points_weight: string,
    changes_weight: string,
    time_weight: string,
    gauges: string,
    time_sum: string,
    points_sum: string,
    changes_sum: string,
    points_total: string,
    points_type_weight: string,
    time_type_weight: string,
    inflation_rate: string,
    working_supply: string,
  };

  private isListening = false;
  private pendingDeploys: IPendingDeploy[] = [];

  constructor(

    private nodeAddress: string,
    private chainName: string,
    private eventStreamAddress?: string,

  ) {
    this.namedKeys = {
      gaugeTypes_: "null",
      gaugeTypeNames: "null",
      vote_user_slopes: "null",
      vote_user_power: "null",
      last_user_vote: "null",
      points_weight: "null",
      changes_weight: "null",
      time_weight: "null",
      gauges: "null",
      time_sum: "null",
      points_sum: "null",
      changes_sum: "null",
      points_total: "null",
      points_type_weight: "null",
      time_type_weight: "null",
      inflation_rate: "null",
      working_supply: "null",
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
    // console.log("namedKeys", namedKeys);

    this.contractPackageHash = contractPackageHash.replace(
      "contract-package-wasm",
      ""
    );
    const LIST_OF_NAMED_KEYS = [
      'gauge_types_',
      'gauge_type_names',
      'vote_user_slopes',
      "vote_user_power",
      "last_user_vote",
      "points_weight",
      "changes_weight",
      "time_weight",
      "gauges",
      "time_sum",
      "points_sum",
      "changes_sum",
      "points_total",
      "points_type_weight",
      "time_type_weight",
      "inflation_rate",
      "working_supply",
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

  public async commit_transfer_ownership(
    keys: Keys.AsymmetricKey,
    addr: string,
    paymentAmount: string) {

    const _addr = new CLByteArray(
      Uint8Array.from(Buffer.from(addr, "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      addr: utils.createRecipientAddress(_addr),
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "commit_transfer_ownership",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async apply_transfer_ownership(
    keys: Keys.AsymmetricKey,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({

    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "apply_transfer_ownership",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async checkpoint_gauge(
    keys: Keys.AsymmetricKey,
    addr: string,
    paymentAmount: string) {

    const _addr = new CLByteArray(
      Uint8Array.from(Buffer.from(addr, "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      addr: CLValueBuilder.key(_addr),
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "checkpoint_gauge",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async checkpoint(
    keys: Keys.AsymmetricKey,
    paymentAmount: string) {

    const runtimeArgs = RuntimeArgs.fromMap({
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "checkpoint",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async change_type_weight(
    keys: Keys.AsymmetricKey,
    type_id: string,
    weight: string,
    paymentAmount: string) {

    const runtimeArgs = RuntimeArgs.fromMap({
      type_id: CLValueBuilder.tuple2([CLValueBuilder.bool(true), CLValueBuilder.u128(type_id)]),
      weight: CLValueBuilder.u256(weight),
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "change_type_weight",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async change_gauge_weight(
    keys: Keys.AsymmetricKey,
    addr: string,
    weight: string,
    paymentAmount: string) {

    const _addr = new CLByteArray(
      Uint8Array.from(Buffer.from(addr, "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      addr: CLValueBuilder.key(_addr),
      weight: CLValueBuilder.u256(weight)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "change_gauge_weight",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async add_type(
    keys: Keys.AsymmetricKey,
    name: string,
    weight: string,
    paymentAmount: string) {

    const runtimeArgs = RuntimeArgs.fromMap({
      name: CLValueBuilder.string(name),
      weight: new CLOption(Some(CLValueBuilder.u256(weight)))
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "add_type",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async add_gauge(
    keys: Keys.AsymmetricKey,
    addr: string,
    gauge_type: string,
    weight: string,
    paymentAmount: string,
  ) {

    const _addr = new CLByteArray(
      Uint8Array.from(Buffer.from(addr, "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      addr: utils.createRecipientAddress(_addr),
      gauge_type: CLValueBuilder.tuple2([CLValueBuilder.bool(true), CLValueBuilder.u128(gauge_type)]),
      weight: new CLOption(Some(CLValueBuilder.u256(weight)))
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "add_gauge",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async vote_for_gauge_weights(
    keys: Keys.AsymmetricKey,
    gauge_addr: string,
    user_weight: string,
    paymentAmount: string,
  ) {

    const _gauge_addr = new CLByteArray(
      Uint8Array.from(Buffer.from(gauge_addr, "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      gauge_addr: utils.createRecipientAddress(_gauge_addr),
      user_weight: CLValueBuilder.u256(user_weight)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "vote_for_gauge_weights",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {

      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async gauge_types_(owner: string) {
    console.log("owner", owner);

    try {
      // console.log("namedKeys", this.namedKeys);
      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.gaugeTypes_
      );
      const maybeValue = result.value().unwrap();
      // console.log("maybeValue", maybeValue.value());

      return parseFloat(maybeValue.value()[1].data);

    } catch (error) {
      return "0";
    }

  }

  public async gauge_type_names(owner: string) {
    console.log("this.namedKeys", this.namedKeys);

    try {

    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      owner,
      this.namedKeys.gaugeTypeNames
    );
    const maybeValue = result.value().unwrap();
    // console.log("maybeValue", maybeValue);

    return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async vote_user_slopes(owner: string, spender: string) {
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
        this.namedKeys.vote_user_slopes
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async vote_user_power(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.vote_user_power
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
  }

  public async last_user_vote(owner: string, spender: string) {
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
        this.namedKeys.last_user_vote
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async points_weight(owner: string, spender: string) {
    try {
      const _spender = CLValueBuilder.u256(spender);

      const _owner = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.points_weight
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async changes_weight(owner: string, spender: string) {
    try {
      const _spender = CLValueBuilder.u256(spender);

      const _owner = new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.changes_weight
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async time_weight(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.time_weight
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }

  }

  public async gauges(owner: string) {
    try {
      console.log("owner", owner);

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.gauges
      );
      const maybeValue = result.value().unwrap();
      // console.log("maybeValue", maybeValue.value());
      // console.log("maybeValue", encodeBase16(maybeValue.value().data));

      return encodeBase16(maybeValue.value().data);

    } catch (error) {
      return "0";
    }

  }

  public async time_sum(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.time_sum
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }

  }

  public async points_sum(owner: string, spender: string) {
    try {
      const _spender = CLValueBuilder.u256(spender);
      const _owner = CLValueBuilder.tuple2([CLValueBuilder.bool(true), CLValueBuilder.u128(owner)]);
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.points_sum
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async changes_sum(owner: string, spender: string) {
    try {
      const _spender = CLValueBuilder.u256(spender);
      const _owner = CLValueBuilder.tuple2([CLValueBuilder.bool(true), CLValueBuilder.u128(owner)]);
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.changes_sum
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async points_total(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.points_total
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }

  }

  public async points_type_weight(owner: string, spender: string) {
    try {
      const _spender = CLValueBuilder.u256(spender);
      const _owner = CLValueBuilder.tuple2([CLValueBuilder.bool(true), CLValueBuilder.u128(owner)]);
      const finalBytes = concat([CLValueParsers.toBytes(_owner).unwrap(), CLValueParsers.toBytes(_spender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.points_type_weight
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async inflation_rate() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["inflation_rate"]
    );
    return result.value();
  }

  public async working_supply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["working_supply"]
    );
    return result.value();
  }

  public async time_type_weight(owner: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.time_type_weight
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }

  }

  public async time_total() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["time_total"]
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

  public async future_admin() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["future_admin"]
    );
    return result.value();
  }

  public async token() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["token"]
    );
    return result.value();
  }

  public async n_gauge_types() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["n_gauge_types"]
    );
    return result.value();
  }

  public async n_gauges() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["n_gauges"]
    );
    return result.value();
  }

  public async voting_escrow() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["voting_escrow"]
    );
    return result.value();
  }

  public async get_hash() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["self_contract_hash"]
    );
    return result.value();
  }

  public async package_hash() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["self_contract_package_hash"]
    );
    return result.value();
  }

  public onEvent(
    eventNames: GAUGECONTROLLEREVENTS[],
    callback: (
      eventName: GAUGECONTROLLEREVENTS,
      deployStatus: {
        deployHash: string;
        success: boolean;
        error: string | null;
      },
      result: any | null
    ) => void
  ): any {
    if (!this.eventStreamAddress) {
      throw Error("Please set eventStreamAddress before!");
    }
    if (this.isListening) {
      throw Error(
        "Only one event listener can be create at a time. Remove the previous one and start new."
      );
    }
    const es = new EventStream(this.eventStreamAddress);
    this.isListening = true;

    es.subscribe(EventName.DeployProcessed, (value: any) => {
      const deployHash = value.body.DeployProcessed.deploy_hash;

      const pendingDeploy = this.pendingDeploys.find(
        (pending) => pending.deployHash === deployHash
      );

      if (!pendingDeploy) {
        return;
      }

      if (
        !value.body.DeployProcessed.execution_result.Success &&
        value.body.DeployProcessed.execution_result.Failure
      ) {
        callback(
          pendingDeploy.deployType,
          {
            deployHash,
            error:
              value.body.DeployProcessed.execution_result.Failure.error_message,
            success: false,
          },
          null
        );
      } else {
        const { transforms } =
          value.body.DeployProcessed.execution_result.Success.effect;

        const GAUGECONTROLLEREVENTS = transforms.reduce((acc: any, val: any) => {
          if (
            val.transform.hasOwnProperty("WriteCLValue") &&
            typeof val.transform.WriteCLValue.parsed === "object" &&
            val.transform.WriteCLValue.parsed !== null
          ) {
            const maybeCLValue = CLValueParsers.fromJSON(
              val.transform.WriteCLValue
            );
            const clValue = maybeCLValue.unwrap();
            if (clValue && clValue instanceof CLMap) {
              const hash = clValue.get(
                CLValueBuilder.string("contract_package_hash")
              );
              const event = clValue.get(CLValueBuilder.string("event_type"));
              if (
                hash &&
                // NOTE: Calling toLowerCase() because current JS-SDK doesn't support checksumed hashes and returns all lower case value
                // Remove it after updating SDK
                hash.value() === this.contractPackageHash.toLowerCase() &&
                event &&
                eventNames.includes(event.value())
              ) {
                acc = [...acc, { name: event.value(), clValue }];
              }
            }
          }
          return acc;
        }, []);

        GAUGECONTROLLEREVENTS.forEach((d: any) =>
          callback(
            d.name,
            { deployHash, error: null, success: true },
            d.clValue
          )
        );
      }

      this.pendingDeploys = this.pendingDeploys.filter(
        (pending) => pending.deployHash !== deployHash
      );
    });
    es.start();

    return {
      stopListening: () => {
        es.unsubscribe(EventName.DeployProcessed);
        es.stop();
        this.isListening = false;
        this.pendingDeploys = [];
      },
    };
  }

  public addPendingDeploy(deployType: GAUGECONTROLLEREVENTS, deployHash: string) {
    this.pendingDeploys = [...this.pendingDeploys, { deployHash, deployType }];
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

export default GaugeControllerClient;
