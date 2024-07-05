import { Entity } from "src/core/domain/Entity";
import { UniqueEntityID } from "src/core/domain/UniqueEntityID";

interface GroupMemberProps {
  role: string;
  join_time: Date;
  user_id: UniqueEntityID;
  conversationId: UniqueEntityID;
  left_time?: Date;
}

export class GroupMember extends Entity<GroupMemberProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): string {
    return this.props.role;
  }

  get join_time(): Date {
    return this.props.join_time;
  }

  get left_time(): Date {
    return this.props.left_time;
  }

  private constructor(props: GroupMemberProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: Readonly<GroupMemberProps>,
    id?: UniqueEntityID,
  ): GroupMember {
    return new GroupMember(
      {
        ...props,
      },
      id,
    );
  }
}
