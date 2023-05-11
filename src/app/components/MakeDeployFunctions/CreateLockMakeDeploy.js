import { CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { checkpoint } from "../checkpoint/Checkpoint";
import { convertToStr } from "../ConvertToString/ConvertToString";


export async function createLockMakeDeploy(lockedAmount, unlockTime, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData) {
  if (lockedAmount == 0) {
    let variant = "Error";
    enqueueSnackbar("Locked amount cannot be Zero", { variant })
    return
  }
  if (unlockTime == undefined) {
    let variant = "Error";
    enqueueSnackbar("Please select Unlock Time", { variant })
    return
  }
  console.log("unlockTime", unlockTime.getTime());
  setOpenSigning(true);
  // get the address of user logged in
  const publicKeyHex = localStorage.getItem("Address");
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 50000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(convertToStr(lockedAmount)),
        unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
      );
      let entryPoint = "create_lock";
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
        enqueueSnackbar("Funds Locked Successfully", { variant })
        fetchBalanceData();
        fetchUserData();
      } catch {
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Lock Funds", { variant })
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