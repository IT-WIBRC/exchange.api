import { UserMapper } from "./UserMapper";
import { User } from "../entities/user.entity";
import { LANG } from "../dto/LANGUAGE";

describe("UserMapper", () => {
  it("fromUserPrismaWithRelationsToEntity", () => {
    const userEntity = UserMapper.fromUserPrismaWithRelationsToEntity({
      email: "email@email.com",
      create_at: new Date(),
      group_members: [
        {
          group_member_id: "uuid-3459",
        },
      ],
      id: "uuid-1234",
      is_active: true,
      password: "12345",
      profile: {
        id: "uuid-98765",
        last_connection: new Date(),
        lang: LANG.EN,
        date_of_birth: new Date(),
        photo: "picture.png",
        userEmail: "email@email.com",
      },
      roles: [
        {
          id: "uuid-938470",
        },
      ],
      username: "username",
    });
    expect(userEntity).toBeInstanceOf(User);
  });

  it("fromUserPrismaToEntity", () => {
    const userEntity = UserMapper.fromUserPrismaToEntity({
      email: "email@email.com",
      create_at: new Date(),
      id: "uuid-1234",
      is_active: true,
      password: "12345",
      profile: {
        id: "uuid-98765",
        last_connection: new Date(),
        lang: LANG.EN,
        date_of_birth: new Date(),
        photo: "picture.png",
        userEmail: "email@email.com",
      },
      username: "username",
    });
    expect(userEntity).toBeInstanceOf(User);
  });
});
