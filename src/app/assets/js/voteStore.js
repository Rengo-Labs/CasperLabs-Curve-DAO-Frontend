import BigNumber from "bignumber.js";
import { truncate } from "./helpers";

export const OWNERSHIP_VOTE_TIME = 604800;
export const PARAMETER_VOTE_TIME = 604800;
export const OWNERSHIP_APP_ADDRESS =
  "0xE478de485ad2fe566d49342Cbd03E49ed7DB3356";
export const PARAMETER_APP_ADDRESS =
  "0xBCfF8B0b9419b9A88c44546519b1e909cF330399";
export const OWNERSHIP_AGENT = "0x40907540d8a6C65c637785e8f8B742ae6b0b9968";
export const PARAMETER_AGENT = "0x4EEb3bA4f221cA16ed4A0cC7254E2E32DF948c5f";
export const MIN_BALANCE = 2500 * 10 ** 18;
export const MIN_TIME = 15;
export const time = 604800;
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
  if (isValuePct(vote.yea, vote.votingPower, vote.supportRequiredPct))
    return true;
  if (isVoteOpen(vote)) return false;
  let totalVotes = BigNumber(vote.yea).plus(vote.nay);
  if (!isValuePct(vote.yea, totalVotes, vote.supportRequiredPct)) return false;
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

const support = (votes, totalSupport) => {
  if (votes !== undefined) {
    return votes.map((vote, index) => {
      if (totalSupport[index] == 0) return 0;
      return ((vote.yea / totalSupport[index]) * 100).toFixed(2);
    });
  }
};

const quorum = (votes, totalSupport) => {
  if (votes !== undefined) {
    return votes.map((vote, index) => {
      if (totalSupport[index] == 0) return 0;
      return ((vote.yea / vote.votingPower) * 100).toFixed(2);
    });
  }
  if (this.vote.totalSupport == 0) return 0;
  return ((this.vote.yea / this.vote.votingPower) * 100).toFixed(2);
};

export const decorateVotes = (votes) => {
  let decorations = [];
  decorations.totalSupport = votes.map((vote) => +vote.yea + +vote.nay);
  decorations.support = support(votes, decorations.totalSupport);
  decorations.quorum = quorum(votes, decorations.totalSupport);
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
