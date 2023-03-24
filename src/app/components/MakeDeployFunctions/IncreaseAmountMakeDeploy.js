import { CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { checkpoint } from "../checkpoint/Checkpoint";
import { convertToStr } from "../ConvertToString/ConvertToString";



export async function increaseAmountMakeDeploy(lockedAmount, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData, gaugesQueryData) {
  let torus;
  const allowance = 0;

  let selectedWallet = localStorage.getItem("selectedWallet")
  let activePublicKey = localStorage.getItem("Address")


  if (lockedAmount == 0) {
    let variant = "Error";
    enqueueSnackbar("Locked amount cannot be Zero", { variant })
    return
  }
  setOpenSigning(true);
  const publicKeyHex = activePublicKey;
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 100000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(convertToStr(lockedAmount)),
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
      );
      let entryPoint = "increase_amount";
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
        console.log("result", result);
        checkpoint(true, setOpenSigning, enqueueSnackbar, gaugesQueryData);
        setOpenSigning(false);
        let variant = "success";
        enqueueSnackbar("Amount Increased Successfully", { variant })

        fetchBalanceData();
        fetchUserData();
      } catch {
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Increase Amount", { variant })
      }
    } catch {
      setOpenSigning(false);
      let variant = "Error";
      enqueueSnackbar("Something Went Wrong", { variant });
    }
  } else {
    setOpenSigning(false);
    let variant = "error";
    enqueueSnackbar("Connect to Wallet Please", { variant });
  }
}