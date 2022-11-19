import { CasperServiceByJsonRPC, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { VOTING_ESCROW_CONTRACT_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { SUPPORTED_NETWORKS, CHAINS } from "../../components/Headers/Header";
import { getDeploy } from "../../components/blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../../components/blockchain/NodeAddress/NodeAddress";


export async function increaseUnlockTimeMakeDeploy(unlockTime, setOpenSigning, enqueueSnackbar) {
    // CREATING REQUIRED VARIABLES
    let torus;
    const allowance = 0;

    let selectedWallet = localStorage.getItem("selectedWallet")
    let activePublicKey = localStorage.getItem("Address")


    // handleShowSigning();
    setOpenSigning(true);
    const publicKeyHex = activePublicKey;
    if (unlockTime == undefined) {
      let variant = "Error";
      enqueueSnackbar("Please select Unlock Time", { variant })
    //   providerRef.current.enqueueSnackbar("Please select Unlock Time", { variant })
      return
    }
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "increase_unlock_time";
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
          setOpenSigning(false);
          let variant = "success";
          enqueueSnackbar("Amount Increased Successfully", { variant })
        //   providerRef.current.enqueueSnackbar("Amount Increased Successfully", { variant })
        } catch {
        //   handleCloseSigning();
          setOpenSigning(false);
          let variant = "Error";
          enqueueSnackbar("Unable to Increase Amount", { variant })
        //   providerRef.current.enqueueSnackbar("Unable to Increase Amount", { variant })
        }
      } catch {
        // handleCloseSigning();
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
        // providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
    //   handleCloseSigning();
      setOpenSigning(false);
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    //   providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }