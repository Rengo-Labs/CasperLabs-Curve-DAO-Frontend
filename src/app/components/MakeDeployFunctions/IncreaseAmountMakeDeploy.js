import { CasperServiceByJsonRPC, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { convertToStr } from "../ConvertToString/ConvertToString";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { SUPPORTED_NETWORKS, CHAINS } from "../Headers/Header";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";



export async function increaseAmountMakeDeploy(lockedAmount, setOpenSingning, enqueueSnackbar) {
    // CREATING REQUIRED VARIABLES
    let torus;
    const allowance = 0;

    let selectedWallet = localStorage.getItem("selectedWallet")
    let activePublicKey = localStorage.getItem("Address")


    if (lockedAmount == 0) {
      let variant = "Error";
      enqueueSnackbar("Locked amount cannot be Zero", { variant })
    //   providerRef.current.enqueueSnackbar("Locked amount cannot be Zero", { variant })
      return
    }
    // handleShowSigning();
    setOpenSingning(true);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          value: CLValueBuilder.u256(convertToStr(lockedAmount)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "increase_amount";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
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
            // let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
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
            //   providerRef.current.enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
        //   handleCloseSigning();
          setOpenSingning(false);
          let variant = "success";
          enqueueSnackbar("Amount Increased Successfully", { variant })
        //   providerRef.current.enqueueSnackbar("Amount Increased Successfully", { variant })
        } catch {
        //   handleCloseSigning();
          setOpenSingning(false);
          let variant = "Error";
          enqueueSnackbar("Unable to Increase Amount", { variant })
        //   providerRef.current.enqueueSnackbar("Unable to Increase Amount", { variant })
        }
      } catch {
        // handleCloseSigning();
        setOpenSingning(false);
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
        // providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
    //   handleCloseSigning();
      setOpenSingning(false);
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    //   providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }