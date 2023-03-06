import { CLByteArray, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { None, Option, Some } from "ts-results";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { convertToStr } from "../ConvertToString/ConvertToString";


export async function depositMakeDeploy(depositAmount, gaugeContractHash, setOpenSigning, enqueueSnackbar, fetchData) {
  // CREATING REQUIRED VARIABLES
  let torus;
  const allowance = 0;

  let selectedWallet = localStorage.getItem("selectedWallet")
  let activePublicKey = localStorage.getItem("Address")

  console.log("gaugeContractHash", gaugeContractHash);
  if (depositAmount == 0) {
    let variant = "Error";
    //   providerRef.current.enqueueSnackbar("Locked amount cannot be Zero", { variant })
    enqueueSnackbar("Deposite amount cannot be zero", { variant })
    return
  }
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
        enqueueSnackbar("Deposit Successfully", { variant })
        fetchData()
        //   providerRef.current.enqueueSnackbar("Funds Locked Successfully", { variant })


      } catch {
        //   handleCloseSigning();
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Deposit", { variant })
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