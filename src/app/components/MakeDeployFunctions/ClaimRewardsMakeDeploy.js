import { CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";


export async function claimRewardsMakeDeploy(setOpenSigning, enqueueSnackbar) {
    // CREATING REQUIRED VARIABLES
    const allowance = 0;

    let selectedWallet = localStorage.getItem("selectedWallet")
    let activePublicKey = localStorage.getItem("Address")

    // handleShowSigning();
    setOpenSigning(true);
    // const publicKeyHex = activePublicKey;
    const publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
            addr: publicKey
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "claim_rewards";
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
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            // let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
        //   handleCloseSigning();
          setOpenSigning(false);
          let variant = "success";
          enqueueSnackbar("Rewards Claimed Successfully", { variant })
        //   providerRef.current.enqueueSnackbar("Funds Locked Successfully", { variant })


        } catch {
        //   handleCloseSigning();
          setOpenSigning(false);
          let variant = "Error";
          enqueueSnackbar("Unable to Claim Rewards", { variant })
        //   providerRef.current.enqueueSnackbar("Unable to Lock Funds", { variant })
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