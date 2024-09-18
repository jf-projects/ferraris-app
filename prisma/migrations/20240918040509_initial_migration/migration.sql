-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL DEFAULT 'normal',
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255),
    "middleName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "address" VARCHAR(255),
    "gender" VARCHAR(255),
    "civilStatus" VARCHAR(255),
    "clientNumber" VARCHAR(255),
    "clientLandline" VARCHAR(255),
    "spouseFirstName" VARCHAR(255),
    "spouseMiddleName" VARCHAR(255),
    "spouseLastName" VARCHAR(255),
    "bday" DATE,
    "image" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "client_id" TEXT,
    "deletedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotTransaction" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER,
    "propertyUnit" VARCHAR(255),
    "totalPropertySize" INTEGER,
    "type" VARCHAR(255),
    "unitBlock" VARCHAR(255),
    "unitLot" VARCHAR(255),
    "propertyUnitAddress" VARCHAR(255),
    "propertyTotalAmount" REAL,
    "downpayment" REAL,
    "paymentTerms" VARCHAR(255),
    "incrementValues" TEXT,
    "dueDate" TIMESTAMP(6),
    "interest" REAL,
    "sqm" REAL,
    "incrementAmount" REAL,
    "transactionDate" TIMESTAMP(6),
    "autocompute" INTEGER NOT NULL,
    "interestDate" TIMESTAMP(6),
    "deletedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LotTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "model_id" INTEGER,
    "oldValue" JSONB,
    "newValue" JSONB,
    "userId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "lotTransactionId" INTEGER NOT NULL,
    "amount" DECIMAL(18,2),
    "bank" TEXT,
    "paymentDate" TIMESTAMP(3),
    "remarks" TEXT,
    "deletedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- AddForeignKey
ALTER TABLE "LotTransaction" ADD CONSTRAINT "LotTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_lotTransactionId_fkey" FOREIGN KEY ("lotTransactionId") REFERENCES "LotTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
