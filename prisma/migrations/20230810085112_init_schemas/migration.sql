-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "fullName" VARCHAR NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtList" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "DebtList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtNote" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebtNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DebtList_authorId_key" ON "DebtList"("authorId");

-- AddForeignKey
ALTER TABLE "DebtList" ADD CONSTRAINT "DebtList_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
