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
  CLOption
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import * as blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import {createRecipientAddress } from "./utils";

class VOTINGESCROWClient {
  private contractName: string = "votingescrow";
  private contractHash: string= "votingescrow";
  private contractPackageHash: string= "votingescrow";
  private namedKeys: {
    balanceOf:string
    metadata: string;
    nonces: string;
    allowances: string;
    ownedTokens: string;
    owners: string;
    paused: string;
    minBalance: string;
    minAcceptQuorumPct: string;
    minTime:string;
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
    
  ) 
  {
    this.namedKeys= {
      balanceOf:"null",
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

  public async install(
    keys: Keys.AsymmetricKey,
    tokenAddr: string,
    name: string,
    tokenSymbol: string,
    version: string,
    contractName: string,
    paymentAmount: string,
    wasmPath: string
  ) {
    const _tokenAddr = new CLByteArray(
			Uint8Array.from(Buffer.from(tokenAddr, "hex"))
		);
    const runtimeArgs = RuntimeArgs.fromMap({
      token_addr: utils.createRecipientAddress(_tokenAddr),
      name: CLValueBuilder.string(name),
      symbol: CLValueBuilder.string(tokenSymbol),
      version: CLValueBuilder.string(version),
      contract_name: CLValueBuilder.string(contractName),
    });

    const deployHash = await installWasmFile({
      chainName: this.chainName,
      paymentAmount,
      nodeAddress: this.nodeAddress,
      keys,
      pathToContract: wasmPath,
      runtimeArgs,
    });

    if (deployHash !== null) {
      return deployHash;
    } else {
      throw Error("Problem with installation");
    }
  }

  // public async getLastUserSlopeSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  // public async userPointHistoryTsSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   idx:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     idx: CLValueBuilder.u256(idx)
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  // public async lockedEndSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  // public async balanceOfSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   t:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     t: CLValueBuilder.u256(t)
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  public async balanceOf(account: string) {
    try {

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        account,
        this.namedKeys.balanceOf
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }

  }

  // public async balanceOfAtSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   time:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     time: CLValueBuilder.u256(time)
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  public async totalSupply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["total_supply"]
    );
    return result.value();
  }

  // public async totalSupplySessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   t:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     t: CLValueBuilder.u256(t)
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }

  // public async totalSupplyAtSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   time:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     time: CLValueBuilder.u256(time)
  //   });

  //   const deployHash = await installWasmFile({
  //     chainName: this.chainName,
  //     paymentAmount,
  //     nodeAddress: this.nodeAddress,
  //     keys,
  //     pathToContract: wasmPath,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
  //     return deployHash;
  //   } else {
  //     throw Error("Problem with installation");
  //   }
  // }


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
      'balance_of',
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

  public async userPointHistory(user:string, userEpoch:string) {
    try {
      const _user=new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(user, "hex"))));
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

  public async commitTransferOwnership(
    keys: Keys.AsymmetricKey,
    addr: string,
    //addr: RecipientType,
    paymentAmount: string
  ) {
    const _addr = new CLByteArray(
			Uint8Array.from(Buffer.from(addr, "hex"))
		);
    const runtimeArgs = RuntimeArgs.fromMap({
      addr: utils.createRecipientAddress(_addr),
      //addr: utils.createRecipientAddress(addr),
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

  public async applyTransferOwnership(
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

  public async checkpoint(
    keys: Keys.AsymmetricKey,
    paymentAmount: string
  ) {
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

  public async depositFor(
    keys: Keys.AsymmetricKey,
    addr: string,
    value: string,
    paymentAmount: string
  ) {
    const _addr = new CLByteArray(
			Uint8Array.from(Buffer.from(addr, "hex"))
		);
    const runtimeArgs = RuntimeArgs.fromMap({
      addr: utils.createRecipientAddress(_addr),
      value: CLValueBuilder.u256(value)
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "deposit_for",
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

  public async createlock(
    keys: Keys.AsymmetricKey,
    value: string,
    unlockTime: string,
    paymentAmount: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      value: CLValueBuilder.u256(value),
      unlock_time: CLValueBuilder.u256(unlockTime)
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "create_lock",
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

  public async increaseAmount(
    keys: Keys.AsymmetricKey,
    value: string,
    paymentAmount: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      value: CLValueBuilder.u256(value),
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "increase_amount",
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

  public async increaseUnlockTime(
    keys: Keys.AsymmetricKey,
    unlockTime: string,
    paymentAmount: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      unlock_time: CLValueBuilder.u256(unlockTime),
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "increase_unlock_time",
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

  public async withdraw(
    keys: Keys.AsymmetricKey,
    paymentAmount: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "withdraw",
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

  public async changeController(
    keys: Keys.AsymmetricKey,
    //newController: string,
    newController: RecipientType,
    paymentAmount: string
  ) {
    // const _newController = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(newController, "hex"))
		// );
    const runtimeArgs = RuntimeArgs.fromMap({
      // new_controller: utils.createRecipientAddress(_newController),
      new_controller: utils.createRecipientAddress(newController),
    });
    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "change_controller",
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

}

interface IInstallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  pathToContract: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
}

const installWasmFile = async ({
  nodeAddress,
  keys,
  chainName,
  pathToContract,
  runtimeArgs,
  paymentAmount,
}: IInstallParams): Promise<string> => {
  const client = new CasperClient(nodeAddress);

  // Set contract installation deploy (unsigned).
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      CLPublicKey.fromHex(keys.publicKey.toHex()),
      chainName
    ),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      utils.getBinary(pathToContract),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy.
  deploy = client.signDeploy(deploy, keys);

  // Dispatch deploy to node.
  return await client.putDeploy(deploy);
};

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
