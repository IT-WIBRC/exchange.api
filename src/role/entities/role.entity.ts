import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface RoleProps {
  name: string;
  permissions?: Permission[];
  description?: string;
}

export class Role extends Entity<RoleProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): Permission[] {
    return this.props.permissions;
  }

  private constructor(props: RoleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: Readonly<RoleProps>, id?: UniqueEntityID): Role {
    return new Role(
      {
        ...props,
      },
      id,
    );
  }
}

interface PermissionProps {
  name: string;
  description?: string;
  create_at?: Date;
}

export class Permission extends Entity<PermissionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get createAt(): Date {
    return this.props.create_at;
  }

  private constructor(props: PermissionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: Readonly<PermissionProps>,
    id?: UniqueEntityID,
  ): Permission {
    return new Permission(
      {
        ...props,
      },
      id,
    );
  }
}
