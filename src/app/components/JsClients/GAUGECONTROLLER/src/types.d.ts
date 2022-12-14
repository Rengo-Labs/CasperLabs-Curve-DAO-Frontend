import { CLAccountHash, CLByteArray, CLPublicKey } from "casper-js-sdk";
import {GAUGECONTROLLEREVENTS} from "./constants";

export type RecipientType = CLPublicKey | CLAccountHash | CLByteArray;

export interface IPendingDeploy {
  deployHash: string;
  deployType: GAUGECONTROLLEREVENTS;
}
