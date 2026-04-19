import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import sortKeysRecursive from "sort-keys-recursive";
import { DocType } from "../constants";
import { Exam } from "../exam";

@Info({
  title: "ExamContract",
  description: "Smart contract for managing exams",
})
export class ExamContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {}

  @Transaction()
  public async CreateExam(
    ctx: Context,
    examID: string,
    hashCode: string,
  ): Promise<void> {
    const key = `${DocType.EXAM}:${examID}`;
    const existingExam = await ctx.stub.getState(key);
    if (existingExam && existingExam.length > 0) {
      throw new Error(`Exam ${examID} already exists`);
    }

    const exam: Exam = {
      docType: DocType.EXAM,
      ID: key,
      Status: 0,
      ExamID: examID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      key,
      Buffer.from(JSON.stringify(sortKeysRecursive(exam))),
    );
  }

  @Transaction(false)
  public async GetExam(ctx: Context, examID: string): Promise<Exam> {
    const key = `${DocType.EXAM}:${examID}`;
    const examJSON = await ctx.stub.getState(key);
    if (!examJSON || examJSON.length === 0) {
      throw new Error(`Exam ${examID} does not exist`);
    }
    return JSON.parse(examJSON.toString()) as Exam;
  }

  @Transaction(false)
  @Returns("string")
  public async GetAllExams(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange(`${DocType.EXAM}:`, `${DocType.EXAM}:~`);
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8",
      );
      let record;
      try {
        record = JSON.parse(strValue) as Exam;
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
