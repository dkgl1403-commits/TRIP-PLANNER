CREATE TABLE users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(50) DEFAULT 'USER' NOT NULL,
    name VARCHAR2(100),
    gender VARCHAR2(20),
    phone VARCHAR2(20),
    email VARCHAR2(100),
    address VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Non-unique index on name for faster lookups
CREATE INDEX idx_users_name ON users(name);

-- Non-unique index on phone number
CREATE INDEX idx_users_phone ON users(phone);
