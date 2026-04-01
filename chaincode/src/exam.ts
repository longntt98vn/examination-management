import { Object, Property } from "fabric-contract-api";
import { DocType } from "./constants";

@Object()
export class Exam {
  @Property()
  public docType: DocType = DocType.UNKNOWN;

  @Property()
  public ID: string = "";

  @Property()
  public ExamID: string = "";

  @Property()
  public HashCode: string = "";

  @Property()
  public Status: number = 0;
}
