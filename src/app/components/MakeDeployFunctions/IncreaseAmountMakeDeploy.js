import { CasperServiceByJsonRPC, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { convertToStr } from "../ConvertToString/ConvertToString";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { SUPPORTED_NETWORKS, CHAINS } from "../Headers/Header";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
import { checkpoint } from "../checkpoint/Checkpoint";



export async function increaseAmountMakeDeploy(lockedAmount, setOpenSigning, enqueueSnackbar) {
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
  setOpenSigning(true);
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
        let signedDeploy = await signdeploywithcaspersigner(
          deploy,
          publicKeyHex
        );
        let result = await putdeploy(signedDeploy, enqueueSnackbar);
        // let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
        console.log("result", result);

        //   handleCloseSigning();
        checkpoint(true, setOpenSigning, enqueueSnackbar);
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