import { CLAccountHash, CLByteArray, CLPublicKey } from "casper-js-sdk";
import {MINTEREvents} from "./constants";

export type RecipientType = CLPublicKey | CLAccountHash | CLByteArray;

export interface IPendingDeploy {
  deployHash: string;
  deployType: MINTEREvents;
}
