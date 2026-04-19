import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
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
    const key = `${DocType.SCORE}:${scoreID}`;
    const existingScore = await ctx.stub.getState(key);
    if (existingScore && existingScore.length > 0) {
      throw new Error(`Score ${scoreID} already exists`);
    }

    const score: Score = {
      docType: DocType.SCORE,
      ID: key,
      Status: 0,
      ScoreID: scoreID,
      CandidateID: candidateID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      key,
      Buffer.from(JSON.stringify(sortKeysRecursive(score))),
    );
  }

  @Transaction(false)
  public async GetScore(ctx: Context, scoreID: string): Promise<Score> {
    const key = `${DocType.SCORE}:${scoreID}`;
    const scoreJSON = await ctx.stub.getState(key);
    if (!scoreJSON || scoreJSON.length === 0) {
      throw new Error(`Score ${scoreID} does not exist`);
    }
    return JSON.parse(scoreJSON.toString()) as Score;
  }

  @Transaction(false)
  @Returns("string")
  public async GetAllScores(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange(`${DocType.SCORE}:`, `${DocType.SCORE}:~`);
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8",
      );
      let record;
      try {
        record = JSON.parse(strValue) as Score;
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
