from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "transcription_sessions" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_seconds" REAL NOT NULL DEFAULT 0,
    "transcript_text" TEXT NOT NULL,
    "word_count" INT NOT NULL DEFAULT 0,
    "model_name" VARCHAR(100) NOT NULL DEFAULT 'vosk-small-en',
    "language" VARCHAR(50) NOT NULL DEFAULT 'en-US'
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSON NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztl9FO2zAUhl+lyhVIFJWOMrS7UsroVBLUhg2BUOTGbhrVcUrsABXi3XfsJLhJ06wMCk"
    "PaVZv//Cfx+ezjOI9GEGJC+a4dIcbdyJ8JP2RDwjn8GN9qjwZDAYE/lb6dmoFmM+2SgkAj"
    "qhLFYobDkxRlQSMOQVeAa4woJyBh8mwFlcWUSjF0wegzT0sx829j4ojQI2JCIghc34DsM0"
    "weCM8uZ1Nn7BOKc4X4WD5b6Y6Yz5TWY+JEGeXTRo4b0jhg2jybiwmMPXP7TEjVI4xESBB5"
    "exHFcvhydGndWUXJSLUlGeJCDiZjFFOxUO6aDFzACPxgNFwV6Mmn1Jt7+1/3D78c7B+CRY"
    "3kWfn6lJSna08SFQHTNp5UHAmUOBRGzc2NiCzWQWKZ3zFEhB+Qcoj5zAJMnKbuZn+KaDOQ"
    "VWwzQcPVC+qN6EIN2GJ0nk5cBUq7d9Yd2u2zc1lJwPktVYjadldGmkqdF9Stg22ph9AOSd"
    "c836T2q2ef1uRl7coyu4pgyIUXqSdqn31lyDGhWIQOC+8dhBfWWKZmYMCpJxbHgDrpTSga"
    "8+XpPaEhWtEgZcmFGR7L7E3NamO38feTWjGJx9bFUb9bOx90O71hzzLzs6aCUgLBF6rKQb"
    "fdVx2kweqdzxHkoaRtbFDLsZakFqhCHZtiahgbQWp3L+1cS5g/24POaXuwdda+3M4B7lvm"
    "98yue8Ls9K2jAuP7MMLALWYleFfu6vmkP+/ub7ZYP3p3L7zOHXW1xK0zQVE5uHzWO67Iu5"
    "BP6zxAlNYJe8XyNAL04FDCPDGBy71GowJatjrBVdics4XbTGJ5shQxL0bei7gu5rwjVcLq"
    "F8M3o9laB2ZrNcuWQinPbePpwglECiPkTu8RNO1SJGyGq7zLoaAZFBXEADtOK5TjT8+5bR"
    "L57sQoOQGnkcozL9Ke/2fcT3TGvSNR9kGzbusupLxf576SYq5tm63WGn0LrpWNq2L5TVC2"
    "xgsgpvbPCXAjbxF4oiBlh5ofQ8tc8ZmlUwogLxgUeI19V+zUqM/Fzb+JtYKirLr67Fg8Ju"
    "7kv5PkDY4++vXy9BuDj5NU"
)
