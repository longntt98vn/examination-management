import { Context, Contract, Info, Transaction } from "fabric-contract-api";
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
    const exists = await this.GetCandidate(
      ctx,
      `${DocType.CANDIDATE}:${candidateID}`,
    );
    if (exists) {
      throw new Error(`Candidate ${candidateID} already exists`);
    }

    const candidate: Candidate = {
      docType: DocType.CANDIDATE,
      ID: `${DocType.CANDIDATE}:${candidateID}`,
      Status: 0,
      CandidateID: candidateID,
      ExamID: examID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      `${DocType.CANDIDATE}:${candidateID}`,
      Buffer.from(JSON.stringify(sortKeysRecursive(candidate))),
    );
  }

  @Transaction()
  public async GetCandidate(
    ctx: Context,
    candidateID: string,
  ): Promise<Candidate> {
    const candidateJSON = await ctx.stub.getState(
      `${DocType.CANDIDATE}:${candidateID}`,
    );
    if (!candidateJSON || candidateJSON.length === 0) {
      throw new Error(`Candidate ${candidateID} does not exist`);
    }
    return JSON.parse(candidateJSON.toString()) as Candidate;
  }
}
