import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import sortKeysRecursive from "sort-keys-recursive";
import { DocType } from "../constants";
import { Score } from "../score";

@Info({
  title: "ScoreContract",
  description: "Smart contract for managing exam scores",
})
export class ScoreContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {}

  @Transaction()
  public async CreateScore(
    ctx: Context,
    scoreID: string,
    candidateID: string,
    hashCode: string,
  ): Promise<void> {
    const exists = await this.GetScore(ctx, `${DocType.SCORE}:${scoreID}`);
    if (exists) {
      throw new Error(`Score ${scoreID} already exists`);
    }

    const score: Score = {
      docType: DocType.SCORE,
      ID: `${DocType.SCORE}:${scoreID}`,
      Status: 0,
      ScoreID: scoreID,
      CandidateID: candidateID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      `${DocType.SCORE}:${scoreID}`,
      Buffer.from(JSON.stringify(sortKeysRecursive(score))),
    );
  }

  @Transaction()
  public async GetScore(ctx: Context, scoreID: string): Promise<Score> {
    const scoreJSON = await ctx.stub.getState(`${DocType.SCORE}:${scoreID}`);
    if (!scoreJSON || scoreJSON.length === 0) {
      throw new Error(`Score ${scoreID} does not exist`);
    }
    return JSON.parse(scoreJSON.toString()) as Score;
  }
}
