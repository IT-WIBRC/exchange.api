-- CreateEnum
CREATE TYPE "CONVERSATION_TYPE" AS ENUM ('SINGLE', 'MULTIPLE', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "GROUP_MEMBER_ROLE" AS ENUM ('ADMIN', 'MEMBER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "LANGUAGES" AS ENUM ('FR', 'EN');

-- CreateTable
CREATE TABLE "t_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_profiles" (
    "id" TEXT NOT NULL,
    "last_connection" TIMESTAMP(3) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "photo" TEXT,
    "userEmail" TEXT NOT NULL,
    "lang" "LANGUAGES" NOT NULL DEFAULT 'EN',

    CONSTRAINT "t_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sent_datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_conversations" (
    "id" TEXT NOT NULL,
    "type" "CONVERSATION_TYPE" NOT NULL DEFAULT 'SINGLE',
    "name" TEXT NOT NULL,

    CONSTRAINT "t_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_group_member" (
    "group_member_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "GROUP_MEMBER_ROLE" NOT NULL DEFAULT 'ADMIN',
    "join_time" TIMESTAMP(3) NOT NULL,
    "left_time" TIMESTAMP(3),

    CONSTRAINT "t_group_member_pkey" PRIMARY KEY ("group_member_id")
);

-- CreateTable
CREATE TABLE "t_conversation_config" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conversationName" TEXT NOT NULL,

    CONSTRAINT "t_conversation_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "t_users_email_key" ON "t_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "t_users_password_key" ON "t_users"("password");

-- CreateIndex
CREATE UNIQUE INDEX "t_profiles_userEmail_key" ON "t_profiles"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "t_conversations_name_key" ON "t_conversations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "t_group_member_group_member_id_key" ON "t_group_member"("group_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_conversation_config_id_key" ON "t_conversation_config"("id");

-- CreateIndex
CREATE UNIQUE INDEX "t_conversation_config_conversationName_key" ON "t_conversation_config"("conversationName");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_id_key" ON "Permission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_id_key" ON "Otp"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- AddForeignKey
ALTER TABLE "t_profiles" ADD CONSTRAINT "t_profiles_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "t_users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_messages" ADD CONSTRAINT "t_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "t_conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_group_member" ADD CONSTRAINT "t_group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "t_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_group_member" ADD CONSTRAINT "t_group_member_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "t_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_conversation_config" ADD CONSTRAINT "t_conversation_config_conversationName_fkey" FOREIGN KEY ("conversationName") REFERENCES "t_conversations"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "t_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
