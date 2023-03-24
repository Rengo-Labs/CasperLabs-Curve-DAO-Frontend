import { CLByteArray, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { Some } from "ts-results";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { convertToStr } from "../ConvertToString/ConvertToString";


export async function depositMakeDeploy(depositAmount, gaugeContractHash, setOpenSigning, enqueueSnackbar, fetchData) {
  if (depositAmount == 0) {
    let variant = "Error";
    enqueueSnackbar("Deposite amount cannot be zero", { variant })
    return
  }
  setOpenSigning(true);
  const publicKeyHex = localStorage.getItem("Address");
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 100000000000;
    const spenderByteArray = new CLByteArray(
      Uint8Array.from(Buffer.from(publicKeyHex, "hex"))
    );
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(convertToStr(depositAmount)),
        addr: new CLOption(Some(createRecipientAddress(publicKey))),
        claim_rewards: new CLOption(Some(CLValueBuilder.bool(false)))

      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(gaugeContractHash, "hex")
      );
      let entryPoint = "deposit";
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
        enqueueSnackbar("Deposit Successfully", { variant })
        fetchData()
      } catch {
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Deposit", { variant })
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