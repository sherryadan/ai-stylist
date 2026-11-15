CREATE TABLE demo_account (
  id TEXT PRIMARY KEY NOT NULL,
  google_subject TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE demo_session (
  token_digest TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES demo_account(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX demo_session_account ON demo_session(account_id);
CREATE INDEX demo_session_expiry ON demo_session(expires_at);

CREATE TABLE demo_profile (
  account_id TEXT PRIMARY KEY NOT NULL REFERENCES demo_account(id) ON DELETE CASCADE,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  updated_at INTEGER NOT NULL
);

CREATE TABLE demo_styling_request (
  account_id TEXT NOT NULL REFERENCES demo_account(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, id)
);
CREATE INDEX demo_request_history ON demo_styling_request(account_id, created_at DESC, id DESC);

CREATE TABLE demo_saved_look (
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  look_id TEXT NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  saved_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, request_id, look_id),
  FOREIGN KEY (account_id, request_id) REFERENCES demo_styling_request(account_id, id) ON DELETE CASCADE
);
CREATE INDEX demo_saved_history ON demo_saved_look(account_id, saved_at DESC, request_id, look_id);

CREATE TABLE demo_rating (
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  look_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('like', 'dislike')),
  PRIMARY KEY (account_id, request_id, look_id),
  FOREIGN KEY (account_id, request_id) REFERENCES demo_styling_request(account_id, id) ON DELETE CASCADE
);
