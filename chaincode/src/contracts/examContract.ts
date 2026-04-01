import { Context, Contract, Info, Transaction } from "fabric-contract-api";
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
    const exists = await this.GetExam(ctx, `${DocType.EXAM}:${examID}`);
    if (exists) {
      throw new Error(`Exam ${examID} already exists`);
    }

    const exam: Exam = {
      docType: DocType.EXAM,
      ID: `${DocType.EXAM}:${examID}`,
      Status: 0,
      ExamID: examID,
      HashCode: hashCode,
    };

    await ctx.stub.putState(
      `${DocType.EXAM}:${examID}`,
      Buffer.from(JSON.stringify(sortKeysRecursive(exam))),
    );
  }

  @Transaction()
  public async GetExam(ctx: Context, examID: string): Promise<Exam> {
    const examJSON = await ctx.stub.getState(`${DocType.EXAM}:${examID}`);
    if (!examJSON || examJSON.length === 0) {
      throw new Error(`Exam ${examID} does not exist`);
    }
    return JSON.parse(examJSON.toString()) as Exam;
  }
}
