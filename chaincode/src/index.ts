
import { type Contract } from "fabric-contract-api";
import { AssetTransferContract } from "./contracts/assetContract";
import { CandidateContract } from "./contracts/candidateContract";
import { ExamContract } from "./contracts/examContract";
import { ScoreContract } from "./contracts/scoreContract";

export const contracts: (typeof Contract)[] = [
  AssetTransferContract,
  CandidateContract,
  ExamContract,
  ScoreContract,
];
