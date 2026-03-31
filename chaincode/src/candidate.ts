import { Object, Property } from "fabric-contract-api";

@Object()
export class Candidate {
  @Property()
  public docType: string = "";

  @Property()
  public ID: string = "";

  @Property()
  public FullName: string = "";

  @Property()
  public DateOfBirth: string = "";

  @Property()
  public IdentityCard: string = "";

  @Property()
  public Email: string = "";

  @Property()
  public Phone: string = "";

  @Property()
  public ExamRoom: string = "";

  @Property()
  public ExamDate: string = "";

  @Property()
  public Status: string = "";

  @Property()
  public RegisteredBy: string = "";

  @Property()
  public RegisteredDate: string = "";
}
