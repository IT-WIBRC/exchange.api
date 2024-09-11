import { LANG } from "src/user/dto/LANGUAGE";

export class UserDTO {
  id: string;
  username: string;
  email: string;
  lang: LANG;
}
