import { CLByteArray, CLKey, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { LIQUIDITY_GAUGE_V3_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeUserCheckpointDeployWasm } from "../blockchain/MakeDeploy/MakeDeployWasm";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";

export async function UserCheckpointMakeDeploy(gauge, activePublicKey, setOpenSigning, enqueueSnackbar) {
    setOpenSigning(true);
    console.log("activePublicKey", activePublicKey);
    const publicKeyHex = activePublicKey;
    if (
        publicKeyHex !== null &&
        publicKeyHex !== "null" &&
        publicKeyHex !== undefined
    ) {
        const paymentAmount = 100000000000;
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        const key = createRecipientAddress(publicKey);
        const runtimeArgs = RuntimeArgs.fromMap({
            entrypoint: CLValueBuilder.string("user_checkpoint"),
            addr: key,
            package_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(gauge, "hex")))),

        });
        console.log("runtimeArgs", runtimeArgs);
        let deploy = await makeUserCheckpointDeployWasm(
            publicKey,
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
            let variant = "success";
            setOpenSigning(false)
            enqueueSnackbar("User Check Point Called Successfully", { variant });

        } catch {
            setOpenSigning(false);
            let variant = "Error";
            enqueueSnackbar("Unable to Call User Check Point", { variant });
        }
    } else {
        let variant = "error";
        setOpenSigning(false);
        enqueueSnackbar("Connect to Wallet Please", { variant });
    }
}