import { CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { makeERC20CRVDeployWasm } from "../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { convertToStr } from "../../components/ConvertToString/ConvertToString";
import { ERC20_CRV_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { ERC20_CRV_PACKAGE_HASH, VOTING_ESCROW_PACKAGE_HASH } from "../blockchain/Hashes/PackageHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
window.Buffer = window.Buffer || require("buffer").Buffer;


export async function increaseAndDecreaseAllowanceGaugeMakeDeploy(amount, setOpenSigning, enqueueSnackbar, getAllowance, gaugeSpender, swapTokenContractHash) {
    // CREATING REQUIRED VARIABLES
    let activePublicKey = localStorage.getItem("Address")
    console.log("gaugeSpender", gaugeSpender);
    console.log("swapTokenContractHash", swapTokenContractHash);

    // handleShowSigning();
    setOpenSigning(true);
    const publicKeyHex = activePublicKey;
    if (
        publicKeyHex !== null &&
        publicKeyHex !== "null" &&
        publicKeyHex !== undefined
    ) {
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        const spender = gaugeSpender;
        const spenderByteArray = new CLByteArray(
            Uint8Array.from(Buffer.from(spender, "hex"))
        );
        let contractHashAsByteArray = Uint8Array.from(
            Buffer.from(swapTokenContractHash, "hex")
        );
        const paymentAmount = 50000000000;
        const runtimeArgs = RuntimeArgs.fromMap({
            spender: createRecipientAddress(spenderByteArray),
            amount: CLValueBuilder.u256(convertToStr(amount)),
        });
        let entryPoint = "increase_allowance";
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
            //   let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
            setOpenSigning(false);
            getAllowance();

            let variant = "success";
            enqueueSnackbar("Allowance Increased Successfully", { variant })
            return true
            // providerRef.current.enqueueSnackbar("Allowance Increased Successfully", { variant })

        } catch {
            setOpenSigning(false);
            let variant = "Error";
            enqueueSnackbar("Unable to Increase Allowance", { variant })
            return false
            // providerRef.current.enqueueSnackbar("Unable to Increase Allowance", { variant })
        }
    } else {
        //   handleCloseSigning();
        setOpenSigning(false);
        let variant = "error";
        enqueueSnackbar("Connect to Wallet Please", { variant });
        return false
        //   providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }

}