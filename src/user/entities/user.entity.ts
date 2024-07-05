import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Profile } from "./profile.entity";

interface UserProps {
  username: string;
  email: string;
  isActive: boolean;
  profile: Profile;
  roles: UniqueEntityID[];
  password: string;
  createdAt: Date;
  groupMembers?: UniqueEntityID[];
  googleId?: number;
  facebookId?: number;
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get profile(): Profile {
    return this.props.profile;
  }

  get groupMember(): UniqueEntityID[] {
    return this.props.groupMembers;
  }

  get roles(): UniqueEntityID[] {
    return this.props.roles;
  }

  get googleId(): number {
    return this.props.googleId;
  }

  get facebookId(): number {
    return this.props.facebookId;
  }

  get username(): string {
    return this.props.username;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  private static isRegisteringWithGoogle(props: UserProps): boolean {
    return !!props.googleId === true;
  }

  private static isRegisteringWithFacebook(props: UserProps): boolean {
    return !!props.facebookId === true;
  }

  public static create(props: Readonly<UserProps>, id?: UniqueEntityID): User {
    return new User(
      {
        ...props,
      },
      id,
    );
  }
}
