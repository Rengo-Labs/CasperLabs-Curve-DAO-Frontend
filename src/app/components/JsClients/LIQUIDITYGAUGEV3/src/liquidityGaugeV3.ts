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
  ToBytes
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import * as blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import {createRecipientAddress } from "./utils";

class LIQUIDITYGAUGEV3Client {
  private contractName: string = "liquiditygaugev3";
  private contractHash: string= "liquiditygaugev3";
  private contractPackageHash: string= "liquiditygaugev3";
  private namedKeys: {
    balances:string
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
    
  ) 
  {
    this.namedKeys= {
      balances:"null",
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

  // public async install(
  //   keys: Keys.AsymmetricKey,
  //   lpAddr: string,
  //   minter: string,
  //   admin:RecipientType,
  //   contractName: string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _lpAddr = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(lpAddr, "hex"))
	// 	);
  //   const _minter = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(minter, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     lp_addr: utils.createRecipientAddress(_lpAddr),
  //     minter: utils.createRecipientAddress(_minter),
  //     admin: utils.createRecipientAddress(admin),
  //     contract_name: CLValueBuilder.string(contractName),
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

  // public async userCheckpointSessionCode(
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

  // public async claimableTokensSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _addr = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(addr, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(_addr),
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

  // public async rewardContractSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
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

  // public async lastClaimSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
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

  // public async claimedRewardSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   token:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _token = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(token, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     token: utils.createRecipientAddress(_token),
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

  // public async claimableRewardSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   token:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _token = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(token, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     token: utils.createRecipientAddress(_token),
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

  // public async claimableRewardWriteSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   addr:RecipientType,
  //   token:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _token = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(token, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     addr: utils.createRecipientAddress(addr),
  //     token: utils.createRecipientAddress(_token),
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

  // public async transferSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   recipient:string,
  //   amount:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _recipient = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(recipient, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     recipient: utils.createRecipientAddress(_recipient),
  //     amount: CLValueBuilder.u256(amount),
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

  // public async transferFromSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   owner:RecipientType,
  //   recipient:string,
  //   amount:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _recipient = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(recipient, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     owner: utils.createRecipientAddress(owner),
  //     recipient: utils.createRecipientAddress(_recipient),
  //     amount: CLValueBuilder.u256(amount),
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

  // public async increaseAllowanceSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   spender:string,
  //   amount:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _spender = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(spender, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     spender: utils.createRecipientAddress(_spender),
  //     amount: CLValueBuilder.u256(amount),
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

  // public async decreaseAllowanceSessionCode(
  //   keys: Keys.AsymmetricKey,
  //   entrypointName:string,
  //   packageHash: string,
  //   spender:string,
  //   amount:string,
  //   paymentAmount: string,
  //   wasmPath: string
  // ) {
  //   const _packageHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(packageHash, "hex"))
	// 	);
  //   const _spender = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(spender, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     entrypoint: CLValueBuilder.string(entrypointName),
  //     package_hash: utils.createRecipientAddress(_packageHash),
  //     spender: utils.createRecipientAddress(_spender),
  //     amount: CLValueBuilder.u256(amount),
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
    return result.value();
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

  public async allowances(owner:string, spender:string) {
    try {
      const _spender = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );

      const _owner=new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
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

  public async workingBalances(owner: string) {
    try {
      
      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        owner,
        this.namedKeys.workingBalances
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

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

  public async rewardIntegralFor(owner:string, spender:string) {
    try {
      const _spender = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );

      const _owner=new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
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

  //LIQUIDITY GAUGE V3 FUNCTIONS

  // public async setRewardsReceiver(
  //   keys: Keys.AsymmetricKey,
  //   receiver: string,
  //   paymentAmount: string
  // ) {
  //    const _receiver = new CLByteArray(
	// 	 	Uint8Array.from(Buffer.from(receiver, "hex"))
	// 	 );
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     receiver: utils.createRecipientAddress(_receiver),
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "set_rewards_receiver",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async claimRewards(
  //   keys: Keys.AsymmetricKey,
  //   addr: RecipientType,
  //   receiver: string,
  //   paymentAmount: string
  // ) {
  //   const _receiver = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(receiver, "hex"))
	// 	);
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     addr: new CLOption(Some(utils.createRecipientAddress(addr))),
  //     receiver: new CLOption(Some(utils.createRecipientAddress(_receiver)))

  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "claim_rewards",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async kick(
  //   keys: Keys.AsymmetricKey,
  //   //addr: string,
  //   addr: RecipientType,
  //   paymentAmount: string
  // ) {
  //   // const _addr = new CLByteArray(
	// 	// 	Uint8Array.from(Buffer.from(addr, "hex"))
	// 	// );
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     //addr: utils.createRecipientAddress(_addr),
  //     addr: utils.createRecipientAddress(addr),
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "kick",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async deposit(
  //   keys: Keys.AsymmetricKey,
  //   value: string,
  //   addr: RecipientType,
  //   claimRewards: boolean,
  //   paymentAmount: string
  // ) {
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     value: CLValueBuilder.u256(value),
  //     addr: new CLOption(Some(utils.createRecipientAddress(addr))),
  //     claim_rewards: new CLOption(Some(CLValueBuilder.bool(claimRewards)))

  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "deposit",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async withdraw(
  //   keys: Keys.AsymmetricKey,
  //   value: string,
  //   claimRewards: boolean,
  //   paymentAmount: string
  // ) {
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     value: CLValueBuilder.u256(value),
  //     claim_rewards: new CLOption(Some(CLValueBuilder.bool(claimRewards)))
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "withdraw",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async approve(
  //   keys: Keys.AsymmetricKey,
  //   spender: string,
  //   amount: string,
  //   paymentAmount: string
  // ) {
  //    const _spender = new CLByteArray(
	// 	 	Uint8Array.from(Buffer.from(spender, "hex"))
	// 	 );
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     spender: utils.createRecipientAddress(_spender),
  //     amount:CLValueBuilder.u256(amount), 
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "approve",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async setRewards(
  //   keys: Keys.AsymmetricKey,
  //   rewardContract: string,
  //   claimSig: string,
  //   rewardTokens: string[],
  //   paymentAmount: string
  // ) {
  //    const _rewardContract = new CLByteArray(
	// 	 	Uint8Array.from(Buffer.from(rewardContract, "hex"))
	// 	 );
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     reward_contract: utils.createRecipientAddress(_rewardContract),
  //     claim_sig:CLValueBuilder.string(claimSig),
  //     reward_tokens: CLValueBuilder.list(rewardTokens.map(id => CLValueBuilder.string(id))),

  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "set_rewards",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async setKilled(
  //   keys: Keys.AsymmetricKey,
  //   isKilled: boolean,
  //   paymentAmount: string
  // ) {
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     is_killed: CLValueBuilder.bool(isKilled)
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "set_killed",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async commitTransferOwnership(
  //   keys: Keys.AsymmetricKey,
  //   //addr: string,
  //   addr: RecipientType,
  //   paymentAmount: string
  // ) {
  //   // const _addr = new CLByteArray(
	// 	// 	Uint8Array.from(Buffer.from(addr, "hex"))
	// 	// );
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     //addr: utils.createRecipientAddress(_addr),
  //     addr: utils.createRecipientAddress(addr),
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "commit_transfer_ownership",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }

  // public async acceptTransferOwnership(
  //   keys: Keys.AsymmetricKey,
  //   paymentAmount: string
  // ) {
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //   });
  //   const deployHash = await contractCall({
  //     chainName: this.chainName,
  //     contractHash: this.contractHash,
  //     entryPoint: "accept_transfer_ownership",
  //     keys,
  //     nodeAddress: this.nodeAddress,
  //     paymentAmount,
  //     runtimeArgs,
  //   });

  //   if (deployHash !== null) {
      
  //     return deployHash;
  //   } else {
  //     throw Error("Invalid Deploy");
  //   }
  // }
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
