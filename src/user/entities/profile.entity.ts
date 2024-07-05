import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { LANG } from "../dto/LANGUAGE";

interface ProfileProps {
  last_connection: Date;
  lang: LANG;
  date_of_birth?: Date;
  photo?: string;
}

export class Profile extends Entity<ProfileProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get email(): string {
    return this.props.lang;
  }

  get last_connection(): Date {
    return this.props.last_connection;
  }

  get date_of_birth(): Date | null {
    return this.props.date_of_birth ?? null;
  }

  get photo(): string {
    return this.props.photo;
  }

  get lang(): "EN" | "FR" {
    return this.props.lang;
  }

  private constructor(props: ProfileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: Readonly<ProfileProps>,
    id?: UniqueEntityID,
  ): Profile {
    return new Profile(
      {
        ...props,
      },
      id,
    );
  }
}
