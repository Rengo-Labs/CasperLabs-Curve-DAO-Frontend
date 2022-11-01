// import { allabis, poolAbis } from "./allabis";
import BigNumber from "bignumber.js";
import { gql, useQuery } from "@apollo/client";
import { truncate } from "./helpers";

export const OWNERSHIP_VOTE_TIME = 604800;
export const PARAMETER_VOTE_TIME = 604800;
export const OWNERSHIP_APP_ADDRESS =
  "0xE478de485ad2fe566d49342Cbd03E49ed7DB3356";
//'0x96B58C29c74fce0aBFE7c0C62225095f47A91A6D'
export const PARAMETER_APP_ADDRESS =
  "0xBCfF8B0b9419b9A88c44546519b1e909cF330399";
//'0x3ef19f1EA214DF368Eb8a612dd1Aca45caC3c756'
export const OWNERSHIP_AGENT = "0x40907540d8a6C65c637785e8f8B742ae6b0b9968";
//'0x9D82050e8ce9541968b01B0F67CF6aa76c34892B'
export const PARAMETER_AGENT = "0x4EEb3bA4f221cA16ed4A0cC7254E2E32DF948c5f";
//'0x6fF8BA3250d0167Af033Ddc215F89177f09aDF1B'
export const MIN_BALANCE = 2500 * 10 ** 18;
export const MIN_TIME = 15;
export const time = 604800;

// let ALL_POOLS = Object.values(poolAbis).map((pool) =>
//   pool.swap_address.toLowerCase()
// );
let vote = {
  id: "id:1",
};
export function getVoteId() {
  return vote.id.split(":")[1];
}

export function getVotingAppName(address) {
  if (address.toLowerCase() == OWNERSHIP_APP_ADDRESS.toLowerCase())
    return "Ownership";
  if (address.toLowerCase() == PARAMETER_APP_ADDRESS.toLowerCase())
    return "Parameter";
  if (address.toLowerCase() == OWNERSHIP_AGENT.toLowerCase())
    return "Ownership Agent";
  if (address.toLowerCase() == PARAMETER_AGENT.toLowerCase())
    return "Parameter Agent";
}

// export function contractCalled(vote) {
//   if (vote.callAddress == allabis.poolproxy_address.substr(2).toLowerCase())
//     return "poolproxy";
//   if (vote.callAddress == allabis.votingescrow_address.substr(2).toLowerCase())
//     return "votingescrow";
//   if (
//     vote.callAddress == allabis.gaugecontroller_address.substr(2).toLowerCase()
//   )
//     return "gaugecontroller";
//   if (
//     ALL_POOLS.map((address) => address.substr(2).toLowerCase()).includes(
//       vote.callAddress
//     )
//   )
//     return "pool";
//   return null;
// }

// export function contractName(vote) {
//   if (contractCalled(vote) == "poolproxy") return "Pool Proxy";
//   if (contractCalled(vote) == "votingescrow") return "Voting Escrow";
//   if (contractCalled(vote) == "gaugecontroller") return "Gauge Controller";
//   if (contractCalled(vote) == "pool") {
//     return Object.keys(poolAbis).find(
//       (pool) =>
//         poolAbis[pool].swap_address.substr(2).toLowerCase() == vote.callAddress
//     );
//   }
//   return null;
// }

export function isVoteOpen(vote) {
  return vote.startDate > new Date().getTime() / 1000 - time;
}

export function isRejected(vote) {
  return (
    !vote.executed &&
    !isVoteOpen(vote) &&
    (!hasSupport(vote) || !hasQuorum(vote)) &&
    !canExecute(vote)
  );
}

export function isValuePct(_value, _total, _pct) {
  if (_total == 0) {
    return false;
  }

  let computedPct = BigNumber(_value)
    .times(10 ** 18)
    .div(_total);
  return computedPct.gt(_pct);
}

export function canExecute(vote) {
  if (isVoteOpen(vote)) return false;

  if (vote.executed) return false;

  // Voting is already decided
  if (isValuePct(vote.yea, vote.votingPower, vote.supportRequiredPct))
    return true;

  // Vote ended?
  if (isVoteOpen(vote)) return false;

  // Vote ended?
  let totalVotes = BigNumber(vote.yea).plus(vote.nay);
  if (!isValuePct(vote.yea, totalVotes, vote.supportRequiredPct)) return false;

  // Has min quorum?
  if (!isValuePct(vote.yea, vote.votingPower, vote.minAcceptQuorum))
    return false;

  return true;
}

export function hasSupport(vote) {
  return isValuePct(vote.yea, +vote.yea + +vote.nay, vote.supportRequiredPct);
}

export function hasQuorum(vote) {
  return isValuePct(vote.yea, vote.votingPower, vote.minAcceptQuorum);
}

export const getVoteCreatedOn = (votes) => {
  var voteCreatedOn = votes.map((vote) => vote.startDate);
  return (voteCreatedOn = [
    "2022-05-01T13:42:00+05:00",
    "2022-06-01T13:42:00+05:00",
    "2022-07-01T13:42:00+05:00",
  ]);
};

export const formattedMetadata = (votes) => {
  var metadata = votes.map((vote) => {
    return truncate(vote.metadata, 100, true);
  });
  return metadata;
};

export const getMinAcceptQuorum = (votes) => {
  if (votes !== undefined) {
    return votes.map((vote) =>
      (parseInt(vote.minAcceptQuorum) / 1e9).toFixed(2)
    );
  }
};

export const getSupportRequiredPct = (votes) => {
  if (votes !== undefined) {
    return votes.map((vote) =>
      (parseInt(vote.supportRequiredPct) / 1e9).toFixed(2)
    );
  }
};

export const decorateVotes = (votes) => {
  let decorations = [];
  // decorations.voteNumber = getVoteId();
  decorations.totalSupport = votes.map((vote) => +vote.yea + +vote.nay);
  decorations.yeap = votes.map((vote) =>
    decorations.totalSupport == 0
      ? 0
      : ((+vote.yea / (+vote.yea + +vote.nay)) * 100).toFixed(1)
  );
  decorations.nop = votes.map((vote) =>
    decorations.totalSupport == 0
      ? 0
      : ((+vote.nay / (+vote.yea + +vote.nay)) * 100).toFixed(1)
  );

  decorations.createdOn = getVoteCreatedOn(votes);
  decorations.metadata = formattedMetadata(votes);

  return decorations;
};

let totalSupport;
export const getTotalSupport = (votes) => {
  totalSupport = votes.map((vote) => +vote.yea + +vote.nay);
  return totalSupport;
};
