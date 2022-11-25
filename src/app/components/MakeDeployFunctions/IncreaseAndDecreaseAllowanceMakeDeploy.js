import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { convertToStr } from "../../components/ConvertToString/ConvertToString";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { SUPPORTED_NETWORKS, CHAINS } from "../../components/Headers/Header";
import { getDeploy } from "../../components/blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../../components/blockchain/NodeAddress/NodeAddress";
import { VOTING_ESCROW_PACKAGE_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { ERC20_CRV_PACKAGE_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { createRecipientAddress } from "../../components/blockchain/RecipientAddress/RecipientAddress";
import { makeERC20CRVDeployWasm } from "../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { checkpoint } from "../checkpoint/Checkpoint";


export async function increaseAndDecreaseAllowanceMakeDeploy(amount, handleCloseAllowance, setOpenSigning, enqueueSnackbar, getAllowance) {
    // CREATING REQUIRED VARIABLES
    let torus;
    const allowance = 0;

    let selectedWallet = localStorage.getItem("selectedWallet")
    let activePublicKey = localStorage.getItem("Address")


    // handleShowSigning();
    setOpenSigning(true);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const spender = VOTING_ESCROW_PACKAGE_HASH;
      const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );
      const erc20CrvPackageHash = new CLByteArray(
        Uint8Array.from(Buffer.from(ERC20_CRV_PACKAGE_HASH, "hex"))
      );
      const paymentAmount = 5000000000;
      const runtimeArgs = RuntimeArgs.fromMap({
        package_hash: CLValueBuilder.key(erc20CrvPackageHash),
        spender: createRecipientAddress(spenderByteArray),
        amount: CLValueBuilder.u256(convertToStr(amount)),
        entrypoint: CLValueBuilder.string("increase_allowance"),
      });

      let deploy = await makeERC20CRVDeployWasm(
        publicKey,
        runtimeArgs,
        paymentAmount
      );
      console.log("make deploy: ", deploy);
      try {
        if (selectedWallet === "Casper") {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
        //   let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
          console.log("result", result);
        } else {
          torus = new Torus();
          console.log("torus", torus);
          await torus.init({
            buildEnv: "testing",
            showTorusButton: true,
            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
          });
          console.log("Torus123", torus);
          console.log("torus", torus.provider);
          const casperService = new CasperServiceByJsonRPC(torus?.provider);
          const deployRes = await casperService.deploy(deploy);
          console.log("deployRes", deployRes.deploy_hash);
          console.log(
            `... Contract installation deployHash: ${deployRes.deploy_hash}`
          );
          let result = await getDeploy(
            NODE_ADDRESS,
            deployRes.deploy_hash,
            enqueueSnackbar
            // providerRef.current.enqueueSnackbar
          );
          console.log(
            `... Contract installed successfully.`,
            JSON.parse(JSON.stringify(result))
          );
          console.log("result", result);
        }
        checkpoint(true, setOpenSigning, enqueueSnackbar);
        handleCloseAllowance();
        // handleCloseSigning();
        setOpenSigning(false);
        getAllowance();

        let variant = "success";
        enqueueSnackbar("Allowance Increased Successfully", { variant })
        // providerRef.current.enqueueSnackbar("Allowance Increased Successfully", { variant })

      } catch {
        // handleCloseSigning();
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Increase Allowance", { variant })
        // providerRef.current.enqueueSnackbar("Unable to Increase Allowance", { variant })
      }
    } else {
    //   handleCloseSigning();
      setOpenSigning(false);
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    //   providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }

  }