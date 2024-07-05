import { v4 as uuidV4 } from "uuid";
import { Identifier } from "./Identifier";

export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id ? id : uuidV4());
  }
}
