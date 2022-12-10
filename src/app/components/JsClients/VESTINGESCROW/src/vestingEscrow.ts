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
  
  class VESTINGESCROWClient {
    private contractName: string = "vestingescrow";
    private contractHash: string= "vestingescrow";
    private contractPackageHash: string= "vestingescrow";
    private namedKeys: {
      balances:string
      vested_of: string
      locked_of: string
      initial_locked: string
      total_claimed: string
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
        vested_of: "null",
        locked_of: "null",
        initial_locked: "null",
        total_claimed: "null"
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
        'vested_of',
        'locked_of',
        'initial_locked',
        'total_claimed',
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
  
    public async start_time() {
      const result = await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash,
        ["start_time"]
      );
      return result.value();
    }

    public async end_time() {
      const result = await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash,
        ["end_time"]
      );
      return result.value();
    }
  
    public async balanceOf(owner: string) {
      try {
        
        const result = await utils.contractDictionaryGetter(
          this.nodeAddress,
          owner,
          this.namedKeys.balances
        );
        const maybeValue = result.value().unwrap();
        return maybeValue.value().toString();
  
      } catch (error) {
        return "0";
      }
      
    }

    public async vestedOf(owner: string) {
      try {
        
        const result = await utils.contractDictionaryGetter(
          this.nodeAddress,
          owner,
          this.namedKeys.vested_of
        );
        const maybeValue = result.value().unwrap();
        return maybeValue.value().toString();
  
      } catch (error) {
        return "0";
      }
      
    }

    public async intialLocked(owner: string) {
      try {
        
        const result = await utils.contractDictionaryGetter(
          this.nodeAddress,
          owner,
          this.namedKeys.initial_locked
        );
        const maybeValue = result.value().unwrap();
        return maybeValue.value().toString();
  
      } catch (error) {
        return "0";
      }
      
    }
    public async totalClaimed(owner: string) {
      try {
        
        const result = await utils.contractDictionaryGetter(
          this.nodeAddress,
          owner,
          this.namedKeys.total_claimed
        );
        const maybeValue = result.value().unwrap();
        return maybeValue.value().toString();
  
      } catch (error) {
        return "0";
      }
      
    }
    public async lockedOf(owner: string) {
      try {
        
        const result = await utils.contractDictionaryGetter(
          this.nodeAddress,
          owner,
          this.namedKeys.locked_of
        );
        const maybeValue = result.value().unwrap();
        return maybeValue.value().toString();
  
      } catch (error) {
        return "0";
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
  
  export default VESTINGESCROWClient;
  