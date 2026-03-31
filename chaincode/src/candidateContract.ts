import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import sortKeysRecursive from "sort-keys-recursive";
import { Candidate } from "./candidate";

@Info({
  title: "CandidateContract",
  description: "Smart contract for managing exam candidates",
})
export class CandidateContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    // Khởi tạo dữ liệu mẫu nếu cần
  }

  @Transaction()
  public async CreateCandidate(
    ctx: Context,
    id: string,
    fullName: string,
    dateOfBirth: string,
    identityCard: string,
    email: string,
    phone: string,
    examRoom: string,
    examDate: string,
    registeredBy: string,
  ): Promise<void> {
    const exists = await this.CandidateExists(ctx, id);
    if (exists) {
      throw new Error(`Candidate ${id} already exists`);
    }

    const candidate: Candidate = {
      ID: id,
      FullName: fullName,
      DateOfBirth: dateOfBirth,
      IdentityCard: identityCard,
      Email: email,
      Phone: phone,
      ExamRoom: examRoom,
      ExamDate: examDate,
      Status: "registered",
      RegisteredBy: registeredBy,
      RegisteredDate: new Date().toISOString(),
      docType: "candidate",
    };

    await ctx.stub.putState(
      id,
      Buffer.from(JSON.stringify(sortKeysRecursive(candidate))),
    );
  }

  @Transaction(false)
  public async ReadCandidate(ctx: Context, id: string): Promise<string> {
    const candidateJSON = await ctx.stub.getState(id);
    if (candidateJSON.length === 0) {
      throw new Error(`Candidate ${id} does not exist`);
    }
    return candidateJSON.toString();
  }

  @Transaction()
  public async UpdateCandidate(
    ctx: Context,
    id: string /* các params */,
  ): Promise<void> {
    // Logic cập nhật thí sinh
  }

  @Transaction()
  public async UpdateCandidateStatus(
    ctx: Context,
    id: string,
    newStatus: string,
  ): Promise<void> {
    const candidateString = await this.ReadCandidate(ctx, id);
    const candidate = JSON.parse(candidateString) as Candidate;
    candidate.Status = newStatus;
    await ctx.stub.putState(
      id,
      Buffer.from(JSON.stringify(sortKeysRecursive(candidate))),
    );
  }

  @Transaction(false)
  @Returns("boolean")
  public async CandidateExists(ctx: Context, id: string): Promise<boolean> {
    const candidateJSON = await ctx.stub.getState(id);
    return candidateJSON.length > 0;
  }

  @Transaction(false)
  @Returns("string")
  public async GetAllCandidates(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8",
      );
      let record;
      try {
        record = JSON.parse(strValue) as Candidate;
        if (record.docType === "candidate") {
          allResults.push(record);
        }
      } catch (err) {
        console.log(err);
      }
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  @Transaction(false)
  @Returns("string")
  public async GetCandidatesByExamRoom(
    ctx: Context,
    examRoom: string,
  ): Promise<string> {
    // Query theo phòng thi
    return "";
  }

  @Transaction(false)
  @Returns("string")
  public async GetCandidatesByExamDate(
    ctx: Context,
    examDate: string,
  ): Promise<string> {
    // Query theo ngày thi
    return "";
  }
}
