import { CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { Some } from "ts-results";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { convertToStr } from "../ConvertToString/ConvertToString";


export async function withdrawGaugeMakeDeploy(amount, setOpenSigning, enqueueSnackbar, gauge, gaugeBalance, fetchData) {
  console.log("amount", amount);
  console.log("gaugeBalance", gaugeBalance);
  if (amount > parseFloat(gaugeBalance)) {
    let variant = "Error";
    enqueueSnackbar("Withdraw amount must be lower than orignal balance ", { variant })
    return
  }
  setOpenSigning(true);
  // get the address of user logged in
  const publicKeyHex = localStorage.getItem("Address");
  console.log("Withdraw function public keys: ", publicKeyHex);
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 100000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(convertToStr(amount)),
        claim_rewards: new CLOption(Some(CLValueBuilder.bool(false)))
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(gauge, "hex")
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
        fetchData()
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