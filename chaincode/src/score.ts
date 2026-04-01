import { Object, Property } from "fabric-contract-api";
import { DocType } from "./constants";

@Object()
export class Score {
  @Property()
  public docType: DocType = DocType.UNKNOWN;

  @Property()
  public ID: string = "";

  @Property()
  public ScoreID: string = "";

  @Property()
  public CandidateID: string = "";

  @Property()
  public HashCode: string = "";

  @Property()
  public Status: number = 0;
}
