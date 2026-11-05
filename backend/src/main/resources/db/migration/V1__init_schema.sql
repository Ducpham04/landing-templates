CREATE TABLE users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  role          VARCHAR(20)  NOT NULL,
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME(6)  NOT NULL,
  updated_at    DATETIME(6)  NOT NULL,
  CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT      NOT NULL,
  token_hash  VARCHAR(64) NOT NULL,
  expires_at  DATETIME(6) NOT NULL,
  revoked_at  DATETIME(6) NULL,
  created_at  DATETIME(6) NOT NULL,
  CONSTRAINT uk_refresh_token_hash UNIQUE (token_hash),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sites (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  domain      VARCHAR(190) NULL,
  site_key    VARCHAR(64)  NOT NULL,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME(6)  NOT NULL,
  updated_at  DATETIME(6)  NOT NULL,
  CONSTRAINT uk_sites_key UNIQUE (site_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE leads (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_id       BIGINT       NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(190) NULL,
  message       TEXT         NULL,
  extra         JSON         NULL,
  status        VARCHAR(20)  NOT NULL,
  assignee_id   BIGINT       NULL,
  page_url      VARCHAR(500) NULL,
  utm_source    VARCHAR(100) NULL,
  utm_medium    VARCHAR(100) NULL,
  utm_campaign  VARCHAR(150) NULL,
  ip_address    VARCHAR(45)  NULL,
  created_at    DATETIME(6)  NOT NULL,
  updated_at    DATETIME(6)  NOT NULL,
  CONSTRAINT fk_leads_site FOREIGN KEY (site_id) REFERENCES sites (id),
  CONSTRAINT fk_leads_assignee FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_leads_status (status),
  INDEX idx_leads_site_created (site_id, created_at),
  INDEX idx_leads_assignee (assignee_id),
  INDEX idx_leads_created (created_at),
  INDEX idx_leads_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lead_notes (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id     BIGINT      NOT NULL,
  author_id   BIGINT      NOT NULL,
  content     TEXT        NOT NULL,
  created_at  DATETIME(6) NOT NULL,
  CONSTRAINT fk_notes_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
  CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES users (id),
  INDEX idx_notes_lead (lead_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lead_activities (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id     BIGINT      NOT NULL,
  actor_id    BIGINT      NULL,
  type        VARCHAR(30) NOT NULL,
  from_value  VARCHAR(120) NULL,
  to_value    VARCHAR(120) NULL,
  created_at  DATETIME(6) NOT NULL,
  CONSTRAINT fk_act_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
  CONSTRAINT fk_act_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_act_lead (lead_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
