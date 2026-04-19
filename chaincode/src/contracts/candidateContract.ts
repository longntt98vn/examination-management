import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import sortKeysRecursive from "sort-keys-recursive";
import { Candidate } from "../candidate";
import { DocType } from "../constants";

@Info({
  title: "CandidateContract",
  description: "Smart contract for managing exam candidates",
})
export class CandidateContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {}

  @Transaction()
  public async CreateCandidate(
    ctx: Context,
    candidateID: string,
    examID: string,
    hashCode: string,
  ): Promise<void> {
    const key = `${DocType.CANDIDATE}:${candidateID}`;
    const existingCandidate = await ctx.stub.getState(key);
    if (existingCandidate && existingCandidate.length > 0) {
      throw new Error(`Candidate ${candidateID} already exists`);
    }

    const candidate: Candidate = {
      docType: DocType.CANDIDATE,
      ID: key,
      Status: 0,
      CandidateID: candidateID,
      ExamID: examID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      key,
      Buffer.from(JSON.stringify(sortKeysRecursive(candidate))),
    );
  }

  @Transaction(false)
  public async GetCandidate(
    ctx: Context,
    candidateID: string,
  ): Promise<Candidate> {
    const key = `${DocType.CANDIDATE}:${candidateID}`;
    const candidateJSON = await ctx.stub.getState(key);
    if (!candidateJSON || candidateJSON.length === 0) {
      throw new Error(`Candidate ${candidateID} does not exist`);
    }
    return JSON.parse(candidateJSON.toString()) as Candidate;
  }

  @Transaction(false)
  @Returns("string")
  public async GetAllCandidates(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange(`${DocType.CANDIDATE}:`, `${DocType.CANDIDATE}:~`);
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8",
      );
      let record;
      try {
        record = JSON.parse(strValue) as Candidate;
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}
