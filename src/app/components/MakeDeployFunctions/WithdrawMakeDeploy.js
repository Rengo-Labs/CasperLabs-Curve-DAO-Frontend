import { CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";

export async function withdrawMakeDeploy(setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData) {
  setOpenSigning(true);
  const publicKeyHex = localStorage.getItem("Address");// get the address of user logged in
  console.log("Withdraw function public keys: ", publicKeyHex);
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 50000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
      );
      let entryPoint = "withdraw";
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
        enqueueSnackbar("Funds Withdrawed Successfully", { variant })
        fetchBalanceData();
        fetchUserData();
      } catch {
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Withdraw Funds", { variant })
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