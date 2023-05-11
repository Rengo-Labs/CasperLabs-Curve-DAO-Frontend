import { CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { checkpoint } from "../checkpoint/Checkpoint";


export async function increaseUnlockTimeMakeDeploy(unlockTime, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData, gaugesQueryData) {
// get the address of user logged in
  let activePublicKey = localStorage.getItem("Address")
  setOpenSigning(true);
  const publicKeyHex = activePublicKey;
  if (unlockTime == undefined) {
    let variant = "Error";
    enqueueSnackbar("Please select Unlock Time", { variant })
    return
  }
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 100000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
      );
      let entryPoint = "increase_unlock_time";
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