CREATE TABLE ROOMS (
    ID TEXT PRIMARY KEY,
    NAME TEXT NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE ROOM_USERS (
    ID SERIAL PRIMARY KEY,
    ROOM_ID TEXT NOT NULL REFERENCES ROOMS(ID),
    USER_ID TEXT NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO', 'STICKER');
CREATE TABLE MESSAGES (
    ID SERIAL PRIMARY KEY,
    ROOM_ID TEXT NOT NULL REFERENCES ROOMS(ID),
    USER_ID TEXT NOT NULL,
    TYPE message_type DEFAULT 'TEXT' NOT NULL,
    CONTENT TEXT NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);