CREATE TABLE IF NOT EXISTS USERS (
    ID SERIAL PRIMARY KEY,
    ACCOUNT_ID TEXT NOT NULL UNIQUE,
    EMAIL TEXT NOT NULL UNIQUE,
    NAME TEXT NOT NULL,
    PASSWORD TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TOKENS (
    ID SERIAL PRIMARY KEY,
    USER_ID INTEGER NOT NULL REFERENCES USERS(ID),
    TOKEN TEXT NOT NULL UNIQUE,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
)